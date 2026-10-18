import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";


function Platnoscrow({ platnosc }){
    return(
        <>
            <tr className="text-theme-text font-bold h-[40px] text-left text-[24px] hover:bg-theme-panel">
                <td className="py-[20px]">{platnosc.tytul}</td>
                <td className="py-[20px]">{platnosc.data}</td>
                <td className="py-[20px]">{platnosc.termin}</td>
                <td className="py-[20px]">{platnosc.kwota}</td>
                <td className="py-[20px]">
                    {platnosc.czyOplacone === 1 ? (
                        <span className="text-[24px] text-theme-green">Opłacone</span>
                    ) : (
                        <span className="text-[24px] text-theme-red">Nie opłacone</span>
                    )}
                </td>
            </tr>
        </>
    );
}

function Content({ platnosci, suma, najblizszytermin}){
    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Moje finanse</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                        
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-[15px]">
                    <div className=" grid  grid-cols-[1fr_1fr_1.5fr]  w-full  gap-2 h-[20%] ">
                        <div className="w-full mx-auto bg-theme-surface rounded-[15px] text-left px-[37px] py-[26px]">
                            <span className="text-[24px] text-theme-muted">Suma do zapłaty</span><br />
                            <span className={`text-[48px] font-bold ${suma < 1 ? 'text-theme-text' : 'text-theme-red'}`}>{suma} PLN</span>
                        </div>
                        {najblizszytermin &&(
                            <div className="w-full mx-auto bg-theme-surface rounded-[15px] text-left px-[37px] py-[26px]">
                                <span className="text-[24px] text-theme-muted">Najbliższy termin</span><br />
                                <span className="text-[34px] text-theme-text font-bold">{najblizszytermin}</span>
                            </div>
                        )}
                        
                        <div className="w-full mx-auto bg-theme-surface rounded-[15px] text-left px-[37px] py-[26px]">
                            <span className="text-[24px] text-theme-muted">Konto bankowe</span><br />
                            <span className="text-[48px] text-theme-text font-bold">676767676767676767</span>
                            
                        </div>
                    </div>
                    <div className=" bg-theme-surface h-[77%] mt-5 px-[37px] py-[22px] rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                        <span className="text-theme-text font-bold text-[40px]">Historia Płatności</span>
                        
                        {platnosci && platnosci.length > 0 ? (
                            <table className="w-full ">
                                <thead>
                                    <tr className="h-[52px] text-theme-muted text-[24px] border-b border-theme-muted px-[61px] py-[10px] text-left ">
                                        <th className="py-[10px]">Tytuł</th>
                                        <th className="py-[10px]">Data wystawienia</th>
                                        <th className="py-[10px]">Termin</th>
                                        <th className="py-[10px]">Kwota</th>
                                        <th className="py-[10px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-theme-muted ">
                                    {platnosci.map((platnosc) => (
                                        <Platnoscrow key={platnosc.id} platnosc={platnosc}/>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                                <span>Brak płatności</span>
                            </div>
                        )}
                        
                    </div>
                </div> 
            </div>        
        </div>
    );

}

export default function MojeFinanse({ auth, platnosci, suma, najblizszytermin }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Moje finanse"/>
            <MenuStudenta/>
            <Content  platnosci={platnosci} suma={suma} najblizszytermin={najblizszytermin}/>
        </div>
    );
}
