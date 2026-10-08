import React, { useEffect } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, Link, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";


function Content({ kurs }){
   

    
    return (
        
       <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Kurs</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#06062c] w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center" > 
                    <div>
                        <span className="text-white font-bold text-[36px] ">{kurs.nazwa}</span><br />
                        <span className="text-white font-thin text-[20px] ">{kurs.prowadzacy.TytulNaukowy} {kurs.prowadzacy.user.name} {kurs.prowadzacy.user.surname}</span>   
                    </div>
                    
                </div>   
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                   
                </div> 
            </div>        
        </div>
        
    );
}

export default function MojeKursy({ auth, kurs }) {
    
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
           
            <Head title="Moje kursy"/>
            <MenuStudenta/>
            <Content kurs={kurs}/>
        </div>
    );
}
