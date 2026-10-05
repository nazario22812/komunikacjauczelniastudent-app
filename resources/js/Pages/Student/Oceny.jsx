import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, useForm, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import Form from 'react-bootstrap/Form';
import { useState } from "react";

function Content({ oceny, semestry, studentsem }){
    const [sem, setsem] = useState(studentsem)
    const filteroceny = oceny.filter(ocena => ocena.Semester === Number(sem))
    return (
        
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Twoje oceny</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#06062c] w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center gap-2.5" > 
                    <span className="text-white font-bold text-[36px] ">Oceny końcowe</span>    
                    <form action="" className="w-[15%]  absolute  right-5">
                        <Form.Select onChange={(e) => {setsem(e.target.value)}} className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[40px]">
                            <option value={studentsem}>Wybierz semester</option>
                            {semestry.map((semester) => (
                                <option key={semester.id} value={semester.Semester}>{semester.Semester}</option>    
                            ))}  
                        </Form.Select>
                    </form>
                </div>
                  
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteroceny && filteroceny.length > 0 ? (
                            
                            <div className="w-full h-[100%]">
                                {filteroceny.map((ocena) => (
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

export default function Oceny({ auth, oceny, semestry, studentsem }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Oceny"/>
            <MenuStudenta/>
            <Content oceny={oceny} semestry={semestry} studentsem={studentsem}/>
        </div>
    );
}
