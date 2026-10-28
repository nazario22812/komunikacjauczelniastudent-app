import React, { useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";


function Rezerwacjerow({ rezerwacja }){
    return(
        <>
            <tr className="text-theme-text font-bold h-[40px] text-left text-[24px] hover:bg-theme-slate-2">
                <td className="py-[20px]">{rezerwacja.GodzinaRozpoczecia}-{rezerwacja.GodzinaZakonczenia}</td>
                <td className="py-[20px]">{rezerwacja.nazwa}</td>
                <td className="py-[20px]">{rezerwacja.numerSali}</td>
                <td className="py-[20px]">{rezerwacja.data}</td>
                <td className="py-[20px]">{rezerwacja.statusRezerwacji}</td>
                <td className="py-[20px]">{rezerwacja.typWydarzenia}</td>
                <td className="text-center  font-semibold"><p onClick={() => router.post(`/prowadzacy/rezerwacja/usun/${rezerwacja.idRezerwacja}`)} className="bg-theme-orange rounded-[10px] p-2 hover:cursor-pointer"> usuń </p></td>
            </tr>
        </>
    );
}

function Content({ rezerwowanesale }){
    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Moje rezerwacje</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-surface w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center" > 
                    <Link href="/prowadzacy/zarezerwujsale" method="get" as="button" className="text-theme-text font-bold text-[36px] hover:cursor-pointer">Zarezerwuj salę</Link>    
                </div>   
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    {rezerwowanesale && rezerwowanesale.length > 0 ? (
                            <table className="w-full ">
                                <thead>
                                    <tr className="h-[52px] text-theme-muted text-[24px] border-b border-theme-muted px-[61px] py-[10px] text-left ">
                                        <th className="py-[10px]">Czas</th>
                                        <th className="py-[10px]">Budynek</th>
                                        <th className="py-[10px]">Sala</th>
                                        <th className="py-[10px]">Data</th>
                                        <th className="py-[10px]">Status</th>
                                        <th className="py-[10px]">Typ</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-theme-muted ">
                                    {rezerwowanesale.map((rezerwacja) => (
                                        <Rezerwacjerow key={rezerwacja.id} rezerwacja={rezerwacja}/>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <div className="w-full mx-auto text-center mt-10 text-[24px] text-theme-muted">
                                <span>Brak konsultacji</span>
                            </div>
                        )}
                </div> 
            </div>        
        </div>
    )
}


export default function Rezerwacje({ rezerwowanesale }){

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

    return(

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
            <Head title="Rezerwacje"/>
            <MenuProwadzacy/>
            <Content rezerwowanesale={rezerwowanesale}/>
        </div>
    );

    
}