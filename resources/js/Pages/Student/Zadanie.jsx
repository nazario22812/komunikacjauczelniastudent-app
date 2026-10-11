import React, { useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, useForm } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import { useDropzone } from "react-dropzone";

function Content({ zadanie, pliki = null, ocena = null }) {
    const { data, setData, post, processing, errors } = useForm({
        files: [],
    });

    const [files, setFiles] = useState([]);
    const onDrop = (acceptedFiles) => {
        setFiles((previousFiles) => {
            const newFiles = acceptedFiles.filter(
                (newFile) =>
                    !previousFiles.some(
                        (file) =>
                            file.name === newFile.name &&
                            file.size === newFile.size &&
                            file.lastModified === newFile.lastModified,
                    ),
            );

            const updatedFiles = [...previousFiles, ...newFiles];

            setData("files", updatedFiles);

            return updatedFiles;
        });
    };

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
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

    const removeFile = (indexToRemove) => {
        const updatedFiles = files.filter(
            (_, index) => index !== indexToRemove,
        );

        setFiles(updatedFiles);
        setData("files", updatedFiles);
    };

    const wyslijzadanie = (e) => {
        e.preventDefault();

        post(`/student/kurs/wyslijzadanie/${zadanie.idZadanie}`, {
            forceFormData: true,
        });
    }

    return (
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full ">
                    Zadanie
                </span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#1e293b] w-full h-full mx-auto pt-[35px] pb-[10px] px-[75px] rounded-[15px] relative overflow-y-auto pr-2 custom-scrollbar">
                    <div className="w-full text-center text-white font-bold text-[58px]">
                        <span>{zadanie.nazwaZadania}</span>
                    </div>
                    <form onsubmit={wyslijzadanie}>
                        <div className="px-[40px] py-[16px] w-full mt-1">
                            <span className="w-[60%] block mx-auto text-[24px] text-[white] text-left">
                                Treść zadania
                            </span>
                            <textarea
                                className="w-[60%] disabled block mx-auto bg-[#06062c] rounded-[15px] text-[16px] h-[15%] px-3 py-2 text-[#73768C] border border-white shrink hover:cursor-default"
                                value={zadanie.tresc}
                            />
                        </div>
                        <div className="w-full px-[40px] py-[16px] mt-1">
                            <div className="w-[60%] mx-auto">
                                <span className="block text-[24px] text-white text-left mb-3">
                                    Załączniki
                                </span>
                                <section className="w-full mx-auto flex flex-col gap-4">
                                    <div
                                        {...getRootProps({
                                            className: `
                                                dropzone
                                                w-full min-h-[180px]
                                                flex flex-col items-center justify-center
                                                gap-3 p-6
                                                bg-[#06062c]
                                                border-2 border-dashed border-[#73768C]
                                                rounded-[15px]
                                                text-white text-center
                                                cursor-pointer
                                                transition-all duration-200
                                                hover:border-orange-500
                                                hover:bg-[#0b0b3b]
                                                focus:outline-none focus:ring-2
                                                focus:ring-orange-500
                                                ${isDragActive ? "border-orange-500 bg-[#11113f] scale-[1.01]" : ""}
                                            `,
                                        })}
                                    >
                                        <input {...getInputProps()} />

                                        <div className="text-4xl">📂</div>

                                        {isDragActive ? (
                                            <p className="text-orange-400 font-semibold text-lg">
                                                Upuść pliki tutaj...
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-lg font-semibold">
                                                    Przeciągnij i upuść pliki
                                                </p>

                                                <p className="text-sm text-[#A1A1AA]">
                                                    lub kliknij, aby wybrać z
                                                    komputera
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {files.length > 0 && (
                                        <aside className="w-full">
                                            <h4 className="text-white text-lg font-semibold mb-3">
                                                Wybrane pliki ({files.length})
                                            </h4>

                                            <ul className="flex flex-col gap-2">
                                                {files.map((file, index) => (
                                                    <li
                                                        key={`${file.name}-${file.lastModified}-${index}`}
                                                        className="flex items-center gap-3 p-3 bg-[#06062c] border border-white/20 rounded-xl text-[#A1A1AA]"
                                                    >
                                                        <span className="text-xl">
                                                            📎
                                                        </span>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="break-all">
                                                                {file.name}
                                                            </p>

                                                            <p className="text-xs text-[#73768C]">
                                                                {(
                                                                    file.size /
                                                                    1024
                                                                ).toFixed(
                                                                    1,
                                                                )}{" "}
                                                                KB
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFile(
                                                                    index,
                                                                )
                                                            }
                                                            className="shrink-0 text-red-400 hover:text-red-300"
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
                        <div className="px-[40px] py-[16px] w-full ">
                            <button disabled={processing} type="submit" className="w-[20%] h-[60px] text-[32px] block mx-auto text-white bg-[#f97316] rounded-[15px] hover:cursor-pointer active:bg-[#c55b11]">
                                Wyślij
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function Zadanie({ auth, zadanie, pliki = null, ocena = null }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        //
        <div className="flex">
            <Head title={zadanie.nazwaZadania} />
            <MenuStudenta />
            <Content zadanie={zadanie} pliki={pliki} ocena={ocena} />
        </div>
    );
}
