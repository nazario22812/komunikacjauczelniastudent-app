import React, {useState} from "react";
import { Head, router } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import MenuProwadzacy from "../../Components/MenuProwadzacy";


function Content({ kursy }){
    
    


    return(
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
            <div className="bg-theme-panel w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <span className="font-bold text-[16px] text-theme-text w-full">Strona główna</span>
            </div>

            <div className="bg-theme-panel w-full h-full grid grid-rows-2 gap-4 border-[0.3px] border-theme-muted px-[10px] py-[10px]  rounded-b-[10px]">
                <div className="bg-theme-surface rounded-[10px] px-[35px] py-[20px] grid grid-cols-2 gap-3">
                    <div className="rounded-[10px] bg-theme-slate text-center flex flex-col justify-center p-6 border border-theme-muted gap-4">
                        <span className="text-theme-text text-[20px] font-bold mb-1">Szybkie działania</span>
                        
                        <button
                            onClick={() => router.get('/prowadzacy/zarezerwujsale')} 
                            className="w-full h-[50px] text-[18px] font-bold text-theme-text bg-theme-orange rounded-[15px] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                        >
                            Rezerwacja sali
                        </button>

                        <button
                            onClick={() => router.get('/prowadzacy/stworzkonsultacje')} 
                            className="w-full h-[50px] text-[18px] font-bold text-theme-text bg-theme-orange rounded-[15px] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                        >
                            Tworzenie konsultacji
                        </button>
                    </div>
                    <div className="rounded-[10px] bg-theme-slate flex border border-theme-muted">
                        
                    </div>
                </div> 
                <div className="bg-theme-surface rounded-[10px]">
                    <div className="w-full px-[35px] py-[5px]">
                        <span className="text-theme-text text-[22px]">Moje kursy</span>
                    </div>
                    <div className="w-full h-[90%] px-[35px] py-[25px] ">
                        
                        {kursy && kursy.length > 0 ? (
                            <div className="w-full h-full flex gap-5">
                                {kursy.map((kurs) => (
                                    <div key={kurs.idkurs} onClick={() => router.get(`/prowadzacy/mojekursy/${kurs.nazwa}/${kurs.idkurs}`)} className="w-[20%] bg-theme-slate rounded-[15px] text-theme-text text-[32px] font-bold border border-theme-muted flex items-center justify-center p-4 text-center shkrink hover:cursor-pointer"><span>{kurs.nazwa}</span></div>        
                                ))}
                            </div>
                            
                        
                        ):(
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



export default function ProwadzacyGlowna({ auth, kursy }) {
    return (
       
        
        <div className="flex">
            <Head title="Strona główna"/>
            <MenuProwadzacy/>
            <Content kursy={kursy}/>
        </div>
    );
}
