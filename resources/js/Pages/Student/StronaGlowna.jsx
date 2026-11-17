
import React, { useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

function Content({
    kursy = [],
    powiadomienie,
    wszystkiekursy = [],
    zadanie,
}) {
    const [znalezionyKurs, setznalezionyKurs] = useState("");

    const znajdzKurs = () => {
        const kurs = (wszystkiekursy ?? []).find(
            (k) => k.kod === znalezionyKurs.trim()
        );

        if (kurs) {
            router.post(`/student/mojekursy/${kurs.idkurs}`);
        } else {
            toast.error("Nie znaleziono kursu", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
    };

    const handleCourseSubmit = (e) => {
        e.preventDefault();
        znajdzKurs();
    };

    return (
        <div className="bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px] lg:h-dvh lg:overflow-hidden">
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

            <div className="bg-theme-panel mx-auto flex h-[40px] w-full shrink-0 items-center justify-center rounded-t-[10px] border-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <span className="text-center text-[16px] font-bold text-theme-text">
                    Strona główna
                </span>
            </div>

            <div className="bg-theme-panel grid min-h-0 min-w-0 w-full flex-1 grid-rows-[auto_auto] gap-3 rounded-b-[10px] border-[0.3px] border-theme-muted p-2 sm:gap-4 sm:p-[10px] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">

                <div className="bg-theme-surface grid min-h-0 min-w-0 grid-cols-1 gap-3 rounded-[10px] p-3 sm:p-4 lg:grid-cols-2 lg:gap-3 lg:px-[35px] lg:py-[20px]">

                    <div className="bg-theme-accent-indigo flex min-h-[220px] min-w-0 flex-col overflow-hidden rounded-[10px] border border-theme-muted sm:min-h-[250px] xl:flex-row">
                        <div className="flex min-w-0 shrink-0 items-center justify-center p-3 text-center text-xl font-bold text-theme-text sm:p-4 sm:text-2xl xl:w-[40%] xl:text-[clamp(1.2rem,1.7vw,2rem)]">
                            <span className="break-words [overflow-wrap:anywhere]">
                                Powiadomienia
                            </span>
                        </div>

                        <div className="bg-theme-slate flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] border-theme-muted p-3 sm:p-4 xl:w-[60%] xl:rounded-b-none xl:rounded-r-[10px] xl:border-l xl:p-[20px]">
                            {powiadomienie ? (
                                <>
                                    <div className="bg-theme-lavender flex min-h-[48px] min-w-0 shrink-0 items-center justify-center rounded-[10px] p-3 text-center text-base font-medium text-theme-text sm:text-lg lg:text-[20px]">
                                        <span className="break-words [overflow-wrap:anywhere]">
                                            {powiadomienie.temat}
                                        </span>
                                    </div>

                                    <div className="bg-theme-lavender min-h-[100px] min-w-0 flex-1 overflow-y-auto rounded-[10px] p-3 text-sm text-theme-text sm:text-base lg:text-[18px]">
                                        <span className="break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                                            {powiadomienie.tresc}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex min-h-[100px] w-full flex-1 items-center justify-center text-center text-lg text-theme-text sm:text-2xl">
                                    <span>Brak powiadomień</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-theme-accent-indigo flex min-h-[250px] min-w-0 flex-col overflow-hidden rounded-[10px] border border-theme-muted sm:min-h-[280px] xl:flex-row">
                        <div className="flex min-w-0 shrink-0 items-center justify-center p-3 text-center text-xl font-bold text-theme-text sm:p-4 sm:text-2xl xl:w-[40%] xl:text-[clamp(1.2rem,1.7vw,2rem)]">
                            <span className="break-words">
                                Zadania
                            </span>
                        </div>

                        <div className="bg-theme-slate flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] border-theme-muted p-3 sm:p-4 xl:w-[60%] xl:rounded-b-none xl:rounded-r-[10px] xl:border-l xl:p-[20px]">
                            <form
                                onSubmit={handleCourseSubmit}
                                className="bg-theme-lavender flex min-h-[50px] min-w-0 shrink-0 items-center justify-center rounded-[10px] p-2"
                            >
                                <div className="bg-theme-slate flex h-[40px] min-w-0 w-full items-center overflow-hidden rounded-[10px] border border-theme-muted text-theme-text">
                                    <input
                                        type="text"
                                        placeholder="szukaj kurs za kodem"
                                        className="h-full min-w-0 flex-1 bg-transparent px-2 text-xs text-theme-text placeholder-gray-400 focus:outline-none sm:px-3 sm:text-sm"
                                        value={znalezionyKurs}
                                        maxLength={6}
                                        onChange={(e) =>
                                            setznalezionyKurs(e.target.value)
                                        }
                                    />

                                    <button
                                        type="submit"
                                        className="bg-theme-orange flex h-full shrink-0 items-center justify-center px-2 text-xs font-medium text-theme-text transition-colors hover:brightness-110 sm:px-3 sm:text-sm"
                                    >
                                        Wpisz się
                                    </button>
                                </div>
                            </form>

                            <div className="bg-theme-lavender flex min-h-[120px] min-w-0 flex-1 flex-col overflow-y-auto rounded-[10px] p-2 text-theme-text">
                                {zadanie ? (
                                    <>
                                        <div className="flex min-w-0 shrink-0 items-center justify-center rounded-[10px] border-b border-theme-muted bg-theme-lavender p-2 text-center text-base font-medium text-theme-text sm:text-lg lg:text-[20px]">
                                            <span className="break-words [overflow-wrap:anywhere]">
                                                {zadanie.nazwaZadania}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1 rounded-[10px] bg-theme-lavender p-2 text-sm text-theme-text sm:text-base lg:text-[18px]">
                                            <p className="break-words [overflow-wrap:anywhere]">
                                                Kurs: {zadanie.kurs?.nazwa}
                                            </p>

                                            <p className="mt-1 break-words">
                                                Status: {zadanie.pivot?.status}
                                            </p>

                                            <p className="mt-1 break-words">
                                                Termin oddania:{" "}
                                                {zadanie.TerminOddania || "N/D"}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex min-h-[100px] w-full flex-1 items-center justify-center text-center text-lg text-theme-text sm:text-2xl">
                                        <span>Brak zadań</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-theme-surface flex min-h-[220px] min-w-0 w-full flex-col rounded-[10px] p-3 sm:p-4 lg:min-h-0 lg:p-0">
                    <div className="w-full shrink-0 lg:px-[35px] lg:py-[5px]">
                        <span className="text-[22px] text-theme-text">
                            Moje kursy
                        </span>
                    </div>

                    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col pt-4 lg:px-[35px] lg:py-[25px]">
                        {kursy && kursy.length > 0 ? (
                            <div className="hide-scrollbar flex min-h-[150px] min-w-0 w-full flex-1 gap-3 overflow-x-auto overscroll-x-contain pb-2 sm:gap-5 lg:min-h-0">
                                {kursy.map((kurs) => (
                                    <div
                                        key={kurs.idkurs}
                                        onClick={() =>
                                            router.get(
                                                `/student/mojekursy/${kurs.nazwa}/${kurs.idkurs}`
                                            )
                                        }
                                        className="bg-theme-slate flex min-h-[140px] w-[220px] max-w-[75vw] shrink-0 cursor-pointer items-center justify-center rounded-[15px] border border-theme-muted p-3 text-center text-xl font-bold text-theme-text sm:w-[250px] sm:p-4 sm:text-2xl lg:h-full lg:min-h-0 lg:w-[20%] lg:min-w-[180px] lg:text-[clamp(1rem,1.7vw,2rem)]"
                                    >
                                        <span className="break-words [overflow-wrap:anywhere]">
                                            {kurs.nazwa}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[120px] w-full flex-1 items-center justify-center text-center text-lg text-theme-muted sm:text-2xl">
                                <span>Brak kursów</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
        <div className="flex min-h-dvh min-w-0 w-full lg:h-dvh lg:overflow-hidden">
            <Head title="Strona główna" />

            <MenuStudenta />

            <Content
                kursy={kursy}
                powiadomienie={powiadomienie}
                wszystkiekursy={wszystkiekursy}
                zadanie={zadanie}
            />
        </div>
    );
}
