
import React from "react";
import { Head, router } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Content({ kursy = [], zajecia = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-panel mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <span className="w-full text-center text-[16px] font-bold text-theme-text">
                    Strona główna
                </span>
            </div>

            <div className="bg-theme-panel custom-scrollbar flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto rounded-b-[10px] border-[0.3px] border-theme-muted p-2 sm:gap-4 sm:p-[10px] lg:overflow-hidden">
                <div className="bg-theme-surface grid min-w-0 w-full shrink-0 grid-cols-1 gap-3 rounded-[10px] p-3 sm:p-4 md:grid-cols-2 lg:min-h-0 lg:flex-1 lg:p-5 xl:px-[35px] xl:py-[20px]">
                    <div className="bg-theme-slate flex min-h-[190px] min-w-0 flex-col gap-3 rounded-[10px] border border-theme-muted p-4 text-center sm:p-6 lg:min-h-0 lg:gap-4">
                        <h2 className="mb-1 text-[20px] font-bold text-theme-text">
                            Szybkie działania
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                router.get(
                                    "/prowadzacy/zarezerwujsale"
                                )
                            }
                            className="bg-theme-orange flex min-h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-[15px] px-3 py-2 text-center text-base font-bold text-theme-text transition-opacity hover:opacity-90 sm:text-[18px]"
                        >
                            Rezerwacja sali
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                router.get(
                                    "/prowadzacy/stworzkonsultacje"
                                )
                            }
                            className="bg-theme-orange flex min-h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-[15px] px-3 py-2 text-center text-base font-bold text-theme-text transition-opacity hover:opacity-90 sm:text-[18px]"
                        >
                            Tworzenie konsultacji
                        </button>
                    </div>

                    <div className="bg-theme-slate flex min-h-[190px] min-w-0 overflow-hidden rounded-[10px] border border-theme-muted sm:min-h-[220px] lg:min-h-0">
                        {zajecia && zajecia.length > 0 ? (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={10}
                                slidesPerView={1}
                                navigation={{
                                    nextEl: ".prowadzacy-swiper-next",
                                    prevEl: ".prowadzacy-swiper-prev",
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                className="h-full w-full min-w-0"
                            >
                                {zajecia.map((zajecie, index) => (
                                    <SwiperSlide
                                        key={index}
                                        className="!flex !h-auto min-w-0 flex-col justify-center px-10 pb-10 pt-5 text-theme-text sm:px-12"
                                    >
                                        <div className="min-w-0 break-words [overflow-wrap:anywhere] text-base font-bold sm:text-[18px]">
                                            {zajecie.nazwa},{" "}
                                            {zajecie.TypZajec}
                                        </div>

                                        <div className="mt-2 break-words text-sm sm:text-base">
                                            {zajecie.GodzinaRozpoczecia} -{" "}
                                            {zajecie.GodzinaZakonczenia}
                                        </div>

                                        <div className="mt-1 break-words text-sm sm:text-base">
                                            Sala: {zajecie.numerSali}
                                        </div>

                                        <div className="mt-1 break-words text-sm sm:text-base">
                                            Budynek: {zajecie.NazwaBudynku}
                                        </div>
                                    </SwiperSlide>
                                ))}

                                <button
                                    type="button"
                                    className="prowadzacy-swiper-prev absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-theme-surface/80 text-theme-text"
                                    aria-label="Poprzednie zajęcia"
                                >
                                    ‹
                                </button>

                                <button
                                    type="button"
                                    className="prowadzacy-swiper-next absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-theme-surface/80 text-theme-text"
                                    aria-label="Następne zajęcia"
                                >
                                    ›
                                </button>
                            </Swiper>
                        ) : (
                            <div className="flex w-full items-center justify-center p-4 text-center text-xl text-theme-muted sm:text-[24px]">
                                <span>Brak zajęć na dzisiaj</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-theme-surface flex min-h-[230px] min-w-0 w-full shrink-0 flex-col rounded-[10px] p-3 sm:min-h-[270px] sm:p-4 lg:min-h-0 lg:flex-1 lg:p-5 xl:px-[35px]">
                    <div className="w-full shrink-0 pb-3">
                        <h2 className="text-xl text-theme-text sm:text-[22px]">
                            Moje kursy
                        </h2>
                    </div>

                    <div className="min-h-0 min-w-0 w-full flex-1">
                        {kursy && kursy.length > 0 ? (
                            <div className="hide-scrollbar flex h-full min-w-0 w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-2 sm:gap-4 lg:gap-5">
                                {kursy.map((kurs) => (
                                    <button
                                        key={kurs.idkurs}
                                        type="button"
                                        onClick={() =>
                                            router.get(
                                                `/prowadzacy/mojekursy/${kurs.nazwa}/${kurs.idkurs}`
                                            )
                                        }
                                        className="bg-theme-slate flex h-full min-h-[145px] w-[80%] max-w-[260px] shrink-0 snap-start cursor-pointer items-center justify-center rounded-[15px] border border-theme-muted p-3 text-center text-lg font-bold text-theme-text transition-colors hover:bg-theme-panel sm:w-[45%] sm:max-w-[300px] sm:p-4 sm:text-2xl lg:w-[30%] xl:w-[20%] xl:text-[28px]"
                                    >
                                        <span className="block min-w-0 break-words [overflow-wrap:anywhere]">
                                            {kurs.nazwa}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[120px] w-full items-center justify-center text-center text-xl text-theme-muted sm:text-[24px]">
                                <span>Brak kursów</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProwadzacyGlowna({
    auth,
    kursy,
    zajecia,
}) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Strona główna" />

            <MenuProwadzacy />

            <Content kursy={kursy} zajecia={zajecia} />
        </div>
    );
}
