import React, { useMemo, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";

const czyOplacona = (platnosc) => Number(platnosc.czyOplacone) === 1;

const kwotaPLN = (kwota) => {
    const liczba = Number(String(kwota ?? 0).replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(liczba)
        ? new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(liczba)
        : `${kwota ?? "0"} PLN`;
};

const formatujDate = (data) => {
    if (!data) return "—";
    const tekst = String(data);
    const dopasowanie = tekst.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
    if (!dopasowanie) return tekst;
    const [, rok, miesiac, dzien, godzina, minuta] = dopasowanie;
    return `${dzien}.${miesiac}.${rok}${godzina ? `, ${godzina}:${minuta}` : ""}`;
};

function StatusPlatnosci({ platnosc }) {
    const oplacone = czyOplacona(platnosc);
    return (
        <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold sm:text-sm ${
            oplacone
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
        }`}>
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${oplacone ? "bg-emerald-400" : "bg-rose-400"}`} />
            {oplacone ? "Opłacone" : "Nieopłacone"}
        </span>
    );
}

function Platnoscrow({ platnosc }) {
    return (
        <tr className="border-b border-theme-muted/40 text-left text-sm text-theme-text transition-colors last:border-b-0 hover:bg-theme-panel">
            <td className="min-w-0 break-words px-4 py-4 align-middle font-semibold">{platnosc.tytul || "—"}</td>
            <td className="px-4 py-4 align-middle text-theme-muted">{formatujDate(platnosc.data)}</td>
            <td className="px-4 py-4 align-middle text-theme-muted">{formatujDate(platnosc.termin)}</td>
            <td className="px-4 py-4 align-middle font-bold tabular-nums">{kwotaPLN(platnosc.kwota)}</td>
            <td className="px-4 py-4 align-middle"><StatusPlatnosci platnosc={platnosc} /></td>
        </tr>
    );
}

function PlatnoscMobile({ platnosc }) {
    return (
        <article className="min-w-0 rounded-xl border border-theme-muted/60 bg-theme-slate p-4 text-theme-text">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 break-words text-sm font-bold sm:text-base">{platnosc.tytul || "—"}</h3>
                <StatusPlatnosci platnosc={platnosc} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-theme-muted/40 pt-3 text-sm">
                <div className="min-w-0"><p className="text-xs text-theme-muted">Data wystawienia</p><p className="mt-1 break-words">{formatujDate(platnosc.data)}</p></div>
                <div className="min-w-0"><p className="text-xs text-theme-muted">Termin płatności</p><p className="mt-1 break-words">{formatujDate(platnosc.termin)}</p></div>
                <div className="col-span-2 min-w-0"><p className="text-xs text-theme-muted">Kwota</p><p className="mt-1 text-xl font-bold tabular-nums">{kwotaPLN(platnosc.kwota)}</p></div>
            </div>
        </article>
    );
}

function Content({ platnosci = [], suma = 0, najblizszytermin = null, kontodozaplaty = null }) {
    const [wyszukiwanie, setWyszukiwanie] = useState("");
    const [status, setStatus] = useState("wszystkie");
    const [skopiowano, setSkopiowano] = useState(false);

    const listaPlatnosci = Array.isArray(platnosci) ? platnosci : [];
    const zaleglosci = listaPlatnosci.filter((platnosc) => !czyOplacona(platnosc)).length;
    const filteredPlatnosci = useMemo(() => {
        const fraza = wyszukiwanie.trim().toLocaleLowerCase("pl-PL");
        return listaPlatnosci.filter((platnosc) => {
            if (status === "oplacone" && !czyOplacona(platnosc)) return false;
            if (status === "nieoplacone" && czyOplacona(platnosc)) return false;
            if (!fraza) return true;
            return [platnosc.tytul, platnosc.data, platnosc.termin, platnosc.kwota, formatujDate(platnosc.data), formatujDate(platnosc.termin), czyOplacona(platnosc) ? "opłacone" : "nieopłacone"]
                .some((wartosc) => String(wartosc ?? "").toLocaleLowerCase("pl-PL").includes(fraza));
        });
    }, [listaPlatnosci, wyszukiwanie, status]);

    const kopiujKonto = async () => {
        if (!kontodozaplaty || !navigator.clipboard?.writeText) return;
        try {
            await navigator.clipboard.writeText(String(kontodozaplaty));
            setSkopiowano(true);
        } catch {
            setSkopiowano(false);
        }
    };

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-10 w-full shrink-0 items-center border-b border-theme-muted/50 bg-theme-page px-2 sm:px-3">
                <div className="flex w-14 shrink-0 items-center"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 text-center text-sm font-bold text-theme-text sm:text-base">Moje finanse</span>
                <div className="w-14 shrink-0" />
            </div>

            <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-3">
                <section className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-2xl bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">Moje finanse</h1>
                        <p className="mt-1 text-sm text-theme-muted">Sprawdzaj swoje należności i historię płatności.</p>
                    </div>
                    <div className="rounded-full border border-theme-muted/60 bg-theme-slate px-3 py-1.5 text-xs font-medium text-theme-muted">
                        {listaPlatnosci.length} {listaPlatnosci.length === 1 ? "płatność" : "płatności"}
                    </div>
                </section>

                <section className="mb-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="min-w-0 rounded-2xl border border-theme-muted/40 bg-theme-surface p-4 sm:p-5">
                        <p className="text-sm font-medium text-theme-muted">Suma do zapłaty</p>
                        <p className={`mt-3 break-words text-3xl font-bold tracking-tight tabular-nums sm:text-4xl ${Number(suma) > 0 ? "text-rose-400" : "text-theme-text"}`}>{kwotaPLN(suma)}</p>
                        <p className="mt-3 text-xs text-theme-muted">{zaleglosci > 0 ? `Nieopłacone pozycje: ${zaleglosci}` : "Brak nieopłaconych pozycji"}</p>
                    </div>
                    <div className="min-w-0 rounded-2xl border border-theme-muted/40 bg-theme-surface p-4 sm:p-5">
                        <p className="text-sm font-medium text-theme-muted">Najbliższy termin</p>
                        <p className="mt-3 break-words text-2xl font-bold text-theme-text sm:text-3xl">{najblizszytermin ? formatujDate(najblizszytermin) : "Brak"}</p>
                        <p className="mt-3 text-xs text-theme-muted">{najblizszytermin ? "Najbliższa należna płatność" : "Nie masz oczekujących terminów"}</p>
                    </div>
                    <div className="min-w-0 rounded-2xl border border-theme-muted/40 bg-theme-surface p-4 sm:col-span-2 sm:p-5 xl:col-span-1">
                        <p className="text-sm font-medium text-theme-muted">Konto bankowe</p>
                        <p className="mt-3 break-all text-base font-bold leading-relaxed text-theme-text sm:text-lg">{kontodozaplaty || "Brak numeru konta"}</p>
                        {kontodozaplaty && (
                            <button type="button" onClick={kopiujKonto} className="mt-3 rounded-lg border border-theme-muted bg-theme-slate px-3 py-1.5 text-xs font-semibold text-theme-text transition-colors hover:bg-theme-panel">
                                {skopiowano ? "Skopiowano" : "Kopiuj numer konta"}
                            </button>
                        )}
                    </div>
                </section>

                <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-theme-surface">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-5 sm:px-6">
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-theme-text sm:text-2xl">Historia płatności</h2>
                            <p className="mt-1 text-xs text-theme-muted">Wyświetlono {filteredPlatnosci.length} z {listaPlatnosci.length} płatności</p>
                        </div>
                    </div>
                    <div className="grid min-w-0 grid-cols-1 gap-3 border-y border-theme-muted/40 bg-theme-slate p-3 sm:grid-cols-[minmax(0,1fr)_200px] sm:p-4">
                        <label className="min-w-0">
                            <span className="mb-1.5 block text-xs font-medium text-theme-muted">Szukaj płatności</span>
                            <input value={wyszukiwanie} onChange={(e) => setWyszukiwanie(e.target.value)} placeholder="Tytuł, data, kwota..." className="h-10 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text outline-none transition-colors placeholder:text-theme-muted focus:border-theme-orange" />
                        </label>
                        <label className="min-w-0">
                            <span className="mb-1.5 block text-xs font-medium text-theme-muted">Status</span>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text outline-none focus:border-theme-orange">
                                <option value="wszystkie">Wszystkie statusy</option>
                                <option value="oplacone">Opłacone</option>
                                <option value="nieoplacone">Nieopłacone</option>
                            </select>
                        </label>
                    </div>

                    {filteredPlatnosci.length ? (
                        <>
                            <div className="hidden w-full min-w-0 lg:block">
                                <table className="w-full table-fixed border-collapse">
                                    <colgroup><col style={{ width: "30%" }}/><col style={{ width: "18%" }}/><col style={{ width: "18%" }}/><col style={{ width: "16%" }}/><col style={{ width: "18%" }}/></colgroup>
                                    <thead className="bg-theme-slate text-left text-xs font-semibold text-theme-muted">
                                        <tr><th className="px-4 py-4">Tytuł</th><th className="px-4 py-4">Data wystawienia</th><th className="px-4 py-4">Termin</th><th className="px-4 py-4">Kwota</th><th className="px-4 py-4">Status</th></tr>
                                    </thead>
                                    <tbody>{filteredPlatnosci.map((platnosc, index) => <Platnoscrow key={platnosc.idPlatnosc ?? index} platnosc={platnosc}/>)}</tbody>
                                </table>
                            </div>
                            <div className="flex min-w-0 flex-col gap-3 p-3 sm:p-4 lg:hidden">
                                {filteredPlatnosci.map((platnosc, index) => <PlatnoscMobile key={platnosc.idPlatnosc ?? index} platnosc={platnosc}/>)}
                            </div>
                        </>
                    ) : (
                        <div className="px-4 py-14 text-center">
                            <p className="text-base font-semibold text-theme-text">{listaPlatnosci.length ? "Nie znaleziono płatności" : "Brak płatności"}</p>
                            <p className="mt-2 text-sm text-theme-muted">{listaPlatnosci.length ? "Zmień wyszukiwaną frazę lub filtr statusu." : "Historia płatności pojawi się tutaj."}</p>
                            {listaPlatnosci.length > 0 && <button type="button" onClick={() => { setWyszukiwanie(""); setStatus("wszystkie"); }} className="mt-4 rounded-lg bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text">Wyczyść filtry</button>}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default function MojeFinanse({ auth, platnosci, suma, najblizszytermin, kontodozaplaty }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Moje finanse" />
            <MenuStudenta />
            <Content platnosci={platnosci} suma={suma} najblizszytermin={najblizszytermin} kontodozaplaty={kontodozaplaty} />
        </div>
    );
}
