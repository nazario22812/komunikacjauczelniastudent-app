import React, { useEffect, useMemo, useState } from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ToastContainer, toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

const pole = "w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-3 py-3 text-sm text-theme-text outline-none transition-colors placeholder:text-theme-muted focus:border-theme-orange";
const przycisk = "inline-flex min-h-[42px] items-center justify-center rounded-xl bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const pomocniczy = "inline-flex min-h-[40px] items-center justify-center rounded-xl border border-theme-muted bg-theme-slate px-4 py-2 text-sm font-medium text-theme-text transition-colors hover:bg-theme-panel";

function Materialy({ materialy = [], kursId }) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ pliks: [] });

    const handleDelete = (idPlik) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten materiał?")) return;
        router.post(`/prowadzacy/usunmaterialy/${kursId}/${idPlik}`, {}, { preserveScroll: true });
    };

    const removeFile = (indexToRemove) => {
        setData("pliks", data.pliks.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.pliks.length || processing) return;
        post(`/prowadzacy/dodajmaterialy/${kursId}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset("pliks"),
        });
    };

    const onDrop = (acceptedFiles) => {
        const previousFiles = Array.isArray(data.pliks) ? data.pliks : [];
        const newFiles = acceptedFiles.filter((newFile) => !previousFiles.some((file) =>
            file.name === newFile.name && file.size === newFile.size && file.lastModified === newFile.lastModified
        ));
        setData("pliks", [...previousFiles, ...newFiles]);
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

    return (
        <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-theme-text sm:text-xl">Materiały dydaktyczne</h2>
                    <p className="text-sm text-theme-muted">Pliki udostępnione studentom · {materialy.length}</p>
                </div>
                <button type="button" onClick={() => setIsEditing(!isEditing)} className={isEditing ? pomocniczy : przycisk}>
                    {isEditing ? "Zakończ edytowanie" : "+ Zarządzaj materiałami"}
                </button>
            </div>

            {isEditing && (
                <form onSubmit={handleSubmit} className="min-w-0 space-y-4 rounded-2xl border border-theme-muted bg-theme-slate p-3 sm:p-5">
                    <div>
                        <h3 className="text-base font-bold text-theme-text">Dodaj materiały</h3>
                        <p className="mt-1 text-sm text-theme-muted">Przeciągnij pliki lub wybierz je z urządzenia.</p>
                    </div>
                    <div {...getRootProps({ className: `flex min-h-[150px] w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors ${isDragActive ? "border-theme-orange bg-theme-surface" : "border-theme-muted bg-theme-surface hover:border-theme-orange"}` })}>
                        <input {...getInputProps()} />
                        <span aria-hidden="true" className="text-3xl">📂</span>
                        <p className="break-words font-semibold text-theme-text">{isDragActive ? "Upuść pliki tutaj" : "Przeciągnij pliki tutaj"}</p>
                        <p className="text-sm text-theme-muted">lub kliknij, aby wybrać</p>
                    </div>
                    {fileRejections.length > 0 && <p className="text-sm text-theme-red">Niektóre pliki mają nieobsługiwany format.</p>}
                    {errors.pliks && <p className="text-sm text-theme-red">{errors.pliks}</p>}
                    {data.pliks.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-theme-text">Wybrane pliki ({data.pliks.length})</h4>
                            {data.pliks.map((file, index) => (
                                <div key={`${file.name}-${file.lastModified}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-theme-muted bg-theme-surface px-3 py-2">
                                    <span aria-hidden="true">📎</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="break-words text-sm font-medium text-theme-text [overflow-wrap:anywhere]">{file.name}</p>
                                        <p className="text-xs text-theme-muted">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button type="button" onClick={() => removeFile(index)} className="shrink-0 text-sm font-medium text-theme-red hover:underline">Usuń</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button type="submit" disabled={processing || data.pliks.length === 0} className={przycisk}>
                        {processing ? "Zapisywanie..." : "Zapisz zmiany"}
                    </button>
                </form>
            )}

            {materialy.length > 0 ? (
                <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
                    {materialy.map((material, index) => (
                        <div key={material.idPlik ?? material.id ?? index} className="flex min-w-0 items-center gap-3 rounded-2xl border border-theme-muted bg-theme-slate p-3 transition-colors hover:border-theme-orange sm:p-4">
                            <a href={`/storage/${material.nazwa}`} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-1 items-center gap-3 text-theme-text no-underline">
                                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-surface text-xl">📄</span>
                                <span className="min-w-0 break-words text-sm font-semibold [overflow-wrap:anywhere] sm:text-base">{material.nazwa?.split("/").pop() || "Plik"}</span>
                            </a>
                            {isEditing ? (
                                <button type="button" onClick={() => handleDelete(material.idPlik)} className="shrink-0 rounded-lg px-2 py-2 text-sm font-medium text-theme-red hover:underline">Usuń</button>
                            ) : <span className="shrink-0 text-xs text-theme-muted">Otwórz</span>}
                        </div>
                    ))}
                </div>
            ) : <div className="rounded-2xl border border-theme-muted bg-theme-slate px-4 py-12 text-center text-theme-muted">Brak materiałów</div>}
        </section>
    );
}

function Sylabusplusliteratura({ sylabus, literatura = [], przedmiot, kurs }) {
    const info = [
        ["Przedmiot", przedmiot?.nazwa],
        ["Semestr", kurs?.Semester],
        ["Punkty ECTS", przedmiot?.punktyECTS],
        ["Liczba godzin", sylabus?.iloscGodzin],
        ["Egzamin", sylabus ? (Number(sylabus.czyEgzamin) === 1 ? "Tak" : "Nie") : null],
    ];
    return (
        <div className="min-w-0 space-y-5">
            <section className="space-y-3">
                <h2 className="text-lg font-bold text-theme-text sm:text-xl">Informacje o przedmiocie</h2>
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {info.map(([label, value]) => (
                        <div key={label} className="min-w-0 rounded-2xl border border-theme-muted bg-theme-slate p-4">
                            <p className="text-xs font-medium text-theme-muted">{label}</p>
                            <p className="mt-2 break-words text-base font-semibold text-theme-text [overflow-wrap:anywhere]">{value ?? "Brak danych"}</p>
                        </div>
                    ))}
                </div>
            </section>
            {[["Opis przedmiotu", sylabus?.opisPrzedmiotu], ["Warunki zaliczenia", sylabus?.warunkiZaliczenia]].map(([label, value]) => (
                <section key={label} className="min-w-0 rounded-2xl border border-theme-muted bg-theme-slate p-4 sm:p-5">
                    <h2 className="mb-3 text-lg font-bold text-theme-text">{label}</h2>
                    <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-theme-text [overflow-wrap:anywhere] sm:text-base">{value || "Brak informacji"}</p>
                </section>
            ))}
            <section className="space-y-3">
                <h2 className="text-lg font-bold text-theme-text sm:text-xl">Literatura</h2>
                {literatura.length ? literatura.map((ksiazka, index) => (
                    <div key={ksiazka.idLiteratura ?? ksiazka.id ?? index} className="min-w-0 rounded-2xl border border-theme-muted bg-theme-slate p-4 sm:p-5">
                        <p className="break-words font-semibold text-theme-text">{ksiazka.nazwa}</p>
                        <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-relaxed text-theme-muted">{ksiazka.opis}</p>
                    </div>
                )) : <div className="rounded-2xl border border-theme-muted bg-theme-slate p-5 text-theme-muted">Brak literatury</div>}
            </section>
        </div>
    );
}

function Zadania({ zadania = [], kursId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [szukaj, setSzukaj] = useState("");
    const { data, setData, post, processing, reset, errors } = useForm({
        nazwaZadania: "", opis: "", termin: "", czyNaOcene: 1,
    });
    const filtrowane = useMemo(() => zadania.filter((zadanie) =>
        `${zadanie.nazwaZadania ?? ""} ${zadanie.tresc ?? ""}`.toLocaleLowerCase("pl-PL").includes(szukaj.trim().toLocaleLowerCase("pl-PL"))
    ), [zadania, szukaj]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/prowadzacy/dodajzadanie/${kursId}`, {
            preserveState: true, preserveScroll: true, onSuccess: () => reset(),
        });
    };
    const handleDelete = (idZadanie) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to zadanie?")) return;
        router.post(`/prowadzacy/usunzadanie/${kursId}/${idZadanie}`, {}, { preserveScroll: true });
    };

    return (
        <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-theme-text sm:text-xl">Zadania</h2>
                    <p className="text-sm text-theme-muted">Zarządzaj zadaniami swojego kursu · {zadania.length}</p>
                </div>
                <button type="button" onClick={() => setIsEditing(!isEditing)} className={isEditing ? pomocniczy : przycisk}>
                    {isEditing ? "Zakończ edytowanie" : "+ Zarządzaj zadaniami"}
                </button>
            </div>

            {isEditing && (
                <form onSubmit={handleSubmit} className="min-w-0 space-y-4 rounded-2xl border border-theme-muted bg-theme-slate p-3 sm:p-5">
                    <h3 className="text-base font-bold text-theme-text">Dodaj nowe zadanie</h3>
                    <div>
                        <label htmlFor="nazwa-zadania" className="mb-2 block text-sm font-medium text-theme-text">Nazwa zadania</label>
                        <input id="nazwa-zadania" type="text" className={pole} value={data.nazwaZadania} onChange={(e) => setData("nazwaZadania", e.target.value)} required />
                        {errors.nazwaZadania && <p className="mt-1 text-sm text-theme-red">{errors.nazwaZadania}</p>}
                    </div>
                    <div>
                        <label htmlFor="opis-zadania" className="mb-2 block text-sm font-medium text-theme-text">Opis</label>
                        <textarea id="opis-zadania" rows={4} className={pole} value={data.opis} onChange={(e) => setData("opis", e.target.value)} />
                        {errors.opis && <p className="mt-1 text-sm text-theme-red">{errors.opis}</p>}
                    </div>
                    <div>
                        <label htmlFor="termin-zadania" className="mb-2 block text-sm font-medium text-theme-text">Termin oddania</label>
                        <input id="termin-zadania" type="date" className={pole} value={data.termin} onChange={(e) => setData("termin", e.target.value)} />
                        {errors.termin && <p className="mt-1 text-sm text-theme-red">{errors.termin}</p>}
                    </div>
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-theme-text">
                        <input type="checkbox" checked={Number(data.czyNaOcene) === 1} onChange={(e) => setData("czyNaOcene", e.target.checked ? 1 : 0)} className="h-4 w-4 shrink-0 accent-orange-500" />
                        Czy na ocenę?
                    </label>
                    <button type="submit" disabled={processing} className={przycisk}>{processing ? "Zapisywanie..." : "Zapisz zadanie"}</button>
                </form>
            )}

            <div className="relative max-w-[420px]">
                <input type="search" aria-label="Szukaj zadań" className={pole} placeholder="Szukaj zadania..." value={szukaj} onChange={(e) => setSzukaj(e.target.value)} />
            </div>
            {filtrowane.length ? (
                <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
                    {filtrowane.map((zadanie, index) => (
                        <div key={zadanie.idZadanie ?? zadanie.id ?? index} className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-theme-muted bg-theme-slate p-4 transition-colors hover:border-theme-orange">
                            <div className="min-w-0">
                                <h3 className="break-words text-base font-bold text-theme-text sm:text-lg">{zadanie.nazwaZadania || "—"}</h3>
                                {zadanie.TerminOddania && <p className="mt-2 text-xs text-theme-muted">Termin oddania: {zadanie.TerminOddania}</p>}
                                {zadanie.tresc && <p className="mt-2 line-clamp-2 break-words text-sm text-theme-muted">{zadanie.tresc}</p>}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => router.get(`/prowadzacy/otworzzadanie/${zadanie.idZadanie}`)} className={`${pomocniczy} flex-1`}>Otwórz zadanie</button>
                                {isEditing && <button type="button" onClick={() => handleDelete(zadanie.idZadanie)} className="min-h-[40px] rounded-xl border border-theme-muted px-4 py-2 text-sm font-medium text-theme-red hover:bg-theme-surface">Usuń</button>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : <div className="rounded-2xl border border-theme-muted bg-theme-slate px-4 py-12 text-center text-theme-muted">{szukaj.trim() ? "Nie znaleziono zadań" : "Brak zadań"}</div>}
        </section>
    );
}

function Studenty({ studenci = [], kurs }) {
    const [deletingId, setDeletingId] = useState(null);
    const [szukaj, setSzukaj] = useState("");
    const filtrowani = useMemo(() => studenci.filter((student) =>
        `${student.index ?? ""} ${student.user?.name ?? ""} ${student.user?.surname ?? ""}`.toLocaleLowerCase("pl-PL").includes(szukaj.trim().toLocaleLowerCase("pl-PL"))
    ), [studenci, szukaj]);

    const handleDelete = (studentId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć studenta z kursu?")) return;
        setDeletingId(studentId);
        router.post(`/prowadzacy/usunstudentazkursu/${studentId}/${kurs.idkurs}`, {}, {
            preserveScroll: true, onFinish: () => setDeletingId(null),
        });
    };

    return (
        <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-theme-text sm:text-xl">Studenci kursu</h2>
                    <p className="text-sm text-theme-muted">Zapisani studenci · {studenci.length}</p>
                </div>
                <input type="search" aria-label="Szukaj studenta" className={`${pole} sm:max-w-[300px]`} placeholder="Szukaj po nazwisku lub indeksie..." value={szukaj} onChange={(e) => setSzukaj(e.target.value)} />
            </div>
            {filtrowani.length ? (
                <div className="min-w-0 overflow-hidden rounded-2xl border border-theme-muted bg-theme-slate">
                    <div className="hidden grid-cols-[minmax(100px,0.4fr)_minmax(0,1fr)_100px] gap-3 border-b border-theme-muted px-4 py-3 text-xs font-semibold text-theme-muted sm:grid">
                        <span>Indeks</span><span>Imię i nazwisko</span><span className="text-right">Akcje</span>
                    </div>
                    {filtrowani.map((student) => (
                        <div key={student.idStudent} className="flex min-w-0 flex-col gap-3 border-b border-theme-muted p-4 last:border-b-0 sm:grid sm:grid-cols-[minmax(100px,0.4fr)_minmax(0,1fr)_100px] sm:items-center sm:gap-3">
                            <span className="break-words text-xs font-semibold text-theme-muted sm:text-sm">{student.index}</span>
                            <span className="min-w-0 break-words font-medium text-theme-text [overflow-wrap:anywhere]">{student.user?.name || "—"} {student.user?.surname || "—"}</span>
                            <button type="button" disabled={deletingId === student.idStudent} onClick={() => handleDelete(student.idStudent)} className="self-start text-left text-sm font-medium text-theme-red hover:underline disabled:opacity-50 sm:text-right">
                                {deletingId === student.idStudent ? "Usuwanie..." : "Usuń"}
                            </button>
                        </div>
                    ))}
                </div>
            ) : <div className="rounded-2xl border border-theme-muted bg-theme-slate px-4 py-12 text-center text-theme-muted">{szukaj.trim() ? "Nie znaleziono studentów" : "Brak studentów"}</div>}
        </section>
    );
}

function Content({ kurs, materialy = [], sylabus, literatura = [], przedmiot, zadania = [], studenci = [] }) {
    const tabClass = "flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-t-xl px-3 py-2 text-sm font-semibold text-theme-muted transition-colors hover:text-theme-text focus:outline-none sm:flex-1 sm:px-4";
    const tabPanelClass = "hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-2xl bg-theme-surface p-3 text-theme-text custom-scrollbar sm:p-5";
    const teacher = [kurs?.prowadzacy?.TytulNaukowy, kurs?.prowadzacy?.user?.name, kurs?.prowadzacy?.user?.surname].filter(Boolean).join(" ");

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <header className="flex h-[42px] w-full shrink-0 items-center rounded-t-xl border-b border-theme-muted bg-theme-page px-2 sm:px-3">
                <div className="flex w-[42px] shrink-0 justify-start"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 truncate text-center text-sm font-bold text-theme-text sm:text-base">Szczegóły kursu</span>
                <div className="w-[42px] shrink-0" />
            </header>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 pb-2 pt-3 sm:px-2 md:px-4">
                <section className="min-w-0 shrink-0 rounded-2xl bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-theme-muted">Kurs · Prowadzący</p>
                            <h1 className="break-words text-2xl font-bold leading-tight text-theme-text sm:text-3xl lg:text-[34px]">{kurs?.nazwa || "Kurs"}</h1>
                            {teacher && <p className="mt-2 break-words text-sm text-theme-muted sm:text-base">{teacher}</p>}
                        </div>
                        <div className="flex min-w-0 flex-wrap gap-2 lg:max-w-[360px] lg:justify-end">
                            {kurs?.Semester != null && <span className="rounded-xl border border-theme-muted bg-theme-slate px-3 py-2 text-xs font-medium text-theme-text">Semestr {kurs.Semester}</span>}
                            {kurs?.kod && <span className="break-all rounded-xl border border-theme-muted bg-theme-slate px-3 py-2 text-xs font-medium text-theme-text">Kod: <strong>{kurs.kod}</strong></span>}
                            <span className="rounded-xl border border-theme-muted bg-theme-slate px-3 py-2 text-xs font-medium text-theme-text">Studenci: {studenci.length}</span>
                        </div>
                    </div>
                </section>

                <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-2xl bg-theme-slate p-2 sm:p-3 md:p-4">
                    <Tabs className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
                        <TabList className="hide-scrollbar flex w-full min-w-0 shrink-0 gap-1 overflow-x-auto border-b border-theme-muted pb-0 text-theme-text sm:gap-2">
                            <Tab className={tabClass} selectedClassName="!border-0 !bg-theme-surface !text-theme-text">Materiały</Tab>
                            <Tab className={tabClass} selectedClassName="!border-0 !bg-theme-surface !text-theme-text">Zadania</Tab>
                            <Tab className={tabClass} selectedClassName="!border-0 !bg-theme-surface !text-theme-text">Dodatkowa informacja</Tab>
                            <Tab className={tabClass} selectedClassName="!border-0 !bg-theme-surface !text-theme-text">Studenci</Tab>
                        </TabList>
                        <TabPanel className={tabPanelClass} selectedClassName="!block"><Materialy materialy={materialy} kursId={kurs?.idkurs} /></TabPanel>
                        <TabPanel className={tabPanelClass} selectedClassName="!block"><Zadania zadania={zadania} kursId={kurs?.idkurs} /></TabPanel>
                        <TabPanel className={tabPanelClass} selectedClassName="!block"><Sylabusplusliteratura sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} kurs={kurs} /></TabPanel>
                        <TabPanel className={tabPanelClass} selectedClassName="!block"><Studenty studenci={studenci} kurs={kurs} /></TabPanel>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}

export default function Kurs({ auth, kurs, materialy, sylabus, literatura, przedmiot, zadania, studenci }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;

    useEffect(() => {
        if (message) toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        if (error) toast.error(error, { position: "bottom-right", autoClose: 5000, theme: "dark" });
    }, [message, error]);

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Head title="Kurs" />
            <MenuProwadzacy />
            <Content kurs={kurs} materialy={materialy} sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} zadania={zadania} studenci={studenci} />
        </div>
    );
}
