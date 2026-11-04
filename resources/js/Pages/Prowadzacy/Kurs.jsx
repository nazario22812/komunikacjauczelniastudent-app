import React, { useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MenuProwadzacy from "../../Components/MenuProwadzacy";


function Materialy({materialy}){
    return (
        <table className="w-[100%] h-full">
            <tbody className="w-[100%] overflow-y-auto pr-2 custom-scrollbar">
                    {materialy && materialy.length > 0 ? (
                        <div>
                            {materialy.map((material) => (
                                <tr key={material.id} className="w-full ">
                                    <td className="w-full">
                                        <a href={`/storage/${material.nazwa}`} target="_blank" className="text-[22px] text-theme-muted ">🔗{material.nazwa}, </a>
                                    </td>
                                </tr>
                            ))}
                        </div>
                    ):
                    (
                        <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                            <span>Brak materiałów</span>
                        </div>
                    )}
                    
            </tbody>
        </table>
    );
}

function Sylabusplusliteratura({sylabus, literatura, przedmiot, kurs}){
    return (
        <div className="w-[100%] h-full m-5 overflow-y-auto pr-2 custom-scrollbar text-theme-text">
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">Informacje o przedmiocie</span>
                <div className="bg-theme-slate p-5 rounded-[10px] w-[60%]">
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
                <div className="bg-theme-slate p-5 rounded-[10px] w-[60%]">
                    <p>{sylabus.opisPrzedmiotu}</p>
                </div>
            </div>
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">Warunki zaliczenia</span>
                <div className="bg-theme-slate p-5 rounded-[10px] w-[60%]">
                    <p>{sylabus.warunkiZaliczenia}</p>
                </div>        
            </div>
            <div>
                <span className="font-bold text-[22px]">Literatura</span>
                <div className="bg-theme-slate p-5 rounded-[10px] w-[60%]">
                    {literatura.map((ksiazka) => (
                        <div key={ksiazka.id} className="border-b border-theme-page pb-1">
                            <p className="text-[18px]">{ksiazka.nazwa}</p>
                            <p className="text-[14px] font-thin">{ksiazka.opis}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



function Zadania({ zadania }){
    return(
        
        <div className="overflow-x-auto rounded-[10px] border border-gray-700/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-theme-muted text-[14px]">
                        <th className="p-3 font-medium">Nazwa Zadania</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {zadania && zadania.length > 0 ? (
                        zadania.map((zadanie) => (
                            <tr key={zadanie.id} onClick={() => router.get(`/student/kurs/${zadanie.idZadanie}`)} className="hover:bg-theme-dark-slate/50 transition-colors cursor-pointer">
                                <td  className="p-3 font-medium text-theme-text">{zadanie.nazwaZadania || '—'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-4 text-theme-text text-theme-muted">
                                Brak zadań
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Studenty({studenci}){
    return(
        <div className="overflow-x-auto rounded-[10px] border border-gray-700/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-theme-muted text-[14px]">
                        <th className="p-3 font-medium">Index</th>
                        <th className="p-3 font-medium">Imie i nazwisko</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {studenci && studenci.length > 0 ? (
                        studenci.map((student) => (
                            
                            <tr key={student.idStudent} className="hover:bg-theme-dark-slate/50 transition-colors">
                                <td  className="p-3 font-medium text-theme-text">{student.index}</td>
                                <td  className="p-3 font-medium text-theme-text">{student.user.name || '—'} {student.user.surname || '—'}</td>
                                <td>
                                    <button type="button" onClick={() => router.post(``)} className="shrink-0 text-red-400 hover:text-red-300 hover:cursor-pointer">
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-4 text-theme-text text-theme-muted">
                                Brak studentów 
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Content({ kurs, materialy, sylabus, literatura, przedmiot, zadania, studenci }){
   

    
    return (
        
       <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Kurs</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-surface w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center" > 
                    <div>
                        <span className="text-theme-text font-bold text-[36px] ">{kurs.nazwa}</span><br />
                        <span className="text-theme-text font-thin text-[20px] ">{kurs.prowadzacy.TytulNaukowy} {kurs.prowadzacy.user.name} {kurs.prowadzacy.user.surname}</span>   
                    </div>
                    
                </div>   
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-b-[15px] ">
                    
                    <div className="w-[100%]">
                        <Tabs className="w-full flex flex-col h-full" selectedTabPanelClassName="!block"> 
                            <TabList className="flex border-b border-theme-muted space-x-8 text-theme-text  cursor-pointer list-none text-center">
                                <Tab className="w-full" selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]">Materiały</Tab>
                                <Tab className="w-full" selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]">Zadania</Tab>
                                {/* <Tab className="w-full" selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]">Oceny</Tab> */}
                                <Tab className="w-full" selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]">Dodatkowa informacja</Tab>
                                <Tab className="w-full" selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]">Użytkowniki</Tab>

                            </TabList>

                            <TabPanel className="hidden bg-theme-surface h-[100%] rounded-b-[10px] theme-text p-5">
                                <Materialy materialy={materialy}/>
                            </TabPanel>
                            <TabPanel className="hidden bg-theme-surface h-full rounded-b-[10px]  theme-text">
                                <Zadania zadania={zadania}/>
                            </TabPanel>
                             {/* <TabPanel className="hidden bg-theme-surface h-full rounded-b-[10px]  theme-text">
                                <Oceny oceny={oceny}/>
                            </TabPanel> */}
                             <TabPanel className="hidden bg-theme-surface h-full rounded-b-[10px]  theme-text">
                                <Sylabusplusliteratura sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} kurs={kurs}/>
                            </TabPanel>
                            <TabPanel className="hidden bg-theme-surface h-full rounded-b-[10px]  theme-text">
                                <Studenty studenci={studenci}/>
                            </TabPanel>
                        </Tabs>
                    </div>
                    
                </div> 
            </div>        
        </div>
        
    );
}

export default function MojeKursy({ auth, kurs, materialy, sylabus, literatura, przedmiot, zadania, studenci }) {
    
    return (
        
        <div className="flex">
           
            <Head title="Moje kursy"/>
            <MenuProwadzacy/>
            <Content kurs={kurs} materialy={materialy} sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} zadania={zadania} studenci={studenci}/>
        </div>
    );
}
