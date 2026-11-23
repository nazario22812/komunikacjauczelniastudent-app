import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const goToCourse = (kurs) => {
    router.get(`/prowadzacy/mojekursy/${kurs.nazwa}/${kurs.idkurs}`);
};

function QuickAction({ title, description, onClick, symbol }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex min-w-0 items-center gap-3 rounded-2xl border border-theme-muted bg-theme-slate p-4 text-left text-theme-text transition-colors hover:border-theme-orange hover:bg-theme-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-orange sm:p-5"
        >
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-orange text-xl font-bold text-white sm:h-12 sm:w-12">
                {symbol}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block break-words text-sm font-bold sm:text-base">{title}</span>
                <span className="mt-1 block break-words text-xs text-theme-muted sm:text-sm">{description}</span>
            </span>
            <span aria-hidden="true" className="shrink-0 text-lg text-theme-muted transition-transform group-hover:translate-x-1">›</span>
        </button>
    );
}

function TodayClasses({ zajecia = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <section className="flex min-h-[280px] min-w-0 flex-col overflow-hidden rounded-[20px] border border-theme-muted bg-theme-surface p-4 sm:p-5">
            <div className="mb-4 flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-theme-text sm:text-xl">Dzisiejsze zajęcia</h2>
                    <p className="mt-1 text-xs text-theme-muted sm:text-sm">Sprawdź godziny i miejsce prowadzenia zajęć.</p>
                </div>
                <span className="shrink-0 rounded-full bg-theme-slate px-3 py-1 text-xs font-semibold text-theme-text">
                    {zajecia.length} {zajecia.length === 1 ? "zajęcia" : "zajęć"}
                </span>
            </div>

            {zajecia.length ? (
                <div className="relative flex min-h-[190px] min-w-0 flex-1 flex-col rounded-2xl bg-theme-slate p-3 sm:p-4">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={12}
                        slidesPerView={1}
                        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                        navigation={{ nextEl: ".prowadzacy-home-next", prevEl: ".prowadzacy-home-prev" }}
                        pagination={{ clickable: true, el: ".prowadzacy-home-pagination" }}
                        className="!min-h-0 !w-full !flex-1"
                    >
                        {zajecia.map((zajecie, index) => (
                            <SwiperSlide key={`${zajecie.id ?? zajecie.nazwa ?? "zajecia"}-${index}`} className="!flex !h-auto min-w-0 flex-col justify-center px-1 pb-2 text-theme-text sm:px-3">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-theme-surface px-3 py-1 text-xs font-medium text-theme-text">{zajecie.TypZajec || "Zajęcia"}</span>
                                </div>
                                <h3 className="break-words text-lg font-bold leading-snug sm:text-xl">{zajecie.nazwa || "Zajęcia"}</h3>
                                <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                    <div className="min-w-0 rounded-xl bg-theme-surface p-3">
                                        <span className="block text-xs text-theme-muted">Godziny</span>
                                        <span className="mt-1 block break-words font-semibold">{zajecie.GodzinaRozpoczecia || "—"} – {zajecie.GodzinaZakonczenia || "—"}</span>
                                    </div>
                                    <div className="min-w-0 rounded-xl bg-theme-surface p-3">
                                        <span className="block text-xs text-theme-muted">Sala i budynek</span>
                                        <span className="mt-1 block break-words font-semibold">{zajecie.numerSali || "—"} {zajecie.NazwaBudynku ? `· ${zajecie.NazwaBudynku}` : ""}</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="mt-2 flex shrink-0 items-center justify-between gap-3 border-t border-theme-muted pt-3">
                        <button type="button" className="prowadzacy-home-prev flex h-9 w-9 items-center justify-center rounded-lg bg-theme-surface text-xl text-theme-text transition-colors hover:bg-theme-panel disabled:cursor-not-allowed disabled:opacity-40" aria-label="Poprzednie zajęcia">‹</button>
                        <div className="min-w-0 flex-1 text-center">
                            <span className="block text-xs text-theme-muted">{currentSlide + 1} z {zajecia.length}</span>
                            <div className="prowadzacy-home-pagination mt-1 flex min-h-[12px] items-center justify-center gap-1" />
                        </div>
                        <button type="button" className="prowadzacy-home-next flex h-9 w-9 items-center justify-center rounded-lg bg-theme-surface text-xl text-theme-text transition-colors hover:bg-theme-panel disabled:cursor-not-allowed disabled:opacity-40" aria-label="Następne zajęcia">›</button>
                    </div>
                </div>
            ) : (
                <div className="flex min-h-[175px] flex-1 flex-col items-center justify-center rounded-2xl bg-theme-slate px-4 py-7 text-center">
                    <span aria-hidden="true" className="mb-2 text-3xl">☀</span>
                    <p className="font-semibold text-theme-text">Brak zajęć na dzisiaj</p>
                    <p className="mt-1 text-sm text-theme-muted">Nie masz zaplanowanych zajęć na dziś.</p>
                </div>
            )}
        </section>
    );
}

function Content({ kursy = [], zajecia = [] }) {
    const [courseQuery, setCourseQuery] = useState("");
    const safeKursy = Array.isArray(kursy) ? kursy : [];
    const safeZajecia = Array.isArray(zajecia) ? zajecia : [];
    const filteredCourses = safeKursy.filter((kurs) =>
        `${kurs.nazwa ?? ""} ${kurs.kod ?? ""} ${kurs.Semester ?? ""}`
            .toLocaleLowerCase("pl")
            .includes(courseQuery.trim().toLocaleLowerCase("pl"))
    );

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <header className="mx-auto flex h-[40px] w-full shrink-0 items-center justify-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-3">
                <span className="text-center text-[16px] font-bold text-theme-text">Strona główna</span>
            </header>

            <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-0 pb-3 pt-3 sm:px-2 md:px-4">
                <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 sm:gap-5">
                    <section className="min-w-0 rounded-[20px] bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-theme-muted">Panel prowadzącego</p>
                                <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">Witaj w MojaUczelnia</h1>
                                <p className="mt-2 max-w-[650px] text-sm text-theme-muted sm:text-base">Zarządzaj kursami, planuj konsultacje i sprawdzaj dzisiejsze zajęcia w jednym miejscu.</p>
                            </div>
                            <span className="rounded-full bg-theme-slate px-4 py-2 text-sm font-semibold text-theme-text">Moje kursy: {safeKursy.length}</span>
                        </div>
                    </section>

                    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                        <section className="flex min-w-0 flex-col rounded-[20px] border border-theme-muted bg-theme-surface p-4 sm:p-5">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-theme-text sm:text-xl">Szybkie działania</h2>
                                <p className="mt-1 text-xs text-theme-muted sm:text-sm">Najczęściej używane funkcje.</p>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                                <QuickAction symbol="▦" title="Rezerwacja sali" description="Wybierz salę na zajęcia lub spotkanie." onClick={() => router.get("/prowadzacy/zarezerwujsale")} />
                                <QuickAction symbol="+" title="Tworzenie konsultacji" description="Dodaj termin konsultacji dla studentów." onClick={() => router.get("/prowadzacy/stworzkonsultacje")} />
                            </div>
                        </section>
                        <TodayClasses zajecia={safeZajecia} />
                    </div>

                    <section className="min-w-0 rounded-[20px] border border-theme-muted bg-theme-surface p-4 sm:p-5">
                        <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-theme-text sm:text-xl">Moje kursy</h2>
                                <p className="mt-1 text-sm text-theme-muted">Wybierz kurs, aby zobaczyć materiały, zadania i studentów.</p>
                            </div>
                            <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
                                <input
                                    type="search"
                                    value={courseQuery}
                                    onChange={(e) => setCourseQuery(e.target.value)}
                                    placeholder="Szukaj kursu..."
                                    aria-label="Szukaj kursu"
                                    className="h-10 min-w-0 flex-1 rounded-xl border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange sm:w-[210px] sm:flex-none"
                                />
                                <span className="flex h-10 shrink-0 items-center rounded-xl bg-theme-slate px-3 text-xs font-semibold text-theme-text">
                                    {filteredCourses.length} z {safeKursy.length}
                                </span>
                            </div>
                        </div>
                        {filteredCourses.length ? (
                            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredCourses.map((kurs, index) => (
                                    <article key={kurs.idkurs ?? kurs.id ?? index} className="flex min-h-[160px] min-w-0 flex-col justify-between gap-4 rounded-2xl border border-theme-muted bg-theme-slate p-4 transition-colors hover:border-theme-orange sm:p-5">
                                        <div className="min-w-0">
                                            {kurs.Semester != null && <span className="mb-2 inline-block rounded-full bg-theme-surface px-3 py-1 text-xs font-medium text-theme-muted">Semestr {kurs.Semester}</span>}
                                            <h3 className="break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text sm:text-lg">{kurs.nazwa || "Kurs"}</h3>
                                            {kurs.kod && <p className="mt-2 break-words text-xs text-theme-muted">Kod kursu: {kurs.kod}</p>}
                                        </div>
                                        <button type="button" onClick={() => goToCourse(kurs)} className="w-full rounded-xl bg-theme-surface px-4 py-2.5 text-sm font-semibold text-theme-text transition-colors hover:bg-theme-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-orange">Otwórz kurs <span aria-hidden="true">›</span></button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[170px] flex-col items-center justify-center rounded-2xl bg-theme-slate p-6 text-center">
                                <p className="font-semibold text-theme-text">{safeKursy.length ? "Nie znaleziono kursów" : "Nie masz jeszcze kursów"}</p>
                                <p className="mt-1 text-sm text-theme-muted">{safeKursy.length ? "Spróbuj zmienić wyszukiwaną frazę." : "Twoje kursy pojawią się tutaj."}</p>
                                {courseQuery && <button type="button" onClick={() => setCourseQuery("")} className="mt-3 rounded-lg bg-theme-surface px-3 py-2 text-sm font-medium text-theme-text">Wyczyść wyszukiwanie</button>}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default function ProwadzacyGlowna({ auth, kursy, zajecia }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Strona główna" />
            <MenuProwadzacy />
            <Content kursy={kursy} zajecia={zajecia} />
        </div>
    );
}
