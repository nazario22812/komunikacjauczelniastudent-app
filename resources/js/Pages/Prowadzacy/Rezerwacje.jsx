import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

const normalize = (value) => String(value ?? "").toLocaleLowerCase("pl-PL");
const display = (value) => (value === null || value === undefined || value === "" ? "—" : value);

function statusStyle(status) {
    const s = normalize(status);
    if (/zaakcept|zatwierdz|potwierdz|przyj|akcept|approved|confirmed/.test(s)) {
        return "border-green-600 bg-green-950 text-green-300";
    }
    if (/odrzu|anulow|niezaakcept|cancel|reject/.test(s)) {
        return "border-red-600 bg-red-950 text-red-300";
    }
    if (/oczek|pending|rozpatrz|nowa|złoż|zloz/.test(s)) {
        return "border-amber-600 bg-amber-950 text-amber-300";
    }
    return "border-theme-muted bg-theme-slate text-theme-text";
}

function StatusBadge({ value }) {
    return (
        <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-semibold [overflow-wrap:anywhere] ${statusStyle(value)}`}>
            {display(value)}
        </span>
    );
}

function RezerwacjaActions({ rezerwacja, mobile = false }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        if (loading || !window.confirm("Czy na pewno chcesz usunąć tę rezerwację?")) return;
        setLoading(true);
        router.post(`/prowadzacy/rezerwacja/usun/${rezerwacja.idRezerwacja}`, {}, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className={`cursor-pointer rounded-[10px] border border-red-500 bg-theme-surface px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-theme-panel disabled:cursor-not-allowed disabled:opacity-50 ${mobile ? "min-h-[42px] w-full" : "whitespace-nowrap"}`}
        >
            {loading ? "Usuwanie..." : "Usuń"}
        </button>
    );
}

function Rezerwacjerow({ rezerwacja }) {
    return (
        <tr className="border-b border-theme-muted text-sm text-theme-text transition-colors hover:bg-theme-panel">
            <td className="break-words px-3 py-4 font-semibold">{display(rezerwacja.data)}</td>
            <td className="break-words px-3 py-4">{display(rezerwacja.GodzinaRozpoczecia)} – {display(rezerwacja.GodzinaZakonczenia)}</td>
            <td className="break-words px-3 py-4">{display(rezerwacja.nazwa)}</td>
            <td className="break-words px-3 py-4">{display(rezerwacja.numerSali)}</td>
            <td className="break-words px-3 py-4">{display(rezerwacja.typWydarzenia)}</td>
            <td className="px-3 py-4"><StatusBadge value={rezerwacja.statusRezerwacji} /></td>
            <td className="px-3 py-4 text-right"><RezerwacjaActions rezerwacja={rezerwacja} /></td>
        </tr>
    );
}

function Detail({ label, value }) {
    return (
        <div className="min-w-0">
            <div className="text-xs font-medium text-theme-muted">{label}</div>
            <div className="mt-1 break-words text-sm font-medium text-theme-text [overflow-wrap:anywhere]">{display(value)}</div>
        </div>
    );
}

function RezerwacjaMobile({ rezerwacja }) {
    return (
        <article className="min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface p-4 text-theme-text">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-theme-muted pb-3">
                <div className="min-w-0">
                    <div className="text-xs text-theme-muted">Data rezerwacji</div>
                    <h3 className="mt-1 break-words text-base font-bold">{display(rezerwacja.data)}</h3>
                    <p className="mt-1 break-words text-sm text-theme-muted">{display(rezerwacja.GodzinaRozpoczecia)} – {display(rezerwacja.GodzinaZakonczenia)}</p>
                </div>
                <StatusBadge value={rezerwacja.statusRezerwacji} />
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-4 py-4">
                <Detail label="Budynek" value={rezerwacja.nazwa} />
                <Detail label="Sala" value={rezerwacja.numerSali} />
                <div className="col-span-2"><Detail label="Typ wydarzenia" value={rezerwacja.typWydarzenia} /></div>
            </div>
            <div className="border-t border-theme-muted pt-3"><RezerwacjaActions rezerwacja={rezerwacja} mobile /></div>
        </article>
    );
}

function Content({ rezerwowanesale = [] }) {
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const reservations = Array.isArray(rezerwowanesale) ? rezerwowanesale : [];

    const statuses = useMemo(() => [...new Set(reservations.map((r) => String(r.statusRezerwacji ?? "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pl")), [rezerwowanesale]);
    const types = useMemo(() => [...new Set(reservations.map((r) => String(r.typWydarzenia ?? "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pl")), [rezerwowanesale]);

    const filtered = useMemo(() => {
        const query = normalize(search.trim());
        return reservations.filter((r) => {
            if (selectedStatus !== "all" && String(r.statusRezerwacji ?? "") !== selectedStatus) return false;
            if (selectedType !== "all" && String(r.typWydarzenia ?? "") !== selectedType) return false;
            if (!query) return true;
            return [r.data, r.GodzinaRozpoczecia, r.GodzinaZakonczenia, r.nazwa, r.numerSali, r.statusRezerwacji, r.typWydarzenia].some((v) => normalize(v).includes(query));
        });
    }, [rezerwowanesale, search, selectedStatus, selectedType]);

    const clearFilters = () => {
        setSearch("");
        setSelectedStatus("all");
        setSelectedType("all");
    };

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 justify-start"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 text-center text-sm font-bold text-theme-text sm:text-base">Moje rezerwacje</span>
                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] pt-3 sm:px-2 md:px-4">
                <section className="shrink-0 rounded-[15px] bg-theme-surface p-4 sm:p-5">
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">Rezerwacje sal</h1>
                            <p className="mt-1 text-sm text-theme-muted">Przeglądaj i zarządzaj swoimi rezerwacjami sal.</p>
                        </div>
                        <Link
                            href="/prowadzacy/zarezerwujsale"
                            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-[10px] bg-theme-orange px-5 py-2 text-center text-sm font-bold text-theme-text transition-colors hover:brightness-110"
                        >
                            + Zarezerwuj salę
                        </Link>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-theme-muted">
                        <span className="rounded-[9px] bg-theme-slate px-3 py-2">Wszystkie: <strong className="text-theme-text">{reservations.length}</strong></span>
                        <span className="rounded-[9px] bg-theme-slate px-3 py-2">Wyświetlane: <strong className="text-theme-text">{filtered.length}</strong></span>
                    </div>
                </section>

                <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-3 sm:p-4 lg:p-5">
                    <div className="grid min-w-0 shrink-0 grid-cols-1 gap-3 border-b border-theme-muted pb-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                        <div className="min-w-0">
                            <label htmlFor="rezerwacja-search" className="mb-1 block text-xs font-medium text-theme-muted">Szukaj rezerwacji</label>
                            <input id="rezerwacja-search" type="search" placeholder="Data, sala, budynek, typ..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-orange" />
                        </div>
                        <div className="min-w-0">
                            <label htmlFor="rezerwacja-status" className="mb-1 block text-xs font-medium text-theme-muted">Status</label>
                            <select id="rezerwacja-status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange">
                                <option value="all">Wszystkie statusy</option>
                                {statuses.map((s) => <option value={s} key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="min-w-0">
                            <label htmlFor="rezerwacja-typ" className="mb-1 block text-xs font-medium text-theme-muted">Typ wydarzenia</label>
                            <select id="rezerwacja-typ" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange">
                                <option value="all">Wszystkie typy</option>
                                {types.map((t) => <option value={t} key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="button" onClick={clearFilters} className="h-[44px] w-full rounded-[10px] border border-theme-muted bg-theme-surface px-4 text-sm font-medium text-theme-text hover:bg-theme-panel xl:w-auto">Wyczyść</button>
                        </div>
                    </div>

                    <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pt-4">
                        {filtered.length > 0 ? (
                            <>
                                <div className="hidden w-full xl:block">
                                    <table className="w-full table-fixed border-collapse text-left">
                                        <colgroup><col className="w-[13%]"/><col className="w-[17%]"/><col className="w-[16%]"/><col className="w-[10%]"/><col className="w-[16%]"/><col className="w-[17%]"/><col className="w-[11%]"/></colgroup>
                                        <thead><tr className="border-b border-theme-muted text-sm text-theme-muted"><th className="px-3 py-3 font-semibold">Data</th><th className="px-3 py-3 font-semibold">Godziny</th><th className="px-3 py-3 font-semibold">Budynek</th><th className="px-3 py-3 font-semibold">Sala</th><th className="px-3 py-3 font-semibold">Typ wydarzenia</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 text-right font-semibold">Akcja</th></tr></thead>
                                        <tbody>{filtered.map((r, i) => <Rezerwacjerow key={r.idRezerwacja ?? i} rezerwacja={r} />)}</tbody>
                                    </table>
                                </div>
                                <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
                                    {filtered.map((r, i) => <RezerwacjaMobile key={r.idRezerwacja ?? i} rezerwacja={r} />)}
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 text-center">
                                <div className="text-3xl">{reservations.length ? "⌕" : "📅"}</div>
                                <h2 className="text-lg font-bold text-theme-text">{reservations.length ? "Nie znaleziono rezerwacji" : "Brak rezerwacji"}</h2>
                                <p className="text-sm text-theme-muted">{reservations.length ? "Spróbuj zmienić kryteria wyszukiwania." : "Nie masz jeszcze żadnych rezerwacji sal."}</p>
                                {reservations.length > 0 && <button type="button" onClick={clearFilters} className="rounded-[10px] bg-theme-surface px-4 py-2 text-sm font-semibold text-theme-text hover:bg-theme-panel">Wyczyść filtry</button>}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default function Rezerwacje({ rezerwowanesale }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    useEffect(() => {
        if (message) toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
    }, [message]);

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Head title="Moje rezerwacje" />
            <MenuProwadzacy />
            <Content rezerwowanesale={rezerwowanesale} />
        </div>
    );
}
