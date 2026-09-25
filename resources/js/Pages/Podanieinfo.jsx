import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head, router } from "@inertiajs/react";

function Content({ szczegoly }){
    return (
       
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Szczegóły podania</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-[15px]">
                
                    <div className=" bg-[#06062c] h-full px-[20px] py-[22px] rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="w-full flex">
                            <div className="w-full ">
                                <span className="text-[#73768c] font-bold text-[20px]">Temat podania</span><br />
                                <span className="font-bold text-white  text-[24px]">{szczegoly.temat}</span>
                            </div>
                            <div className="w-full text-right text-white  text-[30px]">
                                <span className="p-5">{szczegoly.status}</span>
                            </div>
                        </div>
                        <div className="mt-20 w-full">
                            <span className="text-[#73768c] font-bold text-[20px]">Data złożenia: </span>
                            <span className="text-white  text-[18px]">{szczegoly.data}</span>                            
                        </div>
                        <div className="mt-5 w-full border border-white p-5 rounded-[10px]">
                            <span className="text-[#73768c] font-bold text-[20px]">Treść podania</span><br />
                            <span className="font-bold text-white  text-[24px] ">{szczegoly.tresc}</span>                           
                        </div>
                        <div className="mt-5 w-full border border-white p-5 rounded-[10px]">
                            <span className="text-[#73768c] font-bold text-[20px]">Odpowiedź</span><br />
                            <span className="font-bold text-white  text-[24px] ">{szczegoly.odpowiedz}</span>                           
                        </div>

                        {/* <div className="mt-5 w-full border border-white p-5 rounded-[10px]">
                            <span className="text-[#73768c] font-bold text-[20px]">Odpowiedź</span><br />
                            <span className="font-bold text-white  text-[24px] ">{szczegoly.odpowiedz}</span>                           
                        </div> */}
                    </div>
                
                </div>
                
            </div>        
        </div>
    );
}

export default function Podanieinfo({ auth, szczegoly }) {
    return (
      
        <div className="flex">
            <Head title="E-Dziekanat"/>
            <MenuStudenta/>
            <Content szczegoly={szczegoly}/>
        </div>
    );
}