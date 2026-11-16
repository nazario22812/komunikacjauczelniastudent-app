
import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

const opcjeOcen = [
    "Niedostatecznie",
    "Dostatecznie",
    "Dostatecznie plus",
    "Dobrze",
    "Dobrze plus",
    "Bardzo dobrze",
];

function StudentRow({ student, wybranyprzedmiot }) {
    const [wybranaocena, setwybranaocena] = useState("Niedostatecznie");

    const [obecnaOcena, setObecnaOcena] = useState(
        student.existingOcena || "Brak"
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setObecnaOcena(student.existingOcena || "Brak");
    }, [student.existingOcena]);

    const handleWystawOcene = () => {
        if (loading || !wybranyprzedmiot) return;

        const ocenaDoZapisu = wybranaocena;

        setLoading(true);

        router.post(
            `/prowadzacy/ocenekoncowe/wystawienieoceny/${wybranyprzedmiot}/${student.idStudent}/${encodeURIComponent(ocenaDoZapisu)}`,
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    setObecnaOcena(ocenaDoZapisu);
                },

                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <>
            <tr className="hidden border-b border-theme-muted/50 text-theme-text transition-colors hover:bg-theme-slate lg:table-row">
                <td className="break-words p-3 align-middle">
                    {student.index}
                </td>

                <td className="break-words p-3 align-middle">
                    {student.user?.name}{" "}
                    {student.user?.surname}
                </td>

                <td className="break-words p-3 align-middle">
                    {obecnaOcena}
                </td>

                <td className="p-3 align-middle">
                    <Form.Select
                        value={wybranaocena}
                        onChange={(e) =>
                            setwybranaocena(e.target.value)
                        }
                        disabled={loading}
                        className="h-[42px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text"
                    >
                        {opcjeOcen.map((ocena) => (
                            <option key={ocena} value={ocena}>
                                {ocena}
                            </option>
                        ))}
                    </Form.Select>
                </td>

                <td className="p-3 text-center align-middle">
                    <button
                        type="button"
                        disabled={loading || !wybranyprzedmiot}
                        onClick={handleWystawOcene}
                        className="bg-theme-orange h-[42px] w-[50px] cursor-pointer rounded-[10px] p-2 text-[22px] font-bold disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Wystaw ocenę"
                    >
                        {loading ? "..." : "+"}
                    </button>
                </td>
            </tr>

            <tr className="border-b border-theme-muted/50 lg:hidden">
                <td colSpan={5} className="py-2">
                    <div className="bg-theme-surface flex min-w-0 flex-col gap-3 rounded-[15px] border border-theme-muted p-3 text-theme-text sm:p-4">
                        <div className="min-w-0">
                            <span className="block text-xs text-theme-muted">
                                Student
                            </span>

                            <span className="mt-1 block break-words text-base font-bold text-theme-text">
                                {student.user?.name}{" "}
                                {student.user?.surname}
                            </span>
                        </div>

                        <div className="grid min-w-0 grid-cols-2 gap-3 border-b border-theme-muted pb-3">
                            <div className="min-w-0">
                                <span className="block text-xs text-theme-muted">
                                    Indeks
                                </span>

                                <span className="mt-1 block break-words text-sm font-medium text-theme-text">
                                    {student.index}
                                </span>
                            </div>

                            <div className="min-w-0">
                                <span className="block text-xs text-theme-muted">
                                    Obecna ocena
                                </span>

                                <span className="mt-1 block break-words text-sm font-bold text-theme-text">
                                    {obecnaOcena}
                                </span>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col gap-2">
                            <span className="text-xs text-theme-muted">
                                Wybierz ocenę
                            </span>

                            <div className="flex min-w-0 items-center gap-2">
                                <Form.Select
                                    value={wybranaocena}
                                    onChange={(e) =>
                                        setwybranaocena(e.target.value)
                                    }
                                    disabled={loading}
                                    className="h-[44px] min-w-0 flex-1 rounded-[12px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text"
                                >
                                    {opcjeOcen.map((ocena) => (
                                        <option
                                            key={ocena}
                                            value={ocena}
                                        >
                                            {ocena}
                                        </option>
                                    ))}
                                </Form.Select>

                                <button
                                    type="button"
                                    disabled={
                                        loading || !wybranyprzedmiot
                                    }
                                    onClick={handleWystawOcene}
                                    className="bg-theme-orange flex h-[44px] w-[48px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[22px] font-bold disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Wystaw ocenę"
                                >
                                    {loading ? "..." : "+"}
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
}

function Content({
    zajecia = [],
    selectedZajecieId,
    studenci = [],
}) {
    const [wybranyprzedmiot, setwybranyprzedmiot] = useState(
        selectedZajecieId || ""
    );

    useEffect(() => {
        setwybranyprzedmiot(selectedZajecieId || "");
    }, [selectedZajecieId]);

    const handleZajecieChange = (e) => {
        const noweZajecieId = e.target.value;

        setwybranyprzedmiot(noweZajecieId);

        router.get(
            "/prowadzacy/wystawienieocen",
            {
                zajecie_id: noweZajecieId,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Wystawienie ocen
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-w-0 w-full shrink-0 items-center rounded-t-[15px] px-3 py-4 sm:min-h-[90px] sm:px-4">
                    <h1 className="break-words text-xl font-bold text-theme-text sm:text-2xl lg:text-[36px]">
                        Wystawienie ocen końcowych
                    </h1>
                </div>

                <div className="bg-theme-slate flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[15px] p-3 sm:p-4 md:p-5">
                    <div className="w-full shrink-0 pb-4">
                        <label
                            htmlFor="wybor-przedmiotu"
                            className="mb-2 block text-sm text-theme-text sm:text-base"
                        >
                            Przedmiot
                        </label>

                        <Form.Select
                            id="wybor-przedmiotu"
                            required
                            value={wybranyprzedmiot}
                            onChange={handleZajecieChange}
                            className="h-[44px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text sm:text-base"
                        >
                            <option value="">
                                Wybierz przedmiot
                            </option>

                            {zajecia.map((zajecie) => (
                                <option
                                    key={zajecie.idZajęcie}
                                    value={zajecie.idZajęcie}
                                >
                                    {zajecie.NazwaPrzedmiotu},{" "}
                                    {zajecie.TypZajec}
                                </option>
                            ))}
                        </Form.Select>
                    </div>

                    <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] border border-theme-muted bg-theme-surface p-2 sm:p-3 md:p-5">
                        {Array.isArray(studenci) &&
                        studenci.length > 0 ? (
                            <table className="w-full table-fixed border-collapse text-left text-theme-text">
                                <colgroup>
                                    <col className="w-[15%]" />
                                    <col className="w-[25%]" />
                                    <col className="w-[20%]" />
                                    <col className="w-[30%]" />
                                    <col className="w-[10%]" />
                                </colgroup>

                                <thead className="hidden lg:table-header-group">
                                    <tr className="border-b border-theme-muted">
                                        <th className="p-3">
                                            Indeks
                                        </th>

                                        <th className="p-3">
                                            Imię i Nazwisko
                                        </th>

                                        <th className="p-3">
                                            Obecna ocena
                                        </th>

                                        <th className="p-3">
                                            Ocena
                                        </th>

                                        <th className="p-3">
                                            Akcja
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {studenci.map((student) => (
                                        <StudentRow
                                            key={`${wybranyprzedmiot}-${student.idStudent}`}
                                            student={student}
                                            wybranyprzedmiot={
                                                wybranyprzedmiot
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-10 text-center text-theme-muted">
                                {selectedZajecieId
                                    ? "Brak studentów w tej grupie."
                                    : "Wybierz przedmiot, aby zobaczyć listę studentów."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WystawienieOcen({
    auth,
    zajecia,
    selectedZajecieId,
    studenci,
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

            <Head title="Wystawienie ocen" />

            <MenuProwadzacy />

            <Content
                zajecia={zajecia}
                studenci={studenci}
                selectedZajecieId={selectedZajecieId}
            />
        </div>
    );
}
