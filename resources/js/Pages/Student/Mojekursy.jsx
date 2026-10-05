import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
function Content({ mojekursy }){
    return (
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Moje kursy</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                        
                {/* <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-[15px]">
                    <div className="bg-[#06062c] w-full h-[45%] mt-2 px-[37px] py-[22px] rounded-[15px] flex flex-col overflow-hidden">
                    <span className="text-white font-bold text-[25px] shrink-0 mb-4">Ogłoszenia</span> */}

                    {/* {ogloszenia && ogloszenia.length > 0 ? (
                        <div className="w-[1435px] flex gap-4 overflow-x-auto overflow-y-hidden  pr-2 pb-2 custom-scrollbar  pt-4">
                            {ogloszenia.map((ogloszenie) => (
                                <div key={ogloszenie.id} className="bg-[#1e293b] w-[250px]  shrink-0 px-5 py-5 rounded-[15px] text-center flex flex-col gap-2">
                                    <span className="text-white font-bold text-[20px] leading-tight">{ogloszenie.temat}</span>
                                    <p className="text-white text-[16px] text-gray-300">{ogloszenie.tresc}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex-1 flex items-center justify-center text-[24px] text-[#73768C]">
                            <span>Brak ogłoszeń</span>
                        </div>
                    )} */}
                    {/* </div>
                    <div className=" bg-[#06062c] h-[52%] mt-5 px-[37px] py-[22px] rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                        <span className="text-white font-bold text-[25px]">Ankiety</span> */}
                            {/* {ankiety && ankiety.length > 0 ? (
                                <div className="w-full pt-4 ">
                                    {ankiety.map((ankieta) => (
                                        <Link href={ankieta.link} key={ankieta.id} className="flex gap-1 pb-3">
                                            <div className="text-[35px]">
                                                🗳️
                                            </div>
                                            <div>
                                                <span className="text-white text-[20px] font-bold">{ankieta.temat}</span><br />
                                                <span className="text-[white] text-[16px]">{ankieta.opis}</span>    
                                            </div>
                                            
                                        </Link>
                                    ))}
                                </div>
                            ):(
                                <div className="w-full mx-auto text-center mt-10 text-[24px] text-[#73768C]">
                                    <span>Brak ankiet</span>
                                </div>
                            )} */}
                        
                        
                    {/* </div>
                </div>  */}
            </div>        
        </div>
    );
}

export default function MojeKursy({ auth, mojekursy }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Moje kursy"/>
            <MenuStudenta/>
            <Content mojekursy={mojekursy}/>
        </div>
    );
}
