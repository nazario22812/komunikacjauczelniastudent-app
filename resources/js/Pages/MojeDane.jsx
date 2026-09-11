import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head } from "@inertiajs/react";


function Content({ rol, name, surname, email, numerTelefonu, kontoBankowe, DataUrodzenia, photo, index, 
    semester, stopien, trybStudiow, rok, Specjalnosc, kierunek, wydzial, 
    TytulNaukowy, katedra, Odpowiedzialnosc,
    grupaLaboratoryjna, grupaCwiczeniowa, grupaWykladowa }){
    return(
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            {/* <p className="text-white">{rol}</p> */}

            <div className="bg-[#08083b] w-full shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <span className="font-bold text-[16px] text-white">Moje dane</span>
            </div>

            <div className="bg-[#08083b] w-full h-full flex-1 border-[0.3px] border-white py-10 rounded-b-[10px]">
                <div className="w-3/4 h-full bg-[#1E293B] mx-auto  rounded-[15px] flex">
                    

                    <div className="w-full m-10 text-left">
                        <div className="border-b border-white mb-3">
                            <p className="font-bold text-white text-[26px] w-1/2">{rol}</p>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <p className="font-bold text-white text-[20px] w-1/2">Imie: </p>
                            <p className="w-1/2 text-white text-[16px]">{name}</p>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <p className="font-bold text-white text-[20px] w-1/2">Nazwisko: </p>                    
                            <p className="w-1/2 text-white text-[16px]">{surname}</p>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <p className="font-bold text-white text-[20px] w-1/2">Data urodzenia: </p>
                            <p className="w-1/2 text-white text-[16px]">{DataUrodzenia}</p>

                        </div>
                        <div className="flex gap-5 mb-3">
                            <p className="font-bold text-white text-[20px] w-1/2">Email: </p>
                            <p className="w-1/2 text-white text-[16px]">{email}</p>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <p className="font-bold text-white text-[20px] w-1/2">Numer telefonu: </p>
                            <p className="w-1/2 text-white text-[16px]">{numerTelefonu}</p>

                        </div>
                        <div className="flex gap-5 mb-3 border-b border-white">
                            <p className="font-bold text-white text-[20px] w-1/2">Konto bankowe: </p>
                            <p className="w-1/2 text-white text-[16px]">{kontoBankowe}</p>

                        </div>
                        
                        {rol === 'Student' &&(
                            <div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Wydział: </p>
                                    <p className="w-1/2 text-white text-[12px]">{wydzial}</p>
                                </div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Kierunek: </p>
                                    <p className="w-1/2 text-white text-[12px]">{kierunek}</p>
                                </div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Rok stydiów: </p>
                                    <p className="w-1/2 text-white text-[12px]">{rok}</p>
                                </div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Semestr: </p>
                                    <p className="w-1/2 text-white text-[12px]">{semester}</p>
                                </div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Stopień: </p>
                                    <p className="w-1/2 text-white text-[12px]">{stopien}</p>
                                </div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Tryb studiów: </p>
                                    <p className="w-1/2 text-white text-[12px]">{trybStudiow}</p>
                                </div>
                                
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Numer indeksu: </p>
                                    <p className="w-1/2 text-white text-[12px]">{index}</p>
                                </div>
                                {Specjalnosc != null &&(
                                    <div className="flex gap-5 mb-3 ">
                                        <p className="font-bold text-white text-[14px] w-1/2">Specjalność: </p>
                                        <p className="w-1/2 text-white text-[12px]">{Specjalnosc}</p>
                                    </div>
                                )}

                                {grupaLaboratoryjna != null &&(
                                    <div className="flex gap-5 mb-3 ">
                                        <p className="font-bold text-white text-[14px] w-1/2">Grupa laboratoryjna: </p>
                                        <p className="w-1/2 text-white text-[12px]">{grupaLaboratoryjna}</p>
                                    </div>
                                )}

                                {grupaCwiczeniowa != null &&(
                                   <div className="flex gap-5 mb-3 ">
                                        <p className="font-bold text-white text-[14px] w-1/2">Grupa ćwiczeniowa: </p>
                                        <p className="w-1/2 text-white text-[12px]">{grupaCwiczeniowa}</p>
                                    </div> 
                                )}

                                {grupaWykladowa != null &&(
                                    <div className="flex gap-5 mb-3 ">
                                        <p className="font-bold text-white text-[14px] w-1/2">Grupa wykładowa: </p>
                                        <p className="w-1/2 text-white text-[12px]">{grupaWykladowa}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {rol === 'Prowadzący' &&(
                            <div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Tytuł naukowy: </p>
                                    <p className="w-1/2 text-white text-[12px]">{TytulNaukowy}</p>
                                </div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Katedra: </p>
                                    <p className="w-1/2 text-white text-[12px]">{katedra}</p>
                                </div>
                            </div>
                        )}

                        {rol === 'Pracownik Dziekanatu' && Odpowiedzialnosc != null &&(
                            <div>
                                <div className="flex gap-5 mb-3 ">
                                    <p className="font-bold text-white text-[14px] w-1/2">Odpowiedzialność: </p>
                                    <p className="w-1/2 text-white text-[12px]">{Odpowiedzialnosc}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full mx-auto mt-5">
                        <img src={photo} alt="zdjecie" className="w-90 h-100 mx-auto border-[0.3px] border-white"/>
                        <div className="w-full mx-auto text-center text-white">Zdjęcie użytkownika</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 

export default function MojeDane({ auth, rol, name, surname, email, numerTelefonu, kontoBankowe, DataUrodzenia,
    photo, index, semester, stopien, trybStudiow, rok, Specjalnosc, 
    kierunek, wydzial, TytulNaukowy, katedra, Odpowiedzialnosc,
     grupaLaboratoryjna, grupaCwiczeniowa, grupaWykladowa }) {

    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Moje dane"/>
            <MenuStudenta/>
            
            <Content rol={rol} name={name} surname={surname} email={email} numerTelefonu={numerTelefonu} 
            kontoBankowe={kontoBankowe} DataUrodzenia={DataUrodzenia} photo={photo} 
            index={index} semester={semester} stopien={stopien} trybStudiow={trybStudiow} rok={rok} 
            Specjalnosc={Specjalnosc} kierunek={kierunek} wydzial={wydzial} TytulNaukowy={TytulNaukowy} katedra={katedra} 
            Odpowiedzialnosc={Odpowiedzialnosc} 
            grupaLaboratoryjna={grupaLaboratoryjna} grupaCwiczeniowa={grupaCwiczeniowa} grupaWykladowa={grupaWykladowa} />
        </div>
    );
}
