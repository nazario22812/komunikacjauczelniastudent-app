import React, { useMemo, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import { Search, X } from "lucide-react";

function Konsultacjerow({ konsultacja }) {
    return (
        <tr className="text-left text-[clamp(0.85rem,1vw+0.5rem,1.2rem)] font-bold text-theme-text transition-colors hover:bg-theme-slate">
            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {konsultacja.TytulNaukowy} {konsultacja.name} {konsultacja.surname}
            </td>
            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {konsultacja.GodzinaRozpoczecia}-{konsultacja.GodzinaZakonczenia}
            </td>
            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {konsultacja.nazwa}
            </td>
            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {konsultacja.numerSali}
            </td>
            <td className="break-words whitespace-normal py-5 align-top">
                {konsultacja.data}
            </td>
        </tr>
    );
}

function KonsultacjaMobile({ konsultacja }) {
    return (
        <div className="min-w-0 rounded-[15px] border border-theme-muted bg-theme-slate p-3 text-theme-text sm:p-4">
            <div className="min-w-0 border-b border-theme-muted pb-3">
                <span className="block text-xs font-medium text-theme-muted">Prowadzący</span>
                <span className="mt-1 block break-words [overflow-wrap:anywhere] text-base font-bold text-theme-text">
                    {konsultacja.TytulNaukowy} {konsultacja.name} {konsultacja.surname}
                </span>
            </div>
            <div className="mt-3 grid min-w-0 grid-cols-2 gap-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">Czas</span>
                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">
                        {konsultacja.GodzinaRozpoczecia}-{konsultacja.GodzinaZakonczenia}
                    </span>
                </div>
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">Data</span>
                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">{konsultacja.data}</span>
                </div>
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">Budynek</span>
                    <span className="mt-1 block break-words [overflow-wrap:anywhere] text-sm font-semibold text-theme-text">
                        {konsultacja.nazwa}
                    </span>
                </div>
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">Sala</span>
                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">{konsultacja.numerSali}</span>
                </div>
            </div>
        </div>
    );
}

function Content({ konsultacje = [] }) {
    const [szukaj, setSzukaj] = useState("");

    const filtrowaneKonsultacje = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");
        if (!tekst) return konsultacje ?? [];

        return (konsultacje ?? []).filter((konsultacja) => {
            const pola = [
                konsultacja.TytulNaukowy,
                konsultacja.name,
                konsultacja.surname,
                `${konsultacja.name ?? ""} ${konsultacja.surname ?? ""}`,
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
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Konsultacje
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-w-0 w-full shrink-0 flex-col gap-4 rounded-t-[15px] px-3 py-4 sm:px-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="break-words text-xl font-bold text-theme-text sm:text-2xl lg:text-[36px]">
                        Lista dostępnych konsultacji
                    </h1>
                    <div className="relative w-full min-w-0 md:max-w-[340px]">
                        <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
                        <input
                            type="search"
                            value={szukaj}
                            onChange={(e) => setSzukaj(e.target.value)}
                            placeholder="Szukaj konsultacji..."
                            aria-label="Szukaj konsultacji"
                            className="h-[42px] w-full min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate pl-10 pr-10 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                        />
                        {szukaj && (
                            <button
                                type="button"
                                onClick={() => setSzukaj("")}
                                aria-label="Wyczyść wyszukiwanie"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[15px] p-3 sm:p-4 md:p-5">
                    {filtrowaneKonsultacje.length > 0 ? (
                        <>
                            <div className="hidden min-w-0 w-full lg:block">
                                <table className="w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col style={{ width: "30%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "12%" }} />
                                        <col style={{ width: "18%" }} />
                                    </colgroup>
                                    <thead>
                                        <tr className="h-[52px] border-b border-theme-muted text-left text-[clamp(0.9rem,1vw+0.5rem,1.3rem)] text-theme-muted">
                                            <th className="py-[10px] pr-3">Prowadzący</th>
                                            <th className="py-[10px] pr-3">Czas</th>
                                            <th className="py-[10px] pr-3">Budynek</th>
                                            <th className="py-[10px] pr-3">Sala</th>
                                            <th className="py-[10px]">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-theme-muted">
                                        {filtrowaneKonsultacje.map((konsultacja, index) => (
                                            <Konsultacjerow
                                                key={konsultacja.idRezerwacja ?? index}
                                                konsultacja={konsultacja}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex min-w-0 w-full flex-col gap-3 lg:hidden">
                                {filtrowaneKonsultacje.map((konsultacja, index) => (
                                    <KonsultacjaMobile
                                        key={konsultacja.idRezerwacja ?? index}
                                        konsultacja={konsultacja}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="mx-auto mt-10 w-full text-center text-[20px] text-theme-muted sm:text-[24px]">
                            {szukaj.trim() ? "Nie znaleziono konsultacji" : "Brak konsultacji"}
                        </div>
                    )}
                </div>
            </div>
        </div>
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
