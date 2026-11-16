
import React, { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

function RezerwacjaActions({ rezerwacja, mobile = false }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        if (loading) return;

        const confirmed = window.confirm(
            "Czy na pewno chcesz usunąć tę rezerwację?"
        );

        if (!confirmed) return;

        setLoading(true);

        router.post(
            `/prowadzacy/rezerwacja/usun/${rezerwacja.idRezerwacja}`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className={`bg-theme-orange cursor-pointer rounded-[10px] px-4 py-2 font-semibold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
                mobile ? "min-h-[42px] w-full text-sm" : "text-base"
            }`}
        >
            {loading ? "Usuwanie..." : "Usuń"}
        </button>
    );
}

function Rezerwacjerow({ rezerwacja }) {
    return (
        <tr className="border-b border-theme-muted text-left text-[clamp(0.8rem,0.8vw+0.5rem,1.1rem)] font-bold text-theme-text transition-colors hover:bg-theme-slate-2">
            <td className="break-words py-5 pr-3 align-middle">
                {rezerwacja.GodzinaRozpoczecia}-
                {rezerwacja.GodzinaZakonczenia}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {rezerwacja.nazwa}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {rezerwacja.numerSali}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {rezerwacja.data}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {rezerwacja.statusRezerwacji}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {rezerwacja.typWydarzenia}
            </td>

            <td className="py-5 text-center align-middle">
                <RezerwacjaActions rezerwacja={rezerwacja} />
            </td>
        </tr>
    );
}

function RezerwacjaMobile({ rezerwacja }) {
    return (
        <div className="bg-theme-slate flex min-w-0 w-full flex-col gap-3 rounded-[15px] border border-theme-muted p-3 text-theme-text sm:p-4">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-theme-muted pb-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Data
                    </span>

                    <span className="mt-1 block break-words text-base font-bold text-theme-text">
                        {rezerwacja.data}
                    </span>
                </div>

                <div className="min-w-0 text-right">
                    <span className="block text-xs text-theme-muted">
                        Status
                    </span>

                    <span className="mt-1 block break-words text-sm font-bold text-theme-text">
                        {rezerwacja.statusRezerwacji}
                    </span>
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Czas
                    </span>

                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">
                        {rezerwacja.GodzinaRozpoczecia}-
                        {rezerwacja.GodzinaZakonczenia}
                    </span>
                </div>

                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Sala
                    </span>

                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">
                        {rezerwacja.numerSali}
                    </span>
                </div>

                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Budynek
                    </span>

                    <span className="mt-1 block break-words [overflow-wrap:anywhere] text-sm font-semibold text-theme-text">
                        {rezerwacja.nazwa}
                    </span>
                </div>

                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Typ wydarzenia
                    </span>

                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">
                        {rezerwacja.typWydarzenia}
                    </span>
                </div>
            </div>

            <div className="border-t border-theme-muted pt-3">
                <RezerwacjaActions
                    rezerwacja={rezerwacja}
                    mobile
                />
            </div>
        </div>
    );
}

function Content({ rezerwowanesale = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Moje rezerwacje
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-w-0 w-full shrink-0 items-center rounded-t-[15px] px-3 py-4 sm:min-h-[90px] sm:px-4">
                    <Link
                        href="/prowadzacy/zarezerwujsale"
                        method="get"
                        as="button"
                        className="cursor-pointer break-words text-left text-xl font-bold text-theme-text transition-opacity hover:opacity-80 sm:text-2xl lg:text-[36px]"
                    >
                        Zarezerwuj salę
                    </Link>
                </div>

                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[15px] p-3 sm:p-4 md:p-5">
                    {rezerwowanesale && rezerwowanesale.length > 0 ? (
                        <>
                            <div className="hidden min-w-0 w-full xl:block">
                                <table className="w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col style={{ width: "17%" }} />
                                        <col style={{ width: "14%" }} />
                                        <col style={{ width: "10%" }} />
                                        <col style={{ width: "13%" }} />
                                        <col style={{ width: "16%" }} />
                                        <col style={{ width: "17%" }} />
                                        <col style={{ width: "13%" }} />
                                    </colgroup>

                                    <thead>
                                        <tr className="h-[52px] border-b border-theme-muted text-left text-[clamp(0.85rem,0.8vw+0.5rem,1.2rem)] text-theme-muted">
                                            <th className="py-[10px] pr-3">
                                                Czas
                                            </th>

                                            <th className="py-[10px] pr-3">
                                                Budynek
                                            </th>

                                            <th className="py-[10px] pr-3">
                                                Sala
                                            </th>

                                            <th className="py-[10px] pr-3">
                                                Data
                                            </th>

                                            <th className="py-[10px] pr-3">
                                                Status
                                            </th>

                                            <th className="py-[10px] pr-3">
                                                Typ
                                            </th>

                                            <th className="py-[10px] text-center">
                                                Akcja
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-theme-muted">
                                        {rezerwowanesale.map(
                                            (rezerwacja, index) => (
                                                <Rezerwacjerow
                                                    key={
                                                        rezerwacja.idRezerwacja ??
                                                        index
                                                    }
                                                    rezerwacja={rezerwacja}
                                                />
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex min-w-0 w-full flex-col gap-3 xl:hidden">
                                {rezerwowanesale.map(
                                    (rezerwacja, index) => (
                                        <RezerwacjaMobile
                                            key={
                                                rezerwacja.idRezerwacja ??
                                                index
                                            }
                                            rezerwacja={rezerwacja}
                                        />
                                    )
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="mx-auto mt-10 w-full text-center text-[24px] text-theme-muted">
                            <span>Brak rezerwacji</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Rezerwacje({
    rezerwowanesale,
}) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;

    useEffect(() => {
        if (message) {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }, [message]);

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

            <Head title="Rezerwacje" />

            <MenuProwadzacy />

            <Content rezerwowanesale={rezerwowanesale} />
        </div>
    );
}
