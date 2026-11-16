
import React, { useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head, useForm } from "@inertiajs/react";
import Form from "react-bootstrap/Form";
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

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
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

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "application/pdf": [".pdf"],
            "application/zip": [".zip"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                ".docx",
            ],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                ".xlsx",
            ],
            "application/vnd.ms-excel": [".xls"],
        },
    });

    const removeFile = (indexToRemove) => {
        const updatedFiles = files.filter(
            (_, index) => index !== indexToRemove
        );

        setFiles(updatedFiles);
        setData("files", updatedFiles);
    };

    const wyslijpodanie = (e) => {
        e.preventDefault();

        post("/student/zlozpodanie", {
            forceFormData: true,
        });
    };

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    E-Podanie
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate custom-scrollbar mx-auto h-full min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] px-3 pb-5 pt-5 sm:px-6 sm:pt-7 md:px-10 lg:px-[75px] lg:pt-[35px]">
                    <div className="w-full min-w-0 text-center font-bold text-theme-text">
                        <h1 className="break-words text-[clamp(1.8rem,4vw,3.87rem)]">
                            Nowe podanie
                        </h1>
                    </div>

                    <form
                        onSubmit={wyslijpodanie}
                        className="mx-auto w-full min-w-0"
                    >
                        <div className="w-full min-w-0 px-0 py-4 sm:px-4 md:px-6 lg:px-[40px]">
                            <label
                                htmlFor="temat"
                                className="mx-auto mb-2 block w-full text-left text-lg text-theme-text sm:text-xl md:w-[80%] md:text-[24px] lg:w-[60%]"
                            >
                                Typ podania
                            </label>

                            <Form.Select
                                id="temat"
                                className="mx-auto block h-[50px] w-full min-w-0 max-w-full rounded-[15px] border border-theme-muted bg-theme-surface px-3 text-[16px] text-theme-muted md:w-[80%] lg:w-[60%]"
                                value={data.temat}
                                onChange={(e) =>
                                    setData("temat", e.target.value)
                                }
                            >
                                <option value="">
                                    wybierz typ podania
                                </option>

                                {tematy.map((temat) => (
                                    <option
                                        key={temat}
                                        value={temat}
                                    >
                                        {temat}
                                    </option>
                                ))}
                            </Form.Select>

                            {errors.temat && (
                                <p className="mx-auto mt-2 w-full text-center text-xs text-red-400 md:w-[80%] lg:w-[60%]">
                                    {errors.temat}
                                </p>
                            )}
                        </div>

                        <div className="mt-1 w-full min-w-0 px-0 py-4 sm:px-4 md:px-6 lg:px-[40px]">
                            <label
                                htmlFor="tresc"
                                className="mx-auto mb-2 block w-full text-left text-lg text-theme-text sm:text-xl md:w-[80%] md:text-[24px] lg:w-[60%]"
                            >
                                Treść podania
                            </label>

                            <textarea
                                id="tresc"
                                className="mx-auto block h-[220px] w-full min-w-0 max-w-full resize-y rounded-[15px] border border-theme-muted bg-theme-surface px-3 py-2 text-[16px] text-theme-muted outline-none sm:h-[260px] md:h-[300px] md:w-[80%] lg:w-[60%]"
                                placeholder="podaj treść podania"
                                value={data.tresc}
                                onChange={(e) =>
                                    setData("tresc", e.target.value)
                                }
                            />

                            {errors.tresc && (
                                <p className="mx-auto mt-2 w-full text-center text-xs text-red-400 md:w-[80%] lg:w-[60%]">
                                    {errors.tresc}
                                </p>
                            )}
                        </div>

                        <div className="mt-1 w-full min-w-0 px-0 py-4 sm:px-4 md:px-6 lg:px-[40px]">
                            <div className="mx-auto w-full min-w-0 md:w-[80%] lg:w-[60%]">
                                <h2 className="mb-3 text-left text-lg text-theme-text sm:text-xl md:text-[24px]">
                                    Załączniki
                                </h2>

                                <section className="mx-auto flex min-w-0 w-full flex-col gap-4">
                                    <div
                                        {...getRootProps({
                                            className: `
                                                dropzone
                                                flex min-h-[150px] min-w-0 w-full
                                                cursor-pointer flex-col
                                                items-center justify-center gap-3
                                                rounded-[15px] border-2 border-dashed
                                                border-theme-muted bg-theme-surface
                                                p-3 text-center text-theme-text
                                                transition-all duration-200
                                                hover:border-orange-500
                                                hover:bg-theme-accent-ink-2
                                                focus:outline-none
                                                sm:min-h-[180px] sm:p-6
                                                ${
                                                    isDragActive
                                                        ? "border-orange-500 bg-theme-accent-ink scale-[1.01]"
                                                        : ""
                                                }
                                            `,
                                        })}
                                    >
                                        <input {...getInputProps()} />

                                        <div className="text-3xl sm:text-4xl">
                                            📂
                                        </div>

                                        {isDragActive ? (
                                            <p className="break-words text-base font-semibold text-orange-400 sm:text-lg">
                                                Upuść pliki tutaj...
                                            </p>
                                        ) : (
                                            <>
                                                <p className="break-words text-base font-semibold sm:text-lg">
                                                    Przeciągnij i upuść pliki
                                                </p>

                                                <p className="break-words text-sm text-theme-light">
                                                    lub kliknij, aby wybrać z komputera
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {files.length > 0 && (
                                        <aside className="w-full min-w-0">
                                            <h4 className="mb-3 break-words text-base font-semibold text-theme-text sm:text-lg">
                                                Wybrane pliki ({files.length})
                                            </h4>

                                            <ul className="flex min-w-0 flex-col gap-2">
                                                {files.map((file, index) => (
                                                    <li
                                                        key={`${file.name}-${file.lastModified}-${index}`}
                                                        className="bg-theme-surface flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-white/20 p-3 text-theme-light sm:flex-nowrap sm:gap-3"
                                                    >
                                                        <span className="shrink-0 text-xl">
                                                            📎
                                                        </span>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="break-words [overflow-wrap:anywhere] text-sm">
                                                                {file.name}
                                                            </p>

                                                            <p className="text-xs text-theme-muted">
                                                                {(
                                                                    file.size / 1024
                                                                ).toFixed(1)}{" "}
                                                                KB
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFile(index)
                                                            }
                                                            className="shrink-0 text-sm text-red-400 hover:text-red-300"
                                                        >
                                                            Usuń
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </aside>
                                    )}
                                </section>
                            </div>
                        </div>

                        <div className="w-full min-w-0 px-0 py-4 sm:px-4 md:px-6 lg:px-[40px]">
                            <button
                                disabled={processing}
                                type="submit"
                                className="mx-auto block h-[50px] w-full rounded-[15px] bg-theme-orange px-4 text-xl font-semibold text-theme-text hover:cursor-pointer active:bg-theme-orange disabled:cursor-not-allowed disabled:opacity-60 sm:w-[240px] md:h-[60px] md:text-[32px]"
                            >
                                {processing ? "Wysyłanie..." : "Wyślij"}
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
            <Head title="E-Dziekanat" />

            <MenuStudenta />

            <Content />
        </div>
    );
}
