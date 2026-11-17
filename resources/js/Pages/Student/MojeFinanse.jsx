
import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";

function Platnoscrow({ platnosc }) {
    return (
        <tr className="text-left text-[clamp(0.8rem,1vw+0.5rem,1.1rem)] font-bold text-theme-text hover:bg-theme-panel">
            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {platnosc.tytul}
            </td>

            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {platnosc.data}
            </td>

            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {platnosc.termin}
            </td>

            <td className="break-words whitespace-normal py-5 pr-3 align-top">
                {platnosc.kwota}
            </td>

            <td className="py-5 align-top">
                {Number(platnosc.czyOplacone) === 1 ? (
                    <span className="text-[clamp(0.9rem,1vw+0.5rem,1.35rem)] text-theme-green">
                        Opłacone
                    </span>
                ) : (
                    <span className="text-[clamp(0.9rem,1vw+0.5rem,1.35rem)] text-theme-red">
                        Nie opłacone
                    </span>
                )}
            </td>
        </tr>
    );
}

function PlatnoscMobile({ platnosc }) {
    return (
        <div className="min-w-0 border-b border-theme-muted py-4 last:border-b-0">
            <div className="mb-3 flex min-w-0 flex-wrap items-start justify-between gap-2">
                <h3 className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base font-bold text-theme-text">
                    {platnosc.tytul}
                </h3>

                <span
                    className={`shrink-0 text-sm font-bold ${
                        Number(platnosc.czyOplacone) === 1
                            ? "text-theme-green"
                            : "text-theme-red"
                    }`}
                >
                    {Number(platnosc.czyOplacone) === 1
                        ? "Opłacone"
                        : "Nie opłacone"}
                </span>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3 text-sm">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Data wystawienia
                    </span>

                    <span className="mt-1 block break-words text-theme-text">
                        {platnosc.data}
                    </span>
                </div>

                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Termin
                    </span>

                    <span className="mt-1 block break-words text-theme-text">
                        {platnosc.termin}
                    </span>
                </div>

                <div className="col-span-2 min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Kwota
                    </span>

                    <span className="mt-1 block break-words text-lg font-bold text-theme-text">
                        {platnosc.kwota}
                    </span>
                </div>
            </div>
        </div>
    );
}

function Content({
    platnosci = [],
    suma,
    najblizszytermin,
    kontodozaplaty,
}) {
    return (
        <div className="bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px] lg:h-dvh lg:overflow-hidden">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Moje finanse
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-slate mx-auto flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] p-2 sm:p-3 md:p-5">
                    <div className="grid min-w-0 w-full shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)]">
                        <div className="bg-theme-surface mx-auto w-full min-w-0 rounded-[15px] px-4 py-5 text-left sm:px-5 sm:py-[26px] xl:px-[37px]">
                            <span className="block text-[clamp(0.8rem,1.2vw+0.6rem,1.5rem)] text-theme-muted">
                                Suma do zapłaty
                            </span>

                            <span
                                className={`mt-1 block break-words [overflow-wrap:anywhere] text-[clamp(1.8rem,3vw+1rem,3rem)] font-bold ${
                                    Number(suma) < 1
                                        ? "text-theme-text"
                                        : "text-theme-red"
                                }`}
                            >
                                {suma} PLN
                            </span>
                        </div>

                        {najblizszytermin && (
                            <div className="bg-theme-surface mx-auto w-full min-w-0 rounded-[15px] px-4 py-5 text-left sm:px-5 sm:py-[26px] xl:px-[37px]">
                                <span className="block text-[clamp(0.8rem,1.2vw+0.6rem,1.5rem)] text-theme-muted">
                                    Najbliższy termin
                                </span>

                                <span className="mt-1 block break-words text-[clamp(1.4rem,2.2vw+0.9rem,2.3rem)] font-bold text-theme-text">
                                    {najblizszytermin}
                                </span>
                            </div>
                        )}

                        <div className="bg-theme-surface mx-auto w-full min-w-0 rounded-[15px] px-4 py-5 text-left sm:col-span-2 sm:px-5 sm:py-[26px] xl:col-span-1 xl:px-[37px]">
                            <span className="block text-[clamp(0.8rem,1.2vw+0.6rem,1.5rem)] text-theme-muted">
                                Konto bankowe
                            </span>

                            <span className="mt-1 block break-all text-[clamp(1.1rem,2vw+0.9rem,3rem)] font-bold text-theme-text">
                                {kontodozaplaty || "brak"}
                            </span>
                        </div>
                    </div>

                    <div className="bg-theme-surface mt-5 flex min-h-[250px] min-w-0 w-full flex-1 flex-col rounded-[15px] p-3 sm:p-4 md:px-[37px] md:py-[22px] lg:min-h-0">
                        <h2 className="shrink-0 break-words text-[clamp(1.5rem,2.5vw+0.7rem,2.5rem)] font-bold text-theme-text">
                            Historia Płatności
                        </h2>

                        <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto pt-3">
                            {platnosci && platnosci.length > 0 ? (
                                <>
                                    <div className="hidden min-w-0 w-full lg:block">
                                        <table className="w-full table-fixed border-collapse">
                                            <colgroup>
                                                <col style={{ width: "28%" }} />
                                                <col style={{ width: "19%" }} />
                                                <col style={{ width: "18%" }} />
                                                <col style={{ width: "15%" }} />
                                                <col style={{ width: "20%" }} />
                                            </colgroup>

                                            <thead>
                                                <tr className="h-[52px] border-b border-theme-muted text-left text-[clamp(0.85rem,1vw+0.5rem,1.3rem)] text-theme-muted">
                                                    <th className="py-[10px] pr-3">
                                                        Tytuł
                                                    </th>

                                                    <th className="py-[10px] pr-3">
                                                        Data wystawienia
                                                    </th>

                                                    <th className="py-[10px] pr-3">
                                                        Termin
                                                    </th>

                                                    <th className="py-[10px] pr-3">
                                                        Kwota
                                                    </th>

                                                    <th className="py-[10px]">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-theme-muted">
                                                {platnosci.map(
                                                    (platnosc, index) => (
                                                        <Platnoscrow
                                                            key={
                                                                platnosc.id ??
                                                                index
                                                            }
                                                            platnosc={platnosc}
                                                        />
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="block min-w-0 w-full lg:hidden">
                                        {platnosci.map((platnosc, index) => (
                                            <PlatnoscMobile
                                                key={platnosc.id ?? index}
                                                platnosc={platnosc}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="mx-auto mt-10 w-full text-center text-[clamp(1rem,1.2vw+0.7rem,1.6rem)] text-theme-muted">
                                    <span>Brak płatności</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MojeFinanse({
    auth,
    platnosci,
    suma,
    najblizszytermin,
    kontodozaplaty,
}) {
    return (
        <div className="flex min-h-dvh min-w-0 w-full lg:h-dvh lg:overflow-hidden">
            <Head title="Moje finanse" />

            <MenuStudenta />

            <Content
                platnosci={platnosci}
                suma={suma}
                najblizszytermin={najblizszytermin}
                kontodozaplaty={kontodozaplaty}
            />
        </div>
    );
}
