import React, { useEffect, useState } from "react";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";
import { InputMask, useMask } from "@react-input/mask";
import { ToastContainer, toast } from "react-toastify";

function Content({ przedmioty, kierunki }) {
    const [wybranyPrzedmiot, setwybranyPrzedmiot] = useState("");
    const [wybranyKierunek, setwybranyKierunek] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        nazwa: "",
        kod: "",
        semester: "",
        przedmiot: "",
        kierunek: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirm("Czy na pewno chcesz utworzyć kurs?")) {
            post('/prowadzacy/tworzeniekursu');
        }
    };

    const kodref = useMask({
        mask: "______",
        replacement: { _: /[A-Za-z0-9]/ },
    });

    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full ">
                    Tworzenie kursu
                </span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-slate w-full h-full mx-auto pt-[20px] pb-[10px] px-5 rounded-[15px]   relative overflow-y-auto pr-2 custom-scrollbar    ">
                    <div className="w-full text-center text-theme-text font-bold text-[58px]">
                        <span>Nowy kurs</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="px-[20px] py-[5px] w-full h-[85%] overflow-y-auto pr-2 custom-scrollbar">
                            {/* nazwa, kod, semester, przedmiot, prowadzacy, kierunek */}
                            <div className="w-full grid grid-cols-2">
                                <div className="px-5 grid grid-rows-3 text-theme-muted">
                                    <div className="py-5">
                                        <span>nazwa</span>
                                        <input
                                            type="text"
                                            placeholder="Nazwa kursu"
                                            onChange={(e) =>
                                                setData("nazwa", e.target.value)
                                            }
                                            required
                                            className="w-full bg-theme-surface rounded-[15px] text-[16px] px-3 py-2 text-theme-muted border border-theme-muted"
                                        />
                                    </div>
                                    <div className="py-5">
                                        <span>kod</span>
                                        <input
                                            ref={kodref}
                                            type="text"
                                            placeholder="Kod kursu 6 znaków"
                                            onChange={(e) =>
                                                setData("kod", e.target.value)
                                            }
                                            required
                                            className="w-full bg-theme-surface rounded-[15px] text-[16px] px-3 py-2 text-theme-muted border border-theme-muted"
                                        />
                                    </div>
                                    <div className="py-5">
                                        <span>Semestr</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            placeholder="Semestr"
                                            onChange={(e) =>
                                                setData(
                                                    "semester",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            className="w-full bg-theme-surface rounded-[15px] text-[16px] px-3 py-2 text-theme-muted border border-theme-muted "
                                        />
                                    </div>
                                </div>
                                <div className="px-5 grid grid-rows-3 text-theme-muted">
                                    <div className="py-5">
                                        <span>Kierunek</span>
                                        <Form.Select
                                            required
                                            value={wybranyKierunek}
                                            onChange={(e) => {
                                                setwybranyKierunek(
                                                    e.target.value,
                                                );
                                                setData(
                                                    "kierunek",
                                                    e.target.value,
                                                );
                                            }}
                                            className="w-full bg-theme-surface  border border-theme-muted rounded-[15px] text-theme-text h-[60%]"
                                        >
                                            <option value="">
                                                Wybierz kierunek
                                            </option>
                                            {kierunki.map((kierunek) => (
                                                <option
                                                    key={kierunek.idKierunek}
                                                    value={kierunek.idKierunek}
                                                >
                                                    {kierunek.nazwa}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="py-5">
                                        <span>Przedmiot</span>
                                        <Form.Select
                                            required
                                            value={wybranyPrzedmiot}
                                            onChange={(e) => {
                                                setwybranyPrzedmiot(
                                                    e.target.value,
                                                );
                                                setData(
                                                    "przedmiot",
                                                    e.target.value,
                                                );
                                            }}
                                            className="w-full bg-theme-surface  border border-theme-muted rounded-[15px] text-theme-text h-[60%]"
                                        >
                                            <option value="">
                                                Wybierz przedmiot
                                            </option>
                                            {przedmioty.map((przedmiot) => (
                                                <option
                                                    key={przedmiot.idPrzedmiot}
                                                    value={
                                                        przedmiot.idPrzedmiot
                                                    }
                                                >
                                                    {przedmiot.nazwa}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                            <button
                                disabled={processing}
                                type="submit"
                                className="w-[50%] h-[60px] my-20 text-[32px] block mx-auto text-theme-text bg-theme-orange rounded-[15px] hover:cursor-pointer active:bg-theme-orange"
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

export default function TworzenieKursu({ przedmioty, kierunki }) {
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
        if (error) {
            toast.error(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }, [message, error]);

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
            <Head title="Tworzenie kursu" />
            <MenuProwadzacy />
            <Content przedmioty={przedmioty} kierunki={kierunki} />
        </div>
    );
}
