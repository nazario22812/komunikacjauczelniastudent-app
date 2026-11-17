
import React, { useEffect, useState } from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ToastContainer, toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

function Materialy({ materialy = [], kursId }) {
    const [isEditing, setIsEditing] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        pliks: [],
    });

    const handleDelete = (idPlik) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten materiał?")) {
            return;
        }

        router.post(
            `/prowadzacy/usunmaterialy/${kursId}/${idPlik}`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const removeFile = (indexToRemove) => {
        setData(
            "pliks",
            data.pliks.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.pliks.length || processing) return;

        post(`/prowadzacy/dodajmaterialy/${kursId}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset("pliks");
            },
        });
    };

    const onDrop = (acceptedFiles) => {
        const previousFiles = Array.isArray(data.pliks)
            ? data.pliks
            : [];

        const newFiles = acceptedFiles.filter(
            (newFile) =>
                !previousFiles.some(
                    (file) =>
                        file.name === newFile.name &&
                        file.size === newFile.size &&
                        file.lastModified === newFile.lastModified
                )
        );

        setData("pliks", [...previousFiles, ...newFiles]);
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        fileRejections,
    } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "application/pdf": [".pdf"],
            "application/zip": [".zip"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
        },
    });

    return (
        <div className="flex w-full min-w-0 flex-col gap-3 p-2 sm:p-4">
            <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 pb-2">
                {isEditing && (
                    <button
                        type="button"
                        disabled={processing || data.pliks.length === 0}
                        onClick={handleSubmit}
                        className="min-h-[40px] cursor-pointer rounded-[10px] bg-green-600 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                    >
                        {processing ? "Zapisywanie..." : "Zapisz zmiany"}
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`min-h-[40px] cursor-pointer rounded-[10px] px-3 py-2 text-sm font-medium text-white transition-all sm:px-4 ${
                        isEditing
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-theme-orange hover:opacity-90"
                    }`}
                >
                    {isEditing ? "Zakończ edytowanie" : "Edytuj"}
                </button>
            </div>

            {isEditing && (
                <section className="flex w-full min-w-0 flex-col gap-4">
                    <div
                        {...getRootProps({
                            className: `dropzone flex min-h-[160px] w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-[15px] border-2 border-dashed border-theme-muted bg-theme-surface p-4 text-center text-theme-text transition-all duration-200 hover:border-orange-500 hover:bg-theme-accent-ink-2 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:min-h-[180px] sm:p-6 ${
                                isDragActive
                                    ? "border-orange-500 bg-theme-accent-ink"
                                    : ""
                            }`,
                        })}
                    >
                        <input {...getInputProps()} />

                        <div className="text-4xl">📂</div>

                        {isDragActive ? (
                            <p className="text-base font-semibold text-orange-400 sm:text-lg">
                                Upuść pliki tutaj...
                            </p>
                        ) : (
                            <>
                                <p className="break-words text-base font-semibold sm:text-lg">
                                    Przeciągnij i upuść pliki
                                </p>

                                <p className="break-words text-sm text-theme-muted">
                                    lub kliknij, aby wybrać z urządzenia
                                </p>
                            </>
                        )}
                    </div>

                    {fileRejections.length > 0 && (
                        <div className="text-sm text-theme-red">
                            Niektóre pliki mają nieobsługiwany format.
                        </div>
                    )}

                    {errors.pliks && (
                        <p className="break-words text-sm text-theme-red">
                            {errors.pliks}
                        </p>
                    )}

                    {data.pliks.length > 0 && (
                        <div className="w-full min-w-0">
                            <h4 className="mb-3 text-lg font-semibold text-theme-text">
                                Wybrane pliki ({data.pliks.length})
                            </h4>

                            <ul className="flex min-w-0 flex-col gap-2">
                                {data.pliks.map((file, index) => (
                                    <li
                                        key={`${file.name}-${file.lastModified}-${index}`}
                                        className="bg-theme-surface flex min-w-0 items-center gap-3 rounded-xl border border-white/20 p-3 text-theme-text"
                                    >
                                        <span className="shrink-0 text-xl">
                                            📎
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="break-words [overflow-wrap:anywhere] text-sm sm:text-base">
                                                {file.name}
                                            </p>

                                            <p className="mt-1 text-xs text-theme-muted">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="shrink-0 cursor-pointer rounded-[8px] px-2 py-1 text-sm text-red-400 hover:text-red-300"
                                        >
                                            Usuń
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}

            {materialy && materialy.length > 0 ? (
                materialy.map((material, index) => {
                    const fileName =
                        material.nazwa?.split("/").pop() || "Plik";

                    return (
                        <div
                            key={material.idPlik ?? material.id ?? index}
                            className="group flex min-w-0 w-full items-center justify-between gap-2 rounded-[12px] border border-theme-muted/30 bg-theme-surface p-3 transition-all duration-200 hover:border-theme-orange"
                        >
                            <a
                                href={`/storage/${material.nazwa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-w-0 flex-1 items-center gap-3"
                            >
                                <span className="shrink-0 text-[24px]">
                                    📄
                                </span>

                                <span className="min-w-0 break-words [overflow-wrap:anywhere] text-sm font-medium text-theme-text transition-colors group-hover:text-theme-orange sm:text-[16px]">
                                    {fileName}
                                </span>
                            </a>

                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(material.idPlik)
                                    }
                                    className="shrink-0 cursor-pointer rounded-[8px] px-2 py-2 text-sm text-red-400 transition-all hover:text-white sm:px-3"
                                >
                                    Usuń
                                </button>
                            ) : (
                                <span className="hidden shrink-0 text-[14px] text-theme-text transition-transform group-hover:translate-x-1 sm:block">
                                    Otwórz
                                </span>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="mx-auto mt-8 w-full text-center text-[20px] text-theme-muted">
                    Brak materiałów
                </div>
            )}
        </div>
    );
}

function Sylabusplusliteratura({
    sylabus,
    literatura = [],
    przedmiot,
    kurs,
}) {
    return (
        <div className="flex w-full min-w-0 flex-col gap-4 text-theme-text">
            <section className="min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Informacje o przedmiocie
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    <p className="break-words">
                        Przedmiot: {przedmiot?.nazwa}
                    </p>

                    <p>Semestr: {kurs?.Semester}</p>

                    <p>ECTS: {przedmiot?.punktyECTS}</p>

                    <p>Liczba godzin: {sylabus?.iloscGodzin}</p>

                    <p>
                        Egzamin:{" "}
                        {Number(sylabus?.czyEgzamin) === 1
                            ? "Tak"
                            : "Nie"}
                    </p>
                </div>
            </section>

            <section className="min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Opis przedmiotu
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                        {sylabus?.opisPrzedmiotu}
                    </p>
                </div>
            </section>

            <section className="min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Warunki zaliczenia
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                        {sylabus?.warunkiZaliczenia}
                    </p>
                </div>
            </section>

            <section className="min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Literatura
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    {literatura && literatura.length > 0 ? (
                        literatura.map((ksiazka, index) => (
                            <div
                                key={ksiazka.id ?? index}
                                className="min-w-0 border-b border-theme-page py-2 last:border-b-0"
                            >
                                <p className="break-words [overflow-wrap:anywhere] text-base sm:text-[18px]">
                                    {ksiazka.nazwa}
                                </p>

                                <p className="mt-1 break-words whitespace-pre-wrap text-sm font-thin">
                                    {ksiazka.opis}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-theme-muted">
                            Brak literatury
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}

function Zadania({ zadania = [], kursId }) {
    const [isEditing, setIsEditing] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
    } = useForm({
        nazwaZadania: "",
        opis: "",
        termin: "",
        czyNaOcene: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/prowadzacy/dodajzadanie/${kursId}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleDelete = (idZadanie) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to zadanie?")) {
            return;
        }

        router.post(
            `/prowadzacy/usunzadanie/${kursId}/${idZadanie}`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const inputClass =
        "w-full min-w-0 rounded-[8px] border border-theme-muted bg-theme-slate p-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-orange";

    return (
        <div className="flex w-full min-w-0 flex-col gap-4 p-2 sm:p-4">
            <div className="flex w-full justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`min-h-[40px] cursor-pointer rounded-[10px] px-4 py-2 text-sm font-medium text-white transition-all ${
                        isEditing
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-theme-orange hover:opacity-90"
                    }`}
                >
                    {isEditing ? "Zakończ edytowanie" : "Edytuj"}
                </button>
            </div>

            {isEditing && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-theme-surface mb-4 flex min-w-0 flex-col gap-4 rounded-[12px] border border-theme-orange p-3 sm:p-4"
                >
                    <h3 className="break-words text-lg font-semibold text-theme-text">
                        Dodaj nowe zadanie
                    </h3>

                    <div className="flex min-w-0 flex-col gap-1">
                        <label
                            htmlFor="nazwa-zadania"
                            className="text-sm text-theme-muted"
                        >
                            Nazwa zadania
                        </label>

                        <input
                            id="nazwa-zadania"
                            type="text"
                            value={data.nazwaZadania}
                            onChange={(e) =>
                                setData("nazwaZadania", e.target.value)
                            }
                            className={inputClass}
                            required
                        />

                        {errors.nazwaZadania && (
                            <p className="text-sm text-theme-red">
                                {errors.nazwaZadania}
                            </p>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col gap-1">
                        <label
                            htmlFor="opis-zadania"
                            className="text-sm text-theme-muted"
                        >
                            Opis
                        </label>

                        <textarea
                            id="opis-zadania"
                            value={data.opis}
                            onChange={(e) =>
                                setData("opis", e.target.value)
                            }
                            className={inputClass}
                            rows={4}
                        />

                        {errors.opis && (
                            <p className="text-sm text-theme-red">
                                {errors.opis}
                            </p>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col gap-1">
                        <label
                            htmlFor="termin-zadania"
                            className="text-sm text-theme-muted"
                        >
                            Termin oddania
                        </label>

                        <input
                            id="termin-zadania"
                            type="date"
                            value={data.termin}
                            onChange={(e) =>
                                setData("termin", e.target.value)
                            }
                            className={inputClass}
                        />

                        {errors.termin && (
                            <p className="text-sm text-theme-red">
                                {errors.termin}
                            </p>
                        )}
                    </div>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-text">
                        <input
                            type="checkbox"
                            checked={Number(data.czyNaOcene) === 1}
                            onChange={(e) =>
                                setData(
                                    "czyNaOcene",
                                    e.target.checked ? 1 : 0
                                )
                            }
                            className="h-4 w-4 shrink-0 accent-orange-500"
                        />

                        <span>Czy na ocenę?</span>
                    </label>

                    <button
                        type="submit"
                        disabled={processing}
                        className="min-h-[42px] w-full cursor-pointer rounded-[10px] bg-green-600 px-4 py-2 font-medium text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                    >
                        {processing ? "Zapisywanie..." : "Zapisz zadanie"}
                    </button>
                </form>
            )}

            <div className="min-w-0 w-full overflow-hidden rounded-[10px] border border-gray-700/60">
                <table className="w-full table-fixed border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-700 text-[14px] text-theme-muted">
                            <th className="p-2 font-medium sm:p-3">
                                Nazwa Zadania
                            </th>

                            {isEditing && (
                                <th className="w-[85px] p-2 text-right font-medium sm:w-[110px] sm:p-3">
                                    Akcje
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-800 text-[14px]">
                        {zadania && zadania.length > 0 ? (
                            zadania.map((zadanie, index) => (
                                <tr
                                    key={zadanie.idZadanie ?? zadanie.id ?? index}
                                    onClick={() =>
                                        router.get(
                                            `/prowadzacy/otworzzadanie/${zadanie.idZadanie}`
                                        )
                                    }
                                    className="cursor-pointer transition-colors hover:bg-theme-slate/50"
                                >
                                    <td className="break-words [overflow-wrap:anywhere] p-2 font-medium text-theme-text sm:p-3">
                                        {zadanie.nazwaZadania || "—"}
                                    </td>

                                    {isEditing && (
                                        <td className="p-2 text-right sm:p-3">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(
                                                        zadanie.idZadanie
                                                    );
                                                }}
                                                className="cursor-pointer rounded-[8px] px-2 py-2 text-[14px] text-red-400 transition-all hover:text-white sm:px-3"
                                            >
                                                Usuń
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={isEditing ? 2 : 1}
                                    className="p-4 text-center text-theme-muted"
                                >
                                    Brak zadań
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Studenty({ studenci = [], kurs }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (studentId) => {
        if (
            !window.confirm(
                "Czy na pewno chcesz usunąć studenta z kursu?"
            )
        ) {
            return;
        }

        setDeletingId(studentId);

        router.post(
            `/prowadzacy/usunstudentazkursu/${studentId}/${kurs.idkurs}`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setDeletingId(null),
            }
        );
    };

    return (
        <div className="min-w-0 w-full overflow-hidden rounded-[10px] border border-gray-700/60">
            <table className="w-full table-fixed border-collapse text-left">
                <colgroup>
                    <col className="w-[26%] sm:w-[20%]" />
                    <col className="w-[44%] sm:w-[60%]" />
                    <col className="w-[30%] sm:w-[20%]" />
                </colgroup>

                <thead>
                    <tr className="border-b border-gray-700 text-[13px] text-theme-muted sm:text-[14px]">
                        <th className="p-2 font-medium sm:p-3">
                            Indeks
                        </th>

                        <th className="p-2 font-medium sm:p-3">
                            Imię i nazwisko
                        </th>

                        <th className="p-2 text-right font-medium sm:p-3">
                            Akcje
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-[13px] sm:text-[14px]">
                    {studenci && studenci.length > 0 ? (
                        studenci.map((student) => (
                            <tr
                                key={student.idStudent}
                                className="transition-colors hover:bg-theme-slate/50"
                            >
                                <td className="break-words p-2 font-medium text-theme-text sm:p-3">
                                    {student.index}
                                </td>

                                <td className="break-words [overflow-wrap:anywhere] p-2 font-medium text-theme-text sm:p-3">
                                    {student.user?.name || "—"}{" "}
                                    {student.user?.surname || "—"}
                                </td>

                                <td className="p-2 text-right sm:p-3">
                                    <button
                                        type="button"
                                        disabled={
                                            deletingId === student.idStudent
                                        }
                                        onClick={() =>
                                            handleDelete(student.idStudent)
                                        }
                                        className="cursor-pointer rounded-[8px] px-1 py-2 text-xs text-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                                    >
                                        {deletingId === student.idStudent
                                            ? "..."
                                            : "Usuń"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={3}
                                className="p-4 text-center text-theme-muted"
                            >
                                Brak studentów
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Content({
    kurs,
    materialy,
    sylabus,
    literatura,
    przedmiot,
    zadania,
    studenci,
}) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Kurs
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-w-0 w-full shrink-0 items-center rounded-t-[15px] px-3 py-4 sm:min-h-[115px] sm:px-4">
                    <div className="min-w-0 w-full">
                        <h1 className="break-words [overflow-wrap:anywhere] text-xl font-bold text-theme-text sm:text-2xl lg:text-[36px]">
                            {kurs?.nazwa}
                        </h1>

                        <p className="mt-2 break-words text-sm font-thin text-theme-text sm:text-base lg:text-[20px]">
                            {kurs?.prowadzacy?.TytulNaukowy}{" "}
                            {kurs?.prowadzacy?.user?.name}{" "}
                            {kurs?.prowadzacy?.user?.surname}
                        </p>

                        <p className="mt-1 break-words text-sm font-thin text-theme-text sm:text-base lg:text-[20px]">
                            Kod do kursu:{" "}
                            <span className="font-bold">
                                {kurs?.kod}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="bg-theme-slate flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[15px] p-2 sm:p-3 md:p-5">
                    <Tabs className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
                        <TabList className="hide-scrollbar flex w-full min-w-0 shrink-0 gap-1 overflow-x-auto overscroll-x-contain border-b border-theme-muted text-center text-theme-text sm:gap-3 lg:gap-8">
                            <Tab
                                className="flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-t-[10px] px-3 py-2 text-sm outline-none sm:flex-1 sm:px-4 sm:text-base"
                                selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                            >
                                Materiały
                            </Tab>

                            <Tab
                                className="flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-t-[10px] px-3 py-2 text-sm outline-none sm:flex-1 sm:px-4 sm:text-base"
                                selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                            >
                                Zadania
                            </Tab>

                            <Tab
                                className="flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-t-[10px] px-3 py-2 text-sm outline-none sm:flex-1 sm:px-4 sm:text-base"
                                selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                            >
                                Dodatkowa informacja
                            </Tab>

                            <Tab
                                className="flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-t-[10px] px-3 py-2 text-sm outline-none sm:flex-1 sm:px-4 sm:text-base"
                                selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                            >
                                Użytkowniki
                            </Tab>
                        </TabList>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-1 text-theme-text custom-scrollbar sm:p-2 md:p-3"
                            selectedClassName="!block"
                        >
                            <Materialy
                                materialy={materialy}
                                kursId={kurs?.idkurs}
                            />
                        </TabPanel>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-1 text-theme-text custom-scrollbar sm:p-2 md:p-3"
                            selectedClassName="!block"
                        >
                            <Zadania
                                zadania={zadania}
                                kursId={kurs?.idkurs}
                            />
                        </TabPanel>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-3 text-theme-text custom-scrollbar sm:p-4 md:p-5"
                            selectedClassName="!block"
                        >
                            <Sylabusplusliteratura
                                sylabus={sylabus}
                                literatura={literatura}
                                przedmiot={przedmiot}
                                kurs={kurs}
                            />
                        </TabPanel>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-2 text-theme-text custom-scrollbar sm:p-4 md:p-5"
                            selectedClassName="!block"
                        >
                            <Studenty
                                studenci={studenci}
                                kurs={kurs}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default function Kurs({
    auth,
    kurs,
    materialy,
    sylabus,
    literatura,
    przedmiot,
    zadania,
    studenci,
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

            <Head title="Moje kursy" />

            <MenuProwadzacy />

            <Content
                kurs={kurs}
                materialy={materialy}
                sylabus={sylabus}
                literatura={literatura}
                przedmiot={przedmiot}
                zadania={zadania}
                studenci={studenci}
            />
        </div>
    );
}
