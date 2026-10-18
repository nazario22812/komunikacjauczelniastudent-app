import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";


function Konsultacjerow({ konsultacja }){
    return(
        <>
            <tr className="text-theme-text font-bold h-[40px] text-left text-[24px] hover:bg-theme-slate-2">
                <td className="py-[20px]">{konsultacja.TytulNaukowy} {konsultacja.name} {konsultacja.surname}</td>
                <td className="py-[20px]">{konsultacja.GodzinaRozpoczecia}-{konsultacja.GodzinaZakonczenia}</td>
                <td className="py-[20px]">{konsultacja.nazwa}</td>
                <td className="py-[20px]">{konsultacja.numerSali}</td>
                <td className="py-[20px]">{konsultacja.data}</td>
            </tr>
        </>
    );
}

function Content({ konsultacje }){
    return (
        // <>
        //     {konsultacje.map((konsultacja) => (
        //         <span>{konsultacja.TytulNaukowy} {konsultacja.name} {konsultacja.surname} {konsultacja.GodzinaRozpoczecia}-{konsultacja.GodzinaZakonczenia} {konsultacja.nazwa} {konsultacja.numerSali} {konsultacja.data}</span>  
        //     ) )}
        // </>
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Moje finanse</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-surface w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center" > 
                    <span className="text-theme-text font-bold text-[36px] ">Lista dostępnych konsultacji</span>    
                </div>   
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    {konsultacje && konsultacje.length > 0 ? (
                            <table className="w-full ">
                                <thead>
                                    <tr className="h-[52px] text-theme-muted text-[24px] border-b border-theme-muted px-[61px] py-[10px] text-left ">
                                        <th className="py-[10px]">Prowadzący</th>
                                        <th className="py-[10px]">Czas</th>
                                        <th className="py-[10px]">Budynek</th>
                                        <th className="py-[10px]">Sala</th>
                                        <th className="py-[10px]">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-theme-muted ">
                                    {konsultacje.map((konsultacja) => (
                                        <Konsultacjerow key={konsultacja.id} konsultacja={konsultacja}/>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                                <span>Brak konsultacji</span>
                            </div>
                        )}
                </div> 
            </div>        
        </div>
    )
}


export default function Konsultacje({ auth, konsultacje }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Konsultacje"/>
            <MenuStudenta/>
            <Content konsultacje={konsultacje}/>
        </div>
    );
}
