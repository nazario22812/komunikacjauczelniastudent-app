import React, { useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head, router, Link, useForm } from "@inertiajs/react";
import Form from 'react-bootstrap/Form';
import { useDropzone } from "react-dropzone";




function Content({}){
    const tematy = [
        'Podanie o warunkową rejestrację',
        'Podanie o powtarzanie roku / semestru',
        'Podanie o udzielenie urlopu',
        'Podanie o wznowienie studiów',
        'Wniosek o Indywidualną Organizację Studiów',
        'Prośba o wyrażenie zgody na dodatkowy termin egzaminu/zaliczenia lub egzamin komisyjny',
        'Podanie o wybór lub zmianę specjalności',
        'Wniosek o rozłożenie opłaty za czesne na raty',
        'Wniosek o rozłożenie na raty opłaty za punkty kredytowe ECTS',
        'Podanie o zwolnienie z opłat za czesne',
        'Podanie o wybór / zmianę promotora lub tematu pracy dyplomowej',
        'Podanie o przedłużenie terminu złożenia pracy dyplomowej',
        'Podanie o dopuszczenie do egzaminu dyplomowego',
        'Wniosek o wydanie dodatkowego odpisu dyplomu lub suplementu',
        'Podanie ogólne do Dziekana',
        'Wniosek o wydanie duplikatu legitymacji studenckiej',
        'Wnioski o stypendia'
    ];

    const [listaplikow, setlistaplikow] = useState([]);

    const { data, setData, get, post, processing, errors, reset } = useForm({
        temat:'',
        tresc:'',
        files: []
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

    const wyslijpodanie = (e) => {
        e.preventDefault();

        post('/student/zlozpodanie', {
            forceFormData: true,
        });
    }
    return (
       
        <div className="bg-theme-dark-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-dark-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full ">E-Podanie</span>
            </div>
            <div className="w-full flex-1 h-full pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col ">
                <div className="bg-theme-dark-slate w-full h-full mx-auto pt-[35px] pb-[10px] px-[75px] rounded-[15px] relative overflow-y-auto pr-2 custom-scrollbar">
                    <div className="w-full text-center text-white font-bold text-[58px]">
                        <span >Nowe podanie</span>
                    </div>
                    <form onSubmit={wyslijpodanie} >
                        <div className="px-[40px] py-[16px] w-full  ">
                            <span className="w-[60%] block mx-auto text-[24px] text-[white] text-left">Typ podania</span>
                            <Form.Select className="w-[60%] block mx-auto bg-theme-dark-surface rounded-[15px] text-[16px] h-[50px] px-3 text-theme-dark-muted border border-white" value={data.temat} onChange={(e) => {setData('temat', e.target.value)}}>
                                <option value="">wybierz typ podania</option>
                                {tematy.map((temat) => (
                                    <option key={temat}  value={temat}>{temat}</option>
                                ))}
                            
                            </Form.Select>
                            <p className="text-white text-[12px] mx-auto text-center ">{errors.temat}</p>

                        </div>
                        <div className="px-[40px] py-[16px] w-full mt-1">
                            <span  className="w-[60%] block mx-auto text-[24px] text-[white] text-left">Treść podania</span>
                            <textarea className="w-[60%] block mx-auto bg-theme-dark-surface rounded-[15px] text-[16px] h-[300px] px-3 py-2 text-theme-dark-muted border border-white" placeholder="podaj treść podania" value={data.tresc} onChange={(e) => {setData('tresc', e.target.value)}}/>
                            <p className="text-white text-[12px] mx-auto text-center ">{errors.tresc}</p>
                        </div>
                        <div className="px-[40px] py-[16px] w-full mt-1">
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

                                    {files.length > 0 && (
                                        <aside className="w-full">
                                            <h4 className="text-white text-lg font-semibold mb-3">
                                                Wybrane pliki ({files.length})
                                            </h4>

                                            <ul className="flex flex-col gap-2">
                                                {files.map((file, index) => (
                                                    <li
                                                        key={`${file.name}-${file.lastModified}-${index}`}
                                                        className="flex items-center gap-3 p-3 bg-theme-dark-surface border border-white/20 rounded-xl text-theme-dark-light"
                                                    >
                                                        <span className="text-xl">
                                                            📎
                                                        </span>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="break-all">
                                                                {file.name}
                                                            </p>

                                                            <p className="text-xs text-theme-dark-muted">
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


export default function Podanieform({ auth }) {
    return (
      
        <div className="flex">
            <Head title="E-Dziekanat"/>
            <MenuStudenta/>
            <Content />
        </div>
    );
}
