
import React, { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

function KonsultacjaActions({ konsultacja, mobile = false }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        if (loading) return;

        const confirmed = window.confirm(
            "Czy na pewno chcesz usunąć tę konsultację?"
        );

        if (!confirmed) return;

        setLoading(true);

        router.post(
            `/prowadzacy/konsultacja/usun/${konsultacja.idRezerwacja}`,
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

function Konsultacjerow({ konsultacja }) {
    return (
        <tr className="border-b border-theme-muted text-left text-[clamp(0.8rem,0.8vw+0.5rem,1.1rem)] font-bold text-theme-text transition-colors hover:bg-theme-slate-2">
            <td className="break-words py-5 pr-3 align-middle">
                {konsultacja.GodzinaRozpoczecia}-
                {konsultacja.GodzinaZakonczenia}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {konsultacja.nazwa}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {konsultacja.numerSali}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {konsultacja.data}
            </td>

            <td className="break-words py-5 pr-3 align-middle">
                {konsultacja.statusRezerwacji}
            </td>

            <td className="py-5 text-center align-middle">
                <KonsultacjaActions konsultacja={konsultacja} />
            </td>
        </tr>
    );
}

function KonsultacjaMobile({ konsultacja }) {
    return (
        <div className="bg-theme-slate flex min-w-0 w-full flex-col gap-3 rounded-[15px] border border-theme-muted p-3 text-theme-text sm:p-4">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-theme-muted pb-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Data
                    </span>

                    <span className="mt-1 block break-words text-base font-bold text-theme-text">
                        {konsultacja.data}
                    </span>
                </div>

                <div className="min-w-0 text-right">
                    <span className="block text-xs text-theme-muted">
                        Status
                    </span>

                    <span className="mt-1 block break-words text-sm font-bold text-theme-text">
                        {konsultacja.statusRezerwacji}
                    </span>
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Czas
                    </span>

                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">
                        {konsultacja.GodzinaRozpoczecia}-
                        {konsultacja.GodzinaZakonczenia}
                    </span>
                </div>

                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Sala
                    </span>

                    <span className="mt-1 block break-words text-sm font-semibold text-theme-text">
                        {konsultacja.numerSali}
                    </span>
                </div>

                <div className="col-span-2 min-w-0">
                    <span className="block text-xs text-theme-muted">
                        Budynek
                    </span>

                    <span className="mt-1 block break-words [overflow-wrap:anywhere] text-sm font-semibold text-theme-text">
                        {konsultacja.nazwa}
                    </span>
                </div>
            </div>

            <div className="border-t border-theme-muted pt-3">
                <KonsultacjaActions
                    konsultacja={konsultacja}
                    mobile
                />
            </div>
        </div>
    );
}

function Content({ rezerwowanekonsultacje = [] }) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Moje konsultacje
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-w-0 w-full shrink-0 items-center rounded-t-[15px] px-3 py-4 sm:min-h-[90px] sm:px-4">
                    <Link
                        href="/prowadzacy/stworzkonsultacje"
                        method="get"
                        as="button"
                        className="cursor-pointer break-words text-left text-xl font-bold text-theme-text transition-opacity hover:opacity-80 sm:text-2xl lg:text-[36px]"
                    >
                        Zarezerwuj konsultację
                    </Link>
                </div>

                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[15px] p-3 sm:p-4 md:p-5">
                    {rezerwowanekonsultacje &&
                    rezerwowanekonsultacje.length > 0 ? (
                        <>
                            <div className="hidden min-w-0 w-full xl:block">
                                <table className="w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "13%" }} />
                                        <col style={{ width: "17%" }} />
                                        <col style={{ width: "18%" }} />
                                        <col style={{ width: "12%" }} />
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

                                            <th className="py-[10px] text-center">
                                                Akcja
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-theme-muted">
                                        {rezerwowanekonsultacje.map(
                                            (konsultacja, index) => (
                                                <Konsultacjerow
                                                    key={
                                                        konsultacja.idRezerwacja ??
                                                        index
                                                    }
                                                    konsultacja={konsultacja}
                                                />
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex min-w-0 w-full flex-col gap-3 xl:hidden">
                                {rezerwowanekonsultacje.map(
                                    (konsultacja, index) => (
                                        <KonsultacjaMobile
                                            key={
                                                konsultacja.idRezerwacja ??
                                                index
                                            }
                                            konsultacja={konsultacja}
                                        />
                                    )
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="mx-auto mt-10 w-full text-center text-[24px] text-theme-muted">
                            <span>Brak konsultacji</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Konsultacje({
    rezerwowanekonsultacje,
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

            <Head title="Konsultacje" />

            <MenuProwadzacy />

            <Content
                rezerwowanekonsultacje={rezerwowanekonsultacje}
            />
        </div>
    );
}
