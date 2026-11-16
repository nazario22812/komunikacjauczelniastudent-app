
import React, { useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

function Content({ budynki = [], sali = [], zajecia = [] }) {
    const [zaznaczonyCheck, setzaznaczonyCheck] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        data: "",
        godpocz: "",
        godkon: "",
        budynek: "",
        sala: "",
        typ: "",
        zajecie: null,
    });

    const filtersal = (sali ?? []).filter(
        (s) =>
            String(s.Budynek_idBudynek) === String(data.budynek)
    );

    const handleBudynekChange = (e) => {
        const nowyBudynek = e.target.value;

        setData((previous) => ({
            ...previous,
            budynek: nowyBudynek,
            sala: "",
        }));
    };

    const handleCheckChange = (e) => {
        const checked = e.target.checked;

        setzaznaczonyCheck(checked);

        if (!checked) {
            setData("zajecie", null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/prowadzacy/tworzenierezerwacji");
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
                    Rezerwacja
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] px-3 pb-5 pt-5 sm:px-5 sm:pt-6 md:px-8 lg:px-[75px] lg:pt-[35px]">
                    <h1 className="mb-6 break-words text-center text-3xl font-bold text-theme-text sm:text-4xl lg:text-[58px]">
                        Nowa rezerwacja
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto w-full min-w-0 max-w-[1200px]"
                    >
                        <div className="grid min-w-0 grid-cols-1 gap-x-8 gap-y-5 border-b border-theme-muted pb-6 md:grid-cols-2 lg:gap-x-12">
                            <div className="flex min-w-0 flex-col gap-5">
                                <div className="min-w-0">
                                    <label
                                        htmlFor="data-rezerwacji"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Data
                                    </label>

                                    <input
                                        id="data-rezerwacji"
                                        type="date"
                                        value={data.data}
                                        onChange={(e) =>
                                            setData("data", e.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />

                                    {errors.data && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.data}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="godzina-poczatek"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Godzina rozpoczęcia
                                    </label>

                                    <input
                                        id="godzina-poczatek"
                                        type="time"
                                        value={data.godpocz}
                                        onChange={(e) =>
                                            setData("godpocz", e.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />

                                    {errors.godpocz && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.godpocz}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="godzina-koniec"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Godzina zakończenia
                                    </label>

                                    <input
                                        id="godzina-koniec"
                                        type="time"
                                        value={data.godkon}
                                        min={data.godpocz || undefined}
                                        onChange={(e) =>
                                            setData("godkon", e.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />

                                    {errors.godkon && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.godkon}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col gap-5">
                                <div className="min-w-0">
                                    <label
                                        htmlFor="budynek-rezerwacji"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Budynek
                                    </label>

                                    <Form.Select
                                        id="budynek-rezerwacji"
                                        required
                                        value={data.budynek}
                                        onChange={handleBudynekChange}
                                        className={selectClass}
                                    >
                                        <option value="">
                                            Wybierz budynek
                                        </option>

                                        {budynki.map((budynek) => (
                                            <option
                                                key={budynek.idBudynek}
                                                value={budynek.idBudynek}
                                            >
                                                {budynek.nazwa}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    {errors.budynek && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.budynek}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="sala-rezerwacji"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Sala
                                    </label>

                                    <Form.Select
                                        id="sala-rezerwacji"
                                        required
                                        value={data.sala}
                                        onChange={(e) =>
                                            setData("sala", e.target.value)
                                        }
                                        disabled={!data.budynek}
                                        className={selectClass}
                                    >
                                        <option value="">
                                            Wybierz salę
                                        </option>

                                        {filtersal.map((sala) => (
                                            <option
                                                key={sala.idSala}
                                                value={sala.idSala}
                                            >
                                                {sala.numerSali}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    {errors.sala && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.sala}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="typ-rezerwacji"
                                        className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                    >
                                        Typ
                                    </label>

                                    <Form.Select
                                        id="typ-rezerwacji"
                                        required
                                        value={data.typ}
                                        onChange={(e) =>
                                            setData("typ", e.target.value)
                                        }
                                        className={selectClass}
                                    >
                                        <option value="">
                                            Wybierz typ rezerwacji
                                        </option>

                                        <option value="Egzamin">
                                            Egzamin
                                        </option>

                                        <option value="Zaliczenie">
                                            Zaliczenie
                                        </option>

                                        <option value="Odrabianie">
                                            Odrabianie
                                        </option>

                                        <option value="Poprawa">
                                            Poprawa
                                        </option>

                                        <option value="Inne">
                                            Inne
                                        </option>
                                    </Form.Select>

                                    {errors.typ && (
                                        <p className="mt-1 text-sm text-theme-red">
                                            {errors.typ}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 min-w-0">
                            <label className="flex cursor-pointer items-center gap-3 text-sm text-theme-text sm:text-base">
                                <input
                                    type="checkbox"
                                    checked={zaznaczonyCheck}
                                    onChange={handleCheckChange}
                                    className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-orange-500"
                                />

                                <span className="break-words">
                                    Dla konkretnych zajęć
                                </span>
                            </label>
                        </div>

                        {zaznaczonyCheck && (
                            <div className="mt-4 w-full min-w-0 rounded-[15px] border border-theme-muted p-3 sm:p-5">
                                <label
                                    htmlFor="zajecie-rezerwacji"
                                    className="mb-2 block text-sm font-medium text-theme-muted sm:text-base"
                                >
                                    Zajęcie
                                </label>

                                <Form.Select
                                    id="zajecie-rezerwacji"
                                    value={data.zajecie ?? ""}
                                    onChange={(e) =>
                                        setData(
                                            "zajecie",
                                            e.target.value || null
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">
                                        Wybierz zajęcie
                                    </option>

                                    {zajecia.map((zajecie) => (
                                        <option
                                            key={zajecie.idZajęcie}
                                            value={zajecie.idZajęcie}
                                        >
                                            {zajecie.NazwaPrzedmiotu},{" "}
                                            {zajecie.TypZajec}
                                        </option>
                                    ))}
                                </Form.Select>

                                {errors.zajecie && (
                                    <p className="mt-1 text-sm text-theme-red">
                                        {errors.zajecie}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            disabled={processing}
                            type="submit"
                            className="bg-theme-orange mx-auto mt-8 block h-[52px] w-full max-w-[420px] cursor-pointer rounded-[15px] px-4 text-xl font-bold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-12 sm:h-[60px] sm:text-[28px]"
                        >
                            {processing ? "Wysyłanie..." : "Wyślij"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function Rezerwacja({
    budynki,
    sali,
    zajecia,
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

            <Head title="Nowa rezerwacja" />

            <MenuProwadzacy />

            <Content
                budynki={budynki}
                sali={sali}
                zajecia={zajecia}
            />
        </div>
    );
}
