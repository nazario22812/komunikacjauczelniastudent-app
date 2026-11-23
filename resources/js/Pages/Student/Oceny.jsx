import React, { useMemo, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

function Content({ oceny = [], semestry = [], studentsem }) {
    const [sem, setsem] = useState(studentsem ?? "");
    const [szukaj, setSzukaj] = useState("");

    const dostepneSemestry = useMemo(() => {
        const wartosci = (semestry ?? [])
            .map((semester) => semester.Semester)
            .filter((semester) => semester !== null && semester !== undefined && semester !== "");

        return [...new Set(wartosci.map(String))];
    }, [semestry]);

    const filteroceny = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");

        return (oceny ?? []).filter((ocena) => {
            if (sem !== "" && String(ocena.Semester) !== String(sem)) {
                return false;
            }

            if (!tekst) return true;

            return [
                ocena.nazwa,
                ocena.TypZajec,
                ocena.typZajec,
                ocena.typ,
                ocena.TytulNaukowy,
                ocena.wykladowca_imie,
                ocena.wykladowca_nazwisko,
                ocena.skalaOceny,
            ].some((wartosc) =>
                String(wartosc ?? "").toLocaleLowerCase("pl-PL").includes(tekst)
            );
        });
    }, [oceny, sem, szukaj]);

    const ocenySemestru = (oceny ?? []).filter(
        (ocena) => sem === "" || String(ocena.Semester) === String(sem)
    );

    
    const typZajec = (ocena) => ocena.TypZajec || ocena.typZajec || ocena.typ || "";

    const ocenaKolor = (wartosc) => {
        const ocena = Number(String(wartosc ?? "").replace(",", "."));
        if (Number.isNaN(ocena)) return "border-theme-muted bg-theme-slate text-theme-text";
        if (ocena < 3) return "border-red-500/40 bg-red-500/10 text-red-400";
        if (ocena >= 4.5) return "border-green-500/40 bg-green-500/10 text-green-400";
        return "border-theme-muted bg-theme-slate text-theme-text";
    };

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Twoje oceny
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] pb-2 pt-3 sm:px-2 md:px-4">
                <div className="flex min-w-0 shrink-0 flex-col gap-4 rounded-[15px] bg-theme-surface px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-theme-muted">
                            Wyniki w nauce
                        </p>
                        <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[36px]">
                            Oceny końcowe
                        </h1>
                        <p className="mt-2 max-w-[620px] text-sm text-theme-muted">
                            Przeglądaj oceny z przedmiotów i wybierz semestr, który Cię interesuje.
                        </p>
                    </div>

                    <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[430px]">
                        <div className="min-w-0">
                            <label htmlFor="semestr-oceny" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                                Semestr
                            </label>
                            <select
                                id="semestr-oceny"
                                value={sem}
                                onChange={(e) => setsem(e.target.value)}
                                className="h-[42px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none focus:border-theme-orange"
                            >
                                <option value="">Wszystkie semestry</option>
                                {dostepneSemestry.map((semester) => (
                                    <option key={semester} value={semester}>
                                        Semestr {semester}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="min-w-0">
                            <label htmlFor="szukaj-oceny" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                                Szukaj przedmiotu
                            </label>
                            <div className="relative min-w-0">
                                <input
                                    id="szukaj-oceny"
                                    type="search"
                                    value={szukaj}
                                    onChange={(e) => setSzukaj(e.target.value)}
                                    placeholder="Wpisz nazwę..."
                                    className="h-[42px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 pr-9 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                />
                                {szukaj && (
                                    <button
                                        type="button"
                                        onClick={() => setSzukaj("")}
                                        aria-label="Wyczyść wyszukiwanie"
                                        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-lg text-theme-muted hover:bg-theme-panel hover:text-theme-text"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-3 sm:p-4 md:p-5">
                    <div className="mb-4 flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-bold text-theme-text sm:text-xl">
                                Lista ocen
                            </h2>
                            <p className="mt-1 text-xs text-theme-muted sm:text-sm">
                                {sem !== "" ? `Semestr ${sem}` : "Wszystkie semestry"}
                            </p>
                        </div>
                        <div className="rounded-[10px] border border-theme-muted bg-theme-surface px-3 py-2 text-xs font-semibold text-theme-text sm:text-sm">
                            {filteroceny.length} z {ocenySemestru.length}
                        </div>
                    </div>

                    <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
                        {filteroceny.length > 0 ? (
                            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                                {filteroceny.map((ocena, index) => (
                                    <div
                                        key={ocena.idOcena ?? ocena.id ?? index}
                                        className="flex min-w-0 flex-col gap-4 rounded-[14px] border border-theme-muted bg-theme-surface p-4 transition-colors hover:bg-theme-panel sm:p-5"
                                    >
                                        <div className="flex min-w-0 items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-theme-muted">
                                                    {typZajec(ocena) || "Przedmiot"}
                                                </p>
                                                <h3 className="break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text sm:text-lg">
                                                    {ocena.nazwa || "Bez nazwy"}
                                                </h3>
                                            </div>
                                            <div className={`flex h-[52px] min-w-[60px] shrink-0 items-center justify-center rounded-[12px] border px-2 text-xl font-bold ${ocenaKolor(ocena.skalaOceny)}`}>
                                                {ocena.skalaOceny ?? "—"}
                                            </div>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-3 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-theme-surface text-2xl text-theme-muted">
                                    {szukaj ? "?" : "—"}
                                </div>
                                <p className="text-lg font-semibold text-theme-text">
                                    {szukaj.trim() ? "Nie znaleziono ocen" : "Brak ocen"}
                                </p>
                                <p className="mt-1 max-w-sm text-sm text-theme-muted">
                                    {szukaj.trim()
                                        ? "Spróbuj zmienić wyszukiwaną frazę lub wybrać inny semestr."
                                        : "Nie ma jeszcze ocen dla wybranego semestru."}
                                </p>
                                {szukaj.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => setSzukaj("")}
                                        className="mt-4 rounded-[10px] bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text"
                                    >
                                        Wyczyść wyszukiwanie
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Oceny({ auth, oceny, semestry, studentsem }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Oceny" />
            <MenuStudenta />
            <Content oceny={oceny} semestry={semestry} studentsem={studentsem} />
        </div>
    );
}
