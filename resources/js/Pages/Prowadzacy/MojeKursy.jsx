import React, { useEffect } from "react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Head, Link, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import Lupa from '@/../images/search-rounded.png';
import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";

function Content({ mojekursy }){
    

    return (
        
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
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

            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Moje kursy</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2  px-4 rounded-b-[10px] flex flex-col relative ">
                

                

                <div className="w-full h-[90%]">   
                    {mojekursy && mojekursy.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
                            {mojekursy.map((kurs) => (
                                <div key={kurs.id} className="bg-theme-slate p-5 rounded-[15px] flex flex-col justify-between gap-5 border border-gray-700/50 hover:border-gray-500">
                                    <div>
                                        <h3 className="text-theme-text font-bold text-[20px] leading-light">{kurs.nazwa}</h3>
                                        
                                    </div>

                                    <button onClick={() => router.get(`/prowadzacy/mojekursy/${kurs.nazwa}/${kurs.idkurs}`)} className="w-full bg-theme-surface hover:bg-theme-accent-navy text-theme-text py-2 rounded-[10px] text-center font-medium hover:cursor-pointer">
                                        Otwórz kurs
                                    </button>
                                </div>
                            ))}
                        </div>
                    ):(
                        <div className="w-full flex-1 flex items-center justify-center text-[24px] text-theme-muted">
                            <span>Nie masz jeszcze kursów</span>
                        </div>
                    )}
                </div>
            </div>  
            

            <div className="fixed right-1 bottom-1 z-30 ">
                <button 
                    className="bg-theme-orange rounded-[50px] p-5 m-5 text-theme-text text-[22px] font-bold hover:cursor-pointer "
                    onClick={() => router.get('/prowadzacy/tworzeniekursu')}
                >
                    +
                </button>
            </div>
            
            
        </div>
        
    );
}



export default function MojeKursy({ auth, mojekursy}) {
   
    return (
        
        <div className="flex">
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
            <Head title="Moje kursy"/>
            <MenuProwadzacy/>
            <Content mojekursy={mojekursy}/>
        </div>
    );
}
