import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Form from 'react-bootstrap/Form';



function SiatkaPlanu(){
    
}

function Content(){

    const godziny = [
        '08:'
    ]

    return(
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            {/* <p className="text-white">{rol}</p> */}

            <div className="bg-[#08083b] w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Plan zajęć</span>
            </div>

            <div className="bg-[#08083b] w-full h-full flex border-[0.3px] border-white py-5 px-3 rounded-b-[10px] ">
                <div className="w-[80%] border border-white rounded-l-[10px]">
                    1
                </div>
                <div className="w-[20%] rounded-r-[10px] bg-[#06062c] px-[20px] py-[33px] ">
                    
                    <div className="px-[10px] py-[10px]">
                        <div className="mx-auto w-full text-center text-[16px] text-white">
                            Wybierz grupę
                        </div>
                        <div className="w-full px-[29px] pt-[40px]">
                            <span className="text-[13px] text-white">Kierunek</span>
                            <Form.Select className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]">

                            </Form.Select>
                        </div>
                        <div className="w-full px-[29px] pt-[40px]">
                            <span className="text-[13px] text-white">Grupa</span>
                            <Form.Select className="w-full border border-white rounded-[15px] bg-[#1e293b] text-white h-[22px]">

                            </Form.Select>
                        </div>
                        <div className="w-full mx-auto  h-[28px] px-[18px] my-3 flex items-center mt-10">
                            <button className="text-[13px] mx-auto w-3/4 h-full text-white bg-[#f97316] rounded-[15px] hover:cursor-pointer active:bg-[#c55b11]">
                                Wyszukaj
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default function PlanZajec({ auth }) {
    return (
       
        <div className="flex">
            <Head title="Plan zajęć"/>
            <MenuStudenta/>
            <Content/>
        </div>
    );
}
