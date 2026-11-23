import React, { useMemo, useState } from "react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Head, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import { ToastContainer } from "react-toastify";

function Content({ mojekursy = [] }) {
    const [szukaj, setSzukaj] = useState("");
    const [semestr, setSemestr] = useState("wszystkie");

    const kursy = Array.isArray(mojekursy) ? mojekursy : [];

    const semestry = useMemo(
        () =>
            [...new Set(kursy.map((kurs) => kurs.Semester).filter((value) => value !== null && value !== undefined && value !== ""))]
                .sort((a, b) => Number(b) - Number(a)),
        [mojekursy]
    );

    const filtrowaneKursy = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");

        return kursy.filter((kurs) => {
            const pasujeSemestr =
                semestr === "wszystkie" || String(kurs.Semester ?? "") === semestr;
            const pasujeTekst =
                !tekst ||
                [kurs.nazwa, kurs.kod, kurs.Semester, kurs.idkurs]
                    .some((value) => String(value ?? "").toLocaleLowerCase("pl-PL").includes(tekst));

            return pasujeSemestr && pasujeTekst;
        });
    }, [mojekursy, szukaj, semestr]);

    const wyczyscFiltry = () => {
        setSzukaj("");
        setSemestr("wszystkie");
    };

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[15px] font-bold text-theme-text sm:text-[16px]">
                    Moje kursy
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <section className="flex min-w-0 shrink-0 flex-col gap-4 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[36px]">
                            Moje kursy
                        </h1>
                        <p className="mt-1 text-sm text-theme-muted sm:text-base">
                            Przeglądaj kursy, zarządzaj materiałami, zadaniami i studentami.
                        </p>
                        <p className="mt-2 text-xs font-medium text-theme-muted sm:text-sm">
                            Liczba kursów: <span className="font-bold text-theme-text">{kursy.length}</span>
                            {(szukaj.trim() || semestr !== "wszystkie") && (
                                <> · Znaleziono: <span className="font-bold text-theme-text">{filtrowaneKursy.length}</span></>
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.get("/prowadzacy/tworzeniekursu")}
                        className="flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-[12px] bg-theme-orange px-5 py-2.5 text-sm font-bold text-theme-text transition hover:brightness-110 active:scale-[0.98] sm:w-auto"
                    >
                        <span className="text-xl leading-none" aria-hidden="true">+</span>
                        Utwórz kurs
                    </button>
                </section>

                <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-3 sm:p-4 md:p-5">
                    <div className="flex min-w-0 shrink-0 flex-col gap-3 rounded-[12px] bg-theme-surface p-3 sm:flex-row sm:items-end sm:p-4">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="szukaj-kursu" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                                Szukaj kursu
                            </label>
                            <div className="flex min-w-0 items-center gap-2 rounded-[10px] border border-theme-muted bg-theme-slate px-3 focus-within:border-theme-orange">
                                <span className="shrink-0 text-base text-theme-muted" aria-hidden="true">⌕</span>
                                <input
                                    id="szukaj-kursu"
                                    type="search"
                                    value={szukaj}
                                    onChange={(e) => setSzukaj(e.target.value)}
                                    placeholder="Nazwa lub kod kursu..."
                                    className="h-[42px] min-w-0 flex-1 bg-transparent text-sm text-theme-text outline-none placeholder:text-theme-muted"
                                />
                                {szukaj && (
                                    <button
                                        type="button"
                                        onClick={() => setSzukaj("")}
                                        aria-label="Wyczyść wyszukiwanie"
                                        className="shrink-0 px-1 text-lg text-theme-muted hover:text-theme-text"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                        {semestry.length > 0 && (
                            <div className="w-full shrink-0 sm:w-[190px]">
                                <label htmlFor="filtr-semestr" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                                    Semestr
                                </label>
                                <select
                                    id="filtr-semestr"
                                    value={semestr}
                                    onChange={(e) => setSemestr(e.target.value)}
                                    className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none focus:border-theme-orange"
                                >
                                    <option value="wszystkie">Wszystkie semestry</option>
                                    {semestry.map((wartosc) => (
                                        <option key={String(wartosc)} value={String(wartosc)}>
                                            Semestr {wartosc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="custom-scrollbar mt-4 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pr-1 sm:pr-2">
                        {filtrowaneKursy.length > 0 ? (
                            <div className="grid min-w-0 auto-rows-fr grid-cols-1 gap-3 pb-4 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                                {filtrowaneKursy.map((kurs, index) => (
                                    <article
                                        key={kurs.idkurs ?? kurs.id ?? index}
                                        className="flex min-h-[190px] min-w-0 flex-col justify-between gap-5 rounded-[15px] border border-theme-muted bg-theme-surface p-4 transition-colors hover:border-theme-orange sm:p-5"
                                    >
                                        <div className="min-w-0">
                                            <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
                                                <span className="rounded-[8px] bg-theme-slate px-2.5 py-1 text-xs font-medium text-theme-muted">
                                                    Kurs
                                                </span>
                                                {kurs.Semester !== null && kurs.Semester !== undefined && kurs.Semester !== "" && (
                                                    <span className="rounded-[8px] bg-theme-slate px-2.5 py-1 text-xs font-medium text-theme-text">
                                                        Semestr {kurs.Semester}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="break-words [overflow-wrap:anywhere] text-lg font-bold leading-snug text-theme-text sm:text-xl">
                                                {kurs.nazwa || "Kurs bez nazwy"}
                                            </h2>
                                            {kurs.kod && (
                                                <p className="mt-3 break-words text-sm text-theme-muted">
                                                    Kod kursu: <span className="font-semibold text-theme-text">{kurs.kod}</span>
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => router.get(`/prowadzacy/mojekursy/${kurs.nazwa}/${kurs.idkurs}`)}
                                            className="min-h-[42px] w-full shrink-0 rounded-[10px] bg-theme-slate px-4 py-2.5 text-sm font-semibold text-theme-text transition-colors hover:bg-theme-orange active:scale-[0.99]"
                                        >
                                            Otwórz kurs
                                        </button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-3 text-center">
                                <p className="text-lg font-bold text-theme-text">
                                    {kursy.length === 0 ? "Nie masz jeszcze kursów" : "Nie znaleziono kursów"}
                                </p>
                                <p className="max-w-[360px] text-sm text-theme-muted">
                                    {kursy.length === 0
                                        ? "Utwórz pierwszy kurs, aby rozpocząć pracę ze studentami."
                                        : "Spróbuj zmienić wyszukiwaną frazę lub wybrany semestr."}
                                </p>
                                {kursy.length === 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => router.get("/prowadzacy/tworzeniekursu")}
                                        className="mt-1 rounded-[10px] bg-theme-orange px-5 py-2.5 text-sm font-semibold text-theme-text"
                                    >
                                        Utwórz pierwszy kurs
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={wyczyscFiltry}
                                        className="mt-1 rounded-[10px] border border-theme-muted bg-theme-surface px-5 py-2.5 text-sm font-semibold text-theme-text hover:bg-theme-panel"
                                    >
                                        Wyczyść filtry
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function MojeKursy({ auth, mojekursy }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Head title="Moje kursy" />
            <MenuProwadzacy />
            <Content mojekursy={mojekursy} />
        </div>
    );
}
