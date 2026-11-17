
import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head, Link } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

function Content({ ogloszenia = [], ankiety = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Ogłoszenia i ankiety
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-b-[10px] px-0 pb-2 pt-3 sm:px-4">
                <div className="bg-theme-slate mx-auto flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] p-2 sm:p-3 lg:p-5">
                    <div className="bg-theme-surface mt-2 flex min-h-[200px] min-w-0 w-full shrink-0 flex-col overflow-hidden rounded-[15px] p-3 sm:min-h-[260px] sm:p-4 sm:px-[37px] sm:py-[22px]">
                        <h2 className="mb-4 shrink-0 break-words text-[clamp(1.2rem,2vw,1.8rem)] font-bold text-theme-text">
                            Ogłoszenia
                        </h2>

                        {ogloszenia && ogloszenia.length > 0 ? (
                            <div className="hide-scrollbar flex min-w-0 w-full gap-3 overflow-x-auto overscroll-x-contain pb-3 pt-2 sm:gap-4">
                                {ogloszenia.map((ogloszenie) => (
                                    <div
                                        key={ogloszenie.id}
                                        className="bg-theme-slate flex w-[min(250px,78vw)] min-w-0 shrink-0 flex-col gap-2 rounded-[15px] px-3 py-4 text-center sm:px-5 sm:py-5"
                                    >
                                        <span className="break-words whitespace-normal text-[clamp(1rem,1.5vw,1.35rem)] font-bold leading-tight text-theme-text">
                                            {ogloszenie.temat}
                                        </span>

                                        <p className="break-words whitespace-pre-wrap text-[clamp(0.82rem,1vw+0.5rem,1rem)] text-theme-text">
                                            {ogloszenie.tresc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex w-full flex-1 items-center justify-center text-center text-[clamp(1rem,1.2vw+0.8rem,1.6rem)] text-theme-muted">
                                <span>Brak ogłoszeń</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-theme-surface mt-5 flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] p-3 sm:p-4 sm:px-[37px] sm:py-[22px]">
                        <h2 className="shrink-0 break-words text-[clamp(1.2rem,2vw,1.8rem)] font-bold text-theme-text">
                            Ankiety
                        </h2>

                        <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-y-auto overscroll-y-contain pt-4">
                            {ankiety && ankiety.length > 0 ? (
                                <div className="w-full min-w-0">
                                    {ankiety.map((ankieta) => (
                                        <Link
                                            href={ankieta.link}
                                            key={ankieta.id}
                                            className="flex min-w-0 items-start gap-3 pb-4 text-left no-underline"
                                        >
                                            <div className="shrink-0 text-[clamp(1.5rem,2vw,2.2rem)] leading-none">
                                                🗳️
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <span className="block break-words whitespace-normal text-[clamp(1rem,1.5vw,1.35rem)] font-bold text-theme-text">
                                                    {ankieta.temat}
                                                </span>

                                                <span className="mt-1 block break-words whitespace-pre-wrap text-[clamp(0.8rem,1vw+0.5rem,1rem)] text-theme-text">
                                                    {ankieta.opis}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mx-auto mt-10 w-full text-center text-[clamp(1rem,1.2vw+0.8rem,1.6rem)] text-theme-muted">
                                    <span>Brak ankiet</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Ogłoszenia({
    auth,
    ogloszenia,
    ankiety,
    rol,
}) {
    let menu;

    if (rol === "Student") {
        menu = <MenuStudenta />;
    }

    if (rol === "Prowadzący") {
        menu = <MenuProwadzacy />;
    }

    if (rol === "Pracownik Dziekanatu") {
        menu = <MenuDziekanat />;
    }

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Ogłoszenia i ankiety" />
            {menu}
            <Content ogloszenia={ogloszenia} ankiety={ankiety} />
        </div>
    );
}
