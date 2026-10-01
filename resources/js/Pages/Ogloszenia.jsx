import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import Carousel from "react-bootstrap/Carousel";


function Content({ ogloszenia }){
    return (
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Ogłoszenia i ankiety</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                        
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-[15px]">
                    <div className=" bg-[#06062c] h-[45%] mt-2 px-[37px] py-[22px] rounded-[15px]">
                        <span className="text-white font-bold text-[25px] w-full">Ogłoszenia</span>
                            {ogloszenia && ogloszenia.length > 0 ? (
                                <div className="h-[90%] w-full flex gap-4 overflow-x-auto overflow-y-hidden pr-2 custom-scrollbar border-t border-white">
                                    {ogloszenia.map((ogloszenie) => (
                                        <div key={ogloszenie.id} className="bg-[#1e293b] px-5 py-5 rounded-[15px] text-center flex-shkrink-1">
                                            <span className="text-white font-bold text-[20px]">{ogloszenie.temat}</span>
                                            <p className="text-white text-[16px]">{ogloszenie.tresc}</p>
                                        </div>
                                    ))}
                                </div>
                                
                            ):(
                                <div className="w-full mx-auto text-center mt-10 text-[24px] text-[#73768C]">
                                    <span>Brak ogłoszeń</span>
                                </div>
                            )}
                    </div>
                    <div className=" bg-[#06062c] h-[52%] mt-5 px-[37px] py-[22px] rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                        <span className="text-white font-bold text-[25px]">Ankiety</span>
                        
                        
                        
                    </div>
                </div> 
            </div>        
        </div>
    );
}

export default function Ogłoszenia({ auth, ogloszenia }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Ogłoszenia i ankiety"/>
            <MenuStudenta/>
            <Content ogloszenia={ogloszenia}/>
        </div>
    );
}
