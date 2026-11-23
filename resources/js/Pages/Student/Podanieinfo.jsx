import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head } from "@inertiajs/react";

function statusStyle(status = "") {
    const text = String(status).toLowerCase();

    if (text.includes("przyję") || text.includes("zaakcept") || text.includes("zatwierdz")) {
        return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
    }

    if (text.includes("odrzuc") || text.includes("odmow") || text.includes("anulow")) {
        return "border-red-500/40 bg-red-500/10 text-red-400";
    }

    return "border-theme-muted bg-theme-slate text-theme-text";
}

function DetailSection({ title, children, empty = false }) {
    return (
        <section className="min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-semibold text-theme-muted sm:text-base">
                {title}
            </h2>
            <div className={`break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-7 sm:text-base ${empty ? "text-theme-muted" : "text-theme-text"}`}>
                {children}
            </div>
        </section>
    );
}

function Content({ szczegoly, listaplikow = [] }) {
    if (!szczegoly) {
        return (
            <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
                <div className="flex h-[40px] shrink-0 items-center border-b border-theme-muted px-2">
                    <BackButton back={() => window.history.back()} />
                    <span className="flex-1 text-center text-sm font-bold text-theme-text sm:text-base">Szczegóły podania</span>
                    <div className="w-[42px] shrink-0" />
                </div>
                <div className="flex flex-1 items-center justify-center text-theme-muted">Nie znaleziono podania</div>
            </div>
        );
    }

    const files = Array.isArray(listaplikow) ? listaplikow : [];

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[15px] font-bold text-theme-text sm:text-[16px]">
                    Szczegóły podania
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto pb-3 pt-3 sm:pb-4">
                <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 sm:gap-4">
                    <header className="min-w-0 rounded-[15px] bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-theme-muted">
                                    E-Dziekanat · Podanie {szczegoly.idPodanie ? `#${szczegoly.idPodanie}` : ""}
                                </div>
                                <h1 className="break-words [overflow-wrap:anywhere] text-xl font-bold leading-snug text-theme-text sm:text-2xl lg:text-[30px]">
                                    {szczegoly.temat || "Podanie"}
                                </h1>
                                <p className="mt-3 text-xs text-theme-muted sm:text-sm">
                                    Data złożenia: <span className="font-medium text-theme-text">{szczegoly.data || "Brak danych"}</span>
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                <span className="text-xs font-medium text-theme-muted">Status podania</span>
                                <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm ${statusStyle(szczegoly.status)}`}>
                                    <span className="break-words [overflow-wrap:anywhere]">{szczegoly.status || "Brak statusu"}</span>
                                </span>
                            </div>
                        </div>
                    </header>

                    <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2">
                        <DetailSection title="Treść podania" empty={!szczegoly.tresc}>
                            {szczegoly.tresc || "Brak treści podania"}
                        </DetailSection>
                        <DetailSection title="Odpowiedź dziekanatu" empty={!szczegoly.odpowiedz}>
                            {szczegoly.odpowiedz || "Nie udzielono jeszcze odpowiedzi na podanie."}
                        </DetailSection>
                    </div>

                    <section className="min-w-0 rounded-[15px] border border-theme-muted bg-theme-surface p-4 sm:p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-base font-bold text-theme-text sm:text-lg">Załączniki</h2>
                            <span className="rounded-full border border-theme-muted bg-theme-slate px-2.5 py-1 text-xs text-theme-muted">
                                {files.length} {files.length === 1 ? "plik" : "plików"}
                            </span>
                        </div>
                        {files.length > 0 ? (
                            <ul className="flex min-w-0 flex-col gap-2">
                                {files.map((plik, index) => (
                                    <li key={plik.idPlik ?? index} className="min-w-0">
                                        <a
                                            href={`/storage/${plik.nazwa}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-theme-muted bg-theme-slate p-3 transition-colors hover:bg-theme-page sm:p-4"
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-surface text-lg">📎</span>
                                                <span className="min-w-0 break-words [overflow-wrap:anywhere] text-sm font-medium text-theme-text group-hover:underline sm:text-base">
                                                    {String(plik.nazwa ?? "Plik").split("/").pop()}
                                                </span>
                                            </span>
                                            <span className="shrink-0 text-xs text-theme-muted sm:text-sm">Otwórz ↗</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="rounded-xl border border-dashed border-theme-muted bg-theme-slate px-4 py-7 text-center text-sm text-theme-muted">
                                Brak załączników
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function Podanieinfo({ auth, szczegoly, listaplikow }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Szczegóły podania" />
            <MenuStudenta />
            <Content szczegoly={szczegoly} listaplikow={listaplikow} />
        </div>
    );
}
