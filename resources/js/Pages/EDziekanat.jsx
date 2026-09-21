import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head, router, Link } from "@inertiajs/react";


export function Podanierow({ podanie }){
    return(
        
            <tr className="text-white font-bold h-[40px] text-left text-[24px] hover:bg-[#08083b] hover:cursor-pointer"
            onClick={() => router.get(`/edziekanat/${podanie.idPodanie}`)}
            >
                <td className="py-[20px]">{podanie.temat}</td>
                <td className="py-[20px]">{podanie.data}</td>
                <td className="py-[20px]">{podanie.status}</td>
            </tr>
        
    );
}

function Content({ podania }){
    return (
       
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">E-Dziekanat</span>
                <Link className="text-[73768c] w-[10%]">Zloż podanie</Link>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5">
                
                    <div className=" bg-[#06062c] h-full px-[37px] py-[22px] rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                        <span className="text-white font-bold text-[40px]">Historia Podań</span>
                        {podania && podania.length > 0 ? (
                            <table className="w-full ">

                                <thead>
                                    <tr className="h-[52px] text-[#73768C] text-[24px] border-b border-[#73768C] px-[61px] py-[10px] text-left ">
                                        <th className="py-[10px] w-[60%]">Temat</th>
                                        <th className="py-[10px]">Data</th>
                                        <th className="py-[10px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#73768C] w-full">
                                    {podania.map((podanie) => (
                                        <Podanierow key={podanie.id} podanie={podanie}/>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-[#73768C]">
                                <span>Brak podań</span>
                            </div>
                        )}

                    </div>
                
                </div>
                
            </div>        
        </div>
    );
}


export default function EDziekanat({ auth, podania }) {
    return (
      
        <div className="flex">
            <Head title="E-Dziekanat"/>
            <MenuStudenta/>
            <Content podania={podania}/>
        </div>
    );
}
