import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Form from 'react-bootstrap/Form';

function Zajecie({ zajecia }){
    const typZajecia = (typ) => {
        if(typ === 'Laboratorium') return 'lab';
        if (typ === 'Wykład') return 'wy';
        if (typ === 'Ćwiczenia') return 'ćw';
    }

    const bgColors = {
        'Laboratorium': 'bg-[#f97316]',
        'Wykład': 'bg-[#8b5cf6]',
        'Ćwiczenia': 'bg-[#0ea5e9]'
    }

    const timeToMinutes = (timestr) =>{
        if(!timestr) return 0;
        const [hours, minutes] = timestr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const poczatekdniawminutach = 8 * 60;
    const wartoscminuty = 60;
    
    const poczatekMinuty = timeToMinutes(zajecia.godzina_rozpoczecia);
    const koniecMinuty = timeToMinutes(zajecia.godzina_zakonczenia);

    const topOffset = ((poczatekMinuty - poczatekdniawminutach) / 60) * wartoscminuty;
    const durationMinuty = koniecMinuty - poczatekMinuty;
    const blockHeight = (durationMinuty / 60) * wartoscminuty;

    return(
        // ПРИБРАНО h-full, залишено лише абсолютне позиціонування та розраховану висоту
        <div style={{ top: `${topOffset}px`, height: `${blockHeight - 4}px` }} className={`absolute left-1 right-1 p-2 flex flex-col justify-center ${bgColors[zajecia.typ] || ''} z-10 transition-colors hover:opacity-95 rounded-lg shadow-md`}>
            <div className="text-white text-center overflow-hidden">
                <span>{zajecia.tytul},<br /> 
                    {typZajecia(zajecia.typ)},<br />
                    {zajecia.godzina_rozpoczecia} - {zajecia.godzina_zakonczenia}
                </span>
            </div>
        </div>
    );
}

function Content({ plan }){
    const godziny = [
        '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
        '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', 
    ]

    const dni = [
        'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'
    ]

    return(
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#08083b] w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Plan zajęć</span>
            </div>

            <div className="bg-[#08083b] w-full h-full flex border-[0.3px] border-white pt-3 pb-5 px-1 rounded-b-[10px]">
                <div className="w-[80%] h-full border border-white rounded-l-xl rounded-r-xl flex flex-col">
                    
                    {/* Шапка днів фіксована зверху */}
                    <div className="flex w-full shrink-0">
                        <div className="bg-[#73768c] rounded-tl-xl w-full text-white text-center font-semibold border-b border-r border-white flex items-center justify-center text-xs py-1.5">
                            Dzień
                        </div>
                        {dni.map((day) => (
                            <div key={day} className="bg-[#73768c] w-full text-center text-white font-semibold border-b border-r border-white last:border-r-0 flex items-center justify-center text-xs last:rounded-tr-xl py-1.5">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Додано overflow-y-auto сюди, щоб з'явився скрол і можна було гортати нижчі години */}
                    <div className="grid grid-cols-6 border h-full border-slate-700/80 rounded-b-xl overflow-y-auto bg-[#676c98]">
                        <div className="flex flex-col">
                            {godziny.map((hour) => (
                                <div key={hour} style={{ height: '60px' }} className="text-xs text-white border-b border-r border-white flex items-center justify-center bg-[#73768c] shrink-0">
                                    {hour}
                                </div>
                            ))}
                        </div>

                        {dni.map((day) =>{ 
                            const findzajecie = plan?.filter((item) => item.dzien === day) || [];
                            return (
                                <div key={day} className="border border-white bg-[#676c98] relative flex flex-col">
                                    {godziny.map((hour) => (
                                        <div key={hour} style={{ height: '60px' }} className="border-b border-white w-full shrink-0"></div>          
                                    ))}
                                    
                                    {findzajecie.map((zajece) => (
                                        <Zajecie zajecia={zajece} key={zajece.id}/>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-[20%] rounded-r-[10px] bg-[#06062c] px-[20px] py-[33px]">
                    <div className="px-[10px] py-[10px]">
                        <div className="mx-auto w-full text-center text-[16px] text-white">
                            Wybierz grupę
                        </div>
                        <div className="w-full px-[29px] pt-[40px]">
                            <span className="text-[13px] text-white">Kierunek</span>
                            <Form.Select className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]"></Form.Select>
                        </div>
                        <div className="w-full px-[29px] pt-[40px]">
                            <span className="text-[13px] text-white">Grupa</span>
                            <Form.Select className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]"></Form.Select>
                        </div>
                        <div className="w-full mx-auto h-[28px] px-[18px] my-3 flex items-center mt-10">
                            <button className="text-[13px] mx-auto w-3/4 h-full text-white bg-[#f97316] rounded-[15px] hover:cursor-pointer active:bg-[#c55b11]">
                                Wyszukaj
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PlanZajec({ auth, plan }) {
    return (
        <div className="flex">
            <Head title="Plan zajęć"/>
            <MenuStudenta/>
            <Content plan={plan}/>
        </div>
    );
}