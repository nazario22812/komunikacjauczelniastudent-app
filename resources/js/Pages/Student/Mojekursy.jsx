
import React, { useEffect, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import Lupa from "@/../images/search-rounded.png";
import { ToastContainer, toast } from "react-toastify";

function Content({
    mojekursy = [],
    wszystkiekursy = [],
    listasemestrow = [],
    kierunekstudenta,
}) {
    const [pokaz, setpokaz] = useState(false);
    const [znalezionyKurs, setznalezionyKurs] = useState("");

    const handleClose = () => setpokaz(false);
    const handleOpen = () => setpokaz(true);

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

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        znajdzKurs();
    };

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Moje kursy
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="flex min-w-0 w-full shrink-0 flex-col gap-3 pb-4 text-theme-text sm:flex-row sm:items-center sm:justify-between">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="bg-theme-slate flex h-[42px] min-w-0 w-full items-center overflow-hidden rounded-[10px] border border-theme-muted sm:w-[280px] md:w-[30%] md:min-w-[220px] md:max-w-[360px]"
                    >
                        <input
                            type="text"
                            placeholder="szukaj kurs za kodem"
                            className="h-full min-w-0 flex-1 bg-transparent px-3 py-1 text-sm text-theme-text placeholder-gray-400 focus:outline-none sm:px-4"
                            value={znalezionyKurs}
                            maxLength={6}
                            onChange={(e) =>
                                setznalezionyKurs(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="flex h-full w-[44px] shrink-0 items-center justify-center px-2 transition-colors hover:bg-theme-panel"
                        >
                            <img
                                src={Lupa}
                                className="!h-[24px] !w-[24px] !max-w-[24px] object-contain"
                                alt="wyszukaj"
                            />
                        </button>
                    </form>

                    <div className="w-full text-left sm:w-auto sm:shrink-0 sm:text-right">
                        <button
                            type="button"
                            onClick={handleOpen}
                            className="cursor-pointer break-words text-sm text-theme-text hover:underline sm:text-base"
                        >
                            Lista wszystkich kursów
                        </button>
                    </div>
                </div>

                <div className="min-h-0 min-w-0 w-full flex-1">
                    {mojekursy && mojekursy.length > 0 ? (
                        <div className="custom-scrollbar grid h-full min-h-0 min-w-0 w-full auto-rows-max grid-cols-1 content-start gap-3 overflow-x-hidden overflow-y-auto pr-1 sm:grid-cols-2 sm:gap-4 sm:pr-2 xl:grid-cols-3 xl:gap-6">
                            {mojekursy.map((kurs) => (
                                <div
                                    key={kurs.idkurs ?? kurs.id}
                                    className="bg-theme-slate flex min-h-[160px] min-w-0 flex-col justify-between gap-5 rounded-[15px] border border-gray-700/50 p-4 hover:border-gray-500 sm:min-h-[180px] sm:p-5"
                                >
                                    <div className="min-w-0">
                                        <h3 className="break-words [overflow-wrap:anywhere] text-lg font-bold leading-tight text-theme-text sm:text-[20px]">
                                            {kurs.nazwa}
                                        </h3>

                                        <p className="mt-3 break-words [overflow-wrap:anywhere] text-sm text-gray-400">
                                            Prowadzący:{" "}
                                            {kurs.prowadzacy?.TytulNaukowy}{" "}
                                            {kurs.prowadzacy?.user?.name}{" "}
                                            {kurs.prowadzacy?.user?.surname}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.get(
                                                `/student/mojekursy/${kurs.nazwa}/${kurs.idkurs}`
                                            )
                                        }
                                        className="bg-theme-surface w-full shrink-0 cursor-pointer rounded-[10px] py-2 text-center font-medium text-theme-text hover:bg-theme-accent-navy"
                                    >
                                        Otwórz kurs
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[160px] w-full items-center justify-center text-center text-xl text-theme-muted sm:text-[24px]">
                            <span>Nie masz jeszcze kursów</span>
                        </div>
                    )}
                </div>
            </div>

            {pokaz && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 transition-opacity"
                    onClick={handleClose}
                />
            )}

            <div
                className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[500px] min-w-0 flex-col border-l border-white/20 bg-theme-page p-4 text-theme-text transition-transform duration-300 ease-in-out sm:p-6 ${
                    pokaz ? "translate-x-0" : "translate-x-full"
                }`}
                aria-hidden={!pokaz}
                inert={!pokaz}
            >
                <div className="flex min-w-0 shrink-0 items-center justify-between gap-3 border-b border-white/20 pb-4">
                    <h2 className="min-w-0 break-words text-lg font-bold sm:text-[20px]">
                        Wszystkie kursy
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="shrink-0 cursor-pointer px-2 text-[28px] font-bold leading-none text-gray-400 hover:text-theme-text"
                    >
                        &times;
                    </button>
                </div>

                <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-4">
                    <h1 className="mb-4 break-words text-lg font-semibold sm:text-[22px]">
                        {kierunekstudenta?.nazwa}
                    </h1>

                    {wszystkiekursy && wszystkiekursy.length > 0 ? (
                        <div className="min-w-0">
                            {(listasemestrow ?? []).map((semestr, index) => {
                                const kursySemestru =
                                    wszystkiekursy.filter(
                                        (kurs) =>
                                            kurs.Semester === semestr.Semester
                                    );

                                const uniqPrzedmioty = Array.from(
                                    new Map(
                                        kursySemestru.map((kurs) => [
                                            kurs.Przedmiot_idPrzedmiot,
                                            kurs.przedmiot,
                                        ])
                                    ).values()
                                ).filter(Boolean);

                                return (
                                    <div
                                        key={semestr.id ?? index}
                                        className="min-w-0 pb-4"
                                    >
                                        <h2 className="mb-3 break-words text-[18px] font-bold">
                                            {semestr.Semester} semester
                                        </h2>

                                        {uniqPrzedmioty.map((przedmiot) => (
                                            <div
                                                key={przedmiot.idPrzedmiot}
                                                className="mb-4 min-w-0"
                                            >
                                                <h3 className="break-words text-[15px] text-theme-text">
                                                    {przedmiot.nazwa}
                                                </h3>

                                                <div className="mt-2 flex min-w-0 flex-col gap-2 pl-2 sm:pl-4">
                                                    {kursySemestru
                                                        .filter(
                                                            (kurs) =>
                                                                kurs.Przedmiot_idPrzedmiot ===
                                                                przedmiot.idPrzedmiot
                                                        )
                                                        .map((kurs) => (
                                                            <button
                                                                key={kurs.idkurs}
                                                                type="button"
                                                                onClick={() =>
                                                                    router.post(
                                                                        `/student/checkkurs/${kurs.idkurs}`
                                                                    )
                                                                }
                                                                className="min-w-0 cursor-pointer break-words [overflow-wrap:anywhere] pl-2 text-left text-[14px] text-theme-muted hover:text-theme-text sm:pl-5"
                                                            >
                                                                {kurs.nazwa},{" "}
                                                                {
                                                                    kurs.prowadzacy
                                                                        ?.TytulNaukowy
                                                                }{" "}
                                                                {
                                                                    kurs.prowadzacy
                                                                        ?.user
                                                                        ?.name
                                                                }{" "}
                                                                {
                                                                    kurs.prowadzacy
                                                                        ?.user
                                                                        ?.surname
                                                                }
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex min-h-[150px] w-full items-center justify-center text-center text-xl text-theme-muted sm:text-[24px]">
                            <span>Brak kursów</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Koddokursu({
    isOpen,
    onClose,
    zwroconyKurs,
    wszystkiekursy = [],
}) {
    const [znalezionyKurs, setznalezionyKurs] = useState("");

    const znajdzKurs = () => {
        const kurs = (wszystkiekursy ?? []).find(
            (k) => k.kod === znalezionyKurs.trim()
        );

        if (kurs) {
            router.post(`/student/mojekursy/${kurs.idkurs}`);
            onClose();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        znajdzKurs();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[60] bg-black/60 transition-opacity"
                onClick={onClose}
            />

            <div className="fixed left-1/2 top-1/2 z-[70] flex h-auto max-h-[90dvh] w-[calc(100%-24px)] max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[15px] border border-white/20 bg-theme-page p-4 text-theme-text sm:min-h-[300px] sm:p-6">
                <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="break-words text-lg font-bold sm:text-[20px]">
                            Podaj kod do kursu
                        </h2>

                        {zwroconyKurs?.nazwa && (
                            <h4 className="mt-1 break-words text-sm font-light sm:text-[17px]">
                                {zwroconyKurs.nazwa}
                            </h4>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 cursor-pointer px-2 text-[28px] font-bold leading-none text-gray-400 hover:text-theme-text"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex min-h-[130px] min-w-0 flex-1 flex-col justify-center overflow-y-auto py-5">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-theme-slate mx-auto flex h-[44px] w-full min-w-0 items-center overflow-hidden rounded-[10px] border border-theme-muted sm:w-[80%]"
                    >
                        <input
                            type="text"
                            placeholder="szukaj kurs za kodem"
                            className="h-full min-w-0 flex-1 bg-transparent px-3 py-1 text-sm text-theme-text placeholder-gray-400 focus:outline-none sm:px-4"
                            value={znalezionyKurs}
                            maxLength={6}
                            onChange={(e) =>
                                setznalezionyKurs(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="flex h-full w-[44px] shrink-0 cursor-pointer items-center justify-center px-2 transition-colors hover:bg-theme-panel"
                        >
                            <img
                                src={Lupa}
                                className="!h-[24px] !w-[24px] !max-w-[24px] object-contain"
                                alt="wyszukaj"
                            />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default function MojeKursy({
    auth,
    mojekursy,
    wszystkiekursy,
    listasemestrow,
    kierunekstudenta,
}) {
    const pageProps = usePage().props;

    const message = pageProps.status || pageProps.flash?.status;
    const kurs = pageProps.kurs || pageProps.flash?.kurs;

    const [pokazKod, setpokazKod] = useState(false);
    const [zwroconyKurs, setzwroconyKurs] = useState(null);

    const handleClose2 = () => {
        setpokazKod(false);
    };

    useEffect(() => {
        if (message && message !== "nie jestes zapisany na ten kurs") {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        } else if (
            message === "nie jestes zapisany na ten kurs"
        ) {
            setpokazKod(true);
            setzwroconyKurs(kurs);
        }
    }, [message, kurs]);

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

            <MenuStudenta />

            <Content
                mojekursy={mojekursy}
                wszystkiekursy={wszystkiekursy}
                listasemestrow={listasemestrow}
                kierunekstudenta={kierunekstudenta}
            />

            <Koddokursu
                isOpen={pokazKod}
                onClose={handleClose2}
                zwroconyKurs={zwroconyKurs}
                wszystkiekursy={wszystkiekursy}
            />
        </div>
    );
}
