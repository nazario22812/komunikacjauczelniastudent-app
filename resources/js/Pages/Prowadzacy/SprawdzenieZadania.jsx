import React, { useEffect, useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { ToastContainer, toast } from "react-toastify";

const opcjeOcen = [
    "Niedostatecznie",
    "Dostatecznie",
    "Dostatecznie plus",
    "Dobrze",
    "Dobrze plus",
    "Bardzo dobrze",
];

const normalize = (value) => String(value ?? "").toLocaleLowerCase("pl").trim();

function Content({ studenci = [], idZadanie, student_id, pliks = [], terminOddania }) {
    const [szukaj, setSzukaj] = useState("");
    const [wybranaocena, setWybranaocena] = useState("Niedostatecznie");
    const [loading, setLoading] = useState(false);
    const [changingStudent, setChangingStudent] = useState(false);

    const przefiltrowaniStudenci = useMemo(() => {
        const query = normalize(szukaj);
        if (!query) return studenci ?? [];
        return (studenci ?? []).filter((student) =>
            normalize(`${student.index ?? ""} ${student.user?.name ?? ""} ${student.user?.surname ?? ""}`).includes(query),
        );
    }, [studenci, szukaj]);

    const wybranyStudent = (studenci ?? []).find(
        (student) => String(student.idStudent) === String(student_id),
    );

    const handleZadanieClick = (studentId) => {
        if (changingStudent || String(studentId) === String(student_id)) return;
        setChangingStudent(true);
        router.get(
            `/prowadzacy/otworzzadanie/${idZadanie}`,
            { student_id: studentId },
            { preserveState: true, preserveScroll: true, onFinish: () => setChangingStudent(false) },
        );
    };

    const handleZapiszOcene = () => {
        if (loading || !student_id) return;
        setLoading(true);
        router.post(
            `/prowadzacy/ocenieniezadania/${idZadanie}/${student_id}/${encodeURIComponent(wybranaocena)}`,
            {},
            { preserveScroll: true, onFinish: () => setLoading(false) },
        );
    };

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[42px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[46px] shrink-0 justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 truncate text-center text-[15px] font-bold text-theme-text sm:text-[16px]">
                    Sprawdzenie zadania
                </span>
                <div className="w-[46px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] bg-theme-slate p-3 sm:p-4 lg:p-5">
                    <header className="mb-4 flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-3 rounded-[14px] bg-theme-surface p-4 sm:p-5">
                        <div className="min-w-0">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-theme-muted">
                                Zarządzanie zadaniem
                            </p>
                            <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">
                                Sprawdzenie zadania
                            </h1>
                            <p className="mt-1 text-sm text-theme-muted">
                                Wybierz studenta, sprawdź przesłane materiały i wystaw ocenę.
                            </p>
                        </div>
                        <div className="rounded-[12px] border border-theme-muted bg-theme-slate px-4 py-3 text-center">
                            <span className="block text-2xl font-bold text-theme-text">{(studenci ?? []).length}</span>
                            <span className="block text-xs text-theme-muted">Studentów</span>
                        </div>
                    </header>

                    <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(250px,0.88fr)_minmax(0,1.12fr)]">
                        <section className="flex min-h-[230px] min-w-0 flex-col overflow-hidden rounded-[14px] bg-theme-surface lg:min-h-0">
                            <div className="shrink-0 border-b border-theme-muted p-3 sm:p-4">
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <h2 className="text-lg font-bold text-theme-text sm:text-xl">Lista studentów</h2>
                                    <span className="text-xs text-theme-muted">
                                        {przefiltrowaniStudenci.length} z {(studenci ?? []).length}
                                    </span>
                                </div>
                                <input
                                    type="search"
                                    aria-label="Szukaj studenta"
                                    placeholder="Szukaj po nazwisku lub indeksie..."
                                    value={szukaj}
                                    onChange={(event) => setSzukaj(event.target.value)}
                                    className="h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text placeholder:text-theme-muted focus:border-theme-orange focus:outline-none"
                                />
                            </div>

                            <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto p-2 sm:p-3">
                                {przefiltrowaniStudenci.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {przefiltrowaniStudenci.map((student) => {
                                            const selected = String(student.idStudent) === String(student_id);
                                            return (
                                                <button
                                                    key={student.idStudent}
                                                    type="button"
                                                    disabled={changingStudent}
                                                    onClick={() => handleZadanieClick(student.idStudent)}
                                                    aria-pressed={selected}
                                                    className={`flex min-w-0 w-full items-center justify-between gap-3 rounded-[11px] border p-3 text-left transition-colors disabled:cursor-wait ${
                                                        selected
                                                            ? "border-theme-orange bg-theme-slate"
                                                            : "border-theme-muted bg-theme-slate hover:border-theme-orange"
                                                    }`}
                                                >
                                                    <div className="min-w-0">
                                                        <span className="block break-words text-sm font-semibold text-theme-text sm:text-base">
                                                            {student.user?.name || "—"} {student.user?.surname || ""}
                                                        </span>
                                                        <span className="mt-1 block break-words text-xs text-theme-muted">
                                                            Indeks: {student.index ?? "—"}
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0 text-sm font-semibold text-theme-text">
                                                        {selected ? "Wybrano" : "›"}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[140px] items-center justify-center p-4 text-center text-sm text-theme-muted">
                                        {(studenci ?? []).length ? "Nie znaleziono studentów" : "Brak studentów"}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="custom-scrollbar min-h-[270px] min-w-0 overflow-y-auto rounded-[14px] bg-theme-surface p-3 sm:p-4 lg:min-h-0">
                            {student_id ? (
                                <div className="flex min-w-0 flex-col gap-4">
                                    <div className="rounded-[12px] bg-theme-slate p-4">
                                        <span className="block text-xs font-semibold uppercase tracking-wide text-theme-muted">
                                            Wybrany student
                                        </span>
                                        <h2 className="mt-1 break-words text-lg font-bold text-theme-text sm:text-xl">
                                            {wybranyStudent
                                                ? `${wybranyStudent.user?.name ?? ""} ${wybranyStudent.user?.surname ?? ""}`.trim() || "Student"
                                                : "Student"}
                                        </h2>
                                        {wybranyStudent?.index != null && (
                                            <p className="mt-1 text-sm text-theme-muted">Indeks: {wybranyStudent.index}</p>
                                        )}
                                        <p className="mt-2 break-words text-sm text-theme-muted">
                                            Termin oddania: <span className="font-semibold text-theme-text">{terminOddania || "Brak"}</span>
                                        </p>
                                    </div>

                                    <div className="rounded-[12px] border border-theme-muted bg-theme-slate p-4">
                                        <h3 className="text-base font-bold text-theme-text sm:text-lg">Wystaw ocenę</h3>
                                        <label htmlFor="ocena-zadania" className="mb-2 mt-3 block text-sm font-medium text-theme-muted">
                                            Wybierz ocenę
                                        </label>
                                        <select
                                            id="ocena-zadania"
                                            value={wybranaocena}
                                            onChange={(event) => setWybranaocena(event.target.value)}
                                            disabled={loading}
                                            className="h-[46px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text focus:border-theme-orange focus:outline-none sm:text-base"
                                        >
                                            {opcjeOcen.map((ocena) => (
                                                <option key={ocena} value={ocena}>{ocena}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleZapiszOcene}
                                            disabled={loading}
                                            className="mt-3 min-h-[44px] w-full cursor-pointer rounded-[10px] bg-theme-orange px-4 py-2 text-sm font-bold text-theme-text transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
                                        >
                                            {loading ? "Zapisywanie..." : "Zapisz ocenę"}
                                        </button>
                                    </div>

                                    <div className="rounded-[12px] border border-theme-muted bg-theme-slate p-4">
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-base font-bold text-theme-text sm:text-lg">Przesłane pliki</h3>
                                            <span className="text-xs text-theme-muted">{(pliks ?? []).length} plików</span>
                                        </div>
                                        {(pliks ?? []).length > 0 ? (
                                            <ul className="flex min-w-0 flex-col gap-2">
                                                {pliks.map((file, index) => {
                                                    const fileName = file?.nazwa?.split("/").pop() || file?.name || "Plik";
                                                    return (
                                                        <li key={`${file?.nazwa ?? file?.name ?? "plik"}-${index}`}>
                                                            <a
                                                                href={`/storage/${file.nazwa}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex min-w-0 items-center justify-between gap-3 rounded-[10px] border border-theme-muted bg-theme-surface p-3 transition-colors hover:border-theme-orange"
                                                            >
                                                                <span className="flex min-w-0 items-center gap-3">
                                                                    <span className="shrink-0 text-xl" aria-hidden="true">📎</span>
                                                                    <span className="min-w-0 break-words text-sm font-medium text-theme-text [overflow-wrap:anywhere]">
                                                                        {fileName}
                                                                        {file.size != null && (
                                                                            <span className="mt-1 block text-xs font-normal text-theme-muted">
                                                                                {(Number(file.size) / 1024).toFixed(1)} KB
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </span>
                                                                <span className="shrink-0 text-xs font-semibold text-theme-text">Otwórz ›</span>
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <div className="rounded-[10px] bg-theme-surface px-4 py-8 text-center text-sm text-theme-muted">
                                                Brak przesłanych plików
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 p-5 text-center">
                                    <span className="text-4xl" aria-hidden="true">📋</span>
                                    <h2 className="text-lg font-bold text-theme-text">Wybierz studenta</h2>
                                    <p className="max-w-[340px] text-sm text-theme-muted">
                                        Wybierz osobę z listy, aby sprawdzić pliki i wystawić ocenę.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SprawdzenieZadania({ auth, studenci, idZadanie, student_id, pliks, terminOddania }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;

    useEffect(() => {
        if (message) toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        if (error) toast.error(error, { position: "bottom-right", autoClose: 5000, theme: "dark" });
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
            <Head title="Sprawdzenie zadania" />
            <MenuProwadzacy />
            <Content
                studenci={studenci}
                idZadanie={idZadanie}
                student_id={student_id}
                pliks={pliks}
                terminOddania={terminOddania}
            />
        </div>
    );
}
