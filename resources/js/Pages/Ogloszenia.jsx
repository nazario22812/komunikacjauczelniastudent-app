import React, { useMemo, useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

function OgloszenieCard({ ogloszenie }) {
    return (
        <article className="flex min-w-0 flex-col gap-3 rounded-[15px] border border-theme-muted bg-theme-slate p-4 transition-colors hover:bg-theme-panel sm:p-5">
            <div className="flex min-w-0 items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text sm:text-lg">
                    {ogloszenie.temat || "Ogłoszenie"}
                </h3>
                <span className="shrink-0 rounded-full border border-theme-muted px-2.5 py-1 text-[11px] font-semibold text-theme-muted">
                    Komunikat
                </span>
            </div>
            <p className="min-w-0 break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-relaxed text-theme-text sm:text-[15px]">
                {ogloszenie.tresc || "Brak treści ogłoszenia"}
            </p>
        </article>
    );
}

function AnkietaCard({ ankieta }) {
    const dostepnyLink = typeof ankieta.link === "string" && /^(https?:\/\/|\/)/i.test(ankieta.link);

    const zawartosc = (
        <>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-xl" aria-hidden="true">
                🗳️
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text">
                    {ankieta.temat || "Ankieta"}
                </h3>
                {ankieta.opis && (
                    <p className="mt-1.5 break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-relaxed text-theme-muted">
                        {ankieta.opis}
                    </p>
                )}
                <span className="mt-3 inline-block text-xs font-semibold text-theme-text">
                    {dostepnyLink ? "Otwórz ankietę →" : "Brak linku do ankiety"}
                </span>
            </div>
        </>
    );

    const klasy = "flex min-w-0 items-start gap-3 rounded-[15px] border border-theme-muted bg-theme-slate p-4 text-left no-underline transition-colors sm:p-5";

    if (!dostepnyLink) {
        return <div className={klasy}>{zawartosc}</div>;
    }

    return (
        <a
            href={ankieta.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${klasy} cursor-pointer hover:border-theme-orange hover:bg-theme-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme-orange`}
        >
            {zawartosc}
        </a>
    );
}

function Content({ ogloszenia = [], ankiety = [] }) {
    const [szukaj, setSzukaj] = useState("");
    const [widok, setWidok] = useState("wszystkie");

    const filtrowaneOgloszenia = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");
        if (!tekst) return ogloszenia ?? [];
        return (ogloszenia ?? []).filter((ogloszenie) =>
            [ogloszenie.temat, ogloszenie.tresc].some((pole) =>
                String(pole ?? "").toLocaleLowerCase("pl-PL").includes(tekst)
            )
        );
    }, [ogloszenia, szukaj]);

    const filtrowaneAnkiety = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");
        if (!tekst) return ankiety ?? [];
        return (ankiety ?? []).filter((ankieta) =>
            [ankieta.temat, ankieta.opis].some((pole) =>
                String(pole ?? "").toLocaleLowerCase("pl-PL").includes(tekst)
            )
        );
    }, [ankiety, szukaj]);

    const pokazOgloszenia = widok !== "ankiety";
    const pokazAnkiety = widok !== "ogloszenia";
    const ileWynikow = (pokazOgloszenia ? filtrowaneOgloszenia.length : 0) +
        (pokazAnkiety ? filtrowaneAnkiety.length : 0);
    const brakWynikow = szukaj.trim().length > 0;

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[15px] font-bold text-theme-text sm:text-[16px]">
                    Ogłoszenia i ankiety
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] pt-3 sm:gap-4">
                <section className="flex min-w-0 shrink-0 flex-col gap-3 rounded-[15px] bg-theme-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">
                            Aktualności uczelni
                        </h1>
                        <p className="mt-1 text-sm text-theme-muted">
                            Sprawdzaj komunikaty i dostępne ankiety.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <span className="rounded-full border border-theme-muted bg-theme-slate px-3 py-1.5 text-xs font-semibold text-theme-text">
                            Ogłoszenia: {(ogloszenia ?? []).length}
                        </span>
                        <span className="rounded-full border border-theme-muted bg-theme-slate px-3 py-1.5 text-xs font-semibold text-theme-text">
                            Ankiety: {(ankiety ?? []).length}
                        </span>
                    </div>
                </section>

                <div className="flex min-w-0 shrink-0 flex-col gap-3 rounded-[15px] bg-theme-slate p-3 sm:flex-row sm:items-end sm:justify-between sm:p-4">
                    <div className="min-w-0 flex-1">
                        <label htmlFor="szukaj-ogloszenia" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                            Szukaj ogłoszenia lub ankiety
                        </label>
                        <div className="flex min-w-0 items-center gap-2 rounded-[12px] border border-theme-muted bg-theme-surface px-3 focus-within:border-theme-orange">
                            <span className="shrink-0 text-base text-theme-muted" aria-hidden="true">⌕</span>
                            <input
                                id="szukaj-ogloszenia"
                                type="search"
                                value={szukaj}
                                onChange={(e) => setSzukaj(e.target.value)}
                                placeholder="Wpisz temat lub treść..."
                                className="h-[42px] min-w-0 w-full flex-1 bg-transparent text-sm text-theme-text outline-none placeholder:text-theme-muted"
                            />
                            {szukaj && (
                                <button type="button" onClick={() => setSzukaj("")} className="shrink-0 px-1 text-xs font-semibold text-theme-muted hover:text-theme-text" aria-label="Wyczyść wyszukiwanie">
                                    Wyczyść
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="min-w-0 sm:w-[215px] sm:shrink-0">
                        <label htmlFor="filtr-widoku" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                            Wyświetlaj
                        </label>
                        <select
                            id="filtr-widoku"
                            value={widok}
                            onChange={(e) => setWidok(e.target.value)}
                            className="h-[44px] w-full min-w-0 rounded-[12px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text outline-none focus:border-theme-orange"
                        >
                            <option value="wszystkie">Wszystkie</option>
                            <option value="ogloszenia">Tylko ogłoszenia</option>
                            <option value="ankiety">Tylko ankiety</option>
                        </select>
                    </div>
                </div>

                <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] bg-theme-slate p-3 sm:p-4 lg:p-5">
                    <p className="mb-4 text-xs text-theme-muted">
                        Wyświetlono {ileWynikow} z {(pokazOgloszenia ? (ogloszenia ?? []).length : 0) + (pokazAnkiety ? (ankiety ?? []).length : 0)} pozycji
                    </p>
                    <div className="flex min-w-0 flex-col gap-4">
                        {pokazOgloszenia && (
                            <section className="min-w-0 rounded-[15px] bg-theme-surface p-3 sm:p-5">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="text-xl font-bold text-theme-text sm:text-2xl">Ogłoszenia</h2>
                                    <span className="text-xs text-theme-muted">{filtrowaneOgloszenia.length} pozycji</span>
                                </div>
                                {filtrowaneOgloszenia.length > 0 ? (
                                    <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                                        {filtrowaneOgloszenia.map((ogloszenie, index) => (
                                            <OgloszenieCard key={ogloszenie.idKomunikat ?? ogloszenie.id ?? index} ogloszenie={ogloszenie} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-theme-muted bg-theme-slate px-4 py-8 text-center text-sm text-theme-muted">
                                        {brakWynikow ? "Nie znaleziono ogłoszeń" : "Brak ogłoszeń"}
                                    </div>
                                )}
                            </section>
                        )}

                        {pokazAnkiety && (
                            <section className="min-w-0 rounded-[15px] bg-theme-surface p-3 sm:p-5">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="text-xl font-bold text-theme-text sm:text-2xl">Ankiety</h2>
                                    <span className="text-xs text-theme-muted">{filtrowaneAnkiety.length} pozycji</span>
                                </div>
                                {filtrowaneAnkiety.length > 0 ? (
                                    <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
                                        {filtrowaneAnkiety.map((ankieta, index) => (
                                            <AnkietaCard key={ankieta.idAnkieta ?? ankieta.id ?? index} ankieta={ankieta} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-theme-muted bg-theme-slate px-4 py-8 text-center text-sm text-theme-muted">
                                        {brakWynikow ? "Nie znaleziono ankiet" : "Brak ankiet"}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Ogłoszenia({ auth, ogloszenia = [], ankiety = [], rol }) {
    let menu = null;

    if (rol === "Student") menu = <MenuStudenta />;
    if (rol === "Prowadzący") menu = <MenuProwadzacy />;
    if (rol === "Pracownik Dziekanatu") menu = <MenuDziekanat />;

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Ogłoszenia i ankiety" />
            {menu}
            <Content ogloszenia={ogloszenia} ankiety={ankiety} />
        </div>
    );
}
