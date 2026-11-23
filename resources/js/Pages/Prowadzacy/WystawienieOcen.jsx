import React, { useEffect, useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

const opcjeOcen = [
    "Niedostatecznie",
    "Dostatecznie",
    "Dostatecznie plus",
    "Dobrze",
    "Dobrze plus",
    "Bardzo dobrze",
];

const fieldClass =
    "h-11 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none focus:border-theme-orange focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50";

function OcenaBadge({ ocena }) {
    const label = ocena || "Brak";
    const normalized = String(label).toLocaleLowerCase("pl");
    const tone = normalized === "brak"
        ? "border-theme-muted bg-theme-slate text-theme-muted"
        : normalized.includes("niedostatecz")
          ? "border-red-500 bg-red-950 text-red-200"
          : "border-green-600 bg-green-950 text-green-200";

    return (
        <span className={`inline-flex max-w-full break-words rounded-lg border px-2.5 py-1 text-xs font-semibold sm:text-sm ${tone}`}>
            {label}
        </span>
    );
}

function StudentRow({ student, wybranyprzedmiot }) {
    const [wybranaocena, setWybranaocena] = useState("Niedostatecznie");
    const [obecnaOcena, setObecnaOcena] = useState(student.existingOcena || "Brak");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setObecnaOcena(student.existingOcena || "Brak");
    }, [student.existingOcena]);

    const handleWystawOcene = () => {
        if (loading || !wybranyprzedmiot) return;
        const ocenaDoZapisu = wybranaocena;
        setLoading(true);
        router.post(
            `/prowadzacy/ocenekoncowe/wystawienieoceny/${wybranyprzedmiot}/${student.idStudent}/${encodeURIComponent(ocenaDoZapisu)}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setObecnaOcena(ocenaDoZapisu),
                onFinish: () => setLoading(false),
            },
        );
    };

    const studentName = [student.user?.name, student.user?.surname]
        .filter(Boolean)
        .join(" ") || "Nieznany student";

    const action = (
        <div className="flex min-w-0 items-center gap-2">
            <select
                aria-label={`Wybierz ocenę dla ${studentName}`}
                value={wybranaocena}
                onChange={(e) => setWybranaocena(e.target.value)}
                disabled={loading}
                className={`${fieldClass} flex-1`}
            >
                {opcjeOcen.map((ocena) => (
                    <option key={ocena} value={ocena}>{ocena}</option>
                ))}
            </select>
            <button
                type="button"
                disabled={loading || !wybranyprzedmiot}
                onClick={handleWystawOcene}
                className="min-h-11 shrink-0 cursor-pointer rounded-xl bg-theme-orange px-3 text-sm font-semibold text-theme-text transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                aria-label={`Zapisz ocenę dla ${studentName}`}
            >
                {loading ? "Zapisywanie..." : "Zapisz"}
            </button>
        </div>
    );

    return (
        <>
            <tr className="hidden border-b border-theme-muted text-sm text-theme-text transition-colors hover:bg-theme-panel lg:table-row">
                <td className="break-words px-4 py-4 font-medium">{student.index || "—"}</td>
                <td className="break-words px-4 py-4 font-semibold">{studentName}</td>
                <td className="px-4 py-4"><OcenaBadge ocena={obecnaOcena} /></td>
                <td className="px-4 py-4">{action}</td>
            </tr>

            <tr className="lg:hidden">
                <td colSpan={4} className="pb-3">
                    <article className="min-w-0 rounded-2xl border border-theme-muted bg-theme-surface p-4 text-theme-text">
                        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-theme-muted pb-3">
                            <div className="min-w-0 flex-1">
                                <p className="break-words text-base font-semibold">{studentName}</p>
                                <p className="mt-1 text-xs text-theme-muted">Indeks: {student.index || "—"}</p>
                            </div>
                            <OcenaBadge ocena={obecnaOcena} />
                        </div>
                        <div className="mt-3">
                            <label className="mb-2 block text-xs font-medium text-theme-muted">Wystaw ocenę końcową</label>
                            {action}
                        </div>
                    </article>
                </td>
            </tr>
        </>
    );
}

function Content({ zajecia = [], selectedZajecieId, studenci = [] }) {
    const [wybranyprzedmiot, setWybranyprzedmiot] = useState(selectedZajecieId ?? "");
    const [search, setSearch] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");

    useEffect(() => {
        setWybranyprzedmiot(selectedZajecieId ?? "");
        setSearch("");
        setGradeFilter("all");
    }, [selectedZajecieId]);

    const selectedZajecie = (zajecia ?? []).find(
        (z) => String(z.idZajęcie) === String(wybranyprzedmiot),
    );

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLocaleLowerCase("pl");
        return (studenci ?? []).filter((student) => {
            const matchSearch = [student.index, student.user?.name, student.user?.surname]
                .filter((v) => v != null)
                .join(" ")
                .toLocaleLowerCase("pl")
                .includes(query);
            const hasGrade = Boolean(student.existingOcena && student.existingOcena !== "Brak");
            return matchSearch && (
                gradeFilter === "all" ||
                (gradeFilter === "graded" && hasGrade) ||
                (gradeFilter === "ungraded" && !hasGrade)
            );
        });
    }, [studenci, search, gradeFilter]);

    const gradedCount = (studenci ?? []).filter(
        (s) => s.existingOcena && s.existingOcena !== "Brak",
    ).length;

    const handleZajecieChange = (event) => {
        const noweZajecieId = event.target.value;
        setWybranyprzedmiot(noweZajecieId);
        router.get(
            "/prowadzacy/wystawienieocen",
            { zajecie_id: noweZajecieId },
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetFilters = () => {
        setSearch("");
        setGradeFilter("all");
    };

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-10 w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2">
                <div className="flex w-[50px] shrink-0 items-center"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 truncate text-center text-sm font-bold text-theme-text sm:text-base">Wystawienie ocen</span>
                <div className="w-[50px] shrink-0" />
            </div>

            <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden pt-3 sm:px-2 md:px-4">
                <header className="shrink-0 rounded-2xl bg-theme-surface p-4 sm:p-5">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-theme-muted">Panel prowadzącego</p>
                            <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">Oceny końcowe</h1>
                            <p className="mt-1 text-sm text-theme-muted">Wybierz zajęcia i wystaw oceny studentom.</p>
                        </div>
                        <div className="rounded-xl bg-theme-slate px-4 py-3 text-center">
                            <p className="text-xl font-bold text-theme-text">{(studenci ?? []).length}</p>
                            <p className="text-xs text-theme-muted">Studentów</p>
                        </div>
                    </div>
                </header>

                <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden rounded-2xl bg-theme-slate p-3 sm:p-5">
                    <div className="grid shrink-0 min-w-0 grid-cols-1 gap-3 rounded-xl bg-theme-surface p-3 sm:p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_180px]">
                        <div className="min-w-0">
                            <label htmlFor="wybor-przedmiotu" className="mb-1.5 block text-xs font-semibold text-theme-muted">Zajęcia</label>
                            <select
                                id="wybor-przedmiotu"
                                value={wybranyprzedmiot}
                                onChange={handleZajecieChange}
                                className={fieldClass}
                            >
                                <option value="">Wybierz przedmiot</option>
                                {(zajecia ?? []).map((z) => (
                                    <option key={z.idZajęcie} value={z.idZajęcie}>
                                        {z.NazwaPrzedmiotu}, {z.TypZajec}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="min-w-0">
                            <label htmlFor="szukaj-studenta" className="mb-1.5 block text-xs font-semibold text-theme-muted">Szukaj studenta</label>
                            <input
                                id="szukaj-studenta"
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Imię, nazwisko lub indeks"
                                disabled={!wybranyprzedmiot}
                                className={fieldClass}
                            />
                        </div>
                        <div className="min-w-0">
                            <label htmlFor="filtr-ocen" className="mb-1.5 block text-xs font-semibold text-theme-muted">Oceny</label>
                            <select
                                id="filtr-ocen"
                                value={gradeFilter}
                                onChange={(e) => setGradeFilter(e.target.value)}
                                disabled={!wybranyprzedmiot}
                                className={fieldClass}
                            >
                                <option value="all">Wszyscy</option>
                                <option value="graded">Z oceną</option>
                                <option value="ungraded">Bez oceny</option>
                            </select>
                        </div>
                    </div>

                    {wybranyprzedmiot && (
                        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-1 text-xs text-theme-muted sm:text-sm">
                            <span className="min-w-0 break-words">
                                {selectedZajecie ? `${selectedZajecie.NazwaPrzedmiotu} · ${selectedZajecie.TypZajec}` : "Wybrane zajęcia"}
                            </span>
                            <span>{gradedCount} z oceną · {filteredStudents.length} wyników</span>
                        </div>
                    )}

                    <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-xl bg-theme-surface p-3 sm:p-4">
                        {!wybranyprzedmiot ? (
                            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center text-theme-muted">
                                <span className="text-3xl">📚</span>
                                <p className="font-semibold">Wybierz przedmiot</p>
                                <p className="text-sm">Lista studentów pojawi się po wyborze zajęć.</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center text-theme-muted">
                                <span className="text-3xl">📋</span>
                                <p className="font-semibold">{(studenci ?? []).length === 0 ? "Brak studentów w tej grupie" : "Nie znaleziono studentów"}</p>
                                {(search || gradeFilter !== "all") && (
                                    <button type="button" onClick={resetFilters} className="rounded-lg border border-theme-muted px-4 py-2 text-sm text-theme-text hover:bg-theme-slate">Wyczyść filtry</button>
                                )}
                            </div>
                        ) : (
                            <table className="w-full table-fixed border-collapse text-left">
                                <colgroup className="hidden lg:table-column-group">
                                    <col style={{ width: "15%" }} />
                                    <col style={{ width: "27%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "38%" }} />
                                </colgroup>
                                <thead className="hidden lg:table-header-group">
                                    <tr className="border-b border-theme-muted text-xs uppercase tracking-wide text-theme-muted">
                                        <th className="px-4 py-3 font-semibold">Indeks</th>
                                        <th className="px-4 py-3 font-semibold">Student</th>
                                        <th className="px-4 py-3 font-semibold">Obecna ocena</th>
                                        <th className="px-4 py-3 font-semibold">Wystaw ocenę</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <StudentRow
                                            key={`${wybranyprzedmiot}-${student.idStudent}`}
                                            student={student}
                                            wybranyprzedmiot={wybranyprzedmiot}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function WystawienieOcen({ auth, zajecia, selectedZajecieId, studenci }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    useEffect(() => {
        if (message) {
            toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        }
    }, [message]);

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
            <Head title="Wystawienie ocen" />
            <MenuProwadzacy />
            <Content
                zajecia={zajecia}
                studenci={studenci}
                selectedZajecieId={selectedZajecieId}
            />
        </div>
    );
}
