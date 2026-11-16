import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";


function Content({ rol, name, surname, email, numerTelefonu, kontoBankowe, DataUrodzenia, photo, index, 
    semester, stopien, trybStudiow, rok, Specjalnosc, kierunek, wydzial, 
    TytulNaukowy, katedra, Odpowiedzialnosc,
    grupaLaboratoryjna, grupaCwiczeniowa, grupaWykladowa }){
    const extraFields = [];

    if (rol === 'Student') {
        extraFields.push(
            { label: 'Wydział', value: wydzial },
            { label: 'Kierunek', value: kierunek },
            { label: 'Rok studiów', value: rok },
            { label: 'Semestr', value: semester },
            { label: 'Stopień', value: stopien },
            { label: 'Tryb studiów', value: trybStudiow },
            { label: 'Numer indeksu', value: index },
            { label: 'Specjalność', value: Specjalnosc },
            { label: 'Grupa laboratoryjna', value: grupaLaboratoryjna },
            { label: 'Grupa ćwiczeniowa', value: grupaCwiczeniowa },
            { label: 'Grupa wykładowa', value: grupaWykladowa },
        );
    }

    if (rol === 'Prowadzący') {
        extraFields.push(
            { label: 'Tytuł naukowy', value: TytulNaukowy },
            { label: 'Katedra', value: katedra },
        );
    }

    if (rol === 'Pracownik Dziekanatu' && Odpowiedzialnosc != null) {
        extraFields.push({ label: 'Odpowiedzialność', value: Odpowiedzialnosc });
    }

    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto items-center text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Moje dane</span>
            </div>

            <div className="bg-theme-panel w-full h-full flex-1 border-[0.3px] border-theme-muted py-6 rounded-b-[10px] md:py-10">
                <div className="mx-auto w-full rounded-[18px] bg-[#0f1d3d] p-4 md:w-[90%] md:p-6 xl:w-[80%]">
                    <div className="mb-6 flex items-center justify-between border-b border-[#304266] pb-4">
                        <p className="text-2xl font-bold text-white md:text-3xl">{rol}</p>
                        <div className="hidden rounded-full border border-[#3b4d7b] bg-[#101d43] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#dfe8ff] md:block">
                            Konto
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1.1fr_1.5fr] md:gap-6">
                        <div className="flex items-center justify-center rounded-[14px] border border-[#304266] bg-[#101d43] p-5">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#7da5ff] bg-[#1a2d56] text-3xl font-bold text-white">
                                {String(name || '?').charAt(0).toUpperCase()}{String(surname || '?').charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="space-y-3 rounded-[14px] border border-[#304266] bg-[#101d43] p-4">
                            <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                                <p className="font-bold text-[#dfe8ff]">Imie:</p>
                                <p className="text-white">{name}</p>
                            </div>
                            <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                                <p className="font-bold text-[#dfe8ff]">Nazwisko:</p>
                                <p className="text-white">{surname}</p>
                            </div>
                            <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                                <p className="font-bold text-[#dfe8ff]">Data urodzenia:</p>
                                <p className="text-white">{DataUrodzenia}</p>
                            </div>
                            <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                                <p className="font-bold text-[#dfe8ff]">Email:</p>
                                <p className="break-all text-white">{email}</p>
                            </div>
                            <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                                <p className="font-bold text-[#dfe8ff]">Numer telefonu:</p>
                                <p className="text-white">{numerTelefonu}</p>
                            </div>
                            <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                                <p className="font-bold text-[#dfe8ff]">Konto bankowe:</p>
                                <p className="break-all text-white">{kontoBankowe}</p>
                            </div>
                        </div>
                    </div>

                    {extraFields.length > 0 && (
                        <div className="mt-6 rounded-[14px] border border-[#304266] bg-[#101d43] p-4">
                            {extraFields
                                .filter((field) => field.value != null && field.value !== '')
                                .map((field) => (
                                    <div key={field.label} className="grid gap-2 py-2 md:grid-cols-[220px_1fr] md:items-center">
                                        <p className="font-bold text-[#dfe8ff]">{field.label}:</p>
                                        <p className="text-white">{field.value}</p>
                                    </div>
                                ))}
                        </div>
                    )}

                    {photo && (
                        <div className="mt-6 flex justify-center">
                            <div className="w-full max-w-[360px] rounded-[14px] border border-[#304266] bg-[#101d43] p-4 text-center">
                                <img src={photo} alt="zdjecie" className="mx-auto h-[220px] w-full max-w-[220px] rounded-[10px] border border-[#304266] object-cover" />
                                <div className="mt-3 text-sm text-[#dfe8ff]">Zdjęcie użytkownika</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 

export default function MojeDane({ auth, rol, name, surname, email, numerTelefonu, kontoBankowe, DataUrodzenia,
    photo, index, semester, stopien, trybStudiow, rok, Specjalnosc, 
    kierunek, wydzial, TytulNaukowy, katedra, Odpowiedzialnosc,
     grupaLaboratoryjna, grupaCwiczeniowa, grupaWykladowa }) {


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
            <Head title="Moje dane"/>
            {menu}            
            <Content rol={rol} name={name} surname={surname} email={email} numerTelefonu={numerTelefonu} 
            kontoBankowe={kontoBankowe} DataUrodzenia={DataUrodzenia} photo={photo} 
            index={index} semester={semester} stopien={stopien} trybStudiow={trybStudiow} rok={rok} 
            Specjalnosc={Specjalnosc} kierunek={kierunek} wydzial={wydzial} TytulNaukowy={TytulNaukowy} katedra={katedra} 
            Odpowiedzialnosc={Odpowiedzialnosc} 
            grupaLaboratoryjna={grupaLaboratoryjna} grupaCwiczeniowa={grupaCwiczeniowa} grupaWykladowa={grupaWykladowa} />
        </div>
    );
}
