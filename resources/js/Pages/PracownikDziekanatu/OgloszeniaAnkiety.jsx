import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

function Content({ wydzialy = [] }) {
    const [activeTab, setActiveTab] = useState("ogloszenia");

    const ogloszeniaForm = useForm({
        temat: "",
        tresc: "",
        czy_godziny: false,
        rodzaj_godzin: "",
        wydzialy_ids: [],
        data_godzin: "",
        godzina_od: "",
        godzina_do: "",
    });

    const ankietyForm = useForm({
        temat: "",
        opis: "",
        link: "",
    });

    const isOgloszenia = activeTab === "ogloszenia";

    const processing = ogloszeniaForm.processing || ankietyForm.processing;

    const inputClass =
        "h-[46px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-[14px] text-theme-text outline-none transition-colors focus:border-theme-orange";

    const labelClass = "mb-2 block text-[14px] font-semibold text-theme-text";

    const errorClass = "mt-1 block text-[12px] text-red-500";

    const getWydzialId = (wydzial) => {
        return wydzial.idWydzial ?? wydzial.id;
    };

    const getWydzialName = (wydzial) => {
        return wydzial.nazwa ?? wydzial.Nazwa ?? wydzial.nazwaWydzialu ?? "";
    };

    const handleGodzinyChange = (checked) => {
        ogloszeniaForm.setData({
            ...ogloszeniaForm.data,
            czy_godziny: checked,
            rodzaj_godzin: checked ? "dziekanskie" : "",
            wydzialy_ids: [],
            data_godzin: "",
            godzina_od: "",
            godzina_do: "",
        });

        ogloszeniaForm.clearErrors();
    };

    const handleWydzialChange = (id) => {
        const numericId = Number(id);
        const selectedIds = ogloszeniaForm.data.wydzialy_ids;

        const newIds = selectedIds.includes(numericId)
            ? selectedIds.filter((item) => item !== numericId)
            : [...selectedIds, numericId];

        ogloszeniaForm.setData("wydzialy_ids", newIds);
        ogloszeniaForm.clearErrors("wydzialy_ids");
    };

    const handleSelectAll = () => {
        const allIds = wydzialy
            .map((wydzial) => Number(getWydzialId(wydzial)))
            .filter((id) => !Number.isNaN(id));

        const allSelected =
            allIds.length > 0 &&
            allIds.every((id) => ogloszeniaForm.data.wydzialy_ids.includes(id));

        ogloszeniaForm.setData("wydzialy_ids", allSelected ? [] : allIds);
    };
    const timeInvalid =
        ogloszeniaForm.data.czy_godziny &&
        ogloszeniaForm.data.godzina_od &&
        ogloszeniaForm.data.godzina_do &&
        ogloszeniaForm.data.godzina_od >= ogloszeniaForm.data.godzina_do;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (processing) {
            return;
        }

        if (isOgloszenia) {
            if (ogloszeniaForm.data.czy_godziny) {
                if (
                    !ogloszeniaForm.data.rodzaj_godzin ||
                    !ogloszeniaForm.data.data_godzin ||
                    !ogloszeniaForm.data.godzina_od ||
                    !ogloszeniaForm.data.godzina_do
                ) {
                    toast.error("Uzupełnij wszystkie pola dotyczące godzin.");
                    return;
                }

                if (ogloszeniaForm.data.wydzialy_ids.length === 0) {
                    toast.error("Wybierz przynajmniej jeden wydział.");
                    return;
                }

                if (timeInvalid) {
                    toast.error(
                        "Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.",
                    );
                    return;
                }
            }

            const confirmed = window.confirm(
                "Czy na pewno chcesz opublikować to ogłoszenie?",
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
                "Czy na pewno chcesz opublikować tę ankietę?",
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
                    <BackButton back={() => window.history.back()} />
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
                                    Utwórz nowe ogłoszenie lub ankietę dla
                                    użytkowników uczelni.
                                </p>
                            </div>

                            <div className="flex w-full min-w-0 border-b border-theme-muted">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("ogloszenia")}
                                    disabled={processing}
                                    className={`min-w-0 flex-1 border-b-[3px] px-3 py-3 text-[14px] font-bold transition-colors disabled:opacity-50 sm:flex-none sm:px-7 sm:text-[16px] ${
                                        isOgloszenia
                                            ? "border-theme-orange text-theme-text"
                                            : "border-transparent text-theme-muted hover:text-theme-text"
                                    }`}
                                >
                                    Ogłoszenia
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab("ankiety")}
                                    disabled={processing}
                                    className={`min-w-0 flex-1 border-b-[3px] px-3 py-3 text-[14px] font-bold transition-colors disabled:opacity-50 sm:flex-none sm:px-7 sm:text-[16px] ${
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
                                                        e.target.value,
                                                    );
                                                } else {
                                                    ankietyForm.setData(
                                                        "temat",
                                                        e.target.value,
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
                                                    ? ogloszeniaForm.errors
                                                          .temat
                                                    : ankietyForm.errors.temat}
                                            </p>
                                        )}
                                    </div>

                                    {isOgloszenia ? (
                                        <>
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
                                                        ogloszeniaForm.data
                                                            .tresc
                                                    }
                                                    onChange={(e) =>
                                                        ogloszeniaForm.setData(
                                                            "tresc",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Wpisz treść ogłoszenia..."
                                                    className="custom-scrollbar min-h-[165px] w-full min-w-0 resize-y rounded-[10px] border border-theme-muted bg-theme-slate px-3 py-3 text-[14px] leading-relaxed text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                                    required
                                                />

                                                <div className="mt-1 flex items-center justify-between gap-3">
                                                    <span
                                                        className={errorClass}
                                                    >
                                                        {
                                                            ogloszeniaForm
                                                                .errors.tresc
                                                        }
                                                    </span>

                                                    <span className="shrink-0 text-[12px] text-theme-muted">
                                                        {
                                                            ogloszeniaForm.data
                                                                .tresc.length
                                                        }
                                                        /200
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate p-3 sm:p-4">
                                                <label className="flex cursor-pointer items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            ogloszeniaForm.data
                                                                .czy_godziny
                                                        }
                                                        onChange={(e) =>
                                                            handleGodzinyChange(
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="h-[18px] w-[18px] shrink-0 accent-orange-500"
                                                    />

                                                    <span className="min-w-0 text-[14px] font-semibold text-theme-text">
                                                        Godziny dziekańskie /
                                                        rektorskie
                                                    </span>
                                                </label>

                                                <p className="mt-2 text-[12px] leading-relaxed text-theme-muted">
                                                    Zaznacz, jeśli ogłoszenie
                                                    dotyczy godzin dziekańskich
                                                    lub rektorskich.
                                                </p>

                                                {ogloszeniaForm.data
                                                    .czy_godziny && (
                                                    <div className="mt-5 flex min-w-0 flex-col gap-4 border-t border-theme-muted pt-5">
                                                        <div className="min-w-0">
                                                            <label
                                                                htmlFor="rodzaj_godzin"
                                                                className={
                                                                    labelClass
                                                                }
                                                            >
                                                                Rodzaj godzin
                                                            </label>

                                                            <select
                                                                id="rodzaj_godzin"
                                                                value={
                                                                    ogloszeniaForm
                                                                        .data
                                                                        .rodzaj_godzin
                                                                }
                                                                onChange={(e) =>
                                                                    ogloszeniaForm.setData(
                                                                        "rodzaj_godzin",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={
                                                                    inputClass
                                                                }
                                                                required
                                                            >
                                                                <option value="dziekanskie">
                                                                    Godziny
                                                                    dziekańskie
                                                                </option>

                                                                <option value="rektorskie">
                                                                    Godziny
                                                                    rektorskie
                                                                </option>
                                                            </select>

                                                            {ogloszeniaForm
                                                                .errors
                                                                .rodzaj_godzin && (
                                                                <p
                                                                    className={
                                                                        errorClass
                                                                    }
                                                                >
                                                                    {
                                                                        ogloszeniaForm
                                                                            .errors
                                                                            .rodzaj_godzin
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <label
                                                                className={
                                                                    labelClass
                                                                }
                                                            >
                                                                Wydziały
                                                            </label>

                                                            <details className="group relative min-w-0">
                                                                <summary className="flex min-h-[46px] w-full cursor-pointer list-none items-center justify-between gap-3 rounded-[10px] border border-theme-muted bg-theme-slate px-3 py-2 text-[14px] text-theme-text outline-none focus:border-theme-orange [&::-webkit-details-marker]:hidden">
                                                                    <span className="min-w-0 break-words">
                                                                        {ogloszeniaForm
                                                                            .data
                                                                            .wydzialy_ids
                                                                            .length ===
                                                                        0
                                                                            ? "Wybierz wydziały"
                                                                            : `Wybrano wydziałów: ${ogloszeniaForm.data.wydzialy_ids.length}`}
                                                                    </span>

                                                                    <span className="shrink-0 text-theme-muted transition-transform group-open:rotate-180">
                                                                        ▼
                                                                    </span>
                                                                </summary>

                                                                <div className="mt-2 flex max-h-[230px] min-w-0 flex-col overflow-y-auto rounded-[10px] border border-theme-muted bg-theme-slate p-2 custom-scrollbar">
                                                                    {wydzialy.length >
                                                                    0 ? (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                onClick={
                                                                                    handleSelectAll
                                                                                }
                                                                                className="mb-2 rounded-[8px] px-3 py-2 text-left text-[13px] font-semibold text-theme-orange hover:bg-theme-panel"
                                                                            >
                                                                                {ogloszeniaForm
                                                                                    .data
                                                                                    .wydzialy_ids
                                                                                    .length ===
                                                                                wydzialy.length
                                                                                    ? "Odznacz wszystkie"
                                                                                    : "Zaznacz wszystkie"}
                                                                            </button>

                                                                            <div className="border-t border-theme-muted pt-2">
                                                                                {wydzialy.map(
                                                                                    (
                                                                                        wydzial,
                                                                                    ) => {
                                                                                        return (
                                                                                            <label
                                                                                                key={
                                                                                                    wydzial.idWydzial
                                                                                                }
                                                                                                className="flex cursor-pointer items-center gap-3 rounded-[8px] px-3 py-3 transition-colors hover:bg-theme-panel"
                                                                                            >
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    checked={ogloszeniaForm.data.wydzialy_ids.includes(
                                                                                                        wydzial.idWydzial,
                                                                                                    )}
                                                                                                    onChange={() =>
                                                                                                        handleWydzialChange(
                                                                                                            wydzial.idWydzial,
                                                                                                        )
                                                                                                    }
                                                                                                    className="h-[17px] w-[17px] shrink-0 accent-orange-500"
                                                                                                />

                                                                                                <span className="min-w-0 break-words text-[13px] text-theme-text">
                                                                                                    {getWydzialName(
                                                                                                        wydzial,
                                                                                                    )}
                                                                                                </span>
                                                                                            </label>
                                                                                        );
                                                                                    },
                                                                                )}
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <p className="px-3 py-3 text-[13px] text-theme-muted">
                                                                            Brak
                                                                            dostępnych
                                                                            wydziałów
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </details>

                                                            {ogloszeniaForm.data
                                                                .wydzialy_ids
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {wydzialy
                                                                        .filter(
                                                                            (
                                                                                wydzial,
                                                                            ) =>
                                                                                ogloszeniaForm.data.wydzialy_ids.includes(
                                                                                    String(
                                                                                        getWydzialId(
                                                                                            wydzial,
                                                                                        ),
                                                                                    ),
                                                                                ),
                                                                        )
                                                                        .map(
                                                                            (
                                                                                wydzial,
                                                                            ) => {
                                                                                return (
                                                                                    <span
                                                                                        key={
                                                                                            wydzial.idWydzial
                                                                                        }
                                                                                        className="inline-flex max-w-full items-center gap-2 rounded-[8px] border border-theme-muted bg-theme-panel px-3 py-2 text-[12px] text-theme-text"
                                                                                    >
                                                                                        <span className="min-w-0 break-words">
                                                                                            {getWydzialName(
                                                                                                wydzial,
                                                                                            )}
                                                                                        </span>

                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() =>
                                                                                                handleWydzialChange(
                                                                                                    wydzial.idWydzial,
                                                                                                )
                                                                                            }
                                                                                            className="shrink-0 text-[16px] font-bold text-theme-muted hover:text-red-500"
                                                                                            aria-label="Usuń wydział"
                                                                                        >
                                                                                            ×
                                                                                        </button>
                                                                                    </span>
                                                                                );
                                                                            },
                                                                        )}
                                                                </div>
                                                            )}

                                                            {ogloszeniaForm
                                                                .errors
                                                                .wydzialy_ids && (
                                                                <p
                                                                    className={
                                                                        errorClass
                                                                    }
                                                                >
                                                                    {
                                                                        ogloszeniaForm
                                                                            .errors
                                                                            .wydzialy_ids
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <label
                                                                htmlFor="data_godzin"
                                                                className={
                                                                    labelClass
                                                                }
                                                            >
                                                                Data
                                                            </label>

                                                            <input
                                                                id="data_godzin"
                                                                type="date"
                                                                value={
                                                                    ogloszeniaForm
                                                                        .data
                                                                        .data_godzin
                                                                }
                                                                onChange={(e) =>
                                                                    ogloszeniaForm.setData(
                                                                        "data_godzin",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={
                                                                    inputClass
                                                                }
                                                                required
                                                            />

                                                            {ogloszeniaForm
                                                                .errors
                                                                .data_godzin && (
                                                                <p
                                                                    className={
                                                                        errorClass
                                                                    }
                                                                >
                                                                    {
                                                                        ogloszeniaForm
                                                                            .errors
                                                                            .data_godzin
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                                                            <div className="min-w-0">
                                                                <label
                                                                    htmlFor="godzina_od"
                                                                    className={
                                                                        labelClass
                                                                    }
                                                                >
                                                                    Godzina
                                                                    rozpoczęcia
                                                                </label>

                                                                <input
                                                                    id="godzina_od"
                                                                    type="time"
                                                                    value={
                                                                        ogloszeniaForm
                                                                            .data
                                                                            .godzina_od
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        ogloszeniaForm.setData(
                                                                            "godzina_od",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                    required
                                                                />

                                                                {ogloszeniaForm
                                                                    .errors
                                                                    .godzina_od && (
                                                                    <p
                                                                        className={
                                                                            errorClass
                                                                        }
                                                                    >
                                                                        {
                                                                            ogloszeniaForm
                                                                                .errors
                                                                                .godzina_od
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <label
                                                                    htmlFor="godzina_do"
                                                                    className={
                                                                        labelClass
                                                                    }
                                                                >
                                                                    Godzina
                                                                    zakończenia
                                                                </label>

                                                                <input
                                                                    id="godzina_do"
                                                                    type="time"
                                                                    value={
                                                                        ogloszeniaForm
                                                                            .data
                                                                            .godzina_do
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        ogloszeniaForm.setData(
                                                                            "godzina_do",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className={
                                                                        inputClass
                                                                    }
                                                                    required
                                                                />

                                                                {ogloszeniaForm
                                                                    .errors
                                                                    .godzina_do && (
                                                                    <p
                                                                        className={
                                                                            errorClass
                                                                        }
                                                                    >
                                                                        {
                                                                            ogloszeniaForm
                                                                                .errors
                                                                                .godzina_do
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {timeInvalid && (
                                                            <p className="text-[13px] text-red-500">
                                                                Godzina
                                                                zakończenia musi
                                                                być późniejsza
                                                                niż godzina
                                                                rozpoczęcia.
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </>
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
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Krótki opis ankiety..."
                                                    className="custom-scrollbar min-h-[110px] w-full min-w-0 resize-y rounded-[10px] border border-theme-muted bg-theme-slate px-3 py-3 text-[14px] leading-relaxed text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                                    required
                                                />

                                                <div className="mt-1 flex items-center justify-between gap-3">
                                                    <span
                                                        className={errorClass}
                                                    >
                                                        {
                                                            ankietyForm.errors
                                                                .opis
                                                        }
                                                    </span>

                                                    <span className="shrink-0 text-[12px] text-theme-muted">
                                                        {
                                                            ankietyForm.data
                                                                .opis.length
                                                        }
                                                        /45
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
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="https://..."
                                                    className={inputClass}
                                                    required
                                                />

                                                {ankietyForm.errors.link && (
                                                    <p className={errorClass}>
                                                        {
                                                            ankietyForm.errors
                                                                .link
                                                        }
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
                                            disabled={
                                                processing ||
                                                Boolean(timeInvalid)
                                            }
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

export default function OgloszeniaIAnkiety({ wydzialy = [] }) {
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

            <Content wydzialy={wydzialy} />
        </div>
    );
}
