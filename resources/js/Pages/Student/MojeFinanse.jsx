import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";


function Platnoscrow({ platnosc }){
    return(
        <>
            <tr className="h-[40px] text-left text-[clamp(0.8rem,1vw+0.5rem,1.1rem)] font-bold text-theme-text hover:bg-theme-panel">
                <td className="py-[20px]">{platnosc.tytul}</td>
                <td className="py-[20px]">{platnosc.data}</td>
                <td className="py-[20px]">{platnosc.termin}</td>
                <td className="py-[20px]">{platnosc.kwota}</td>
                <td className="py-[20px]">
                    {platnosc.czyOplacone === 1 ? (
                        <span className="text-[clamp(0.9rem,1vw+0.5rem,1.35rem)] text-theme-green">Opłacone</span>
                    ) : (
                        <span className="text-[clamp(0.9rem,1vw+0.5rem,1.35rem)] text-theme-red">Nie opłacone</span>
                    )}
                </td>
            </tr>
        </>
    );
}

function Content({ platnosci, suma, najblizszytermin, kontodozaplaty}){
    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Moje finanse</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">

                <div className="bg-theme-slate w-full h-full mx-auto p-3 rounded-[15px] sm:p-5">
                    <div className="grid w-full gap-2 md:grid-cols-[1fr_1fr_1.5fr]">
                        <div className="w-full mx-auto rounded-[15px] bg-theme-surface px-4 py-5 text-left sm:px-[37px] sm:py-[26px]">
                            <span className="text-[clamp(0.8rem,1.2vw+0.6rem,1.5rem)] text-theme-muted">Suma do zapłaty</span><br />
                            <span className={`text-[clamp(1.8rem,3vw+1rem,3rem)] font-bold ${suma < 1 ? 'text-theme-text' : 'text-theme-red'}`}>{suma} PLN</span>
                        </div>
                        {najblizszytermin &&(
                            <div className="w-full mx-auto rounded-[15px] bg-theme-surface px-4 py-5 text-left sm:px-[37px] sm:py-[26px]">
                                <span className="text-[clamp(0.8rem,1.2vw+0.6rem,1.5rem)] text-theme-muted">Najbliższy termin</span><br />
                                <span className="text-[clamp(1.4rem,2.2vw+0.9rem,2.3rem)] font-bold text-theme-text">{najblizszytermin}</span>
                            </div>
                        )}

                        <div className="w-full mx-auto rounded-[15px] bg-theme-surface px-4 py-5 text-left sm:px-[37px] sm:py-[26px]">
                            <span className="text-[clamp(0.8rem,1.2vw+0.6rem,1.5rem)] text-theme-muted">Konto bankowe</span><br />
                            <span className="break-all text-[clamp(1.1rem,2vw+0.9rem,3rem)] font-bold text-theme-text">{kontodozaplaty || 'brak'}</span>
                        </div>
                    </div>
                    <div className="mt-5 h-[77%] overflow-y-auto rounded-[15px] bg-theme-surface px-4 py-4 pr-2 custom-scrollbar sm:px-[37px] sm:py-[22px]">
                        <span className="text-[clamp(1.5rem,2.5vw+0.7rem,2.5rem)] font-bold text-theme-text">Historia Płatności</span>

                        {platnosci && platnosci.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="h-[52px] border-b border-theme-muted px-[61px] py-[10px] text-left text-[clamp(0.85rem,1vw+0.5rem,1.3rem)] text-theme-muted">
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
                            <div className="mx-auto mt-10 text-center text-[clamp(1rem,1.2vw+0.7rem,1.6rem)] text-theme-muted">
                                <span>Brak płatności</span>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );

}

export default function MojeFinanse({ auth, platnosci, suma, najblizszytermin, kontodozaplaty }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Moje finanse"/>
            <MenuStudenta/>
            <Content  platnosci={platnosci} suma={suma} najblizszytermin={najblizszytermin} kontodozaplaty={kontodozaplaty}/>
        </div>
    );
}
