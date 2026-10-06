import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import Lupa from '@/../images/search-rounded.png';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';

function Content({ mojekursy }){
    const [pokaz, setpokaz] = useState(false);
    const handleClose = () => setpokaz(false);
    const handleOpen = () => setpokaz(true);

    return (
       
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            

            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Moje kursy</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2  px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="w-full h-[8%] flex  text-white">
                    <div className="bg-[#1e293b] w-[30%] max-h-[60%] flex items-center text-white rounded-[10px] overflow-hidden border border-white">
    
                        <input 
                            type="text" 
                            placeholder="szukaj kurs za kodem" 
                            className="w-full bg-transparent px-4 py-1 text-white placeholder-gray-400 focus:outline-none"
                        />

                        <div className=" px-3 py-1 flex items-center justify-center cursor-pointer  transition-colors">
                            <img src={Lupa} className="w-[28px] h-[28px] object-contain" alt="wyszukaj" />
                        </div>

                    </div>
                    <div className="w-full text-right"><button variant="primary" onClick={handleOpen} className="hover:cursor-pointer">Lista wszystkich kursów</button></div>    
                </div>

                

                <div className="w-full h-[90%]">   
                    {mojekursy && mojekursy.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2 h-[30%]">
                            {mojekursy.map((kurs) => (
                                <div key={kurs.id} className="bg-[#1e293b] p-5 rounded-[15px] flex flex-col justify-between gap-5 border border-gray-700/50 hover:border-gray-500">
                                    <div>
                                        <h3 className="text-white font-bold text-[20px] leading-light">{kurs.nazwa}</h3>
                                        
                                        <p className="text-gray-400 text-[14px] ">Prowadzący: {kurs.prowadzacy.TytulNaukowy} {kurs.prowadzacy.user.name} {kurs.prowadzacy.user.surname}</p>
                                    </div>

                                    <button className="w-full bg-[#06062c] hover:bg-[#101042] text-white py-2 rounded-[10px] text-center font-medium hover:cursor-pointer">
                                        Zapisz się
                                    </button>
                                </div>
                            ))}
                        </div>
                    ):(
                        <div className="w-full flex-1 flex items-center justify-center text-[24px] text-[#73768C]">
                            <span>Nie masz jeszcze kursów</span>
                        </div>
                    )}
                </div>
            </div>  

            {/* panel ktora wyjezdza od prawej strony */}
            {pokaz && (
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={handleClose}>

                </div>
            )}     
            <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#04041D] border-l border-white/20 shadow-2xl z-50 p-6 flex flex-col text-white transition-transform duration-300 ease-in-out ${pokaz ? 'translate-x-0' : 'translate-x-full'}`}>
                
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <h2 className="font-bold text-[20px]">Wszystkie kursy</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white text-[28px] font-bold px-2 leading-none cursor-pointer"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
                    
                </div>

            </div>
        </div>
        
    );
}

export default function MojeKursy({ auth, mojekursy }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Moje kursy"/>
            <MenuStudenta/>
            <Content mojekursy={mojekursy}/>
        </div>
    );
}
