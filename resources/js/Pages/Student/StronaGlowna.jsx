import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";


function Content({ kursy }){
    
    console.log(kursy);

    return(
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#08083b] w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <span className="font-bold text-[16px] text-white w-full">Strona główna</span>
            </div>

            <div className="bg-[#08083b] w-full h-full grid grid-rows-2 gap-4 border-[0.3px] border-white px-[10px] py-[10px]  rounded-b-[10px]">
                <div className="bg-[#06062C] rounded-[10px] px-[35px] py-[20px] grid grid-cols-2 gap-3">
                    <div className="rounded-[10px] bg-[#0F0F75] flex border border-white">
                        <div className="w-[40%] ">1</div>
                        <div className="w-[60%] bg-[#1E293B] rounded-r-[10px] border border-white">2</div>
                    </div>
                    <div className="rounded-[10px] bg-[#0F0F75] flex border border-white">
                        <div className="w-[40%] ">1</div>
                        <div className="w-[60%] bg-[#1E293B] rounded-r-[10px] border border-white">2</div>
                    </div>
                </div>
                <div className="bg-[#06062C] rounded-[10px]">
                    <div className="w-full px-[35px] py-[5px]">
                        <span className="text-white text-[22px]">Moje kursy</span>
                    </div>
                    <div className="w-full h-[90%] px-[35px] py-[25px] ">
                        
                        {kursy && kursy.length > 0 ? (
                            <div className="w-full h-full flex gap-5">
                                {kursy.map((kurs) => (
                                    <div key={kurs.idkurs} onClick={() => router.get(`/student/mojekursy/${kurs.nazwa}/${kurs.idkurs}`)} className="w-[20%] bg-[#1E293B] rounded-[15px] text-white text-[32px] font-bold border border-white flex items-center justify-center p-4 text-center shkrink hover:cursor-pointer"><span>{kurs.nazwa}</span></div>        
                                ))}
                            </div>
                            
                        
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-[#73768C]">
                                <span>Brak kursów</span>
                            </div>
                        )}

                        
                    </div>
                </div>
                
            </div>
        </div>
    );
}



export default function StudentGlowna({ auth, kursy }) {
    return (
       
        
        <div className="flex">
            <Head title="Strona główna"/>
            <MenuStudenta/>
            <Content kursy={kursy}/>
        </div>
    );
}
