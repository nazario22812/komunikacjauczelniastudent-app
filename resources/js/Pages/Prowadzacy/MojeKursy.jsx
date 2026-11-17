
import React from "react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { Head, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import { ToastContainer } from "react-toastify";

function Content({ mojekursy = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Moje kursy
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto pb-20 pr-1 sm:pb-24 sm:pr-2">
                    {mojekursy && mojekursy.length > 0 ? (
                        <div className="grid min-w-0 w-full auto-rows-max grid-cols-1 content-start gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 xl:gap-6">
                            {mojekursy.map((kurs, index) => (
                                <div
                                    key={kurs.idkurs ?? kurs.id ?? index}
                                    className="bg-theme-slate flex min-h-[160px] min-w-0 flex-col justify-between gap-5 rounded-[15px] border border-gray-700/50 p-4 transition-colors hover:border-gray-500 sm:min-h-[180px] sm:p-5"
                                >
                                    <div className="min-w-0">
                                        <h3 className="break-words [overflow-wrap:anywhere] text-lg font-bold leading-tight text-theme-text sm:text-[20px]">
                                            {kurs.nazwa}
                                        </h3>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.get(
                                                `/prowadzacy/mojekursy/${kurs.nazwa}/${kurs.idkurs}`
                                            )
                                        }
                                        className="bg-theme-surface w-full shrink-0 cursor-pointer rounded-[10px] px-3 py-2 text-center font-medium text-theme-text transition-colors hover:bg-theme-accent-navy"
                                    >
                                        Otwórz kurs
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[200px] w-full items-center justify-center text-center text-xl text-theme-muted sm:text-[24px]">
                            <span>Nie masz jeszcze kursów</span>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        router.get("/prowadzacy/tworzeniekursu")
                    }
                    className="bg-theme-orange absolute bottom-5 right-3 z-20 flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-full text-[30px] font-bold text-theme-text shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 sm:h-[64px] sm:w-[64px]"
                    aria-label="Utwórz nowy kurs"
                    title="Utwórz nowy kurs"
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default function MojeKursy({
    auth,
    mojekursy,
}) {
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

            <Head title="Moje kursy" />

            <MenuProwadzacy />

            <Content mojekursy={mojekursy} />
        </div>
    );
}
