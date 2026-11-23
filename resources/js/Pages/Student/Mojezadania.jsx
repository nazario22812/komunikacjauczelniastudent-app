import React, { useMemo, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

function pobierzStatus(zadanie) {
    return String(zadanie?.pivot?.status ?? zadanie?.status ?? "Nie wysłane");
}

function wygladStatusu(status) {
    const wartosc = status.toLocaleLowerCase("pl-PL");

    if (wartosc.includes("ocenion")) {
        return "border-theme-muted bg-theme-slate text-theme-green";
    }
    if (wartosc.includes("wysłan") || wartosc.includes("wyslan")) {
        return "border-theme-muted bg-theme-slate text-sky-400";
    }
    if (wartosc.includes("termin") || wartosc.includes("spóźn") || wartosc.includes("spozn")) {
        return "border-theme-muted bg-theme-slate text-theme-red";
    }
    return "border-theme-muted bg-theme-slate text-theme-text";
}

function formatData(wartosc) {
    if (!wartosc) return null;

    const tekst = String(wartosc);
    const dopasowanie = tekst.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);

    if (dopasowanie) {
        const [, rok, miesiac, dzien, godzina, minuta] = dopasowanie;
        return `${dzien}.${miesiac}.${rok}${godzina ? `, ${godzina}:${minuta}` : ""}`;
    }

    return tekst;
}

function ZadanieKarta({ zadanie }) {
    const status = pobierzStatus(zadanie);
    const termin = formatData(zadanie.TerminOddania);
    const nazwaKursu = zadanie.kurs?.nazwa;
    const nazwaPrzedmiotu = zadanie.kurs?.przedmiot?.nazwa;

    const otworz = () => router.get(`/student/kurs/${zadanie.idZadanie}`);

    return (
        <button
            type="button"
            onClick={otworz}
            className="group flex w-full min-w-0 flex-col gap-4 rounded-[15px] border border-theme-muted bg-theme-surface p-4 text-left transition-colors hover:border-theme-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-orange sm:p-5"
        >
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-theme-muted">
                        Zadanie{nazwaKursu ? ` · ${nazwaKursu}` : ""}
                    </p>
                    <h3 className="break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text sm:text-lg">
                        {zadanie.nazwaZadania || "Zadanie bez nazwy"}
                    </h3>
                    {nazwaPrzedmiotu && (
                        <p className="mt-1 break-words text-sm text-theme-muted">
                            {nazwaPrzedmiotu}
                        </p>
                    )}
                </div>

                <span className={`max-w-full shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${wygladStatusu(status)}`}>
                    {status}
                </span>
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-theme-muted pt-3">
                <div className="min-w-0 text-sm text-theme-muted">
                    {termin ? (
                        <>
                            <span>Termin oddania: </span>
                            <span className="font-semibold text-theme-text">{termin}</span>
                        </>
                    ) : (
                        <span>Bez określonego terminu</span>
                    )}
                </div>
                <span className="shrink-0 text-sm font-semibold text-theme-orange transition-colors group-hover:text-theme-text">
                    Zobacz szczegóły <span aria-hidden="true">→</span>
                </span>
            </div>
        </button>
    );
}

function Content({ zadania = [] }) {
    const [szukaj, setSzukaj] = useState("");
    const [wybranyStatus, setWybranyStatus] = useState("wszystkie");

    const listaZadan = Array.isArray(zadania) ? zadania : [];

    const filtrowaneZadania = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");

        return listaZadan.filter((zadanie) => {
            const status = pobierzStatus(zadanie);
            const statusMale = status.toLocaleLowerCase("pl-PL");
            const pasujeStatus =
                wybranyStatus === "wszystkie" ||
                (wybranyStatus === "ocenione" && statusMale.includes("ocenion")) ||
                (wybranyStatus === "wyslane" &&
                    (statusMale.includes("wysłan") || statusMale.includes("wyslan")) &&
                    !statusMale.includes("nie wysłan") && !statusMale.includes("nie wyslan")) ||
                (wybranyStatus === "niewyslane" &&
                    !statusMale.includes("ocenion") &&
                    !(statusMale.includes("wysłan") && !statusMale.includes("nie wysłan")) &&
                    !(statusMale.includes("wyslan") && !statusMale.includes("nie wyslan")));

            if (!pasujeStatus) return false;
            if (!tekst) return true;

            const pola = [
                zadanie.nazwaZadania,
                zadanie.tresc,
                zadanie.kurs?.nazwa,
                zadanie.kurs?.przedmiot?.nazwa,
                status,
                zadanie.TerminOddania,
                formatData(zadanie.TerminOddania),
            ];

            return pola.some((pole) =>
                String(pole ?? "").toLocaleLowerCase("pl-PL").includes(tekst)
            );
        });
    }, [listaZadan, szukaj, wybranyStatus]);

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Moje zadania
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <main className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] pt-3 sm:px-2 md:px-4">
                <div className="flex min-w-0 shrink-0 flex-col gap-4 rounded-[15px] bg-theme-surface px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[36px]">
                            Twoje zadania
                        </h1>
                        <p className="mt-1 text-sm text-theme-muted">
                            Sprawdzaj zadania, terminy oddania i status przesłanych prac.
                        </p>
                    </div>
                    <div className="shrink-0 rounded-xl border border-theme-muted bg-theme-slate px-4 py-3">
                        <p className="text-xs text-theme-muted">Liczba zadań</p>
                        <p className="text-2xl font-bold text-theme-text">{listaZadan.length}</p>
                    </div>
                </div>

                <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-3 sm:p-4 md:p-5">
                    <div className="flex min-w-0 shrink-0 flex-col gap-3 rounded-xl bg-theme-surface p-3 sm:p-4 lg:flex-row lg:items-end">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="szukaj-zadania" className="mb-2 block text-xs font-semibold text-theme-muted">
                                Szukaj zadania
                            </label>
                            <div className="flex min-w-0 items-center gap-2 rounded-[10px] border border-theme-muted bg-theme-slate px-3 focus-within:border-theme-orange">
                                <span aria-hidden="true" className="shrink-0 text-base text-theme-muted">⌕</span>
                                <input
                                    id="szukaj-zadania"
                                    type="search"
                                    value={szukaj}
                                    onChange={(e) => setSzukaj(e.target.value)}
                                    placeholder="Nazwa zadania, kurs, termin..."
                                    className="h-[42px] min-w-0 flex-1 bg-transparent text-sm text-theme-text outline-none placeholder:text-theme-muted"
                                />
                                {szukaj && (
                                    <button
                                        type="button"
                                        onClick={() => setSzukaj("")}
                                        aria-label="Wyczyść wyszukiwanie"
                                        className="shrink-0 px-1 text-sm text-theme-muted hover:text-theme-text"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="w-full min-w-0 lg:w-[220px] lg:shrink-0">
                            <label htmlFor="status-zadania" className="mb-2 block text-xs font-semibold text-theme-muted">
                                Status
                            </label>
                            <select
                                id="status-zadania"
                                value={wybranyStatus}
                                onChange={(e) => setWybranyStatus(e.target.value)}
                                className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none focus:border-theme-orange"
                            >
                                <option value="wszystkie">Wszystkie zadania</option>
                                <option value="niewyslane">Niewysłane</option>
                                <option value="wyslane">Wysłane</option>
                                <option value="ocenione">Ocenione</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-1 py-3 text-xs text-theme-muted sm:text-sm">
                        <span>Wyświetlono {filtrowaneZadania.length} z {listaZadan.length} zadań</span>
                        {(szukaj || wybranyStatus !== "wszystkie") && (
                            <button
                                type="button"
                                onClick={() => { setSzukaj(""); setWybranyStatus("wszystkie"); }}
                                className="font-semibold text-theme-orange hover:underline"
                            >
                                Wyczyść filtry
                            </button>
                        )}
                    </div>

                    <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-2">
                        {filtrowaneZadania.length > 0 ? (
                            <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
                                {filtrowaneZadania.map((zadanie, index) => (
                                    <ZadanieKarta
                                        key={zadanie.idZadanie ?? index}
                                        zadanie={zadanie}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl bg-theme-surface px-5 py-8 text-center">
                                <p className="text-lg font-bold text-theme-text">
                                    {listaZadan.length === 0 ? "Brak zadań" : "Nie znaleziono zadań"}
                                </p>
                                <p className="mt-2 text-sm text-theme-muted">
                                    {listaZadan.length === 0
                                        ? "Nie masz obecnie przypisanych zadań."
                                        : "Zmień wyszukiwanie lub wybrane filtry."}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function MojeZadania({ auth, zadania = [] }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Moje zadania" />
            <MenuStudenta />
            <Content zadania={zadania} />
        </div>
    );
}
