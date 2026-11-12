import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

function Content({ kursy, kierunki, grupy }) {
    const [targetType, setTargetType] = useState("kurs");

    const { data, setData, post, processing, errors, reset } = useForm({
        target_type: "kurs",
        target_id: "",
        tytul: "",
        tresc: "",
    });

    const handleTypeChange = (type) => {
        setTargetType(type);
        setData({
            ...data,
            target_type: type,
            target_id: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/prowadzacy/komunikaty', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full ">
                    Nowy komunikat
                </span>
            </div>
            <div className="w-full flex-1 h-[80%] pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-slate w-full h-full mx-auto pt-[20px] pb-[10px] px-5 rounded-[15px] relative overflow-y-auto pr-2 custom-scrollbar">
                    <div className="w-full text-center text-theme-text font-bold text-[48px] mb-4">
                        <span>Nowy komunikat</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="px-[20px] py-[5px] w-full h-full overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-5">
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-theme-muted text-[14px]">Adresat</label>
                                <div className="flex flex-wrap gap-6 items-center">
                                    <label className="flex items-center gap-2 text-theme-text cursor-pointer">
                                        <input
                                            type="radio"
                                            name="targetType"
                                            checked={targetType === "kierunek"}
                                            onChange={() => handleTypeChange("kierunek")}
                                            className="accent-theme-orange"
                                        />
                                        Kierunek
                                    </label>
                                    <label className="flex items-center gap-2 text-theme-text cursor-pointer">
                                        <input
                                            type="radio"
                                            name="targetType"
                                            checked={targetType === "kurs"}
                                            onChange={() => handleTypeChange("kurs")}
                                            className="accent-theme-orange"
                                        />
                                        Kurs
                                    </label>
                                    <label className="flex items-center gap-2 text-theme-text cursor-pointer">
                                        <input
                                            type="radio"
                                            name="targetType"
                                            checked={targetType === "grupa"}
                                            onChange={() => handleTypeChange("grupa")}
                                            className="accent-theme-orange"
                                        />
                                        Grupa
                                    </label>
                                    <label className="flex items-center gap-2 text-theme-text cursor-pointer">
                                        <input
                                            type="radio"
                                            name="targetType"
                                            checked={targetType === "student"}
                                            onChange={() => handleTypeChange("student")}
                                            className="accent-theme-orange"
                                        />
                                        Student
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-theme-muted text-[14px]">
                                    {targetType === "kierunek" && "Wybierz kierunek"}
                                    {targetType === "kurs" && "Wybierz kurs"}
                                    {targetType === "grupa" && "Wybierz grupę"}
                                    {targetType === "student" && "Wpisz indeks studenta"}
                                </label>

                                {targetType === "student" ? (
                                    <input
                                        type="text"
                                        required
                                        placeholder="Wpisz identyfikator studenta..."
                                        value={data.target_id}
                                        onChange={(e) => setData("target_id", e.target.value)}
                                        className="w-full bg-theme-surface rounded-[15px] text-[16px] px-4 py-3 text-theme-text border border-theme-muted focus:outline-none h-[50px]"
                                    />
                                ) : (
                                    <Form.Select
                                        required
                                        value={data.target_id}
                                        onChange={(e) => setData("target_id", e.target.value)}
                                        className="w-full bg-theme-surface border border-theme-muted rounded-[15px] text-theme-text p-3 h-[50px]"
                                    >
                                        <option value="">
                                            {targetType === "kierunek" && "Wybierz kierunek"}
                                            {targetType === "kurs" && "Wybierz kurs"}
                                            {targetType === "grupa" && "Wybierz grupę"}
                                        </option>
                                        {targetType === "kierunek" &&
                                            kierunki?.map((k) => (
                                                <option key={k.idKierunek} value={k.idKierunek}>
                                                    {k.nazwa}
                                                </option>
                                            ))}
                                        {targetType === "kurs" &&
                                            kursy?.map((k) => (
                                                <option key={k.idkurs} value={k.idkurs}>
                                                    {k.nazwa}
                                                </option>
                                            ))}
                                        {targetType === "grupa" && 
                                            grupy?.map((g) => (
                                                <option key={g.idGrupaStudenta} value={g.idGrupaStudenta}>
                                                    {g.nazwaGrupy}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                )}
                                
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-theme-muted text-[14px]">Temat</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Wpisz temat komunikatu..."
                                    value={data.tytul}
                                    onChange={(e) => setData("tytul", e.target.value)}
                                    className="w-full bg-theme-surface rounded-[15px] text-[16px] px-4 py-3 text-theme-text border border-theme-muted focus:outline-none"
                                />
                                
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-theme-muted text-[14px]">Treść komunikatu</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Wpisz treść wiadomości dla studentów..."
                                    value={data.tresc}
                                    onChange={(e) => setData("tresc", e.target.value)}
                                    className="w-full bg-theme-surface rounded-[15px] text-[16px] p-4 text-theme-text border border-theme-muted focus:outline-none custom-scrollbar"
                                />
                               
                            </div>

                            <button
                                disabled={processing}
                                type="submit"
                                className="w-[50%] h-[60px] my-5 text-[24px] block mx-auto text-theme-text bg-theme-orange rounded-[15px] hover:cursor-pointer active:bg-theme-orange"
                            >
                                Wyślij
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function Komunikatform({ kursy, kierunki, grupy }) {
    const props = usePage().props;
    
    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;
    useEffect(() => {
        if (message) {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
                          
            });
        }
        if(error) {
            toast.error(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark"
            })
        }
    }, [message, error])
    
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
            <Head title="Komunikaty" />
            <MenuProwadzacy /> 
            <Content kursy={kursy} kierunki={kierunki} grupy={grupy}/>          
        </div>
    );
}