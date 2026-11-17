
import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

function Content() {
    const [activeTab, setActiveTab] = useState("ogloszenia");

    const ogloszeniaForm = useForm({
        temat: "",
        tresc: "",
    });

    const ankietyForm = useForm({
        temat: "",
        opis: "",
        link: "",
    });

    const isOgloszenia = activeTab === "ogloszenia";

    const processing = isOgloszenia
        ? ogloszeniaForm.processing
        : ankietyForm.processing;

    const inputClass =
        "h-[46px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-[14px] text-theme-text outline-none transition-colors focus:border-theme-orange";

    const labelClass =
        "mb-2 block text-[14px] font-semibold text-theme-text";

    const errorClass =
        "mt-1 block text-[12px] text-red-500";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (processing) {
            return;
        }

        if (isOgloszenia) {
            const confirmed = window.confirm(
                "Czy na pewno chcesz opublikować to ogłoszenie?"
            );

            if (!confirmed) {
                return;
            }

            ogloszeniaForm.post("/dziekanat/ogloszenia", {
                preserveScroll: true,
                onSuccess: () => {
                    ogloszeniaForm.reset();
                    ogloszeniaForm.clearErrors();
                },
            });
        } else {
            const confirmed = window.confirm(
                "Czy na pewno chcesz opublikować tę ankietę?"
            );

            if (!confirmed) {
                return;
            }

            ankietyForm.post("/dziekanat/ankiety", {
                preserveScroll: true,
                onSuccess: () => {
                    ankietyForm.reset();
                    ankietyForm.clearErrors();
                },
            });
        }
    };

    const handleClear = () => {
        if (isOgloszenia) {
            ogloszeniaForm.reset();
            ogloszeniaForm.clearErrors();
        } else {
            ankietyForm.reset();
            ankietyForm.clearErrors();
        }
    };

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton
                        back={() => window.history.back()}
                    />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Ogłoszenia i ankiety
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] p-2 sm:p-3 md:p-5">
                    <div className="bg-theme-surface custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] p-3 sm:p-5 md:p-7">
                        <div className="mx-auto flex w-full max-w-[850px] flex-col gap-5">
                            <div>
                                <h1 className="text-[26px] font-bold text-theme-text sm:text-[32px] lg:text-[40px]">
                                    Ogłoszenia i ankiety
                                </h1>

                                <p className="mt-2 text-[13px] leading-relaxed text-theme-muted sm:text-[14px]">
                                    Utwórz nowe ogłoszenie lub ankietę
                                    dla użytkowników uczelni.
                                </p>
                            </div>

                            <div className="flex w-full min-w-0 border-b border-theme-muted">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab("ogloszenia")
                                    }
                                    disabled={processing}
                                    className={`min-w-0 flex-1 border-b-[3px] px-3 py-3 text-[14px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-7 sm:text-[16px] ${
                                        isOgloszenia
                                            ? "border-theme-orange text-theme-text"
                                            : "border-transparent text-theme-muted hover:text-theme-text"
                                    }`}
                                >
                                    Ogłoszenia
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab("ankiety")
                                    }
                                    disabled={processing}
                                    className={`min-w-0 flex-1 border-b-[3px] px-3 py-3 text-[14px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-7 sm:text-[16px] ${
                                        !isOgloszenia
                                            ? "border-theme-orange text-theme-text"
                                            : "border-transparent text-theme-muted hover:text-theme-text"
                                    }`}
                                >
                                    Ankiety
                                </button>
                            </div>

                            <div className="min-w-0 rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5 md:p-7">
                                <h2 className="mb-5 text-[19px] font-bold text-theme-text sm:text-[22px]">
                                    {isOgloszenia
                                        ? "Nowe ogłoszenie"
                                        : "Nowa ankieta"}
                                </h2>

                                <form
                                    onSubmit={handleSubmit}
                                    className="flex min-w-0 flex-col gap-5"
                                >
                                    <div className="min-w-0">
                                        <label
                                            htmlFor="temat"
                                            className={labelClass}
                                        >
                                            Temat
                                        </label>

                                        <input
                                            id="temat"
                                            type="text"
                                            maxLength={45}
                                            value={
                                                isOgloszenia
                                                    ? ogloszeniaForm.data.temat
                                                    : ankietyForm.data.temat
                                            }
                                            onChange={(e) => {
                                                if (isOgloszenia) {
                                                    ogloszeniaForm.setData(
                                                        "temat",
                                                        e.target.value
                                                    );
                                                } else {
                                                    ankietyForm.setData(
                                                        "temat",
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                            placeholder="Wpisz temat..."
                                            className={inputClass}
                                            required
                                        />

                                        {(isOgloszenia
                                            ? ogloszeniaForm.errors.temat
                                            : ankietyForm.errors.temat) && (
                                            <p className={errorClass}>
                                                {isOgloszenia
                                                    ? ogloszeniaForm.errors.temat
                                                    : ankietyForm.errors.temat}
                                            </p>
                                        )}
                                    </div>

                                    {isOgloszenia ? (
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="tresc"
                                                className={labelClass}
                                            >
                                                Treść ogłoszenia
                                            </label>

                                            <textarea
                                                id="tresc"
                                                rows={7}
                                                maxLength={200}
                                                value={
                                                    ogloszeniaForm.data.tresc
                                                }
                                                onChange={(e) =>
                                                    ogloszeniaForm.setData(
                                                        "tresc",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Wpisz treść ogłoszenia..."
                                                className="custom-scrollbar min-h-[165px] w-full min-w-0 resize-y rounded-[10px] border border-theme-muted bg-theme-slate px-3 py-3 text-[14px] leading-relaxed text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                                required
                                            />

                                            <div className="mt-1 flex items-center justify-between gap-3">
                                                <span className={errorClass}>
                                                    {ogloszeniaForm.errors.tresc}
                                                </span>

                                                <span className="shrink-0 text-[12px] text-theme-muted">
                                                    {ogloszeniaForm.data.tresc.length}/200
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="min-w-0">
                                                <label
                                                    htmlFor="opis"
                                                    className={labelClass}
                                                >
                                                    Opis ankiety
                                                </label>

                                                <textarea
                                                    id="opis"
                                                    rows={4}
                                                    maxLength={45}
                                                    value={
                                                        ankietyForm.data.opis
                                                    }
                                                    onChange={(e) =>
                                                        ankietyForm.setData(
                                                            "opis",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Krótki opis ankiety..."
                                                    className="custom-scrollbar min-h-[110px] w-full min-w-0 resize-y rounded-[10px] border border-theme-muted bg-theme-slate px-3 py-3 text-[14px] leading-relaxed text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                                    required
                                                />

                                                <div className="mt-1 flex items-center justify-between gap-3">
                                                    <span className={errorClass}>
                                                        {ankietyForm.errors.opis}
                                                    </span>

                                                    <span className="shrink-0 text-[12px] text-theme-muted">
                                                        {ankietyForm.data.opis.length}/45
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <label
                                                    htmlFor="link"
                                                    className={labelClass}
                                                >
                                                    Link do ankiety
                                                </label>

                                                <input
                                                    id="link"
                                                    type="url"
                                                    value={
                                                        ankietyForm.data.link
                                                    }
                                                    onChange={(e) =>
                                                        ankietyForm.setData(
                                                            "link",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="https://..."
                                                    className={inputClass}
                                                    required
                                                />

                                                {ankietyForm.errors.link && (
                                                    <p className={errorClass}>
                                                        {ankietyForm.errors.link}
                                                    </p>
                                                )}

                                                <p className="mt-2 text-[12px] leading-relaxed text-theme-muted">
                                                    Wprowadź adres strony
                                                    zawierającej ankietę.
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex flex-col-reverse gap-3 border-t border-theme-muted pt-5 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            disabled={processing}
                                            className="flex min-h-[45px] w-full items-center justify-center rounded-[10px] border border-theme-muted bg-theme-slate px-5 py-2 text-[13px] font-semibold text-theme-text transition-colors hover:bg-theme-panel disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                        >
                                            Wyczyść
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-theme-orange flex min-h-[45px] w-full items-center justify-center rounded-[10px] px-6 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                        >
                                            {processing
                                                ? "Publikowanie..."
                                                : isOgloszenia
                                                ? "Opublikuj ogłoszenie"
                                                : "Opublikuj ankietę"}
                                        </button>
                                    </div>

                                    {(isOgloszenia
                                        ? ogloszeniaForm.errors.message
                                        : ankietyForm.errors.message) && (
                                        <p className={errorClass}>
                                            {isOgloszenia
                                                ? ogloszeniaForm.errors.message
                                                : ankietyForm.errors.message}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OgloszeniaIAnkiety() {
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
    }, [message]);
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
            <Head title="Ogłoszenia i ankiety" />

            <MenuDziekanat />

            <Content />
        </div>
    );
}
