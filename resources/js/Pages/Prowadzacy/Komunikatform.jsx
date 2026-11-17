
import React, { useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

function Content({ kursy = [], kierunki = [], grupy = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        target_type: "kurs",
        target_id: "",
        tytul: "",
        tresc: "",
    });

    const targetType = data.target_type;

    const handleTypeChange = (type) => {
        setData((previous) => ({
            ...previous,
            target_type: type,
            target_id: "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/prowadzacy/komunikaty", {
            onSuccess: () => reset(),
        });
    };

    const inputClass =
        "h-[50px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface px-4 py-3 text-[16px] text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange";

    const selectClass =
        "h-[50px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface px-3 text-[16px] text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange";

    const targetOptions = [
        { value: "kierunek", label: "Kierunek" },
        { value: "kurs", label: "Kurs" },
        { value: "grupa", label: "Grupa" },
        { value: "student", label: "Student" },
    ];

    const targetLabels = {
        kierunek: "Wybierz kierunek",
        kurs: "Wybierz kurs",
        grupa: "Wybierz grupę",
        student: "Wpisz indeks studenta",
    };

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Nowy komunikat
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] px-3 pb-5 pt-5 sm:px-5 sm:pt-6 md:px-8">
                    <h1 className="mb-6 break-words text-center text-3xl font-bold text-theme-text sm:text-4xl lg:text-[48px]">
                        Nowy komunikat
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto flex w-full min-w-0 max-w-[1000px] flex-col gap-5"
                    >
                        <fieldset className="min-w-0">
                            <legend className="mb-3 text-sm font-medium text-theme-muted">
                                Adresat
                            </legend>

                            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
                                {targetOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex min-h-[40px] min-w-0 cursor-pointer items-center gap-2 rounded-[10px] text-theme-text"
                                    >
                                        <input
                                            type="radio"
                                            name="targetType"
                                            value={option.value}
                                            checked={
                                                targetType === option.value
                                            }
                                            onChange={() =>
                                                handleTypeChange(option.value)
                                            }
                                            className="h-4 w-4 shrink-0 cursor-pointer accent-orange-500"
                                        />

                                        <span className="break-words text-sm sm:text-base">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {errors.target_type && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.target_type}
                                </p>
                            )}
                        </fieldset>

                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                htmlFor="adresat-komunikatu"
                                className="text-sm font-medium text-theme-muted"
                            >
                                {targetLabels[targetType]}
                            </label>

                            {targetType === "student" ? (
                                <input
                                    id="adresat-komunikatu"
                                    type="text"
                                    required
                                    placeholder="Wpisz identyfikator studenta..."
                                    value={data.target_id}
                                    onChange={(e) =>
                                        setData(
                                            "target_id",
                                            e.target.value
                                        )
                                    }
                                    className={inputClass}
                                />
                            ) : (
                                <Form.Select
                                    id="adresat-komunikatu"
                                    required
                                    value={data.target_id}
                                    onChange={(e) =>
                                        setData(
                                            "target_id",
                                            e.target.value
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">
                                        {targetLabels[targetType]}
                                    </option>

                                    {targetType === "kierunek" &&
                                        kierunki.map((k) => (
                                            <option
                                                key={k.idKierunek}
                                                value={k.idKierunek}
                                            >
                                                {k.nazwa}
                                            </option>
                                        ))}

                                    {targetType === "kurs" &&
                                        kursy.map((k) => (
                                            <option
                                                key={k.idkurs}
                                                value={k.idkurs}
                                            >
                                                {k.nazwa}
                                            </option>
                                        ))}

                                    {targetType === "grupa" &&
                                        grupy.map((g) => (
                                            <option
                                                key={g.idGrupaStudenta}
                                                value={g.idGrupaStudenta}
                                            >
                                                {g.nazwaGrupy}
                                            </option>
                                        ))}
                                </Form.Select>
                            )}

                            {errors.target_id && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.target_id}
                                </p>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                htmlFor="temat-komunikatu"
                                className="text-sm font-medium text-theme-muted"
                            >
                                Temat
                            </label>

                            <input
                                id="temat-komunikatu"
                                type="text"
                                required
                                placeholder="Wpisz temat komunikatu..."
                                value={data.tytul}
                                onChange={(e) =>
                                    setData("tytul", e.target.value)
                                }
                                className={inputClass}
                            />

                            {errors.tytul && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.tytul}
                                </p>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                htmlFor="tresc-komunikatu"
                                className="text-sm font-medium text-theme-muted"
                            >
                                Treść komunikatu
                            </label>

                            <textarea
                                id="tresc-komunikatu"
                                required
                                rows={6}
                                placeholder="Wpisz treść wiadomości dla studentów..."
                                value={data.tresc}
                                onChange={(e) =>
                                    setData("tresc", e.target.value)
                                }
                                className="custom-scrollbar min-h-[150px] w-full min-w-0 resize-y rounded-[15px] border border-theme-muted bg-theme-surface p-4 text-[16px] text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange sm:min-h-[180px]"
                            />

                            {errors.tresc && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.tresc}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-theme-orange mx-auto mt-3 flex min-h-[52px] w-full max-w-[420px] cursor-pointer items-center justify-center rounded-[15px] px-4 py-2 text-xl font-bold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-5 sm:min-h-[60px] sm:text-[24px]"
                        >
                            {processing ? "Wysyłanie..." : "Wyślij"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function Komunikatform({
    kursy,
    kierunki,
    grupy,
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

            <Head title="Komunikaty" />

            <MenuProwadzacy />

            <Content
                kursy={kursy}
                kierunki={kierunki}
                grupy={grupy}
            />
        </div>
    );
}
