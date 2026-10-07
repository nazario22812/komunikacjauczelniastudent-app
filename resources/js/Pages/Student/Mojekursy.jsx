import React, { useEffect } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, Link, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import Lupa from '@/../images/search-rounded.png';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";

function Content({ mojekursy, wszystkiekursy, listasemestrow, kierunekstudenta }){
    const [pokaz, setpokaz] = useState(false);
    const handleClose = () => setpokaz(false);
    const handleOpen = () => setpokaz(true);
    

    const [znalezionyKurs,setznalezionyKurs] = useState('');
    const [idZnalezionegoKursu, setidZnalezionegoKursu] = useState(null);
    const znajdzKurs = () => {
        const kurs = wszystkiekursy.find((k) => k.kod === znalezionyKurs);
        if(kurs){
            // setidZnalezionegoKursu(kurs.idkurs);
            // console.log(idZnalezionegoKursu);
            router.post(`/student/mojekursy/${kurs.idkurs}`);
        }
        else{
            setidZnalezionegoKursu(null);
            // alert("nie znaleziono kursu");
            toast.error('Nie znaleziono kursu', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    
    
    return (
        
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Moje kursy</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2  px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="w-full h-[8%] flex  text-white">
                    <div className="bg-[#1e293b] w-[30%] max-h-[60%] flex items-center text-white rounded-[10px] overflow-hidden border border-white">

                        <input 
                            type="text" 
                            placeholder="szukaj kurs za kodem" 
                            className="w-full bg-transparent px-4 py-1 text-white placeholder-gray-400 focus:outline-none"
                            value={znalezionyKurs}
                            maxLength={6}
                            minLength={5}
                            onChange={(e) => setznalezionyKurs(e.target.value)}
                        />

                        <div className=" px-3 py-1 flex items-center justify-center cursor-pointer  transition-colors">
                            <img onClick={znajdzKurs} src={Lupa} className="w-[28px] h-[28px] object-contain" alt="wyszukaj" />
                        </div>

                    </div>
                    <div className="w-full text-right"><button variant="primary" onClick={handleOpen} className="hover:cursor-pointer">Lista wszystkich kursów</button></div>    
                </div>

                

                <div className="w-full h-[90%]">   
                    {mojekursy && mojekursy.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2 h-[30%]">
                            {mojekursy.map((kurs) => (
                                <div key={kurs.id} className="bg-[#1e293b] p-5 rounded-[15px] flex flex-col justify-between gap-5 border border-gray-700/50 hover:border-gray-500">
                                    <div>
                                        <h3 className="text-white font-bold text-[20px] leading-light">{kurs.nazwa}</h3>
                                        
                                        <p className="text-gray-400 text-[14px] ">Prowadzący: {kurs.prowadzacy.TytulNaukowy} {kurs.prowadzacy.user.name} {kurs.prowadzacy.user.surname}</p>
                                    </div>

                                    <button className="w-full bg-[#06062c] hover:bg-[#101042] text-white py-2 rounded-[10px] text-center font-medium hover:cursor-pointer">
                                        Otwórz kurs
                                    </button>
                                </div>
                            ))}
                        </div>
                    ):(
                        <div className="w-full flex-1 flex items-center justify-center text-[24px] text-[#73768C]">
                            <span>Nie masz jeszcze kursów</span>
                        </div>
                    )}
                </div>
            </div>  

            {/* panel ktora wyjezdza od prawej strony */}
            {pokaz && (
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={handleClose}>

                </div>
            )}     
            <div className={`fixed top-0 right-0 h-full w-[500px] bg-[#04041D] border-l border-white/20 shadow-2xl z-50 p-6 flex flex-col text-white transition-transform duration-300 ease-in-out ${pokaz ? 'translate-x-0' : 'translate-x-full'}`}>
                
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <h2 className="font-bold text-[20px]">Wszystkie kursy</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white text-[28px] font-bold px-2 leading-none cursor-pointer"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
                    <h1 className="text-[22px] font-semibold">{kierunekstudenta.nazwa}</h1>

                    {wszystkiekursy && wszystkiekursy.length > 0 ? (
                        <div>
                            {/* {listasemestrow.map((semestr) => (
                                <div key={semestr.id} className="pb-2">
                                    <h1 className="text-[18px]">{semestr.Semester} semester</h1>
                                
                                    <div className="flex flex-col gap-1">
                                        {wszystkiekursy.filter((kurs) => kurs.Semester === semestr.Semester).map((kurs)=> (
                                            <div key={kurs.id}>
                                                <Link className="text-[14px] pl-5 text-[#73768c]">{kurs.nazwa}, {kurs.prowadzacy.TytulNaukowy} {kurs.prowadzacy.user.name} {kurs.prowadzacy.user.surname}</Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                            ))} */}
                            {listasemestrow.map((semestr) => {
                                
                                const kursySemestru = wszystkiekursy.filter((kurs) => kurs.Semester === semestr.Semester);
                                const uniqPrqdmioty = Array.from(
                                    new Map(kursySemestru.map(kurs => [kurs.Przedmiot_idPrzedmiot, kurs.przedmiot])).values() 
                                );
                                return (
                                    <div key={semestr.id} className="pb-2">
                                        <h1 className="text-[18px] font-bold">{semestr.Semester} semester</h1>
                                
                                        {uniqPrqdmioty.map((przedmiot) => (
                                            <div key={przedmiot.id} className="mb-3">
                                                <h2 className="text-[15px] text-white">{przedmiot.nazwa}</h2>
                                            
                                            
                                                <div className="flex flex-col gap-1 pl-4 mt-1">
                                                    {kursySemestru.filter((kurs) => kurs.Przedmiot_idPrzedmiot === przedmiot.idPrzedmiot)
                                                    .map((kurs) => (
                                                        <div key={kurs.idKurs}>
                                                            <Link className="text-[14px] pl-5 text-[#73768c] shrink">
                                                                {kurs.nazwa}, {kurs.prowadzacy.TytulNaukowy} {kurs.prowadzacy.user.name} {kurs.prowadzacy.user.surname}
                                                            </Link>
                                                        </div>
                                                    ))}
                            
                                                </div>    
                                            </div>
                                        ))}

                                        
                                    </div>
                                );
                                


                            })}
                        </div>
                    ):(
                        <div className="w-full flex-1 flex items-center justify-center text-[24px] text-[#73768C]">
                            <span>Brak kursów</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
        
    );
}

export default function MojeKursy({ auth, mojekursy, wszystkiekursy,listasemestrow, kierunekstudenta }) {
    const pageProps = usePage().props;
    

    const message = pageProps.status || pageProps.flash?.status;

    useEffect(() => {
        if (message) {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }, [message]);
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Head title="Moje kursy"/>
            <MenuStudenta/>
            <Content mojekursy={mojekursy} wszystkiekursy={wszystkiekursy} listasemestrow={listasemestrow} kierunekstudenta={kierunekstudenta}/>
        </div>
    );
}
