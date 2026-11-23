import React, { useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

const panelClass =
    "min-w-0 rounded-[18px] border border-theme-muted bg-theme-surface p-4 sm:p-5";

function SectionTitle({ title, description, action }) {
    return (
        <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
                <h2 className="break-words text-lg font-bold text-theme-text sm:text-xl">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 break-words text-xs text-theme-muted sm:text-sm">
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}

function Content({
    kursy = [],
    powiadomienie,
    wszystkiekursy = [],
    zadanie,
}) {
    const [znalezionyKurs, setZnalezionyKurs] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleCourseSubmit = (event) => {
        event.preventDefault();
        if (processing) return;

        const kod = znalezionyKurs.trim();
        if (!kod) {
            toast.error("Wpisz kod kursu");
            return;
        }

        const kurs = (wszystkiekursy ?? []).find((k) => k.kod === kod);
        if (!kurs) {
            toast.error("Nie znaleziono kursu");
            return;
        }

        router.post(`/student/mojekursy/${kurs.idkurs}`, {}, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    const openCourse = (kurs) => {
        router.get(`/student/mojekursy/${kurs.nazwa}/${kurs.idkurs}`);
    };

    const currentCourses = Array.isArray(kursy) ? kursy : [];
    const taskStatus = zadanie?.pivot?.status;

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[42px] w-full shrink-0 items-center justify-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-3">
                <span className="text-center text-sm font-bold text-theme-text sm:text-base">
                    Strona główna
                </span>
            </div>

            <main className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto px-0 pb-5 pt-3 sm:px-2 md:px-4">
                <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 sm:gap-5">
                    <header className="flex min-w-0 flex-col gap-3 rounded-[18px] bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-theme-muted">
                                Panel studenta
                            </p>
                            <h1 className="mt-1 break-words text-2xl font-bold text-theme-text sm:text-3xl">
                                Strona główna
                            </h1>
                            <p className="mt-2 text-sm text-theme-muted">
                                Najważniejsze informacje, zadania i Twoje kursy w jednym miejscu.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-theme-muted bg-theme-slate px-3 py-1.5 text-xs font-medium text-theme-text sm:text-sm">
                                Moje kursy: {currentCourses.length}
                            </span>
                            <span className="rounded-full border border-theme-muted bg-theme-slate px-3 py-1.5 text-xs font-medium text-theme-text sm:text-sm">
                                {zadanie ? "Aktualne zadanie" : "Brak aktualnych zadań"}
                            </span>
                        </div>
                    </header>

                    <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
                        <section className={panelClass}>
                            <SectionTitle
                                title="Powiadomienia"
                                description="Ostatnia ważna informacja"
                            />
                            {powiadomienie ? (
                                <div className="flex min-w-0 flex-col gap-3 rounded-[14px] bg-theme-slate p-4">
                                    <p className="break-words text-base font-semibold text-theme-text sm:text-lg">
                                        {powiadomienie.temat || "Powiadomienie"}
                                    </p>
                                    <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-relaxed text-theme-text">
                                        {powiadomienie.tresc || "Brak treści powiadomienia"}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex min-h-[140px] flex-col items-center justify-center rounded-[14px] border border-dashed border-theme-muted bg-theme-slate p-5 text-center">
                                    <span className="text-2xl" aria-hidden="true">🔔</span>
                                    <p className="mt-2 font-medium text-theme-text">Brak powiadomień</p>
                                    <p className="mt-1 text-xs text-theme-muted">Nowe informacje pojawią się tutaj.</p>
                                </div>
                            )}
                        </section>

                        <section className={panelClass}>
                            <SectionTitle
                                title="Aktualne zadanie"
                                description="Ostatnie zadanie przypisane do Ciebie"
                            />
                            {zadanie ? (
                                <div className="flex min-w-0 flex-col gap-3 rounded-[14px] bg-theme-slate p-4">
                                    <p className="break-words text-base font-semibold text-theme-text sm:text-lg">
                                        {zadanie.nazwaZadania || "Zadanie"}
                                    </p>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="min-w-0">
                                            <p className="text-xs text-theme-muted">Kurs</p>
                                            <p className="mt-1 break-words text-sm font-medium text-theme-text">
                                                {zadanie.kurs?.nazwa || "—"}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-theme-muted">Termin oddania</p>
                                            <p className="mt-1 break-words text-sm font-medium text-theme-text">
                                                {zadanie.TerminOddania || "N/D"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 border-t border-theme-muted pt-3">
                                        <span className="text-xs text-theme-muted">Status:</span>
                                        <span className="rounded-full border border-theme-muted bg-theme-surface px-3 py-1 text-xs font-semibold text-theme-text">
                                            {taskStatus || "Brak statusu"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[140px] flex-col items-center justify-center rounded-[14px] border border-dashed border-theme-muted bg-theme-slate p-5 text-center">
                                    <span className="text-2xl" aria-hidden="true">📋</span>
                                    <p className="mt-2 font-medium text-theme-text">Brak zadań</p>
                                    <p className="mt-1 text-xs text-theme-muted">Nie masz obecnie żadnego zadania do wyświetlenia.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <section className={panelClass}>
                        <SectionTitle
                            title="Dołącz do kursu"
                            description="Wpisz sześciocyfrowy lub krótszy kod otrzymany od prowadzącego."
                        />
                        <form onSubmit={handleCourseSubmit} className="flex w-full min-w-0 flex-col gap-3 sm:max-w-[650px] sm:flex-row">
                            <label htmlFor="kod-kursu-glowna" className="sr-only">Kod kursu</label>
                            <input
                                id="kod-kursu-glowna"
                                type="text"
                                value={znalezionyKurs}
                                maxLength={6}
                                onChange={(e) => setZnalezionyKurs(e.target.value)}
                                placeholder="Wpisz kod kursu"
                                autoComplete="off"
                                className="min-h-[44px] w-full min-w-0 flex-1 rounded-[12px] border border-theme-muted bg-theme-slate px-4 text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-orange"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="min-h-[44px] shrink-0 cursor-pointer rounded-[12px] bg-theme-orange px-6 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? "Dołączanie..." : "Dołącz do kursu"}
                            </button>
                        </form>
                    </section>

                    <section className={panelClass}>
                        <SectionTitle
                            title="Moje kursy"
                            description="Wybierz kurs, aby przejść do materiałów, zadań i ocen."
                            action={
                                <span className="rounded-full bg-theme-slate px-3 py-1.5 text-xs font-medium text-theme-muted">
                                    {currentCourses.length} kursów
                                </span>
                            }
                        />
                        {currentCourses.length > 0 ? (
                            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {currentCourses.map((kurs, index) => (
                                    <article
                                        key={kurs.idkurs ?? index}
                                        className="flex min-w-0 flex-col justify-between gap-5 rounded-[15px] border border-theme-muted bg-theme-slate p-4 transition-colors hover:border-theme-orange sm:min-h-[175px] sm:p-5"
                                    >
                                        <div className="min-w-0">
                                            <span className="text-xs font-medium text-theme-muted">
                                                {kurs.Semester != null ? `Semestr ${kurs.Semester}` : "Kurs"}
                                            </span>
                                            <h3 className="mt-2 break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text sm:text-lg">
                                                {kurs.nazwa || "Kurs bez nazwy"}
                                            </h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => openCourse(kurs)}
                                            className="min-h-[42px] w-full cursor-pointer rounded-[10px] bg-theme-surface px-3 py-2 text-center text-sm font-semibold text-theme-text transition-colors hover:bg-theme-panel"
                                        >
                                            Otwórz kurs ›
                                        </button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[14px] border border-dashed border-theme-muted bg-theme-slate p-8 text-center">
                                <p className="font-semibold text-theme-text">Nie masz jeszcze kursów</p>
                                <p className="mt-2 text-sm text-theme-muted">Aby dołączyć, wpisz kod kursu w formularzu powyżej.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default function StudentGlowna({
    auth,
    kursy,
    powiadomienie,
    wszystkiekursy,
    zadanie,
}) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Strona główna" />
            <MenuStudenta />
            <Content
                kursy={kursy}
                powiadomienie={powiadomienie}
                wszystkiekursy={wszystkiekursy}
                zadanie={zadanie}
            />
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
        </div>
    );
}
