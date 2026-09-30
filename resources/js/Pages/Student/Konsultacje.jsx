import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";


function Konsultacjerow({ konsultacja }){
    return(
        <>
            <tr className="text-white font-bold h-[40px] text-left text-[24px] hover:bg-[#314361]">
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
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Moje finanse</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#06062c] w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center" > 
                    <span className="text-white font-bold text-[36px] ">Lista dostępnych konsultacji</span>    
                </div>   
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    {konsultacje && konsultacje.length > 0 ? (
                            <table className="w-full ">
                                <thead>
                                    <tr className="h-[52px] text-[#73768C] text-[24px] border-b border-[#73768C] px-[61px] py-[10px] text-left ">
                                        <th className="py-[10px]">Prowadzący</th>
                                        <th className="py-[10px]">Czas</th>
                                        <th className="py-[10px]">Budynek</th>
                                        <th className="py-[10px]">Sala</th>
                                        <th className="py-[10px]">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#73768C] ">
                                    {konsultacje.map((konsultacja) => (
                                        <Konsultacjerow key={konsultacja.id} konsultacja={konsultacja}/>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-[#73768C]">
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
