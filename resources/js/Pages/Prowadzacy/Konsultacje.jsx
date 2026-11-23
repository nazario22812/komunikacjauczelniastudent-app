import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

const display = (value) =>
    value === null || value === undefined || String(value).trim() === ""
        ? "—"
        : String(value);

function StatusBadge({ status }) {
    const label = display(status);
    const value = label.toLocaleLowerCase("pl-PL");
    let colors = "border-theme-muted bg-theme-panel text-theme-text";

    if (/zaakcept|zatwierdz|potwierdz|akcept|zrealizowan/.test(value)) {
        colors = "border-green-600 bg-green-950 text-green-200";
    } else if (/odrzuc|anul|odwoł|odwol/.test(value)) {
        colors = "border-red-600 bg-red-950 text-red-200";
    } else if (/oczek|złoż|zloz|now|weryfik|rezerw/.test(value)) {
        colors = "border-amber-600 bg-amber-950 text-amber-200";
    }

    return (
        <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-semibold [overflow-wrap:anywhere] ${colors}`}>
            {label}
        </span>
    );
}

function DeleteButton({ konsultacja, fullWidth = false }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        if (loading || !window.confirm("Czy na pewno chcesz usunąć tę konsultację?")) return;
        setLoading(true);
        router.post(
            `/prowadzacy/konsultacja/usun/${konsultacja.idRezerwacja}`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`min-h-[38px] cursor-pointer rounded-[10px] border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50 ${fullWidth ? "w-full" : ""}`}
            aria-label="Usuń konsultację"
        >
            {loading ? "Usuwanie..." : "Usuń"}
        </button>
    );
}

function ConsultationCard({ konsultacja }) {
    return (
        <article className="flex min-w-0 flex-col gap-4 rounded-[16px] border border-theme-muted bg-theme-surface p-4 text-theme-text sm:p-5">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-theme-muted">Termin konsultacji</p>
                    <h3 className="mt-1 break-words text-lg font-bold sm:text-xl">{display(konsultacja.data)}</h3>
                    <p className="mt-1 text-sm font-medium text-theme-text">
                        {display(konsultacja.GodzinaRozpoczecia)} – {display(konsultacja.GodzinaZakonczenia)}
                    </p>
                </div>
                <StatusBadge status={konsultacja.statusRezerwacji} />
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-3 border-t border-theme-muted pt-4 sm:grid-cols-2">
                <div className="min-w-0">
                    <p className="text-xs text-theme-muted">Budynek</p>
                    <p className="mt-1 break-words text-sm font-semibold [overflow-wrap:anywhere]">{display(konsultacja.nazwa)}</p>
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-theme-muted">Sala</p>
                    <p className="mt-1 break-words text-sm font-semibold">{display(konsultacja.numerSali)}</p>
                </div>
            </div>
            <div className="border-t border-theme-muted pt-3">
                <DeleteButton konsultacja={konsultacja} fullWidth />
            </div>
        </article>
    );
}

function ConsultationsTable({ konsultacje }) {
    return (
        <div className="hidden min-w-0 overflow-hidden rounded-[15px] border border-theme-muted bg-theme-surface xl:block">
            <table className="w-full table-fixed border-collapse text-left text-sm text-theme-text">
                <colgroup>
                    <col style={{ width: "17%" }} />
                    <col style={{ width: "19%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "12%" }} />
                </colgroup>
                <thead className="bg-theme-panel text-theme-muted">
                    <tr>
                        <th className="px-4 py-4 font-semibold">Data</th>
                        <th className="px-4 py-4 font-semibold">Godziny</th>
                        <th className="px-4 py-4 font-semibold">Budynek</th>
                        <th className="px-4 py-4 font-semibold">Sala</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                        <th className="px-4 py-4 text-right font-semibold">Akcja</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-theme-muted">
                    {konsultacje.map((konsultacja, index) => (
                        <tr key={konsultacja.idRezerwacja ?? index} className="transition-colors hover:bg-theme-panel">
                            <td className="break-words px-4 py-4 font-semibold">{display(konsultacja.data)}</td>
                            <td className="break-words px-4 py-4">{display(konsultacja.GodzinaRozpoczecia)} – {display(konsultacja.GodzinaZakonczenia)}</td>
                            <td className="break-words px-4 py-4 [overflow-wrap:anywhere]">{display(konsultacja.nazwa)}</td>
                            <td className="break-words px-4 py-4">{display(konsultacja.numerSali)}</td>
                            <td className="px-4 py-4"><StatusBadge status={konsultacja.statusRezerwacji} /></td>
                            <td className="px-4 py-4 text-right"><DeleteButton konsultacja={konsultacja} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Content({ rezerwowanekonsultacje = [] }) {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const konsultacje = Array.isArray(rezerwowanekonsultacje) ? rezerwowanekonsultacje : [];

    const statuses = useMemo(
        () => [...new Set(konsultacje.map((item) => String(item.statusRezerwacji ?? "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pl")),
        [rezerwowanekonsultacje],
    );

    const filtered = useMemo(() => {
        const phrase = query.trim().toLocaleLowerCase("pl-PL");
        return konsultacje.filter((item) => {
            if (statusFilter !== "all" && String(item.statusRezerwacji ?? "") !== statusFilter) return false;
            if (!phrase) return true;
            return [
                item.data,
                item.GodzinaRozpoczecia,
                item.GodzinaZakonczenia,
                item.nazwa,
                item.numerSali,
                item.statusRezerwacji,
            ].some((value) => String(value ?? "").toLocaleLowerCase("pl-PL").includes(phrase));
        });
    }, [rezerwowanekonsultacje, query, statusFilter]);

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[48px] shrink-0 justify-start"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 text-center text-[15px] font-bold text-theme-text sm:text-base">Moje konsultacje</span>
                <div className="w-[48px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <section className="flex min-w-0 shrink-0 flex-col gap-4 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-theme-muted">Prowadzący · Konsultacje</p>
                        <h1 className="mt-1 break-words text-2xl font-bold text-theme-text sm:text-3xl">Moje konsultacje</h1>
                        <p className="mt-2 text-sm text-theme-muted">Zarządzaj terminami konsultacji i rezerwacjami sal.</p>
                    </div>
                    <Link href="/prowadzacy/stworzkonsultacje" className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-[11px] bg-theme-orange px-5 py-3 text-center text-sm font-bold text-theme-text transition hover:brightness-110 sm:text-base">
                        <span className="text-xl leading-none">+</span> Utwórz konsultację
                    </Link>
                </section>

                <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-3 sm:p-4 lg:p-5">
                    <div className="flex min-w-0 shrink-0 flex-col gap-3 border-b border-theme-muted pb-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-theme-text sm:text-xl">Zaplanowane konsultacje</h2>
                            <p className="mt-1 text-sm text-theme-muted">Wyświetlono {filtered.length} z {konsultacje.length} konsultacji</p>
                        </div>
                        <div className="flex min-w-0 w-full flex-col gap-2 sm:flex-row lg:w-auto">
                            <label className="min-w-0 flex-1 lg:w-[285px]">
                                <span className="sr-only">Szukaj konsultacji</span>
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Szukaj po dacie, sali, budynku..."
                                    className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                />
                            </label>
                            <label className="min-w-0 sm:w-[190px]">
                                <span className="sr-only">Filtruj według statusu</span>
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text outline-none focus:border-theme-orange"
                                >
                                    <option value="all">Wszystkie statusy</option>
                                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pt-4">
                        {filtered.length > 0 ? (
                            <>
                                <ConsultationsTable konsultacje={filtered} />
                                <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
                                    {filtered.map((konsultacja, index) => <ConsultationCard key={konsultacja.idRezerwacja ?? index} konsultacja={konsultacja} />)}
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[230px] flex-col items-center justify-center gap-3 px-4 text-center">
                                <span className="text-4xl" aria-hidden="true">📅</span>
                                <p className="text-lg font-semibold text-theme-text">{konsultacje.length ? "Nie znaleziono konsultacji" : "Brak konsultacji"}</p>
                                <p className="max-w-md text-sm text-theme-muted">
                                    {konsultacje.length ? "Zmień wyszukiwaną frazę lub wybrany status." : "Utwórz konsultację, aby wyświetlić ją na tej liście."}
                                </p>
                                {konsultacje.length > 0 && (
                                    <button type="button" onClick={() => { setQuery(""); setStatusFilter("all"); }} className="rounded-[10px] border border-theme-muted bg-theme-surface px-4 py-2 text-sm font-semibold text-theme-text hover:bg-theme-panel">Wyczyść filtry</button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default function Konsultacje({ rezerwowanekonsultacje }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;

    useEffect(() => {
        if (message) {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }, [message]);

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Head title="Moje konsultacje" />
            <MenuProwadzacy />
            <Content rezerwowanekonsultacje={rezerwowanekonsultacje} />
        </div>
    );
}
