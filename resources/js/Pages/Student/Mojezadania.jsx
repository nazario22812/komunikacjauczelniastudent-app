import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

function Content({ zadania }){
   
    return (
        
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Twoje zadania</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-surface w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center gap-2.5" > 
                    <span className="text-theme-text font-bold text-[36px] ">Zadania</span>    
                    
                </div>
                  
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    {zadania && zadania.length > 0 ? (
                            
                        <div className="w-full h-[100%]">
                            
                            {zadania.map((zadanie) => (
                                <div key={zadanie.idZadanie} onClick={() => router.get(`/student/kurs/${zadanie.idZadanie}`)} className="w-full h-[11%] grid grid-cols-[1fr_1fr_1fr_1fr] flex items-center justify-center pl-5 text-theme-text text-[15px] bg-theme-muted rounded-[15px] mb-4 hover:cursor-pointer">
                                    <span >{zadanie.nazwaZadania}</span>
                                </div>
                            ))}
                            
                            
                        </div>
                    ):(
                        <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                            <span>Brak zadań</span>
                        </div>
                    )}
                </div> 
            </div>        
        </div>
    )
}

export default function MojeZadania({ auth, zadania}) {
    return (
        
        <div className="flex">
            <Head title="Moje zadania"/>
            <MenuStudenta/>
            <Content zadania={zadania}/>
        </div>
    );
}
