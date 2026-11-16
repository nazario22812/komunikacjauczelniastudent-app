
import React, { useState, useEffect } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";

function Content({ zadanie, pliki = null, ocena = null }) {
    const initialFiles = Array.isArray(pliki) ? pliki : [];

    const { data, setData, post, processing, errors } = useForm({
        pliks: initialFiles,
    });

    const [pliks, setpliks] = useState(initialFiles);

    const onDrop = (acceptedFiles) => {
        setpliks((previousFiles) => {
            const safePreviousFiles = Array.isArray(previousFiles)
                ? previousFiles
                : [];

            const newFiles = acceptedFiles.filter(
                (newFile) =>
                    !safePreviousFiles.some(
                        (file) =>
                            file.name === newFile.name &&
                            file.size === newFile.size &&
                            file.lastModified === newFile.lastModified
                    )
            );

            const updatedFiles = [
                ...safePreviousFiles,
                ...newFiles,
            ];

            setData("pliks", updatedFiles);

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
        const updatedFiles = pliks.filter(
            (_, index) => index !== indexToRemove
        );

        setpliks(updatedFiles);
        setData("pliks", updatedFiles);
    };

    const wyslijzadanie = (e) => {
        e.preventDefault();

        post(`/student/kurs/wyslijzadanie/${zadanie.idZadanie}`, {
            forceFormData: true,
        });
    };

    return (
        <div className="bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Zadanie
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-[#0f1d3d] mx-auto w-full min-w-0 flex-1 rounded-[18px] border border-[#304266] p-3 sm:p-4 md:p-8">
                    <div className="mb-6 min-w-0 border-b border-[#304266] pb-4 text-center text-white">
                        <h1 className="break-words [overflow-wrap:anywhere] text-xl font-bold sm:text-2xl md:text-4xl">
                            {zadanie.nazwaZadania}
                        </h1>

                        <p className="mt-2 break-words text-sm text-[#dfe8ff] md:text-base">
                            Termin oddania:{" "}
                            {zadanie.TerminOddania || "N/D"}
                        </p>

                        {zadanie.CzyNaOcene == 1 && (
                            <p className="mt-2 text-sm text-[#dfe8ff] md:text-base">
                                {ocena != null
                                    ? `Ocena: ${ocena.skalaOceny}`
                                    : "Nie ocenione"}
                            </p>
                        )}

                        <p className="mt-2 break-words text-sm text-[#dfe8ff] md:text-base">
                            Status: {zadanie.pivot?.status}
                        </p>
                    </div>

                    <form
                        onSubmit={wyslijzadanie}
                        className="min-w-0 space-y-6"
                    >
                        <div className="min-w-0 rounded-[14px] border border-[#304266] bg-[#101d43] p-3 sm:p-4 md:p-5">
                            <h2 className="mb-3 text-lg font-semibold text-white sm:text-xl">
                                Treść zadania
                            </h2>

                            <textarea
                                readOnly
                                className="min-h-[140px] w-full min-w-0 max-w-full resize-y rounded-[12px] border border-[#304266] bg-[#0b1735] px-3 py-3 text-sm text-[#dfe8ff] outline-none"
                                defaultValue={zadanie.tresc}
                            />
                        </div>

                        <div className="min-w-0 rounded-[14px] border border-[#304266] bg-[#101d43] p-3 sm:p-4 md:p-5">
                            <h2 className="mb-3 text-lg font-semibold text-white sm:text-xl">
                                Załączniki
                            </h2>

                            <section className="flex min-w-0 flex-col gap-4">
                                <div
                                    {...getRootProps({
                                        className: `
                                            dropzone
                                            flex min-h-[150px] min-w-0 w-full cursor-pointer
                                            flex-col items-center justify-center gap-3
                                            rounded-[12px] border-2 border-dashed
                                            border-[#4d639d] bg-[#0d173a]
                                            p-3 text-center text-[#dfe8ff]
                                            transition-all duration-200
                                            hover:border-[#7da5ff] hover:bg-[#101d43]
                                            sm:min-h-[170px] sm:p-6
                                            ${isDragActive
                                                ? "border-[#7da5ff] bg-[#111f4f]"
                                                : ""}
                                        `,
                                    })}
                                >
                                    <input {...getInputProps()} />

                                    <div className="text-3xl sm:text-4xl">
                                        📂
                                    </div>

                                    {isDragActive ? (
                                        <p className="break-words text-base font-semibold text-[#9cc3ff] sm:text-lg">
                                            Upuść pliki tutaj...
                                        </p>
                                    ) : (
                                        <>
                                            <p className="break-words text-base font-semibold sm:text-lg">
                                                Przeciągnij i upuść pliki
                                            </p>

                                            <p className="break-words text-sm text-[#b9c8ee]">
                                                lub kliknij, aby wybrać z komputera
                                            </p>
                                        </>
                                    )}
                                </div>

                                {pliks && pliks.length > 0 && (
                                    <aside className="w-full min-w-0">
                                        <h4 className="mb-3 break-words text-base font-semibold text-white sm:text-lg">
                                            Wybrane pliki ({pliks.length})
                                        </h4>

                                        <ul className="flex min-w-0 flex-col gap-2">
                                            {pliks.map((file, index) => (
                                                <li
                                                    key={`${file.nazwa || file.name}-${file.lastModified || index}-${index}`}
                                                    className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-[#304266] bg-[#0b1735] p-3 text-[#dfe8ff] sm:flex-nowrap sm:gap-3"
                                                >
                                                    <span className="shrink-0 text-xl">
                                                        📎
                                                    </span>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="break-words [overflow-wrap:anywhere] text-sm">
                                                            {file?.nazwa
                                                                ? file.nazwa
                                                                      .split("/")
                                                                      .pop()
                                                                : file?.name ||
                                                                  "Brak nazwy"}
                                                        </p>

                                                        {typeof file.size === "number" && (
                                                            <p className="text-xs text-[#9aaed8]">
                                                                {(
                                                                    file.size /
                                                                    1024
                                                                ).toFixed(1)}{" "}
                                                                KB
                                                            </p>
                                                        )}
                                                    </div>

                                                    {zadanie.pivot?.status !=
                                                    "Wysłane" ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFile(index)
                                                            }
                                                            className="shrink-0 text-sm text-red-300 hover:text-red-200"
                                                        >
                                                            Usuń
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/student/kurs/redagujzadanie/${zadanie.idZadanie}/${file.idPlik}`
                                                                )
                                                            }
                                                            className="shrink-0 text-sm text-red-300 hover:text-red-200"
                                                        >
                                                            Usuń
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </aside>
                                )}
                            </section>
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={processing}
                                type="submit"
                                className="mx-auto block h-12 w-full rounded-xl bg-[#3b60d4] px-6 text-base font-semibold text-white transition hover:bg-[#2d4eb3] disabled:cursor-not-allowed disabled:opacity-70 md:w-[220px]"
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

export default function Zadanie({
    auth,
    zadanie,
    pliki = null,
    ocena = null,
}) {
    const Pageprops = usePage().props;

    const error = Pageprops.error || Pageprops.flash?.error;
    const status = Pageprops.status || Pageprops.flash?.status;

    useEffect(() => {
        if (status) {
            toast.info(status, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        } else if (error) {
            toast.error(error, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
    }, [error, status]);

    return (
        <div className="flex min-h-dvh min-w-0 w-full">
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

            <Head title={zadanie.nazwaZadania} />

            <MenuStudenta />

            <Content
                zadanie={zadanie}
                pliki={pliki}
                ocena={ocena}
            />
        </div>
    );
}
