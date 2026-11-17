
import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

function Content({ zadania = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Twoje zadania
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-h-[75px] w-full shrink-0 items-center rounded-t-[15px] px-3 py-4 sm:min-h-[90px] sm:px-4">
                    <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[36px]">
                        Zadania
                    </h1>
                </div>

                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[15px] p-3 sm:p-4 md:p-5">
                    {zadania && zadania.length > 0 ? (
                        <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4">
                            {zadania.map((zadanie) => (
                                <div
                                    key={zadanie.idZadanie}
                                    onClick={() =>
                                        router.get(
                                            `/student/kurs/${zadanie.idZadanie}`
                                        )
                                    }
                                    className="bg-theme-muted flex min-h-[60px] w-full min-w-0 cursor-pointer items-center rounded-[15px] px-3 py-4 text-[15px] text-theme-text transition-colors hover:brightness-110 sm:min-h-[75px] sm:px-5"
                                >
                                    <span className="block min-w-0 break-words [overflow-wrap:anywhere]">
                                        {zadanie.nazwaZadania}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mx-auto mt-10 w-full text-center text-[24px] text-theme-muted">
                            <span>Brak zadań</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MojeZadania({ auth, zadania }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Moje zadania" />

            <MenuStudenta />

            <Content zadania={zadania} />
        </div>
    );
}
