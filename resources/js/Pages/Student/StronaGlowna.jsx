import React, {useState} from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";


function Content({ kursy, powiadomienie, wszystkiekursy, zadanie }){
    
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


    return(
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
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
            <div className="bg-theme-panel w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <span className="font-bold text-[16px] text-theme-text w-full">Strona główna</span>
            </div>

            <div className="bg-theme-panel w-full h-full grid grid-rows-2 gap-4 border-[0.3px] border-theme-muted px-[10px] py-[10px]  rounded-b-[10px]">
                <div className="bg-theme-surface rounded-[10px] px-[35px] py-[20px] grid grid-cols-2 gap-3">
                    <div className="rounded-[10px] bg-theme-accent-indigo flex border border-theme-muted">
                        <div className="w-[40%] flex items-center justify-center p-4 text-center shkrink font-bold text-theme-text text-[32px]"><span>Powiadomienia</span></div>
                        <div className="w-[60%] bg-theme-slate px-[20px] py-[20px] rounded-r-[10px] border border-theme-muted ">
                            {powiadomienie ? (
                                <>
                                    <div className="w-full h-[20%] flex items-center justify-center p-4 mb-3 text-center shkrink text-theme-text font-medium text-[20px] bg-theme-lavender rounded-[10px]">
                                        <span>{powiadomienie.temat}</span>
                                    </div>
                                    <div className="w-full h-[75%] text-theme-text text-[18px]  bg-theme-lavender p-2 rounded-[10px]">
                                        <span>{powiadomienie.tresc}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-text">
                                    <span>Brak powiadomień</span>
                                </div>
                            )}
                            
                            
                        </div>
                    </div>
                    <div className="rounded-[10px] bg-theme-accent-indigo flex border border-theme-muted">
                        <div className="w-[40%] flex items-center justify-center p-4 text-center shkrink font-bold text-theme-text text-[32px]"><span>Zadania</span></div>
                        <div className="w-[60%] bg-theme-slate px-[20px] py-[20px] rounded-r-[10px] border border-theme-muted">
                            <div className="w-full h-[25%] flex items-center justify-center p-4 mb-3 text-center shkrink text-theme-text font-medium text-[20px] bg-theme-lavender rounded-[10px]">
                                <div className="bg-theme-slate w-full h-full flex items-center text-theme-text rounded-[10px] overflow-hidden border border-theme-muted">
                                
                                    <input 
                                        type="text" 
                                        placeholder="szukaj kurs za kodem" 
                                        className="w-[70%] bg-transparent px-4 py-1 text-theme-text placeholder-gray-400 focus:outline-none"
                                        value={znalezionyKurs}
                                        maxLength={6}
                                        minLength={5}
                                        onChange={(e) => setznalezionyKurs(e.target.value)}
                                    />
            
                                    <div className="w-[30%] h-full px-2 py-1 bg-theme-orange flex items-center justify-center cursor-pointer  transition-colors">
                                        <span onClick={znajdzKurs}>Wpisz się</span> 
                                    </div>
            
                                </div>
                            </div>
                            <div className="w-full h-[70%] text-theme-text text-[18px]  bg-theme-lavender p-2 rounded-[10px]">
                                {zadanie ? (
                                    <>
                                        <div className="w-full h-[15%] border-b border-theme-muted flex items-center justify-center p-4 mb-1 text-center shkrink text-theme-text font-medium text-[20px] bg-theme-lavender rounded-[10px]">
                                            <span>{zadanie.nazwaZadania}</span>
                                        </div>
                                        <div className="w-full h-[80%] text-theme-text text-[18px]  bg-theme-lavender p-2 rounded-[10px]">
                                            <span>Kurs: {zadanie.kurs.nazwa}</span><br />    
                                            <span>Status: {zadanie.pivot.status}</span><br />
                                            <span>Termin oddania: {zadanie.TerminOddania}</span>
                                        </div>
                                    </>
                                ): (
                                    <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-text">
                                        <span>Brak zadań</span>
                                    </div>
                                )}
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-theme-surface rounded-[10px]">
                    <div className="w-full px-[35px] py-[5px]">
                        <span className="text-theme-text text-[22px]">Moje kursy</span>
                    </div>
                    <div className="w-full h-[90%] px-[35px] py-[25px] ">
                        
                        {kursy && kursy.length > 0 ? (
                            <div className="w-full h-full flex gap-5">
                                {kursy.map((kurs) => (
                                    <div key={kurs.idkurs} onClick={() => router.get(`/student/mojekursy/${kurs.nazwa}/${kurs.idkurs}`)} className="w-[20%] bg-theme-slate rounded-[15px] text-theme-text text-[32px] font-bold border border-theme-muted flex items-center justify-center p-4 text-center shkrink hover:cursor-pointer"><span>{kurs.nazwa}</span></div>        
                                ))}
                            </div>
                            
                        
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                                <span>Brak kursów</span>
                            </div>
                        )}

                        
                    </div>
                </div>
                
            </div>
        </div>
    );
}



export default function StudentGlowna({ auth, kursy, powiadomienie, wszystkiekursy, zadanie }) {
    return (
       
        
        <div className="flex">
            <Head title="Strona główna"/>
            <MenuStudenta/>
            <Content kursy={kursy} powiadomienie={powiadomienie} wszystkiekursy={wszystkiekursy} zadanie={zadanie}/>
        </div>
    );
}
