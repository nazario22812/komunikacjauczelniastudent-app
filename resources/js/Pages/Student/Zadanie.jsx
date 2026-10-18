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
            const safePreviousFiles = Array.isArray(previousFiles) ? previousFiles : [];

            const newFiles = acceptedFiles.filter(
                (newFile) =>
                    !safePreviousFiles.some(
                        (file) =>
                            file.name === newFile.name &&
                            file.size === newFile.size &&
                            file.lastModified === newFile.lastModified,
                    ),
            );

            const updatedFiles = [...safePreviousFiles, ...newFiles];

            setData("pliks", updatedFiles);

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
        const updatedFiles = pliks.filter(
            (_, index) => index !== indexToRemove,
        );

        setpliks(updatedFiles);
        setData("pliks", updatedFiles);
    };

    const wyslijzadanie = (e) => {
        e.preventDefault();

        

        post(`/student/kurs/wyslijzadanie/${zadanie.idZadanie}`, {
            forceFormData: true,
        });
    }

    return (
        
        <div className="bg-theme-dark-page w-full p-[10px] h-screen flex flex-col box-border">
             
            <div className="bg-theme-dark-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full ">
                    Zadanie
                </span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-dark-slate w-full h-full mx-auto pt-[35px] pb-[10px] px-[75px] rounded-[15px] relative overflow-y-auto pr-2 custom-scrollbar">
                    <div className="w-full text-center text-white font-bold text-[58px]">
                        <span>{zadanie.nazwaZadania}</span><br />
                        <span className="text-[20px] font-thin">termin oddania: {zadanie.TerminOddania}</span><br />
                        <div className="w-[60%] mx-auto  flex justify-between items-center">
                            {ocena != null ? (
                                <span className="text-[22px] font-thin">Ocena: {ocena.skalaOceny}</span>
                            ) : (
                                <span className="text-[22px] font-thin">Nie ocenione</span>
                            )}
                            <span className="text-[22px] font-thin">Status: {zadanie.pivot.status}</span>
                        </div>
                         
                    </div>
                    <form onSubmit={wyslijzadanie}>
                        <div className="px-[40px] py-[16px] w-full mt-1">
                            <div className="w-full flex">
                                <span className="w-[60%] block mx-auto text-[24px] text-[white] text-left">
                                    Treść zadania
                                </span>
                            </div>
                            
                            <textarea
                                readOnly
                                className="w-[60%] disabled block mx-auto bg-theme-dark-surface rounded-[15px] text-[16px] h-[15%] px-3 py-2 text-theme-dark-muted border border-white shrink hover:cursor-default"
                                defaultValue={zadanie.tresc}
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
                                                bg-theme-dark-surface
                                                border-2 border-dashed border-theme-dark-muted
                                                rounded-[15px]
                                                text-white text-center
                                                cursor-pointer
                                                transition-all duration-200
                                                hover:border-orange-500
                                                hover:bg-theme-dark-accent-ink-2
                                                focus:outline-none focus:ring-2
                                                focus:ring-orange-500
                                                ${isDragActive ? "border-orange-500 bg-theme-dark-accent-ink scale-[1.01]" : ""}
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

                                                <p className="text-sm text-theme-dark-light">
                                                    lub kliknij, aby wybrać z
                                                    komputera
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {pliks && pliks.length > 0 ? (
                                        <aside className="w-full">
                                            <h4 className="text-white text-lg font-semibold mb-3">
                                                Wybrane pliki ({pliks.length})
                                            </h4>

                                            <ul className="flex flex-col gap-2">
                                                {pliks.map((file, index) => (
                                                    <li
                                                        key={`${file.nazwa}-${file.lastModified}-${index}`}
                                                        className="flex items-center gap-3 p-3 bg-theme-dark-surface border border-white/20 rounded-xl text-theme-dark-light"

                                                    >
                                                        <span className="text-xl">
                                                            📎
                                                        </span>

                                                        <div className="flex-1 min-w-0">
                                                            <p  className="break-all">
                                                                {file.nazwa || file.name}
                                                            </p>

                                                            <p className="text-xs text-theme-dark-muted">
                                                                {( file.size / 1024 ).toFixed( 1, )}{" "}KB
                                                            </p>
                                                        </div>

                                                        {zadanie.pivot.status != "Wysłane" ? (
                                                            <button type="button" onClick={() => removeFile(index,)} className="shrink-0 text-red-400 hover:text-red-300">
                                                                Usuń
                                                            </button>
                                                        ) : (
                                                            <button type="button" onClick={() => router.post(`/student/kurs/redagujzadanie/${zadanie.idZadanie}/${file.idPlik}`)} className="shrink-0 text-red-400 hover:text-red-300">
                                                                Usuń
                                                            </button>
                                                        )}

                                                        
                                                    </li>
                                                ))}
                                            </ul>
                                        </aside>
                                    ):(
                                        <div></div>
                                    )}
                                </section>
                            </div>
                        </div>
                        <div className="px-[40px] py-[16px] w-full ">
                            <button disabled={processing} type="submit" className="w-[20%] h-[60px] text-[32px] block mx-auto text-white bg-theme-dark-orange rounded-[15px] hover:cursor-pointer active:bg-theme-dark-orange-dark">
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
    const Pageprops = usePage().props;
    const error = Pageprops.error || Pageprops.flash?.error;
    const status = Pageprops.status || Pageprops.flash?.status;

    useEffect(() => {
        if(status){
            toast.info(status, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }else if (error){
            toast.error(error, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }, [error], [status]);

    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        //
        <div className="flex">
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
            <Content zadanie={zadanie} pliki={pliki} ocena={ocena} />
        </div>
    );
}
