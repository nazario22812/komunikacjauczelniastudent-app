
import React from "react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";
import { Head, router } from "@inertiajs/react";

export function Podanierow({ podanie }) {
    const handleOpen = () => {
        router.get(
            `/dziekanat/szczegolypodania/${podanie.idPodanie}`
        );
    };

    return (
        <tr
            onClick={handleOpen}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpen();
                }
            }}
            tabIndex={0}
            role="link"
            className="h-[55px] cursor-pointer border-b border-theme-muted text-left text-base font-bold text-theme-text transition-colors hover:bg-theme-panel focus:outline-none focus:bg-theme-panel lg:text-lg"
        >
            <td className="break-words [overflow-wrap:anywhere] py-4 pr-4 align-middle">
                {podanie.temat}
            </td>

            <td className="break-words py-4 pr-4 align-middle">
                {podanie.data}
            </td>

            <td className="break-words py-4 align-middle">
                {podanie.status}
            </td>
        </tr>
    );
}

function PodanieMobile({ podanie }) {
    return (
        <button
            type="button"
            onClick={() =>
                router.get(
                    `/dziekanat/szczegolypodania/${podanie.idPodanie}`
                )
            }
            className="bg-theme-slate flex min-w-0 w-full cursor-pointer flex-col gap-3 rounded-[15px] border border-theme-muted p-3 text-left text-theme-text transition-colors hover:bg-theme-panel sm:p-4"
        >
            <div className="min-w-0 w-full border-b border-theme-muted pb-3">
                <span className="block text-xs text-theme-muted">
                    Temat
                </span>

                <span className="mt-1 block break-words [overflow-wrap:anywhere] text-base font-bold text-theme-text">
                    {podanie.temat}
                </span>
            </div>

            <div className="grid min-w-0 w-full grid-cols-2 gap-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Data
                    </span>

                    <span className="mt-1 block break-words text-sm font-medium text-theme-text">
                        {podanie.data}
                    </span>
                </div>

                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Status
                    </span>

                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">
                        {podanie.status}
                    </span>
                </div>
            </div>

            <span className="mt-1 self-end text-xs font-medium text-theme-muted">
                Zobacz szczegóły ›
            </span>
        </button>
    );
}

function Content({ podania = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton
                        back={() => window.history.back()}
                    />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Podania
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] p-2 sm:p-3 md:p-5">
                    <div className="bg-theme-surface flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] p-3 sm:p-4 md:px-[37px] md:py-[22px]">
                        <h1 className="mb-4 shrink-0 text-2xl font-bold text-theme-text sm:text-3xl lg:text-[40px]">
                            Podania
                        </h1>

                        <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
                            {podania && podania.length > 0 ? (
                                <>
                                    <div className="hidden w-full lg:block">
                                        <table className="w-full table-fixed border-collapse">
                                            <colgroup>
                                                <col className="w-[60%]" />
                                                <col className="w-[20%]" />
                                                <col className="w-[20%]" />
                                            </colgroup>

                                            <thead>
                                                <tr className="h-[52px] border-b border-theme-muted text-left text-base text-theme-muted lg:text-xl">
                                                    <th className="py-3 pr-4 font-medium">
                                                        Temat
                                                    </th>

                                                    <th className="py-3 pr-4 font-medium">
                                                        Data
                                                    </th>

                                                    <th className="py-3 font-medium">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-theme-muted">
                                                {podania.map((podanie) => (
                                                    <Podanierow
                                                        key={podanie.idPodanie}
                                                        podanie={podanie}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex min-w-0 w-full flex-col gap-3 lg:hidden">
                                        {podania.map((podanie) => (
                                            <PodanieMobile
                                                key={podanie.idPodanie}
                                                podanie={podanie}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex min-h-[180px] w-full items-center justify-center text-center text-xl text-theme-muted sm:text-[24px]">
                                    Brak podań
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Podania({ podania }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Podania" />

            <MenuDziekanat />

            <Content podania={podania} />
        </div>
    );
}
