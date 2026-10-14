import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head, router, useForm } from "@inertiajs/react";
import Form from 'react-bootstrap/Form';
import { useState } from "react";

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import themePlugin from '@fullcalendar/react/themes/classic';

import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/classic/theme.css';
import '@fullcalendar/react/themes/classic/palette.css';


function Content({ plan = null, listagrup, listakierunkow}){
    const [wybranyKierunek, setwybranyKierunek] = useState('');
    const [wybranaGrupa, setwybranaGrupa] = useState('');
    const filtergrup = listagrup?.filter(
        (g) => String(g.Kierunek_idKierunek) === String(wybranyKierunek)
    )
    const { data, setData, get, post, processing, errors, reset } = useForm({
        kierunk: '',
        grpa: '',
    });
    const wyszukajGrupe = (e) => {
        e.preventDefault();

        get(`/planzajec/${data.grpa}`);
        // post(route.post('planzajec.szukaniegrupy', data.grpa));
    };


    

    return(
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#08083b] w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Plan zajęć</span>
            </div>

            <div className="bg-[#08083b] w-full h-full flex border-[0.3px] border-white pt-3 pb-5 px-1 rounded-b-[10px]">
                <div className="w-[80%]  h-full border border-white rounded-l-xl rounded-r-xl flex flex-col">
                    
                    <FullCalendar
                        colorScheme="dark"
                        plugins={[timeGridPlugin, themePlugin]}
                        initialView="timeGridFourDay"
                        views={{
                            timeGridFourDay: {
                                type: 'timeGrid',
                                duration: { days: 7 },
                            },
                        }}
                        events={plan}
                        headerToolbar={{
                            'left' : 'prev,next today',
                            'right': ''
                        }}
                        allDaySlot={false}
                        slotMinTime="08:00:00"
                        slotMaxTime="22:00:00"
                        slotDuration="01:00:00"
                        height="100%"
                        expandRows={true}
                        weekNumberFormat={{
                            week: 'narrow'
                        }}
                        // eventClick={function(info) {
                        //     info.event.size
                        // }}
                        eventContent={(arg) => {
                            const props = arg.event.extendedProps;
                            
                            let bgColor = '#3788d8'; 
                            if (props.typ === 'Laboratorium') bgColor = '#f97316';
                            else if (props.typ === 'Wykład') bgColor = '#8b5cf6';     
                            else if (props.typ === 'Ćwiczenia') bgColor = '#0ea5e9';   

                            return {

                                html:
                                `
                                        <div style=" background-color: ${bgColor}; margin: 0px; padding: 0px; height: 100%; font-size: 11px; line-height: 1.2; padding: 2px; overflow: hidden; color: white;">
                                            <b>${arg.event.title}</b><br/>
                                            ${props.tytulNaukowy || ''} ${props.imie}. ${props.nazwisko}<br/>
                                            ${props.parzystosc}<br/> ${props.numersali}<br/>
                                            ${arg.timeText}
                                        </div>    
                                    
                                    
                                `
                            };
                        }}
                    />

                    
                </div> 

                <div className="w-[20%] rounded-r-[10px] bg-[#06062c] px-[20px] py-[33px]">
                    <form onSubmit={wyszukajGrupe}>
                        <div className="px-[10px] py-[10px]">
                            <div className="mx-auto w-full text-center text-[16px] text-white">
                                Wybierz grupę
                            </div>
                            <div className="w-full px-[29px] pt-[40px]">
                                <span className="text-[13px] text-white">Kierunek</span>
                                <Form.Select value={wybranyKierunek} onChange={(e) =>{ setwybranyKierunek(e.target.value); setwybranaGrupa(''); setData('kierunk', e.target.value)}} className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]">
                                    <option>Wybierz kierunek</option>
                                    {listakierunkow && listakierunkow.map((kierunek) => (
                                        <option key={kierunek.idKierunek} value={kierunek.idKierunek}>{kierunek.nazwa}</option>

                                    )) }
                                </Form.Select>
                            </div>
                            <div className="w-full px-[29px] pt-[40px]">
                                <span className="text-[13px] text-white">Grupa</span>
                                <Form.Select value={wybranaGrupa} onChange={(e) => {setwybranaGrupa(e.target.value); setData('grpa', e.target.value)}} disabled={!wybranyKierunek}  className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]">
                                    <option>Wybierz grupę</option>
                                    {filtergrup.map((grupa) => (
                                        <option key={grupa.idGrupaStudenta} value={grupa.idGrupaStudenta}>{grupa.nazwaGrupy}</option>

                                    ))}
                                </Form.Select>
                            </div>
                            <div className="w-full mx-auto h-[28px] px-[18px] my-3 flex items-center mt-10">
                                <button disabled={processing} type="submit" className="text-[13px] mx-auto w-3/4 h-full text-white bg-[#f97316] rounded-[15px] hover:cursor-pointer active:bg-[#c55b11]">
                                    Wyszukaj
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}





export default function PlanZajec({ auth, plan = null, listagrup, listakierunkow }) {
    return (
        <div className="flex">
            <Head title="Plan zajęć"/>
            <MenuStudenta/>
            <Content plan={plan} listagrup={listagrup} listakierunkow={listakierunkow}/>
        </div>
    );
}