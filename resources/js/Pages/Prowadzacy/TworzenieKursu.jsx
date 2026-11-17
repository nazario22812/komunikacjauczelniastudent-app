
import React, { useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";
import { useMask } from "@react-input/mask";
import { ToastContainer, toast } from "react-toastify";

function Content({ przedmioty = [], kierunki = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nazwa: "",
        kod: "",
        semester: "",
        przedmiot: "",
        kierunek: "",
    });

    const kodref = useMask({
        mask: "______",
        replacement: { _: /[A-Za-z0-9]/ },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (window.confirm("Czy na pewno chcesz utworzyć kurs?")) {
            post("/prowadzacy/tworzeniekursu");
        }
    };

    const inputClass =
        "h-[46px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface px-3 py-2 text-[16px] text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange";

    const selectClass =
        "h-[46px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface px-3 text-[16px] text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange";

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Tworzenie kursu
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] px-3 pb-5 pt-5 sm:px-5 sm:pt-6 md:px-8">
                    <h1 className="mb-6 break-words text-center text-3xl font-bold text-theme-text sm:text-4xl lg:text-[58px]">
                        Nowy kurs
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto w-full min-w-0 max-w-[1100px]"
                    >
                        <div className="grid min-w-0 grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 lg:gap-x-12">
                            <div className="flex min-w-0 flex-col gap-5">
                                <div className="min-w-0">
                                    <label
                                        htmlFor="nazwa-kursu"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Nazwa
                                    </label>

                                    <input
                                        id="nazwa-kursu"
                                        type="text"
                                        placeholder="Nazwa kursu"
                                        value={data.nazwa}
                                        onChange={(e) =>
                                            setData("nazwa", e.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />

                                    {errors.nazwa && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.nazwa}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="kod-kursu"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Kod
                                    </label>

                                    <input
                                        id="kod-kursu"
                                        ref={kodref}
                                        type="text"
                                        placeholder="Kod kursu 6 znaków"
                                        value={data.kod}
                                        onChange={(e) =>
                                            setData("kod", e.target.value)
                                        }
                                        minLength={6}
                                        maxLength={6}
                                        required
                                        className={inputClass}
                                    />

                                    {errors.kod && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.kod}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="semestr-kursu"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Semestr
                                    </label>

                                    <input
                                        id="semestr-kursu"
                                        type="number"
                                        min={1}
                                        max={10}
                                        placeholder="Semestr"
                                        value={data.semester}
                                        onChange={(e) =>
                                            setData(
                                                "semester",
                                                e.target.value
                                            )
                                        }
                                        required
                                        className={inputClass}
                                    />

                                    {errors.semester && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.semester}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col gap-5">
                                <div className="min-w-0">
                                    <label
                                        htmlFor="kierunek-kursu"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Kierunek
                                    </label>

                                    <Form.Select
                                        id="kierunek-kursu"
                                        required
                                        value={data.kierunek}
                                        onChange={(e) =>
                                            setData(
                                                "kierunek",
                                                e.target.value
                                            )
                                        }
                                        className={selectClass}
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

                                    {errors.kierunek && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.kierunek}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="przedmiot-kursu"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Przedmiot
                                    </label>

                                    <Form.Select
                                        id="przedmiot-kursu"
                                        required
                                        value={data.przedmiot}
                                        onChange={(e) =>
                                            setData(
                                                "przedmiot",
                                                e.target.value
                                            )
                                        }
                                        className={selectClass}
                                    >
                                        <option value="">
                                            Wybierz przedmiot
                                        </option>

                                        {przedmioty.map((przedmiot) => (
                                            <option
                                                key={przedmiot.idPrzedmiot}
                                                value={przedmiot.idPrzedmiot}
                                            >
                                                {przedmiot.nazwa}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    {errors.przedmiot && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.przedmiot}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={processing}
                            type="submit"
                            className="bg-theme-orange mx-auto mt-8 block h-[52px] w-full max-w-[420px] cursor-pointer rounded-[15px] px-4 text-xl font-bold text-theme-text transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-12 sm:h-[60px] sm:text-[28px]"
                        >
                            {processing ? "Wysyłanie..." : "Wyślij"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function TworzenieKursu({
    przedmioty,
    kierunki,
}) {
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
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
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

            <Content
                przedmioty={przedmioty}
                kierunki={kierunki}
            />
        </div>
    );
}
