
import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head, router, Link } from "@inertiajs/react";

export function Podanierow({ podanie }) {
    return (
        <tr
            onClick={() =>
                router.get(`/student/edziekanat/${podanie.idPodanie}`)
            }
            className="h-[40px] cursor-pointer text-left text-[clamp(0.85rem,1vw+0.5rem,1.2rem)] font-bold text-theme-text transition-colors hover:bg-theme-panel"
        >
            <td className="w-[60%] break-words whitespace-normal py-5 pr-4 align-top">
                {podanie.temat}
            </td>

            <td className="break-words whitespace-normal py-5 pr-4 align-top">
                {podanie.data}
            </td>

            <td className="break-words whitespace-normal py-5 align-top">
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
                router.get(`/student/edziekanat/${podanie.idPodanie}`)
            }
            className="flex w-full min-w-0 flex-col gap-3 rounded-[15px] border border-theme-muted bg-theme-slate p-3 text-left text-theme-text transition-colors hover:bg-theme-panel sm:p-4"
        >
            <div className="min-w-0 w-full">
                <span className="block text-xs font-medium text-theme-muted">
                    Temat
                </span>

                <span className="mt-1 block break-words [overflow-wrap:anywhere] text-base font-bold text-theme-text">
                    {podanie.temat}
                </span>
            </div>

            <div className="flex w-full min-w-0 flex-wrap items-start justify-between gap-3 border-t border-theme-muted pt-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Data
                    </span>

                    <span className="mt-1 block break-words text-sm text-theme-text">
                        {podanie.data}
                    </span>
                </div>

                <div className="min-w-0 text-right">
                    <span className="block text-xs text-theme-muted">
                        Status
                    </span>

                    <span className="mt-1 block break-words text-sm font-bold text-theme-text">
                        {podanie.status}
                    </span>
                </div>
            </div>
        </button>
    );
}

function Content({ podania = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex min-h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 py-2 sm:px-[10px]">
                <div className="flex w-[36px] shrink-0 items-center justify-start sm:w-[42px]">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[15px] font-bold text-theme-text sm:text-[16px]">
                    E-Dziekanat
                </span>

                <Link
                    href="/student/zlozpodanie"
                    method="get"
                    as="button"
                    className="shrink-0 cursor-pointer rounded-[8px] px-1 py-1 text-right text-xs font-medium text-theme-muted hover:text-theme-text sm:px-2 sm:text-sm"
                >
                    Złóż podanie
                </Link>
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate mx-auto flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] p-2 sm:p-3 md:p-5">
                    <div className="bg-theme-surface flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] p-3 sm:p-4 md:px-[37px] md:py-[22px]">
                        <h1 className="shrink-0 break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[40px]">
                            Historia Podań
                        </h1>

                        <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto pt-4">
                            {podania && podania.length > 0 ? (
                                <>
                                    <div className="hidden min-w-0 w-full md:block">
                                        <table className="w-full table-fixed border-collapse">
                                            <colgroup>
                                                <col style={{ width: "60%" }} />
                                                <col style={{ width: "20%" }} />
                                                <col style={{ width: "20%" }} />
                                            </colgroup>

                                            <thead>
                                                <tr className="h-[52px] border-b border-theme-muted text-left text-[clamp(0.85rem,1vw+0.5rem,1.3rem)] text-theme-muted">
                                                    <th className="py-[10px] pr-4">
                                                        Temat
                                                    </th>

                                                    <th className="py-[10px] pr-4">
                                                        Data
                                                    </th>

                                                    <th className="py-[10px]">
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

                                    <div className="flex min-w-0 w-full flex-col gap-3 md:hidden">
                                        {podania.map((podanie) => (
                                            <PodanieMobile
                                                key={podanie.idPodanie}
                                                podanie={podanie}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="mx-auto mt-10 w-full text-center text-[24px] text-theme-muted">
                                    <span>Brak podań</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EDziekanat({ auth, podania }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="E-Dziekanat" />

            <MenuStudenta />

            <Content podania={podania} />
        </div>
    );
}
