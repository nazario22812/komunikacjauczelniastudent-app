import React, { useEffect, useState } from "react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";
import { Head, useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

function StatusPodania({ status }) {
    const value = String(status ?? "");
    const normalized = value.toLocaleLowerCase("pl-PL");
    const accepted = /przyję|zaakcept|akcept|zatwierdz|pozytyw/.test(normalized);
    const rejected = /odrzu|odmow|negatyw/.test(normalized);

    const color = accepted
        ? "border-green-500 text-green-500"
        : rejected
          ? "border-red-500 text-red-500"
          : "border-theme-muted text-theme-text";

    return (
        <span className={`inline-flex max-w-full items-center rounded-[10px] border bg-theme-slate px-3 py-2 text-sm font-semibold ${color}`}>
            <span className="break-words [overflow-wrap:anywhere]">{value || "Brak statusu"}</span>
        </span>
    );
}

function Content({ szczegoly, listaplikow = [], podanie }) {
    const [koniec, setkoniec] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        odpowiedz: "",
        selected_status: "",
    });

    const handleDecision = (status) => {
        setData("selected_status", status);
        setkoniec(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.selected_status || !data.odpowiedz.trim() || processing) return;

        if (window.confirm("Czy na pewno chcesz zapisać zmiany?")) {
            post(`/dziekanat/szczegolypodania/${podanie}`, {
                preserveScroll: true,
                onSuccess: () => setkoniec(false),
            });
        }
    };

    const pliki = Array.isArray(listaplikow) ? listaplikow : [];

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[42px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 truncate text-center text-[15px] font-bold text-theme-text sm:text-[16px]">
                    Szczegóły podania
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] pb-2 pt-3 sm:px-1 md:px-4">
                <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] bg-theme-slate p-2 sm:p-3 lg:p-5">
                    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-[1200px] min-w-0 flex-col gap-4 sm:gap-5">
                        <section className="min-w-0 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:p-7">
                            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-theme-muted">Podanie {szczegoly?.idPodanie ? `nr ${szczegoly.idPodanie}` : ""}</p>
                                    <h1 className="mt-2 break-words [overflow-wrap:anywhere] text-xl font-bold leading-tight text-theme-text sm:text-2xl lg:text-3xl">
                                        {szczegoly?.temat || "Bez tematu"}
                                    </h1>
                                </div>
                                <div className="min-w-0 shrink-0 sm:text-right">
                                    <p className="mb-2 text-xs text-theme-muted">Aktualny status</p>
                                    <StatusPodania status={szczegoly?.status} />
                                </div>
                            </div>

                            <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 border-t border-theme-muted pt-4 sm:grid-cols-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-theme-muted">Autor podania</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-theme-text sm:text-base">
                                        {[szczegoly?.user?.name, szczegoly?.user?.surname].filter(Boolean).join(" ") || "Brak danych"}
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-theme-muted">Data złożenia</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-theme-text sm:text-base">
                                        {szczegoly?.data || "—"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
                            <section className="min-w-0 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:p-6">
                                <h2 className="text-lg font-bold text-theme-text sm:text-xl">Treść podania</h2>
                                <div className="mt-3 min-h-[140px] min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate p-4">
                                    <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-relaxed text-theme-text sm:text-base">
                                        {szczegoly?.tresc || "Brak treści"}
                                    </p>
                                </div>
                            </section>

                            <section className="min-w-0 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:p-6">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="text-lg font-bold text-theme-text sm:text-xl">Odpowiedź / Uzasadnienie</h2>
                                    <span className="text-xs text-theme-muted">Pole wymagane</span>
                                </div>
                                <textarea
                                    id="odpowiedz"
                                    required
                                    rows={6}
                                    value={data.odpowiedz}
                                    onChange={(e) => setData("odpowiedz", e.target.value)}
                                    placeholder="Np. Podanie zostało przyjęte, ponieważ..."
                                    className="mt-3 block min-h-[140px] w-full min-w-0 resize-y rounded-[12px] border border-theme-muted bg-theme-slate p-4 text-sm leading-relaxed text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange sm:text-base"
                                />
                                {errors.odpowiedz && (
                                    <p className="mt-2 break-words text-sm text-red-400">{errors.odpowiedz}</p>
                                )}
                                {szczegoly?.odpowiedz && (
                                    <div className="mt-3 min-w-0 rounded-[10px] border border-theme-muted p-3">
                                        <p className="mb-1 text-xs font-medium text-theme-muted">Poprzednia odpowiedź</p>
                                        <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm text-theme-text">{szczegoly.odpowiedz}</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        <section className="min-w-0 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-lg font-bold text-theme-text sm:text-xl">Załączniki</h2>
                                <span className="text-xs text-theme-muted">{pliki.length} plików</span>
                            </div>
                            {pliki.length > 0 ? (
                                <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                                    {pliki.map((plik, index) => (
                                        <a
                                            key={plik.idPlik ?? index}
                                            href={`/storage/${plik.nazwa}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex min-w-0 items-center gap-3 rounded-[12px] border border-theme-muted bg-theme-slate px-4 py-3 text-theme-text no-underline transition-colors hover:border-theme-orange"
                                        >
                                            <span className="shrink-0 text-xl" aria-hidden="true">📄</span>
                                            <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-sm font-medium">
                                                {plik.nazwa?.split("/").pop() || "Plik"}
                                            </span>
                                            <span className="shrink-0 text-xs text-theme-muted">Otwórz ›</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 rounded-[12px] border border-theme-muted bg-theme-slate p-4 text-sm text-theme-muted">Brak załączników</p>
                            )}
                        </section>

                        <section className="min-w-0 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:p-6">
                            <h2 className="text-lg font-bold text-theme-text sm:text-xl">Decyzja dziekanatu</h2>
                            <p className="mt-1 text-sm text-theme-muted">Wybierz decyzję, wpisz uzasadnienie i zapisz zmiany.</p>

                            <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => handleDecision("Przyjęto")}
                                    aria-pressed={data.selected_status === "Przyjęto"}
                                    className={`min-h-[46px] rounded-[12px] border px-4 py-3 text-sm font-semibold transition-colors sm:text-base ${
                                        data.selected_status === "Przyjęto"
                                            ? "border-green-500 bg-green-700 text-white ring-2 ring-green-500"
                                            : "border-green-600 bg-theme-slate text-green-500 hover:bg-green-700 hover:text-white"
                                    }`}
                                >
                                    Zaakceptuj
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDecision("Odrzucono")}
                                    aria-pressed={data.selected_status === "Odrzucono"}
                                    className={`min-h-[46px] rounded-[12px] border px-4 py-3 text-sm font-semibold transition-colors sm:text-base ${
                                        data.selected_status === "Odrzucono"
                                            ? "border-red-500 bg-red-700 text-white ring-2 ring-red-500"
                                            : "border-red-600 bg-theme-slate text-red-500 hover:bg-red-700 hover:text-white"
                                    }`}
                                >
                                    Odrzuć
                                </button>
                            </div>

                            {errors.selected_status && <p className="mt-3 text-sm text-red-400">{errors.selected_status}</p>}

                            {koniec && (
                                <div className="mt-5 flex min-w-0 flex-col items-start gap-3 border-t border-theme-muted pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-theme-muted">
                                        Wybrana decyzja: <span className="font-semibold text-theme-text">{data.selected_status}</span>
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.odpowiedz.trim()}
                                        className="min-h-[44px] w-full rounded-[12px] bg-theme-orange px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base"
                                    >
                                        {processing ? "Zapisywanie..." : "Zapisz decyzję ✓"}
                                    </button>
                                </div>
                            )}
                        </section>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function SzczegolyPodania({ auth, szczegoly, listaplikow, podanie }) {
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
            <Head title="Szczegóły podania" />
            <MenuDziekanat />
            <Content szczegoly={szczegoly} listaplikow={listaplikow} podanie={podanie} />
        </div>
    );
}
