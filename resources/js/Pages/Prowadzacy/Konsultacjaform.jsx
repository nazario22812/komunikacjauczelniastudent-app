import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from 'react-bootstrap/Form';

function Content({ budynki, sali }) {



    const [wybranyBudynek, setwybranyBudynek] = useState('');
    const [wybranaSala, setwybranaSala] = useState('');
    const filtersal = sali?.filter(
        (s) => String(s.Budynek_idBudynek) === String(wybranyBudynek)
    )
    
    const { data, setData, get, post, processing, errors, reset } = useForm({
        data: '',
        godpocz: '',
        godkon: '',
        budynek: '',
        sala: ''
    });
    
    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full ">
                    Konsultacja
                </span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-slate w-full h-full mx-auto pt-[35px] pb-[10px] px-[75px] rounded-[15px]   relative overflow-y-auto pr-2 custom-scrollbar    ">
                    <div className="w-full text-center text-theme-text font-bold text-[58px]">
                        <span>Nowa konsultacja</span>
                    </div>
                    {/* onSubmit={wyslijpodanie} */}
                    <form >
                        <div className="px-[40px] py-[16px] w-full ">

                            <div className="w-full grid grid-cols-2">
                                <div className="px-5 grid grid-rows-3 text-theme-muted">
                                    <div className="py-5">
                                        <span>Data</span>
                                        <input type="date" onChange={(e) => setData('data', e.target.value)} required className="w-full bg-theme-surface rounded-[15px] text-[16px] px-3 py-2 text-theme-muted border border-theme-muted"/>
                                    </div>
                                    <div className="py-5">
                                        <span>Godzina rozpoczęcia</span>
                                        <input type="time" onChange={(e) => setData('godpocz', e.target.value)} required className="w-full bg-theme-surface rounded-[15px] text-[16px] px-3 py-2 text-theme-muted border border-theme-muted"/>
                                    </div>
                                    <div className="py-5">
                                        <span>Godzina zakończenia</span>
                                        <input type="time" onChange={(e) => setData('godkon', e.target.value)} required className="w-full bg-theme-surface rounded-[15px] text-[16px] px-3 py-2 text-theme-muted border border-theme-muted "/>
                                    </div>
                                </div>
                                <div className="px-5 grid grid-rows-3 text-theme-muted">
                                    <div className="py-5">
                                        <span>Budynek</span>
                                        <Form.Select required value={wybranyBudynek} onChange={(e) => {setwybranyBudynek(e.target.value); setData('budynek', e.target.value) }} className="w-full bg-theme-surface  border border-theme-muted rounded-[15px] text-theme-text h-[60%]">
                                            <option value="">Wybierz budynek</option>
                                            {budynki.map((budynek) => (
                                                <option key={budynek.idBudynek} value={budynek.idBudynek}>{budynek.nazwa}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="py-5">
                                        <span>Sala</span>
                                        <Form.Select required value={wybranaSala} onChange={(e) => {setwybranaSala(e.target.value); setData('sala', e.target.value)}} disabled={!wybranyBudynek} className="w-full bg-theme-surface  border border-theme-muted rounded-[15px] text-theme-text h-[60%]">
                                            <option value="">Wybierz salę</option>
                                            {filtersal.map((sala) => (
                                                <option key={sala.idSala} value={sala.idSala}>{sala.numerSali}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>

                            
                            <button
                                disabled={processing}    
                                type="submit"
                                className="w-[20%] h-[60px] text-[32px] block mx-auto text-theme-text bg-theme-orange rounded-[15px] hover:cursor-pointer active:bg-theme-orange"
                            >
                                Wyślij
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function Konsultacjaform({ budynki, sali }) {
    return (
        <div className="flex">
            <Head title="Nowa konsultacja" />
            <MenuProwadzacy />
            <Content budynki={budynki} sali={sali}/>
        </div>
    );
}
