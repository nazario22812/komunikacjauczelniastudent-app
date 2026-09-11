import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Form from 'react-bootstrap/Form';



function SiatkaPlanu(){
    
}

function Content(){

    const godziny = [
        '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
        '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', 
    ]

    const dni = [
        'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'
    ]

    return(
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            {/* <p className="text-white">{rol}</p> */}

            <div className="bg-[#08083b] w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Plan zajęć</span>
            </div>

            <div className="bg-[#08083b] w-full h-[900px] flex border-[0.3px] border-white py-3 px-1 rounded-b-[10px] ">
                <div className="w-[80%] border border-white rounded-l-[10px]">
                    
                    <div className="grid grid-cols-6 border h-full border-slate-700/80 rounded-xl overflow-hidden bg-[#1a1738]">
          
                        <div className="bg-[#73768c] p-3 text-white text-center font-semibold border-b border-r border-white">
                            Dzień
                        </div>
                        {dni.map((day) => (
                            <div key={day} className="bg-[#73768c] p-3 text-center text-white font-semibold border-b border-r border-white last:border-r-0">
                                {day}
                            </div>
                        ))}
                        {godziny.map((hour) => (
                            <React.Fragment key={hour}>
                                <div className="h-full text-xs text-white border-b border-r border-white flex items-center justify-center bg-[#73768c]">
                                    {hour}
                                </div>
                                {dni.map((day, dayIndex) => (
                                    <div key={dayIndex} className="h-full border-b border-r border-white bg-[#676c98] relative last:border-r-0  transition-colors hover:bg-white/[0.02]">
                                        {/* {hour === '10:00-11:00' && dayIndex === 2 && (
                                            <div className="absolute inset-1 bg-purple-600 rounded-lg p-2 text-xs flex flex-col justify-between shadow-md">
                                                <span className="font-bold leading-tight">Programowanie obiektowe w C++</span>
                                                <span className="text-[10px] text-purple-200">dr inż. Jan Kowalski | E301</span>
                                            </div>
                                        )} */}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="w-[20%] rounded-r-[10px] bg-[#06062c] px-[20px] py-[33px] ">
                    
                    <div className="px-[10px] py-[10px]">
                        <div className="mx-auto w-full text-center text-[16px] text-white">
                            Wybierz grupę
                        </div>
                        <div className="w-full px-[29px] pt-[40px]">
                            <span className="text-[13px] text-white">Kierunek</span>
                            <Form.Select className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]">

                            </Form.Select>
                        </div>
                        <div className="w-full px-[29px] pt-[40px]">
                            <span className="text-[13px] text-white">Grupa</span>
                            <Form.Select className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]">

                            </Form.Select>
                        </div>
                        <div className="w-full mx-auto  h-[28px] px-[18px] my-3 flex items-center mt-10">
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



export default function PlanZajec({ auth }) {
    return (
       
        <div className="flex">
            <Head title="Plan zajęć"/>
            <MenuStudenta/>
            <Content/>
        </div>
    );
}
