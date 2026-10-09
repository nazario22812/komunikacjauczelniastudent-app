import React, { useEffect } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, Link, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


function Materialy({materialy}){
    return (
        <table className="w-[100%] h-full">
            <tbody className="w-[100%] overflow-y-auto pr-2 custom-scrollbar">
                    {materialy.map((material) => (
                        <tr key={material.id} className="w-full ">
                            <td className="w-full">
                                <a href={`/storage/${material.nazwa}`} target="_blank" className="text-[22px] text-[#73768C] ">🔗{material.nazwa}, </a>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
}

function Sylabusplusliteratura({sylabus, literatura, przedmiot, kurs}){
    return (
        <div className="w-[100%] h-full m-5 overflow-y-auto pr-2 custom-scrollbar">
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">Informacje o przedmiocie</span>
                <div className="bg-[#1e293b] p-5 rounded-[10px] w-[60%]">
                    <p>Przedmiot: {przedmiot.nazwa}</p>
                    <p>Semester: {kurs.Semester}</p>
                    <p>ECTS: {przedmiot.punktyECTS}</p>
                    <p>Liczba godzin: {sylabus.iloscGodzin}</p>
                    {sylabus.czyEgzamin === 1 ? (
                        <p>Egzamin: Tak</p>
                    ):(
                        <p>Egzamin: Nie</p>
                    )}
                </div>
            </div>
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">Opis przedmiotu</span>
                <div className="bg-[#1e293b] p-5 rounded-[10px] w-[60%]">
                    <p>{sylabus.opisPrzedmiotu}</p>
                </div>
            </div>
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">Warunki zaliczenia</span>
                <div className="bg-[#1e293b] p-5 rounded-[10px] w-[60%]">
                    <p>{sylabus.warunkiZaliczenia}</p>
                </div>        
            </div>
            <div>
                <span className="font-bold text-[22px]">Literatura</span>
                <div className="bg-[#1e293b] p-5 rounded-[10px] w-[60%]">
                    {literatura.map((ksiazka) => (
                        <div key={ksiazka.id} className="border-b border-b-[#04041D] pb-1">
                            <p className="text-[18px]">{ksiazka.nazwa}</p>
                            <p className="text-[14px] font-thin">{ksiazka.opis}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Oceny({oceny}){
    return(
        <div className="overflow-x-auto rounded-[10px] border border-gray-700/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-[#73768C] text-[14px]">
                        <th className="p-3 font-medium">Nazwa Zadania</th>
                        <th className="p-3 font-medium">Ocena</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {oceny && oceny.length > 0 ? (
                        oceny.map((ocena) => (
                            <tr key={ocena.id} className="hover:bg-[#1e293b]/50 transition-colors">
                                <td className="p-3 font-medium text-white">{ocena.nazwaZadania || '—'}</td>
                                <td className="p-3 font-bold text-white">{ocena.skalaOceny}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-4 text-center text-gray-400">
                                Brak ocen
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


function Zadania({ zadania }){
    return(
        // <lu>
        //     {zadania.map((zadanie) => (
        //         <li key={zadanie.id}>
        //             {zadanie.nazwaZadania}
        //         </li>
        //     ))}
        // </lu>
        <div className="overflow-x-auto rounded-[10px] border border-gray-700/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-[#73768C] text-[14px]">
                        <th className="p-3 font-medium">Nazwa Zadania</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {zadania && zadania.length > 0 ? (
                        zadania.map((zadanie) => (
                            <tr key={zadanie.id} className="hover:bg-[#1e293b]/50 transition-colors">
                                <td className="p-3 font-medium text-white">{zadanie.nazwaZadania || '—'}</td>
                                {/* <td className="p-3 font-bold text-white">{ocena.skalaOceny}</td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-4 text-center text-gray-400">
                                Brak zadań
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Content({ kurs, materialy, sylabus, literatura, przedmiot, oceny, zadania }){
   

    
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
                <div className="bg-[#1e293b] w-full h-full mx-auto p-5 rounded-b-[15px] ">
                    
                    <div className="w-[100%]">
                        <Tabs className="w-full flex flex-col h-full" selectedTabPanelClassName="!block"> 
                            <TabList className="flex border-b border-white space-x-8 text-white  cursor-pointer list-none text-center">
                                <Tab className="w-full" selectedClassName="!border-0 !bg-[#06062c] !rounded-t-[10px]">Materiały</Tab>
                                <Tab className="w-full" selectedClassName="!border-0 !bg-[#06062c] !rounded-t-[10px]">Zadania</Tab>
                                <Tab className="w-full" selectedClassName="!border-0 !bg-[#06062c] !rounded-t-[10px]">Oceny</Tab>
                                <Tab className="w-full" selectedClassName="!border-0 !bg-[#06062c] !rounded-t-[10px]">Dodatkowa informacja</Tab>
                            </TabList>

                            <TabPanel className="hidden bg-[#06062c] h-[100%] rounded-b-[10px] text-white p-5">
                                <Materialy materialy={materialy}/>
                            </TabPanel>
                            <TabPanel className="hidden bg-[#06062c] h-full rounded-b-[10px]  text-white">
                                <Zadania zadania={zadania}/>
                            </TabPanel>
                             <TabPanel className="hidden bg-[#06062c] h-full rounded-b-[10px]  text-white">
                                <Oceny oceny={oceny}/>
                            </TabPanel>
                             <TabPanel className="hidden bg-[#06062c] h-full rounded-b-[10px]  text-white">
                                <Sylabusplusliteratura sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} kurs={kurs}/>
                            </TabPanel>
                        </Tabs>
                    </div>
                    
                </div> 
            </div>        
        </div>
        
    );
}

export default function MojeKursy({ auth, kurs, materialy, sylabus, literatura, przedmiot, oceny, zadania }) {
    
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
           
            <Head title="Moje kursy"/>
            <MenuStudenta/>
            <Content kurs={kurs} materialy={materialy} sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} oceny={oceny} zadania={zadania}/>
        </div>
    );
}
