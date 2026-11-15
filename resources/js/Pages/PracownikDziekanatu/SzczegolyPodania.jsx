import React, { useEffect, useState } from "react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

function Content({ szczegoly, listaplikow, podanie }){
    const [koniec, setkoniec] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        odpowiedz: "",
        selected_status: "" // Тепер сюди записуватиметься статус
    });

    const handleDecision = (status) => {
        setData("selected_status", status);
        setkoniec(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(confirm("Czy na pewno chcesz zapisać zmiany?")){
            post(`/dziekanat/szczegolypodania/${podanie}`, {
                onSuccess: () => setkoniec(false)
            });
        }
    }

    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Szczegóły podania</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative">
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-[15px]">
                
                    <form onSubmit={handleSubmit} className="bg-theme-surface h-full px-[20px] py-[22px] rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="w-full flex items-center">
                            <div className="w-full">
                                <span className="text-theme-muted font-bold text-[20px]">Temat podania</span><br />
                                <span className="font-bold text-theme-text text-[24px]">{szczegoly.temat}</span>
                            </div>
                            
                            <div className="w-full text-right text-theme-text text-[30px] flex justify-end items-center gap-2">
                                <button 
                                    onClick={() => handleDecision('Przyjęto')} 
                                    type="button" 
                                    className={`p-2 rounded-[10px] font-medium text-base hover:cursor-pointer border transition ${
                                        data.selected_status === 'Przyjęto' ? 'bg-green-700 border-white ring-2 ring-white' : 'bg-green-600 border-transparent'
                                    }`}
                                >
                                    Zaakceptuj
                                </button>
                                
                                <button 
                                    onClick={() => handleDecision('Odrzucono')} 
                                    type="button" 
                                    className={`p-2 rounded-[10px] font-medium text-base hover:cursor-pointer border transition ${
                                        data.selected_status === 'Odrzucono' ? 'bg-red-700 border-white ring-2 ring-white' : 'bg-red-600 border-transparent'
                                    }`}
                                >
                                    Odrzuć
                                </button>

                                <button 
                                    hidden={!koniec} 
                                    disabled={processing}
                                    type="submit" 
                                    className="p-2 font-bold bg-theme-orange text-white rounded-[10px] hover:cursor-pointer text-base disabled:opacity-50"
                                >
                                    Zapisz decyzję ✓
                                </button>
                            </div>
                        </div>

                        
                        {errors.selected_status && (
                            <div className="mt-4 text-red-500 font-bold text-sm">
                                {errors.selected_status}
                            </div>
                        )}

                        <div className="mt-10 w-full">
                            <span className="text-theme-muted font-bold text-[20px]">Autor podania: </span>
                            <span className="text-white text-[18px]">{szczegoly.user.name} {szczegoly.user.surname}</span>
                        </div>
                        <div className="mt-1 w-full">
                            <span className="text-theme-muted font-bold text-[20px]">Data złożenia: </span>
                            <span className="text-white text-[18px]">{szczegoly.data}</span>                            
                        </div>
                        <div className="mt-5 w-full border border-theme-muted p-5 rounded-[10px]">
                            <span className="text-theme-muted font-bold text-[20px]">Treść podania</span><br />
                            <span className="font-bold text-theme-text text-[24px]">{szczegoly.tresc}</span>                           
                        </div>

                        <div className="mt-5 w-full border border-theme-muted p-5 rounded-[10px]">
                            <span className="text-theme-muted font-bold text-[20px]">Odpowiedź / Uzasadnienie</span><br />
                            <input 
                                required 
                                type="text" 
                                value={data.odpowiedz}
                                onChange={(e) => setData("odpowiedz", e.target.value)} 
                                placeholder="Np. podanie zostało przyjęte" 
                                className="w-full p-3 font-bold text-theme-text text-[24px] bg-theme-page rounded border border-theme-border"
                            />
                        </div>

                        <div className="mt-5 w-full border border-theme-muted p-5 rounded-[10px]">
                            <span className="text-theme-muted font-bold text-[20px]">Załączniki</span><br />
                            {listaplikow.length > 0 ? (
                                listaplikow.map((plik, index) => (
                                    <div key={index} className="mt-2">
                                        <a href={`/storage/${plik.nazwa}`} target="_blank" rel="noreferrer" className="text-[17px] text-blue-400 hover:underline">
                                            🔗 {plik.nazwa.split('/').pop()}
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <span className="text-theme-muted text-[16px]">Brak załączników</span>
                            )}
                        </div>
                    </form>
                </div>
            </div>        
        </div>
    );
}

export default function SzczegolyPodania({ auth, szczegoly, listaplikow, podanie }) {
    const props = usePage().props;
        
    const message = props.flash?.status || props.status;
    useEffect(() => {
        if (message) {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
                              
            });
        }
        
    }, [message])
    return (
      
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
            <Head title="Szczegóły podania"/>
            <MenuDziekanat/>
            <Content szczegoly={szczegoly} listaplikow={listaplikow} podanie={podanie}/>
        </div>
    );
}