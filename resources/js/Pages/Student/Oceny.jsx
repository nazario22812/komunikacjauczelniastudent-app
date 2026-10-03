import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

function Content({ oceny }){
    console.log(oceny)
    return (
        
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Twoje oceny</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#06062c] w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center" > 
                    <span className="text-white font-bold text-[36px] ">Oceny końcowe</span>    
                </div>   
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    {oceny && oceny.length > 0 ? (
                            
                            <div className="w-full h-[100%]">
                                {oceny.map((ocena) => (
                                    <div key={ocena.id} className="w-full h-[11%] grid grid-cols-[1fr_1fr_1fr_1fr] flex items-center justify-center pl-5 text-white text-[15px] bg-[#73768c] rounded-[15px] mb-4 ">
                                        <span>{ocena.nazwa} {ocena.TypZajec}</span>
                                        <span>{ocena.TytulNaukowy} {ocena.wykladowca_imie} {ocena.wykladowca_nazwisko}</span>
                                        <span>{ocena.typ}</span>
                                        <span className="font-bold">{ocena.skalaOceny}</span>
                                    </div>
                                ))}
                               
                                
                            </div>
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-[#73768C]">
                                <span>Brak ocen</span>
                            </div>
                        )}
                </div> 
            </div>        
        </div>
    )
}

export default function Oceny({ auth, oceny }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Oceny"/>
            <MenuStudenta/>
            <Content oceny={oceny}/>
        </div>
    );
}
