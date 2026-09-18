import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";


function Platnoscrow({ platnosc }){
    return(
        <>
            <tr className="text-white font-bold h-[40px] text-left text-[24px] hover:bg-[#08083b]">
                <td className="py-[20px]">{platnosc.tytul}</td>
                <td className="py-[20px]">{platnosc.data}</td>
                <td className="py-[20px]">{platnosc.termin}</td>
                <td className="py-[20px]">{platnosc.kwota}</td>
                <td className="py-[20px]">
                    {platnosc.czyOplacone === 1 ? (
                        <span className="text-[24px] text-[#0DFF00]">Opłacone</span>
                    ) : (
                        <span className="text-[24px] text-[#852221]">Nie opłacone</span>
                    )}
                </td>
            </tr>
        </>
    );
}

function Content({ platnosci, suma, najblizszytermin}){
    console.log(platnosci)
    return (
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Moje finanse</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                        
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5">
                    <div className=" grid  grid-cols-[1fr_1fr_1.5fr]  w-full  gap-2 h-[20%] ">
                        <div className="w-full mx-auto bg-[#06062c] rounded-[15px] text-left px-[37px] py-[26px]">
                            <span className="text-[24px] text-[#73768C]">Suma do zapłaty</span><br />
                            <span className={`text-[48px] font-bold ${suma < 1 ? 'text-white' : 'text-[#852221]'}`}>{suma} PLN</span>
                        </div>
                        <div className="w-full mx-auto bg-[#06062c] rounded-[15px] text-left px-[37px] py-[26px]">
                            <span className="text-[24px] text-[#73768C]">Najbliższy termin</span><br />
                            <span className="text-[34px] text-white font-bold">{najblizszytermin}</span>
                        </div>
                        <div className="w-full mx-auto bg-[#06062c] rounded-[15px] text-left px-[37px] py-[26px]">
                            <span className="text-[24px] text-[#73768C]">Konto bankowe</span><br />
                            <span className="text-[48px] text-white font-bold">676767676767676767</span>
                            
                        </div>
                    </div>
                    <div className=" bg-[#06062c] h-[77%] mt-5 px-[37px] py-[22px] rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                        <span className="text-white font-bold text-[40px]">Historia Płatności</span>
                        
                        <table className="w-full ">
                            <thead>
                                <tr className="h-[52px] text-[#73768C] text-[24px] border-b border-[#73768C] px-[61px] py-[10px] text-left ">
                                    <th className="py-[10px]">Tytuł</th>
                                    <th className="py-[10px]">Data wystawienia</th>
                                    <th className="py-[10px]">Termin</th>
                                    <th className="py-[10px]">Kwota</th>
                                    <th className="py-[10px]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#73768C] ">
                                {platnosci.map((platnosc) => (
                                    <Platnoscrow key={platnosc.id} platnosc={platnosc}/>
                                ))}
                            </tbody>
                        </table>
                        
                        
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
