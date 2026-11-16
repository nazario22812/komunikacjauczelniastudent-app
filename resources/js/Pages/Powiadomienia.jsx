import React, { useEffect } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

function Powiadomienierow({ powiadomienie }){
    return(
        <tr className="h-[40px] text-left font-bold text-theme-text hover:bg-theme-panel hover:cursor-pointer">
            <td className="py-[20px] text-[clamp(0.85rem,1vw+0.5rem,1.2rem)] break-words">{powiadomienie.temat}</td>
            <td className="py-[20px] text-[clamp(0.8rem,1vw+0.45rem,1.15rem)] break-words">{powiadomienie.tresc}</td>
        </tr>
    );
}

function Content({ powiadomienia }){
    return (
        <div className="bg-theme-page w-full min-h-screen p-[10px] flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Powiadomienia</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 sm:px-4 rounded-b-[10px] flex flex-col relative">
                <div className="bg-theme-slate w-full h-full mx-auto p-3 sm:p-5 rounded-[15px]">
                    <div className="bg-theme-surface h-full rounded-[15px] overflow-y-auto p-4 pr-2 custom-scrollbar sm:px-[37px] sm:py-[22px]">
                        <span className="text-theme-text font-bold text-[clamp(1.5rem,2.2vw+0.8rem,2.5rem)]">Historia Powiadomień</span>
                        {powiadomienia && powiadomienia.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[520px]">
                                    <thead>
                                        <tr className="h-[52px] border-b border-theme-muted px-[61px] py-[10px] text-left text-[clamp(0.85rem,1vw+0.55rem,1.3rem)] text-theme-muted">
                                            <th className="py-[10px] w-[60%]">Temat</th>
                                            <th className="py-[10px]">Treść</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-theme-muted w-full">
                                        {powiadomienia.map((powiadomienie) => (
                                            <Powiadomienierow key={powiadomienie.id} powiadomienie={powiadomienie}/>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="w-full mx-auto text-center mt-10 text-[clamp(1rem,1.2vw+0.8rem,1.6rem)] text-theme-muted">
                                <span>Brak powiadomień</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default function Powiadomienia({ auth, powiadomienia, rol }) {
    
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
            <Head title="Powiadomienia"/>
            {menu}
            <Content powiadomienia={powiadomienia}/>
        </div>
    );
}
