import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Content({ kursy, zajecia}) {
    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-panel w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <span className="font-bold text-[16px] text-theme-text w-full">
                    Strona główna
                </span>
            </div>

            <div className="bg-theme-panel w-full h-full grid grid-rows-2 gap-4 border-[0.3px] border-theme-muted px-[10px] py-[10px]  rounded-b-[10px]">
                <div className="bg-theme-surface rounded-[10px] px-[35px] py-[20px] grid grid-cols-2 gap-3">
                    <div className="rounded-[10px] bg-theme-slate text-center flex flex-col justify-top p-6 border border-theme-muted gap-4">
                        <span className="text-theme-text text-[20px] font-bold mb-1">
                            Szybkie działania
                        </span>

                        <button
                            onClick={() =>
                                router.get("/prowadzacy/zarezerwujsale")
                            }
                            className="w-full h-[50px] text-[18px] font-bold text-theme-text bg-theme-orange rounded-[15px] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                        >
                            Rezerwacja sali
                        </button>

                        <button
                            onClick={() =>
                                router.get("/prowadzacy/stworzkonsultacje")
                            }
                            className="w-full h-[50px] text-[18px] font-bold text-theme-text bg-theme-orange rounded-[15px] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                        >
                            Tworzenie konsultacji
                        </button>
                    </div>
                    <div className="rounded-[10px] bg-theme-slate flex border border-theme-muted">
                        {zajecia && zajecia.length > 0 ? (
                            <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            className="w-full h-full"
                        >
                            {zajecia.map((zajecie, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="flex flex-col justify-center p-4 text-theme-text"
                                >
                                    <div className="font-bold text-[18px]">
                                        {zajecie.nazwa}, {zajecie.TypZajec}
                                    </div>
                                    <div>{zajecie.GodzinaRozpoczecia} - {zajecie.GodzinaZakonczenia}</div>
                                    <div>Sala: {zajecie.numerSali}</div>
                                    <div>Budynek: {zajecie.NazwaBudynku}</div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        ): (
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                                <span>Brak zajęć na dzisiaj</span>
                            </div>
                        )}
                        
                    </div>
                </div>
                <div className="bg-theme-surface rounded-[10px]">
                    <div className="w-full px-[35px] py-[5px]">
                        <span className="text-theme-text text-[22px]">
                            Moje kursy
                        </span>
                    </div>
                    <div className="w-full h-[90%] px-[35px] py-[25px] ">
                        {kursy && kursy.length > 0 ? (
                            <div className="w-full h-full flex gap-5">
                                {kursy.map((kurs) => (
                                    <div
                                        key={kurs.idkurs}
                                        onClick={() =>
                                            router.get(
                                                `/prowadzacy/mojekursy/${kurs.nazwa}/${kurs.idkurs}`,
                                            )
                                        }
                                        className="w-[20%] bg-theme-slate rounded-[15px] text-theme-text text-[32px] font-bold border border-theme-muted flex items-center justify-center p-4 text-center shkrink hover:cursor-pointer"
                                    >
                                        <span>{kurs.nazwa}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                                <span>Brak kursów</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProwadzacyGlowna({ auth, kursy, zajecia }) {
    return (
        <div className="flex">
            <Head title="Strona główna" />
            <MenuProwadzacy />
            <Content kursy={kursy} zajecia={zajecia}/>
        </div>
    );
}
