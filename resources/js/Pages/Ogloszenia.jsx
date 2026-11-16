import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head, Link } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import Carousel from "react-bootstrap/Carousel";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

function Content({ ogloszenia, ankiety }){
    return (
        <div className="bg-theme-page w-full min-h-screen p-[10px] flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Ogłoszenia i ankiety</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 sm:px-4 rounded-b-[10px] flex flex-col relative">
                <div className="bg-theme-slate w-full h-full mx-auto p-3 sm:p-5 rounded-[15px]">
                    <div className="bg-theme-surface w-full min-h-[260px] mt-2 rounded-[15px] flex flex-col overflow-hidden p-4 sm:px-[37px] sm:py-[22px]">
                        <span className="text-theme-text font-bold text-[clamp(1.2rem,2vw,1.8rem)] shrink-0 mb-4">Ogłoszenia</span>

                        {ogloszenia && ogloszenia.length > 0 ? (
                            <div className="flex min-w-0 gap-4 overflow-x-auto pb-2 pt-2 custom-scrollbar">
                                {ogloszenia.map((ogloszenie) => (
                                    <div key={ogloszenie.id} className="bg-theme-slate w-[min(250px,78vw)] shrink-0 rounded-[15px] px-4 py-5 text-center flex flex-col gap-2 sm:px-5">
                                        <span className="text-theme-text font-bold text-[clamp(1rem,1.5vw,1.35rem)] leading-tight">{ogloszenie.temat}</span>
                                        <p className="text-theme-text text-[clamp(0.82rem,1vw+0.5rem,1rem)] break-words">{ogloszenie.tresc}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full flex-1 flex items-center justify-center text-[clamp(1rem,1.2vw+0.8rem,1.6rem)] text-theme-muted">
                                <span>Brak ogłoszeń</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-theme-surface mt-5 rounded-[15px] overflow-y-auto p-4 pr-2 custom-scrollbar sm:px-[37px] sm:py-[22px]">
                        <span className="text-theme-text font-bold text-[clamp(1.2rem,2vw,1.8rem)]">Ankiety</span>
                        {ankiety && ankiety.length > 0 ? (
                            <div className="w-full pt-4">
                                {ankiety.map((ankieta) => (
                                    <Link href={ankieta.link} key={ankieta.id} className="flex gap-3 pb-3 text-left">
                                        <div className="text-[clamp(1.5rem,2vw,2.2rem)] leading-none">🗳️</div>
                                        <div className="min-w-0">
                                            <span className="block text-theme-text text-[clamp(1rem,1.5vw,1.35rem)] font-bold break-words">{ankieta.temat}</span>
                                            <span className="block text-theme-text text-[clamp(0.8rem,1vw+0.5rem,1rem)] break-words">{ankieta.opis}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full mx-auto text-center mt-10 text-[clamp(1rem,1.2vw+0.8rem,1.6rem)] text-theme-muted">
                                <span>Brak ankiet</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Ogłoszenia({ auth, ogloszenia, ankiety, rol }) {
    let menu;
    if (rol === 'Student'){
        menu = <MenuStudenta/>
    }
    if (rol === 'Prowadzący'){
        menu = <MenuProwadzacy/>
    }
    if (rol === 'Pracownik Dziekanatu'){
        menu = <MenuDziekanat/>
    }
    return (
        
        <div className="flex">
            <Head title="Ogłoszenia i ankiety"/>
            {menu}
            <Content ogloszenia={ogloszenia} ankiety={ankiety}/>
        </div>
    );
}
