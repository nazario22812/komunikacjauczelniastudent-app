
import React, { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { ToastContainer, toast } from "react-toastify";
import Form from "react-bootstrap/Form";

const opcjeOcen = [
    "Niedostatecznie",
    "Dostatecznie",
    "Dostatecznie plus",
    "Dobrze",
    "Dobrze plus",
    "Bardzo dobrze",
];

function Content({
    studenci = [],
    idZadanie,
    student_id,
    pliks = [],
    terminOddania,
}) {
    const [wybranaocena, setwybranaocena] = useState("Niedostatecznie");
    const [loading, setLoading] = useState(false);

    const handleZadanieClick = (studentId) => {
        router.get(
            `/prowadzacy/otworzzadanie/${idZadanie}`,
            { student_id: studentId },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleZapiszOcene = () => {
        if (loading || !student_id) return;

        setLoading(true);

        router.post(
            `/prowadzacy/ocenieniezadania/${idZadanie}/${student_id}/${encodeURIComponent(wybranaocena)}`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
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
                    Sprawdzenie zadania
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate custom-scrollbar flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto rounded-[15px] p-2 sm:p-3 md:p-5 lg:overflow-hidden">
                    <div className="bg-theme-surface flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] p-3 sm:p-4 md:px-[37px] md:py-[22px]">
                        <h1 className="mb-4 shrink-0 break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[40px]">
                            Lista studentów
                        </h1>

                        <div className="grid min-h-0 min-w-0 w-full flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-3">
                            <div className="custom-scrollbar min-h-[180px] min-w-0 overflow-x-hidden overflow-y-auto rounded-[10px] border border-gray-700/60 lg:min-h-0">
                                {studenci && studenci.length > 0 ? (
                                    <div className="divide-y divide-gray-700/50">
                                        {studenci.map((student) => (
                                            <button
                                                key={student.idStudent}
                                                type="button"
                                                onClick={() =>
                                                    handleZadanieClick(
                                                        student.idStudent
                                                    )
                                                }
                                                className={`flex min-w-0 w-full cursor-pointer items-center gap-3 px-3 py-4 text-left text-theme-text transition-colors sm:px-4 ${
                                                    String(student_id) ===
                                                    String(student.idStudent)
                                                        ? "bg-theme-slate"
                                                        : "hover:bg-theme-slate"
                                                }`}
                                            >
                                                <span className="w-[75px] shrink-0 break-words text-sm font-medium sm:w-[90px] sm:text-base">
                                                    {student.index}
                                                </span>

                                                <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-sm font-medium sm:text-base lg:text-lg">
                                                    {student.user?.name}{" "}
                                                    {student.user?.surname}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-theme-muted">
                                        Brak studentów
                                    </div>
                                )}
                            </div>

                            <div className="flex min-h-[220px] min-w-0 flex-col overflow-hidden rounded-[10px] border border-gray-700/60 lg:min-h-0">
                                {student_id ? (
                                    <>
                                        <div className="flex min-w-0 shrink-0 flex-col gap-3 border-b border-gray-700/60 p-3 sm:p-4">
                                            <h2 className="break-words text-lg font-medium text-theme-text sm:text-[22px]">
                                                Termin oddania:{" "}
                                                {terminOddania || "Brak"}
                                            </h2>

                                            <label
                                                htmlFor="ocena-zadania"
                                                className="text-sm text-theme-text sm:text-base"
                                            >
                                                Wybierz ocenę
                                            </label>

                                            <Form.Select
                                                id="ocena-zadania"
                                                value={wybranaocena}
                                                onChange={(e) =>
                                                    setwybranaocena(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={loading}
                                                className="h-[46px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface px-3 text-sm text-theme-text sm:text-base"
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
                                                disabled={loading}
                                                onClick={handleZapiszOcene}
                                                className="bg-theme-orange mx-auto mt-1 min-h-[46px] w-full max-w-[300px] cursor-pointer rounded-[10px] px-3 py-2 text-base font-bold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                                            >
                                                {loading
                                                    ? "Zapisywanie..."
                                                    : "Zapisz ocenę"}
                                            </button>
                                        </div>

                                        <div className="custom-scrollbar min-h-[180px] min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:min-h-0">
                                            {pliks && pliks.length > 0 ? (
                                                <ul className="flex min-w-0 flex-col gap-2">
                                                    {pliks.map(
                                                        (file, index) => {
                                                            const fileName =
                                                                file?.nazwa
                                                                    ?.split("/")
                                                                    .pop() ||
                                                                file?.name ||
                                                                "Brak nazwy";

                                                            return (
                                                                <li
                                                                    key={`${file.nazwa}-${index}`}
                                                                    className="bg-theme-surface flex min-w-0 items-center gap-3 rounded-xl border border-white/20 p-3 text-theme-text"
                                                                >
                                                                    <span className="shrink-0 text-xl">
                                                                        📎
                                                                    </span>

                                                                    <div className="min-w-0 flex-1">
                                                                        <a
                                                                            href={`/storage/${file.nazwa}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="block break-words [overflow-wrap:anywhere] text-sm text-theme-text hover:underline sm:text-base"
                                                                        >
                                                                            {fileName}
                                                                        </a>

                                                                        {file.size != null && (
                                                                            <p className="mt-1 text-xs text-theme-muted">
                                                                                {(
                                                                                    file.size /
                                                                                    1024
                                                                                ).toFixed(
                                                                                    1
                                                                                )}{" "}
                                                                                KB
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                            ) : (
                                                <div className="mt-10 w-full text-center text-xl text-theme-muted sm:text-[24px]">
                                                    Brak plików
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-full min-h-[180px] w-full items-center justify-center p-4 text-center text-xl text-theme-muted sm:text-[24px]">
                                        Wybierz studenta
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SprawdzenieZadania({
    auth,
    studenci,
    idZadanie,
    student_id,
    pliks,
    terminOddania,
}) {
    const props = usePage().props;

    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;

    useEffect(() => {
        if (message) {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }

        if (error) {
            toast.error(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }, [message, error]);

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

            <Head title="Sprawdzenie zadania" />

            <MenuProwadzacy />

            <Content
                studenci={studenci}
                idZadanie={idZadanie}
                student_id={student_id}
                pliks={pliks}
                terminOddania={terminOddania}
            />
        </div>
    );
}
