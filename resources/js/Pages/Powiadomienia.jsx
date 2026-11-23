import React, { useMemo, useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

function Powiadomienierow({ powiadomienie }) {
    return (
        <tr className="border-b border-theme-muted/30 text-left text-theme-text transition-colors last:border-b-0 hover:bg-theme-panel">
            <td className="min-w-0 py-4 pr-5 align-top">
                <p className="break-words [overflow-wrap:anywhere] text-sm font-semibold leading-6 lg:text-base">
                    {powiadomienie.temat || "Bez tematu"}
                </p>
            </td>
            <td className="min-w-0 py-4 align-top">
                <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-6 text-theme-text/90">
                    {powiadomienie.tresc || "Brak treści"}
                </p>
            </td>
        </tr>
    );
}

function PowiadomienieMobile({ powiadomienie }) {
    return (
        <article className="min-w-0 rounded-2xl border border-theme-muted/40 bg-theme-slate p-4 transition-colors hover:bg-theme-panel sm:p-5">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-orange/15 text-lg text-theme-orange" aria-hidden="true">
                    !
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="break-words [overflow-wrap:anywhere] text-sm font-bold leading-6 text-theme-text sm:text-base">
                        {powiadomienie.temat || "Bez tematu"}
                    </h3>
                    <p className="mt-2 break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-6 text-theme-text/85">
                        {powiadomienie.tresc || "Brak treści"}
                    </p>
                </div>
            </div>
        </article>
    );
}

function Content({ powiadomienia = [] }) {
    const [wyszukiwanie, setWyszukiwanie] = useState("");

    const filtrowanePowiadomienia = useMemo(() => {
        const fraza = wyszukiwanie.trim().toLocaleLowerCase("pl-PL");
        if (!fraza) return powiadomienia ?? [];

        return (powiadomienia ?? []).filter((powiadomienie) =>
            [powiadomienie.temat, powiadomienie.tresc]
                .some((wartosc) => String(wartosc ?? "").toLocaleLowerCase("pl-PL").includes(fraza))
        );
    }, [powiadomienia, wyszukiwanie]);

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted/40 bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Powiadomienia
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <main className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] pt-3 sm:gap-4">
                <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-3 rounded-[15px] bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-bold tracking-tight text-theme-text sm:text-3xl lg:text-[36px]">
                            Historia powiadomień
                        </h1>
                        <p className="mt-1 text-sm text-theme-muted">
                            Wszystkie komunikaty i informacje w jednym miejscu.
                        </p>
                    </div>
                    <span className="shrink-0 rounded-xl border border-theme-muted/50 bg-theme-slate px-3 py-2 text-xs font-semibold text-theme-text sm:text-sm">
                        {powiadomienia?.length ?? 0} powiadomień
                    </span>
                </div>

                <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-3 sm:p-4 md:p-5">
                    <div className="flex min-w-0 shrink-0 flex-col gap-3 rounded-xl bg-theme-surface p-3 sm:flex-row sm:items-end sm:justify-between sm:p-4">
                        <div className="min-w-0 w-full sm:max-w-[560px]">
                            <label htmlFor="szukaj-powiadomien" className="mb-2 block text-xs font-semibold text-theme-muted">
                                Szukaj powiadomienia
                            </label>
                            <div className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-theme-muted/60 bg-theme-slate px-3 focus-within:border-theme-orange">
                                <span className="shrink-0 text-base text-theme-muted" aria-hidden="true">⌕</span>
                                <input
                                    id="szukaj-powiadomien"
                                    type="search"
                                    value={wyszukiwanie}
                                    onChange={(e) => setWyszukiwanie(e.target.value)}
                                    placeholder="Temat lub treść powiadomienia..."
                                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-theme-text outline-none placeholder:text-theme-muted"
                                />
                                {wyszukiwanie && (
                                    <button
                                        type="button"
                                        onClick={() => setWyszukiwanie("")}
                                        className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-theme-muted transition-colors hover:bg-theme-panel hover:text-theme-text"
                                        aria-label="Wyczyść wyszukiwanie"
                                    >
                                        Wyczyść
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="shrink-0 text-xs text-theme-muted sm:pb-2">
                            Wyświetlono {filtrowanePowiadomienia.length} z {powiadomienia?.length ?? 0}
                        </p>
                    </div>

                    <div className="custom-scrollbar mt-3 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-xl bg-theme-surface p-3 sm:p-4 md:px-6">
                        {filtrowanePowiadomienia.length > 0 ? (
                            <>
                                <div className="hidden min-w-0 w-full lg:block">
                                    <table className="w-full table-fixed border-collapse">
                                        <colgroup>
                                            <col style={{ width: "38%" }} />
                                            <col style={{ width: "62%" }} />
                                        </colgroup>
                                        <thead>
                                            <tr className="border-b border-theme-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-theme-muted">
                                                <th className="pb-3 pr-5 pt-2">Temat</th>
                                                <th className="pb-3 pt-2">Treść</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtrowanePowiadomienia.map((powiadomienie, index) => (
                                                <Powiadomienierow
                                                    key={powiadomienie.idKomunikat ?? index}
                                                    powiadomienie={powiadomienie}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex min-w-0 w-full flex-col gap-3 lg:hidden">
                                    {filtrowanePowiadomienia.map((powiadomienie, index) => (
                                        <PowiadomienieMobile
                                            key={powiadomienie.idKomunikat ?? index}
                                            powiadomienie={powiadomienie}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
                                <span className="text-3xl" aria-hidden="true">{wyszukiwanie.trim() ? "⌕" : "✉"}</span>
                                <h2 className="mt-3 text-lg font-bold text-theme-text">
                                    {wyszukiwanie.trim() ? "Nie znaleziono powiadomień" : "Brak powiadomień"}
                                </h2>
                                <p className="mt-1 max-w-md text-sm text-theme-muted">
                                    {wyszukiwanie.trim()
                                        ? "Spróbuj zmienić wyszukiwaną frazę."
                                        : "Nowe powiadomienia pojawią się tutaj."}
                                </p>
                                {wyszukiwanie.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => setWyszukiwanie("")}
                                        className="mt-4 rounded-xl bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text transition-opacity hover:opacity-90"
                                    >
                                        Wyczyść wyszukiwanie
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function Powiadomienia({ auth, powiadomienia, rol }) {
    let menu = null;

    if (rol === "Student") {
        menu = <MenuStudenta />;
    }

    if (rol === "Prowadzący") {
        menu = <MenuProwadzacy />;
    }

    if (rol === "Pracownik Dziekanatu") {
        menu = <MenuDziekanat />;
    }

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Powiadomienia" />
            {menu}
            <Content powiadomienia={powiadomienia} />
        </div>
    );
}
