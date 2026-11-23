import React, { useMemo, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";

function Konsultacjerow({ konsultacja }) {
    return (
        <tr className="border-b border-theme-muted/40 text-left text-sm text-theme-text transition-colors last:border-b-0 hover:bg-theme-panel">
            <td className="break-words px-4 py-4 align-middle font-semibold [overflow-wrap:anywhere]">
                {[konsultacja.TytulNaukowy, konsultacja.name, konsultacja.surname]
                    .filter(Boolean)
                    .join(" ") || "—"}
            </td>
            <td className="px-4 py-4 align-middle font-medium">
                <span className="inline-block rounded-lg bg-theme-surface px-2.5 py-1.5 whitespace-nowrap">
                    {konsultacja.GodzinaRozpoczecia || "—"} – {konsultacja.GodzinaZakonczenia || "—"}
                </span>
            </td>
            <td className="break-words px-4 py-4 align-middle [overflow-wrap:anywhere]">
                {konsultacja.nazwa || "—"}
            </td>
            <td className="px-4 py-4 align-middle font-semibold">
                {konsultacja.numerSali || "—"}
            </td>
            <td className="px-4 py-4 align-middle whitespace-nowrap text-theme-muted">
                {konsultacja.data || "—"}
            </td>
        </tr>
    );
}

function KonsultacjaMobile({ konsultacja }) {
    return (
        <article className="min-w-0 rounded-2xl border border-theme-muted/60 bg-theme-surface p-4 text-theme-text transition-colors hover:border-theme-orange/50 sm:p-5">
            <div className="flex min-w-0 flex-col gap-2 border-b border-theme-muted/50 pb-3">
                <span className="text-xs font-medium uppercase tracking-wide text-theme-muted">Prowadzący</span>
                <h3 className="break-words text-base font-bold leading-snug [overflow-wrap:anywhere]">
                    {[konsultacja.TytulNaukowy, konsultacja.name, konsultacja.surname]
                        .filter(Boolean)
                        .join(" ") || "—"}
                </h3>
            </div>
            <dl className="mt-3 grid min-w-0 grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div className="min-w-0">
                    <dt className="text-xs text-theme-muted">Data</dt>
                    <dd className="mt-1 break-words font-semibold">{konsultacja.data || "—"}</dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-xs text-theme-muted">Godziny</dt>
                    <dd className="mt-1 break-words font-semibold">
                        {konsultacja.GodzinaRozpoczecia || "—"} – {konsultacja.GodzinaZakonczenia || "—"}
                    </dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-xs text-theme-muted">Budynek</dt>
                    <dd className="mt-1 break-words font-semibold [overflow-wrap:anywhere]">{konsultacja.nazwa || "—"}</dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-xs text-theme-muted">Sala</dt>
                    <dd className="mt-1 break-words font-semibold">{konsultacja.numerSali || "—"}</dd>
                </div>
            </dl>
        </article>
    );
}

function Content({ konsultacje = [] }) {
    const [szukaj, setSzukaj] = useState("");
    const listaKonsultacji = Array.isArray(konsultacje) ? konsultacje : [];

    const filtrowaneKonsultacje = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");
        if (!tekst) return listaKonsultacji;

        return listaKonsultacji.filter((konsultacja) => {
            const pola = [
                konsultacja.TytulNaukowy,
                konsultacja.name,
                konsultacja.surname,
                `${konsultacja.TytulNaukowy ?? ""} ${konsultacja.name ?? ""} ${konsultacja.surname ?? ""}`,
                konsultacja.GodzinaRozpoczecia,
                konsultacja.GodzinaZakonczenia,
                konsultacja.nazwa,
                konsultacja.numerSali,
                konsultacja.data,
            ];
            return pola.some((pole) =>
                String(pole ?? "").toLocaleLowerCase("pl-PL").includes(tekst)
            );
        });
    }, [konsultacje, szukaj]);

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[44px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted/60 bg-theme-page px-2 sm:px-3">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[15px] font-bold text-theme-text sm:text-base">
                    Konsultacje
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 rounded-b-[10px] pt-3 sm:px-1 sm:pb-2 md:px-3">
                <section className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-theme-muted/50 bg-theme-slate">
                    <header className="shrink-0 border-b border-theme-muted/50 bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="min-w-0">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-theme-muted">MojaUczelnia · Student</p>
                                <h1 className="break-words text-2xl font-bold tracking-tight text-theme-text sm:text-3xl lg:text-[34px]">
                                    Dostępne konsultacje
                                </h1>
                                <p className="mt-2 text-sm text-theme-muted">
                                    Sprawdź terminy konsultacji, prowadzących i dostępne sale.
                                </p>
                            </div>
                            <div className="w-full min-w-0 lg:max-w-[360px]">
                                <label htmlFor="konsultacje-szukaj" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                                    Wyszukaj konsultację
                                </label>
                                <div className="flex min-w-0 items-center gap-2 rounded-xl border border-theme-muted bg-theme-slate px-3 focus-within:border-theme-orange">
                                    <span className="shrink-0 text-base text-theme-muted" aria-hidden="true">⌕</span>
                                    <input
                                        id="konsultacje-szukaj"
                                        type="search"
                                        value={szukaj}
                                        onChange={(e) => setSzukaj(e.target.value)}
                                        placeholder="Prowadzący, sala, data..."
                                        className="h-11 min-w-0 w-full flex-1 bg-transparent text-sm text-theme-text outline-none placeholder:text-theme-muted"
                                    />
                                    {szukaj && (
                                        <button
                                            type="button"
                                            onClick={() => setSzukaj("")}
                                            aria-label="Wyczyść wyszukiwanie"
                                            className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-theme-muted transition-colors hover:bg-theme-panel hover:text-theme-text"
                                        >
                                            Wyczyść
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
                        <h2 className="text-sm font-semibold text-theme-text">Lista konsultacji</h2>
                        <span className="rounded-lg border border-theme-muted/60 bg-theme-surface px-3 py-1 text-xs font-medium text-theme-muted">
                            {szukaj.trim()
                                ? `Znaleziono: ${filtrowaneKonsultacje.length} z ${listaKonsultacji.length}`
                                : `Łącznie: ${listaKonsultacji.length}`}
                        </span>
                    </div>

                    <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto px-3 pb-4 sm:px-5 sm:pb-5">
                        {filtrowaneKonsultacje.length > 0 ? (
                            <>
                                <div className="hidden min-w-0 overflow-hidden rounded-xl border border-theme-muted/50 bg-theme-surface lg:block">
                                    <table className="w-full table-fixed border-collapse">
                                        <colgroup>
                                            <col style={{ width: "29%" }} />
                                            <col style={{ width: "22%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "10%" }} />
                                            <col style={{ width: "19%" }} />
                                        </colgroup>
                                        <thead className="bg-theme-panel">
                                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-theme-muted">
                                                <th className="px-4 py-4">Prowadzący</th>
                                                <th className="px-4 py-4">Czas</th>
                                                <th className="px-4 py-4">Budynek</th>
                                                <th className="px-4 py-4">Sala</th>
                                                <th className="px-4 py-4">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtrowaneKonsultacje.map((konsultacja, index) => (
                                                <Konsultacjerow
                                                    key={konsultacja.idRezerwacja ?? index}
                                                    konsultacja={konsultacja}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex min-w-0 flex-col gap-3 lg:hidden">
                                    {filtrowaneKonsultacje.map((konsultacja, index) => (
                                        <KonsultacjaMobile
                                            key={konsultacja.idRezerwacja ?? index}
                                            konsultacja={konsultacja}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-theme-muted/60 bg-theme-surface px-4 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-theme-slate text-2xl" aria-hidden="true">{szukaj.trim() ? "⌕" : "—"}</div>
                                <h3 className="text-base font-bold text-theme-text">
                                    {szukaj.trim() ? "Nie znaleziono konsultacji" : "Brak konsultacji"}
                                </h3>
                                <p className="max-w-[340px] text-sm text-theme-muted">
                                    {szukaj.trim()
                                        ? "Spróbuj zmienić wyszukiwaną frazę lub wyczyścić pole."
                                        : "Aktualnie nie ma dostępnych terminów konsultacji."}
                                </p>
                                {szukaj.trim() && (
                                    <button type="button" onClick={() => setSzukaj("")} className="mt-1 rounded-xl bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text">
                                        Wyczyść wyszukiwanie
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default function Konsultacje({ auth, konsultacje = [] }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Konsultacje" />
            <MenuStudenta />
            <Content konsultacje={konsultacje} />
        </div>
    );
}
