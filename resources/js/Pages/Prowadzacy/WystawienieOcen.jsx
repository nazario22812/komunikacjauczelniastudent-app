
import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

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
        <tr className="border-b border-theme-muted/50">
            <td className="p-2">
                {student.index}
            </td>

            <td className="p-2">
                {student.user.name}{" "}
                {student.user.surname}
            </td>

            <td className="p-2">
                {obecnaOcena}
            </td>

            <td className="p-2">
                <Form.Select
                    value={wybranaocena}
                    onChange={(e) => {
                        setwybranaocena(e.target.value);
                    }}
                    className="w-full bg-theme-surface border border-theme-muted rounded-[15px] text-theme-text h-[60%]"
                >
                    <option value="Niedostatecznie">
                        Niedostatecznie
                    </option>
                    <option value="Dostatecznie">
                        Dostatecznie
                    </option>
                    <option value="Dostatecznie plus">
                        Dostatecznie plus
                    </option>
                    <option value="Dobrze">
                        Dobrze
                    </option>
                    <option value="Dobrze plus">
                        Dobrze plus
                    </option>
                    <option value="Bardzo dobrze">
                        Bardzo dobrze
                    </option>
                </Form.Select>
            </td>

            <td className="p-2">
                <button
                    className="w-[50px] bg-theme-orange p-2 text-[22px] rounded-[10px] font-bold hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    disabled={loading}
                    onClick={handleWystawOcene}
                >
                    {loading ? "..." : "+"}
                </button>
            </td>
        </tr>
    );
}

function Content({ zajecia, selectedZajecieId, studenci }) {
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
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />

                <span className="font-bold text-[16px] text-theme-text w-full">
                    Wystawienie ocen
                </span>
            </div>

            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative">
                <div className="bg-theme-surface w-full h-[15%] mx-auto rounded-t-[15px] px-[12px] flex text-left items-center">
                    <span className="text-theme-text font-bold text-[36px]">
                        Wystawienie ocen końcowych
                    </span>
                </div>

                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-b-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    <form className="w-full h-full">
                        <div className="py-5 h-[100px]">
                            <span className="text-theme-text">
                                Przedmiot
                            </span>

                            <Form.Select
                                required
                                value={wybranyprzedmiot}
                                onChange={handleZajecieChange}
                                className="w-full bg-theme-surface border border-theme-muted rounded-[15px] text-theme-text h-[60%]"
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

                        <div className="w-full h-[85%] px-5 py-2 bg-theme-surface border border-theme-muted rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                            {Array.isArray(studenci) && studenci.length > 0 ? (
                                <table className="w-full text-theme-text text-left">
                                    <thead>
                                        <tr className="border-b border-theme-muted">
                                            <th className="p-2">
                                                Indeks
                                            </th>

                                            <th className="p-2">
                                                Imię i Nazwisko
                                            </th>

                                            <th className="p-2">
                                                Obecna ocena
                                            </th>

                                            <th className="p-2">
                                                Ocena
                                            </th>

                                            <th className="p-2">
                                                Akcja
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {studenci.map((student) => (
                                            <StudentRow
                                                key={`${wybranyprzedmiot}-${student.idStudent}`}
                                                student={student}
                                                wybranyprzedmiot={wybranyprzedmiot}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-theme-muted text-center py-10">
                                    {selectedZajecieId
                                        ? "Brak studentów w tej grupie."
                                        : "Wybierz przedmiot, aby zobaczyć listę studentów."}
                                </div>
                            )}
                        </div>
                    </form>
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
        <div className="flex">
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
