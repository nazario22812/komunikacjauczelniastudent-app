
import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

function Powiadomienierow({ powiadomienie }) {
    return (
        <tr className="h-[40px] text-left font-bold text-theme-text hover:bg-theme-panel hover:cursor-pointer">
            <td className="w-[60%] min-w-0 break-words whitespace-normal py-[20px] pr-4 text-[clamp(0.85rem,1vw+0.5rem,1.2rem)] align-top">
                {powiadomienie.temat}
            </td>
            <td className="min-w-0 break-words whitespace-normal py-[20px] text-[clamp(0.8rem,1vw+0.45rem,1.15rem)] align-top">
                {powiadomienie.tresc}
            </td>
        </tr>
    );
}

function PowiadomienieMobile({ powiadomienie }) {
    return (
        <div className="min-w-0 border-b border-theme-muted py-4 last:border-b-0">
            <div className="mb-2">
                <span className="text-xs font-semibold text-theme-muted">
                    Temat
                </span>
                <p className="mt-1 break-words whitespace-normal text-[15px] font-bold text-theme-text">
                    {powiadomienie.temat}
                </p>
            </div>

            <div>
                <span className="text-xs font-semibold text-theme-muted">
                    Treść
                </span>
                <p className="mt-1 break-words whitespace-pre-wrap text-[14px] font-medium text-theme-text">
                    {powiadomienie.tresc}
                </p>
            </div>
        </div>
    );
}

function Content({ powiadomienia }) {
    return (
        <div className="bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Powiadomienia
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-4">
                <div className="bg-theme-slate mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col rounded-[15px] p-2 sm:p-3 lg:p-5">
                    <div className="bg-theme-surface custom-scrollbar min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] p-3 sm:px-5 sm:py-[22px] lg:px-[37px]">
                        <h1 className="break-words text-[clamp(1.5rem,2.2vw+0.8rem,2.5rem)] font-bold text-theme-text">
                            Historia Powiadomień
                        </h1>

                        {powiadomienia && powiadomienia.length > 0 ? (
                            <>
                                <div className="mt-3 hidden w-full min-w-0 md:block">
                                    <table className="w-full table-fixed border-collapse">
                                        <colgroup>
                                            <col style={{ width: "60%" }} />
                                            <col style={{ width: "40%" }} />
                                        </colgroup>

                                        <thead>
                                            <tr className="h-[52px] border-b border-theme-muted text-left text-[clamp(0.85rem,1vw+0.55rem,1.3rem)] text-theme-muted">
                                                <th className="py-[10px] pr-4">
                                                    Temat
                                                </th>
                                                <th className="py-[10px]">
                                                    Treść
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-theme-muted">
                                            {powiadomienia.map((powiadomienie) => (
                                                <Powiadomienierow
                                                    key={powiadomienie.id}
                                                    powiadomienie={powiadomienie}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-3 block min-w-0 md:hidden">
                                    {powiadomienia.map((powiadomienie) => (
                                        <PowiadomienieMobile
                                            key={powiadomienie.id}
                                            powiadomienie={powiadomienie}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="mx-auto mt-10 w-full text-center text-[clamp(1rem,1.2vw+0.8rem,1.6rem)] text-theme-muted">
                                <span>Brak powiadomień</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Powiadomienia({ auth, powiadomienia, rol }) {
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
        <div className="flex min-h-dvh min-w-0 w-full">
            <Head title="Powiadomienia" />
            {menu}
            <Content powiadomienia={powiadomienia} />
        </div>
    );
}
