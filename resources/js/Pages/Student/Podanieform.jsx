import React, { useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head, useForm } from "@inertiajs/react";
import { useDropzone } from "react-dropzone";

function Content() {
    const tematy = [
        "Podanie o warunkową rejestrację",
        "Podanie o powtarzanie roku / semestru",
        "Podanie o udzielenie urlopu",
        "Podanie o wznowienie studiów",
        "Wniosek o Indywidualną Organizację Studiów",
        "Prośba o wyrażenie zgody na dodatkowy termin egzaminu/zaliczenia lub egzamin komisyjny",
        "Podanie o wybór lub zmianę specjalności",
        "Wniosek o rozłożenie opłaty za czesne na raty",
        "Wniosek o rozłożenie na raty opłaty za punkty kredytowe ECTS",
        "Podanie o zwolnienie z opłat za czesne",
        "Podanie o wybór / zmianę promotora lub tematu pracy dyplomowej",
        "Podanie o przedłużenie terminu złożenia pracy dyplomowej",
        "Podanie o dopuszczenie do egzaminu dyplomowego",
        "Wniosek o wydanie dodatkowego odpisu dyplomu lub suplementu",
        "Podanie ogólne do Dziekana",
        "Wniosek o wydanie duplikatu legitymacji studenckiej",
        "Wnioski o stypendia",
    ];

    const [files, setFiles] = useState([]);
    const { data, setData, post, processing, errors } = useForm({
        temat: "",
        tresc: "",
        files: [],
    });

    const onDrop = (acceptedFiles) => {
        setFiles((previousFiles) => {
            const newFiles = acceptedFiles.filter(
                (newFile) =>
                    !previousFiles.some(
                        (file) =>
                            file.name === newFile.name &&
                            file.size === newFile.size &&
                            file.lastModified === newFile.lastModified
                    )
            );
            const updatedFiles = [...previousFiles, ...newFiles];
            setData("files", updatedFiles);
            return updatedFiles;
        });
    };

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "application/pdf": [".pdf"],
            "application/zip": [".zip"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
        },
    });

    const removeFile = (indexToRemove) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        setData("files", updatedFiles);
    };

    const wyslijpodanie = (e) => {
        e.preventDefault();
        post("/student/zlozpodanie", { forceFormData: true });
    };

    const inputStyle =
        "block w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-4 py-3 text-sm text-theme-text outline-none transition-colors placeholder:text-theme-muted focus:border-theme-orange focus:ring-1 focus:ring-theme-orange sm:text-base";

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[42px] w-full shrink-0 items-center border-b border-theme-muted bg-theme-page px-2 sm:px-3">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 truncate text-center text-sm font-bold text-theme-text sm:text-base">
                    E-Dziekanat
                </span>
                <div className="w-[65px] shrink-0" />
            </div>

            <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto pb-4 pt-3">
                <div className="mx-auto w-full max-w-[1100px] space-y-3 sm:space-y-4">
                    <div className="flex min-w-0 flex-col gap-2 rounded-2xl bg-theme-surface px-4 py-5 sm:px-6 sm:py-6 md:px-8">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-theme-muted">
                            <span className="rounded-lg bg-theme-slate px-2.5 py-1.5">E-Dziekanat</span>
                            <span>/</span>
                            <span>Nowe podanie</span>
                        </div>
                        <h1 className="break-words text-2xl font-bold tracking-tight text-theme-text sm:text-3xl lg:text-4xl">
                            Nowe podanie
                        </h1>
                        <p className="max-w-[720px] text-sm leading-relaxed text-theme-muted sm:text-base">
                            Wybierz typ podania, wpisz jego treść i opcjonalnie dodaj załączniki.
                        </p>
                    </div>

                    <form onSubmit={wyslijpodanie} className="min-w-0 space-y-3 sm:space-y-4">
                        <section className="min-w-0 rounded-2xl bg-theme-surface p-4 sm:p-6 md:p-8">
                            <div className="mb-6 flex items-center gap-3 border-b border-theme-muted pb-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-sm font-bold text-theme-orange">01</span>
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-theme-text sm:text-lg">Informacje o podaniu</h2>
                                    <p className="text-xs text-theme-muted sm:text-sm">Uzupełnij wymagane pola.</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="temat" className="block text-sm font-semibold text-theme-text">
                                        Typ podania <span className="text-theme-orange">*</span>
                                    </label>
                                    <select
                                        id="temat"
                                        value={data.temat}
                                        onChange={(e) => setData("temat", e.target.value)}
                                        className={inputStyle}
                                        aria-invalid={Boolean(errors.temat)}
                                        required
                                    >
                                        <option value="">Wybierz typ podania</option>
                                        {tematy.map((temat) => (
                                            <option key={temat} value={temat}>{temat}</option>
                                        ))}
                                    </select>
                                    {errors.temat && <p className="text-xs text-red-400">{errors.temat}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <label htmlFor="tresc" className="block text-sm font-semibold text-theme-text">
                                            Treść podania <span className="text-theme-orange">*</span>
                                        </label>
                                        <span className="text-xs text-theme-muted">{data.tresc.length} znaków</span>
                                    </div>
                                    <textarea
                                        id="tresc"
                                        value={data.tresc}
                                        onChange={(e) => setData("tresc", e.target.value)}
                                        placeholder="Opisz swoją sprawę..."
                                        rows={8}
                                        className={`${inputStyle} min-h-[180px] resize-y leading-relaxed sm:min-h-[230px]`}
                                        aria-invalid={Boolean(errors.tresc)}
                                        required
                                    />
                                    {errors.tresc && <p className="text-xs text-red-400">{errors.tresc}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="min-w-0 rounded-2xl bg-theme-surface p-4 sm:p-6 md:p-8">
                            <div className="mb-5 flex items-center gap-3 border-b border-theme-muted pb-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-sm font-bold text-theme-orange">02</span>
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-theme-text sm:text-lg">Załączniki</h2>
                                    <p className="text-xs text-theme-muted sm:text-sm">Opcjonalnie dołącz dokumenty do podania.</p>
                                </div>
                            </div>

                            <div
                                {...getRootProps({
                                    className: `flex min-h-[145px] w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-theme-orange sm:min-h-[175px] sm:p-6 ${
                                        isDragActive
                                            ? "border-theme-orange bg-theme-slate"
                                            : "border-theme-muted bg-theme-slate hover:border-theme-orange"
                                    }`,
                                })}
                            >
                                <input {...getInputProps()} />
                                <span aria-hidden="true" className="text-3xl">📎</span>
                                <span className="break-words text-sm font-bold text-theme-text sm:text-base">
                                    {isDragActive ? "Upuść pliki tutaj" : "Przeciągnij pliki lub kliknij, aby je wybrać"}
                                </span>
                                <span className="break-words text-xs text-theme-muted sm:text-sm">
                                    PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP
                                </span>
                            </div>

                            {fileRejections.length > 0 && (
                                <p className="mt-3 text-sm text-red-400">Niektóre pliki mają nieobsługiwany format.</p>
                            )}
                            {errors.files && <p className="mt-3 text-sm text-red-400">{errors.files}</p>}

                            {files.length > 0 && (
                                <div className="mt-5 min-w-0 space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-theme-text">Wybrane pliki ({files.length})</h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFiles([]);
                                                setData("files", []);
                                            }}
                                            className="text-xs font-semibold text-theme-muted transition-colors hover:text-theme-text"
                                        >
                                            Wyczyść listę
                                        </button>
                                    </div>
                                    <ul className="min-w-0 space-y-2">
                                        {files.map((file, index) => (
                                            <li key={`${file.name}-${file.lastModified}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-theme-muted bg-theme-slate p-3">
                                                <span className="shrink-0 text-xl" aria-hidden="true">📄</span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="break-words text-sm font-medium text-theme-text [overflow-wrap:anywhere]">{file.name}</p>
                                                    <p className="mt-1 text-xs text-theme-muted">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="shrink-0 rounded-lg border border-theme-muted px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-theme-surface"
                                                    aria-label={`Usuń plik ${file.name}`}
                                                >
                                                    Usuń
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>

                        <div className="flex min-w-0 flex-col items-stretch justify-between gap-4 rounded-2xl bg-theme-surface p-4 sm:flex-row sm:items-center sm:p-6 md:px-8">
                            <p className="max-w-[600px] text-xs leading-relaxed text-theme-muted sm:text-sm">
                                Sprawdź treść i załączniki przed wysłaniem podania do dziekanatu.
                            </p>
                            <button
                                type="submit"
                                disabled={processing || !data.temat || !data.tresc.trim()}
                                className="inline-flex min-h-[46px] w-full shrink-0 items-center justify-center rounded-xl bg-theme-orange px-7 py-3 text-sm font-bold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
                            >
                                {processing ? "Wysyłanie..." : "Wyślij podanie"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function Podanieform({ auth }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="E-Podanie" />
            <MenuStudenta />
            <Content />
        </div>
    );
}
