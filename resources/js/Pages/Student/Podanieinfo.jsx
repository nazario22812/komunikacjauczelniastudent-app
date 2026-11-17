
import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";

function Content({ szczegoly, listaplikow = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Szczegóły podania
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate mx-auto flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] p-2 sm:p-3 md:p-5">
                    <div className="bg-theme-surface custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] p-3 sm:p-4 md:px-[20px] md:py-[22px]">
                        <div className="flex min-w-0 w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <span className="block text-base font-bold text-theme-muted sm:text-[18px] md:text-[20px]">
                                    Temat podania
                                </span>

                                <span className="mt-1 block break-words [overflow-wrap:anywhere] text-lg font-bold text-theme-text sm:text-xl md:text-[24px]">
                                    {szczegoly.temat}
                                </span>
                            </div>

                            <div className="min-w-0 shrink-0 text-left sm:max-w-[40%] sm:text-right">
                                <span className="block break-words text-xl font-medium text-theme-text sm:text-2xl md:text-[30px]">
                                    {szczegoly.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 min-w-0 sm:mt-12 md:mt-20">
                            <span className="text-base font-bold text-theme-muted sm:text-[18px] md:text-[20px]">
                                Data złożenia:
                            </span>{" "}

                            <span className="break-words text-base text-theme-text sm:text-[18px]">
                                {szczegoly.data}
                            </span>
                        </div>

                        <div className="mt-5 min-w-0 w-full rounded-[10px] border border-theme-muted p-3 sm:p-4 md:p-5">
                            <span className="block text-base font-bold text-theme-muted sm:text-[18px] md:text-[20px]">
                                Treść podania
                            </span>

                            <span className="mt-2 block break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-lg font-bold text-theme-text sm:text-xl md:text-[24px]">
                                {szczegoly.tresc}
                            </span>
                        </div>

                        <div className="mt-5 min-w-0 w-full rounded-[10px] border border-theme-muted p-3 sm:p-4 md:p-5">
                            <span className="block text-base font-bold text-theme-muted sm:text-[18px] md:text-[20px]">
                                Odpowiedź
                            </span>

                            <span className="mt-2 block break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-lg font-bold text-theme-text sm:text-xl md:text-[24px]">
                                {szczegoly.odpowiedz || "Brak"}
                            </span>
                        </div>

                        <div className="mt-5 min-w-0 w-full rounded-[10px] border border-theme-muted p-3 sm:p-4 md:p-5">
                            <span className="mb-3 block text-base font-bold text-theme-muted sm:text-[18px] md:text-[20px]">
                                Załączniki
                            </span>

                            {listaplikow && listaplikow.length > 0 ? (
                                <div className="flex min-w-0 flex-col gap-3">
                                    {listaplikow.map((plik, index) => (
                                        <div
                                            key={index}
                                            className="min-w-0 w-full"
                                        >
                                            <a
                                                href={`/storage/${plik.nazwa}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block max-w-full break-words [overflow-wrap:anywhere] text-sm text-blue-400 hover:underline sm:text-[17px]"
                                            >
                                                🔗{" "}
                                                {plik.nazwa
                                                    .split("/")
                                                    .pop()}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm text-theme-muted sm:text-[16px]">
                                    Brak załączników
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Podanieinfo({
    auth,
    szczegoly,
    listaplikow,
}) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="E-Dziekanat" />

            <MenuStudenta />

            <Content
                szczegoly={szczegoly}
                listaplikow={listaplikow}
            />
        </div>
    );
}
