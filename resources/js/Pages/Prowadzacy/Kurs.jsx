import React, { useEffect, useState } from "react";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { ToastContainer, toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

function Materialy({ materialy, kursId }) {
    const initialFiles = [];

    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        pliks: initialFiles,
    });
    const handleDelete = (idPlik) => {
        if (confirm("Czy na pewno chcesz usunąć ten materiał?")) {
            router.post(`/prowadzacy/usunmaterialy/${kursId}/${idPlik}`, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };
    const [pliks, setpliks] = useState(initialFiles);

    const removeFile = (indexToRemove) => {
        const updatedFiles = pliks.filter(
            (_, index) => index !== indexToRemove,
        );

        setpliks(updatedFiles);
        setData("pliks", updatedFiles);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/prowadzacy/dodajmaterialy/${kursId}`, {
            forceFormData: true,
            onSuccess: () => {
                setpliks([]);
                setData("pliks", []);
            },
        });
    }

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

    return (
        <div className="w-full h-full p-4 flex flex-col gap-3">
            <div className="w-full flex justify-between items-center mb-2">
                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`fixed right-[5%] px-4 py-2 rounded-[10px] font-medium text-white transition-all ${
                        isEditing
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-theme-orange hover:opacity-90"
                    }`}
                >
                    {isEditing ? "Zakończ edytowanie" : "Edytuj"}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[10px] font-medium transition-all"
                    >
                        Zapisz zmiany
                    </button>
                )}
            </div>

            {isEditing && (
                <section className="w-full min-h-[180px] mx-auto flex flex-col gap-4">
                    <div
                        {...getRootProps({
                            className: `
                                dropzone
                                w-full min-h-[180px]
                                flex flex-col items-center justify-center
                                gap-3 p-6
                                bg-theme-surface
                                border-2 border-dashed border-theme-muted
                                rounded-[15px]
                                text-theme-text text-center
                                cursor-pointer
                                transition-all duration-200
                                hover:border-orange-500
                                hover:bg-theme-accent-ink-2
                                focus:outline-none focus:ring-2
                                focus:ring-orange-500
                                ${isDragActive ? "border-orange-500 bg-theme-accent-ink scale-[1.01]" : ""}
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

                                <p className="text-sm text-theme-light">
                                    lub kliknij, aby wybrać z komputera
                                </p>
                            </>
                        )}
                    </div>

                    {pliks && pliks.length > 0 ? (
                        <aside className="w-full h-[30%]">
                            <h4 className="text-theme-text text-lg font-semibold mb-3">
                                Wybrane pliki ({pliks.length})
                            </h4>

                            <ul className="h-full flex flex-col gap-2 ">
                                {pliks.map((file, index) => (
                                    <li
                                        key={`${file.name || file.nazwa}-${file.lastModified}-${index}`}
                                        className="flex items-center gap-3 p-3 bg-theme-surface border border-white/20 rounded-xl text-theme-light"
                                    >
                                        <span className="text-xl">📎</span>

                                        <div className="flex-1 min-w-0">
                                            <p className="break-all">
                                                {file.name ||
                                                    (file.nazwa
                                                        ? file.nazwa
                                                              .split("/")
                                                              .pop()
                                                        : "")}
                                            </p>

                                            <p className="text-xs text-theme-muted">
                                                {(file.size / 1024).toFixed(1)}{" "}
                                                KB
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="shrink-0 text-red-400 hover:text-red-300 hover:cursor-pointer px-2 py-1 text-sm transition-colors"
                                        >
                                            Usuń
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    ) : (
                        <div></div>
                    )}
                </section>
            )}

            {materialy && materialy.length > 0 ? (
                materialy.map((material) => {
                    const fileName = material.nazwa.split("/").pop();

                    return (
                        <div
                            key={material.id}
                            className="flex items-center justify-between p-3 bg-theme-surface border border-theme-muted/30 rounded-[12px] hover:border-theme-orange transition-all duration-200 group"
                        >
                            <a
                                href={`/storage/${material.nazwa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 flex-1"
                            >
                                <span className="text-[24px]">📄</span>
                                <span className="text-[16px] text-theme-text font-medium group-hover:text-theme-orange transition-colors">
                                    {fileName}
                                </span>
                            </a>

                            <div className="flex items-center gap-3">
                                {isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(material.idPlik)
                                        }
                                        className=" text-red-400  hover:text-white px-3 py-1 rounded-[8px] text-[14px] transition-all"
                                    >
                                        Usuń
                                    </button>
                                ) : (
                                    <span className="text-theme-text text-[14px] group-hover:translate-x-1 transition-transform">
                                        Otwórz
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="w-full mx-auto text-center mt-10 text-[20px] text-theme-muted">
                    <span>Brak materiałów</span>
                </div>
            )}
        </div>
    );
}

function Sylabusplusliteratura({ sylabus, literatura, przedmiot, kurs }) {
    return (
        <div className="w-full text-theme-text">
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">
                    Informacje o przedmiocie
                </span>
                <div className="bg-theme-slate p-5 rounded-[10px] w-full">
                    <p>Przedmiot: {przedmiot.nazwa}</p>
                    <p>Semester: {kurs.Semester}</p>
                    <p>ECTS: {przedmiot.punktyECTS}</p>
                    <p>Liczba godzin: {sylabus.iloscGodzin}</p>
                    {sylabus.czyEgzamin === 1 ? (
                        <p>Egzamin: Tak</p>
                    ) : (
                        <p>Egzamin: Nie</p>
                    )}
                </div>
            </div>
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">Opis przedmiotu</span>
                <div className="bg-theme-slate p-5 rounded-[10px] w-full">
                    <p>{sylabus.opisPrzedmiotu}</p>
                </div>
            </div>
            <div className="mb-2 ">
                <span className="font-bold text-[22px]">
                    Warunki zaliczenia
                </span>
                <div className="bg-theme-slate p-5 rounded-[10px] w-full">
                    <p>{sylabus.warunkiZaliczenia}</p>
                </div>
            </div>
            <div>
                <span className="font-bold text-[22px]">Literatura</span>
                <div className="bg-theme-slate p-5 rounded-[10px] w-full">
                    {literatura.map((ksiazka) => (
                        <div
                            key={ksiazka.id}
                            className="border-b border-theme-page pb-1"
                        >
                            <p className="text-[18px]">{ksiazka.nazwa}</p>
                            <p className="text-[14px] font-thin">
                                {ksiazka.opis}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Zadania({ zadania, kursId }) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
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
        if (confirm("Czy na pewno chcesz usunąć to zadanie?")) {
            router.post(`/prowadzacy/usunzadanie/${kursId}/${idZadanie}`, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="h-full overflow-x-auto rounded-[10px]  p-4">
            <div className="w-full py-4 flex justify-between items-center ">
                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`fixed right-[5%]  px-4 py-2 rounded-[10px] font-medium text-white transition-all  ${
                        isEditing
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-theme-orange hover:opacity-90"
                    }`}
                >
                    {isEditing ? "Zakończ edytowanie" : "Edytuj"}
                </button>
            </div>

            {isEditing && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-theme-surface border border-theme-orange rounded-[12px] flex flex-col gap-4">
                    <h4 className="text-theme-text text-lg font-semibold">Dodaj nowe zadanie</h4>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-theme-muted">Nazwa zadania</label>
                        <input
                            type="text"
                            value={data.nazwaZadania}
                            onChange={(e) => setData("nazwaZadania", e.target.value)}
                            className="p-2 bg-theme-slate border border-theme-muted rounded-[8px] text-theme-text"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-theme-muted">Opis</label>
                        <textarea
                            value={data.opis}
                            onChange={(e) => setData("opis", e.target.value)}
                            className="p-2 bg-theme-slate border border-theme-muted rounded-[8px] text-theme-text"
                            rows="4"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-theme-muted">Termin oddania</label>
                        <input
                            type="date"
                            value={data.termin}
                            onChange={(e) => setData("termin", e.target.value)}
                            className="p-2 bg-theme-slate border border-theme-muted rounded-[8px] text-theme-text"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="czyNaOcene"
                            {...data.czyNaOcene && data.czyNaOcene === 1 ? { checked: true } : {}}
                            onChange={(e) =>{
                                if (e.target.checked) {
                                    setData("czyNaOcene", 1);
                                }else {
                                    setData("czyNaOcene", 0);
                                }
                            }  }
                            className="w-4 h-4 accent-theme-orange"
                        />
                        <label htmlFor="czyNaOcene" className="text-sm text-theme-text">Czy na ocenę?</label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[10px] font-medium transition-all w-fit"
                    >
                        {processing ? "Zapisywanie..." : "Zapisz zadanie"}
                    </button>
                </form>
            )}

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-theme-muted text-[14px]">
                        <th className="p-3 font-medium">Nazwa Zadania</th>
                        {isEditing && <th className="p-3 font-medium text-right">Akcje</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {zadania && zadania.length > 0 ? (
                        zadania.map((zadanie) => (
                            <tr
                                key={zadanie.id || zadanie.idZadanie}
                                className="hover:bg-theme-dark-slate/50 transition-colors hover:cursor-pointer"
                                onClick={() => router.get(`/prowadzacy/otworzzadanie/${zadanie.idZadanie}`)}
                            >
                                <td className="p-3 font-medium text-theme-text">
                                    {zadanie.nazwaZadania || "—"}
                                </td>
                                {isEditing && (
                                    <td className="p-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(zadanie.idZadanie)}
                                            className="text-red-400 hover:text-white px-3 py-1 rounded-[8px] text-[14px] transition-all"
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
                                className="p-4 text-theme-text text-theme-muted text-center"
                            >
                                Brak zadań
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
function Studenty({ studenci, kurs }) {
    return (
        <div className="overflow-x-auto rounded-[10px] border border-gray-700/60">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-theme-muted text-[14px]">
                        <th className="p-3 font-medium">Index</th>
                        <th className="p-3 font-medium">Imie i nazwisko</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {studenci && studenci.length > 0 ? (
                        studenci.map((student) => (
                            <tr
                                key={student.idStudent}
                                className="hover:bg-theme-dark-slate/50 transition-colors"
                            >
                                <td className="p-3 font-medium text-theme-text">
                                    {student.index}
                                </td>
                                <td className="p-3 font-medium text-theme-text">
                                    {student.user.name || "—"}{" "}
                                    {student.user.surname || "—"}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.post(
                                                `/prowadzacy/usunstudentazkursu/${student.idStudent}/${kurs.idkurs}`,
                                            )
                                        }
                                        className="shrink-0 text-red-400 hover:text-red-300 hover:cursor-pointer"
                                    >
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                className="p-4 text-theme-text text-theme-muted"
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
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">
                    Kurs
                </span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-surface w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center">
                    <div>
                        <span className="text-theme-text font-bold text-[36px] ">
                            {kurs.nazwa}
                        </span>
                        <br />
                        <span className="text-theme-text font-thin text-[20px] ">
                            {kurs.prowadzacy.TytulNaukowy}{" "}
                            {kurs.prowadzacy.user.name}{" "}
                            {kurs.prowadzacy.user.surname}
                        </span>
                    </div>
                </div>
                    <div className="bg-theme-slate w-full flex-1 min-h-0 flex flex-col p-5 rounded-b-[15px]">                    
                        <div className="w-full flex-1 min-h-0 flex flex-col">
                        <Tabs
                            className="w-full flex flex-col flex-1 min-h-0"
                            selectedTabPanelClassName="!block"
                        >
                            <TabList className="flex border-b border-theme-muted space-x-8 text-theme-text  cursor-pointer list-none text-center">
                                <Tab
                                    className="w-full"
                                    selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                                >
                                    Materiały
                                </Tab>
                                <Tab
                                    className="w-full"
                                    selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                                >
                                    Zadania
                                </Tab>
                                {/* <Tab className="w-full" selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]">Oceny</Tab> */}
                                <Tab
                                    className="w-full"
                                    selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                                >
                                    Dodatkowa informacja
                                </Tab>
                                <Tab
                                    className="w-full"
                                    selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                                >
                                    Użytkowniki
                                </Tab>
                            </TabList>

                            <TabPanel className="hidden w-full flex-1 min-h-0 bg-theme-surface rounded-b-[10px] theme-text p-5 overflow-y-auto custom-scrollbar">
                                <Materialy
                                    materialy={materialy}
                                    kursId={kurs.idkurs}
                                />
                            </TabPanel>
                            <TabPanel className="hidden w-full flex-1 min-h-0 bg-theme-surface rounded-b-[10px] theme-text p-5 overflow-y-auto custom-scrollbar">
                                <Zadania zadania={zadania} kursId={kurs.idkurs} />
                            </TabPanel>
                            {/* <TabPanel className="hidden bg-theme-surface h-full rounded-b-[10px]  theme-text">
                                <Oceny oceny={oceny}/>
                            </TabPanel> */}
                            <TabPanel className="hidden w-full flex-1 min-h-0 bg-theme-surface rounded-b-[10px] theme-text p-5 overflow-y-auto custom-scrollbar">
                                <Sylabusplusliteratura
                                    sylabus={sylabus}
                                    literatura={literatura}
                                    przedmiot={przedmiot}
                                    kurs={kurs}
                                />
                            </TabPanel>
                            <TabPanel className="hidden w-full flex-1 min-h-0 bg-theme-surface rounded-b-[10px] theme-text p-5 overflow-y-auto custom-scrollbar">
                                <Studenty studenci={studenci} kurs={kurs} />
                            </TabPanel>
                        </Tabs>
                    </div>
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
