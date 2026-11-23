import React, { useMemo, useState } from "react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";
import { Head, router } from "@inertiajs/react";

const normalize = (value) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pl-PL");

function getStatusStyle(status) {
    const value = normalize(status);

    if (
        value.includes("zaakcept") ||
        value.includes("przyjet") ||
        value.includes("pozytywn") ||
        value.includes("zatwierdz") ||
        value.includes("rozpatrzono pozytywnie")
    ) {
        return "border-green-500/40 bg-green-500/10 text-green-500";
    }

    if (
        value.includes("odrzu") ||
        value.includes("negatywn") ||
        value.includes("odmow")
    ) {
        return "border-red-500/40 bg-red-500/10 text-red-400";
    }

    if (
        value.includes("wyslan") ||
        value.includes("oczek") ||
        value.includes("nowe") ||
        value.includes("w trakcie") ||
        value.includes("rozpatrywan")
    ) {
        return "border-amber-500/40 bg-amber-500/10 text-amber-500";
    }

    return "border-theme-muted bg-theme-slate text-theme-text";
}

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-semibold sm:text-sm ${getStatusStyle(status)}`}
        >
            <span className="break-words [overflow-wrap:anywhere]">
                {status || "Brak statusu"}
            </span>
        </span>
    );
}

function openPodanie(podanie) {
    router.get(`/dziekanat/szczegolypodania/${podanie.idPodanie}`);
}

export function Podanierow({ podanie }) {
    return (
        <tr
            onClick={() => openPodanie(podanie)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPodanie(podanie);
                }
            }}
            tabIndex={0}
            role="link"
            aria-label={`Zobacz szczegóły podania: ${podanie.temat}`}
            className="group cursor-pointer border-b border-theme-muted text-left text-sm text-theme-text transition-colors hover:bg-theme-slate focus-visible:bg-theme-slate focus-visible:outline-2 focus-visible:outline-theme-orange"
        >
            <td className="py-4 pr-4 align-middle">
                <span className="block break-words [overflow-wrap:anywhere] font-semibold group-hover:text-theme-orange">
                    {podanie.temat || "Bez tematu"}
                </span>
                <span className="mt-1 block text-xs text-theme-muted">
                    Podanie #{podanie.idPodanie}
                </span>
            </td>
            <td className="py-4 pr-4 align-middle text-theme-muted">
                {podanie.data || "—"}
            </td>
            <td className="py-4 align-middle">
                <StatusBadge status={podanie.status} />
            </td>
            <td className="py-4 pl-3 text-right align-middle text-theme-muted">
                <span className="font-semibold group-hover:text-theme-orange">Szczegóły ›</span>
            </td>
        </tr>
    );
}

function PodanieMobile({ podanie }) {
    return (
        <button
            type="button"
            onClick={() => openPodanie(podanie)}
            className="group flex w-full min-w-0 flex-col gap-3 rounded-[15px] border border-theme-muted bg-theme-slate p-4 text-left text-theme-text transition-colors hover:border-theme-orange focus-visible:outline-2 focus-visible:outline-theme-orange"
        >
            <div className="flex w-full min-w-0 flex-wrap items-start justify-between gap-2">
                <span className="text-xs font-medium text-theme-muted">
                    Podanie #{podanie.idPodanie}
                </span>
                <StatusBadge status={podanie.status} />
            </div>

            <h3 className="w-full min-w-0 break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text">
                {podanie.temat || "Bez tematu"}
            </h3>

            <div className="flex w-full min-w-0 flex-wrap items-end justify-between gap-3 border-t border-theme-muted pt-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">Data złożenia</span>
                    <span className="mt-1 block break-words text-sm font-medium text-theme-text">
                        {podanie.data || "—"}
                    </span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-theme-orange">
                    Zobacz szczegóły ›
                </span>
            </div>
        </button>
    );
}

function Content({ podania = [] }) {
    const [szukaj, setSzukaj] = useState("");
    const [wybranyStatus, setWybranyStatus] = useState("wszystkie");

    const wszystkiePodania = Array.isArray(podania) ? podania : [];

    const statusy = useMemo(
        () =>
            [...new Set(wszystkiePodania.map((podanie) => podanie.status).filter(Boolean))]
                .sort((a, b) => String(a).localeCompare(String(b), "pl-PL")),
        [podania]
    );

    const filtrowanePodania = useMemo(() => {
        const query = normalize(szukaj.trim());

        return wszystkiePodania.filter((podanie) => {
            const statusPasuje =
                wybranyStatus === "wszystkie" || podanie.status === wybranyStatus;

            const tekstPasuje =
                !query ||
                [podanie.temat, podanie.data, podanie.status, podanie.idPodanie]
                    .some((value) => normalize(value).includes(query));

            return statusPasuje && tekstPasuje;
        });
    }, [podania, szukaj, wybranyStatus]);

    const wyczyscFiltry = () => {
        setSzukaj("");
        setWybranyStatus("wszystkie");
    };

    const aktywneFiltry = Boolean(szukaj.trim()) || wybranyStatus !== "wszystkie";

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[15px] font-bold text-theme-text sm:text-[16px]">
                    Podania
                </span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-2 sm:p-3 md:p-5">
                    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-surface p-3 sm:p-4 md:p-6">
                        <div className="flex min-w-0 shrink-0 flex-col gap-2 border-b border-theme-muted pb-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="min-w-0">
                                <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[36px]">
                                    Podania studentów
                                </h1>
                                <p className="mt-1 text-sm text-theme-muted">
                                    Przeglądaj podania i przechodź do ich rozpatrywania.
                                </p>
                            </div>
                            <span className="shrink-0 text-sm font-medium text-theme-muted">
                                Wszystkich podań: <strong className="text-theme-text">{wszystkiePodania.length}</strong>
                            </span>
                        </div>

                        <div className="flex min-w-0 shrink-0 flex-col gap-3 py-4 md:flex-row md:items-center">
                            <div className="relative min-w-0 flex-1">
                                <label htmlFor="szukaj-podan-dziekanat" className="sr-only">
                                    Szukaj podań
                                </label>
                                <input
                                    id="szukaj-podan-dziekanat"
                                    type="search"
                                    placeholder="Szukaj po temacie, numerze lub dacie..."
                                    value={szukaj}
                                    onChange={(e) => setSzukaj(e.target.value)}
                                    className="h-[44px] w-full min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate px-4 pr-10 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                />
                                {szukaj && (
                                    <button
                                        type="button"
                                        onClick={() => setSzukaj("")}
                                        aria-label="Wyczyść wyszukiwanie"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl leading-none text-theme-muted hover:text-theme-text"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <div className="w-full min-w-0 md:w-[230px] md:shrink-0">
                                <label htmlFor="status-podan-dziekanat" className="sr-only">
                                    Filtruj według statusu
                                </label>
                                <select
                                    id="status-podan-dziekanat"
                                    value={wybranyStatus}
                                    onChange={(e) => setWybranyStatus(e.target.value)}
                                    className="h-[44px] w-full min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none focus:border-theme-orange"
                                >
                                    <option value="wszystkie">Wszystkie statusy</option>
                                    {statusy.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2 pb-3 text-xs text-theme-muted sm:text-sm">
                            <span>
                                Wyświetlane: <strong className="text-theme-text">{filtrowanePodania.length}</strong> z {wszystkiePodania.length}
                            </span>
                            {aktywneFiltry && (
                                <button
                                    type="button"
                                    onClick={wyczyscFiltry}
                                    className="font-semibold text-theme-orange hover:underline"
                                >
                                    Wyczyść filtry
                                </button>
                            )}
                        </div>

                        <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
                            {filtrowanePodania.length > 0 ? (
                                <>
                                    <div className="hidden w-full min-w-0 lg:block">
                                        <table className="w-full table-fixed border-collapse">
                                            <colgroup>
                                                <col style={{ width: "48%" }} />
                                                <col style={{ width: "21%" }} />
                                                <col style={{ width: "22%" }} />
                                                <col style={{ width: "9%" }} />
                                            </colgroup>
                                            <thead className="sticky top-0 z-10 bg-theme-surface">
                                                <tr className="border-b border-theme-muted text-left text-sm text-theme-muted">
                                                    <th className="py-3 pr-4 font-semibold">Temat</th>
                                                    <th className="py-3 pr-4 font-semibold">Data</th>
                                                    <th className="py-3 font-semibold">Status</th>
                                                    <th className="py-3 text-right font-semibold"> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtrowanePodania.map((podanie) => (
                                                    <Podanierow key={podanie.idPodanie} podanie={podanie} />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex w-full min-w-0 flex-col gap-3 lg:hidden">
                                        {filtrowanePodania.map((podanie) => (
                                            <PodanieMobile key={podanie.idPodanie} podanie={podanie} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex min-h-[240px] w-full flex-col items-center justify-center gap-3 px-3 text-center">
                                    <span className="text-lg font-bold text-theme-text">
                                        {aktywneFiltry ? "Nie znaleziono podań" : "Brak podań"}
                                    </span>
                                    <p className="max-w-[340px] text-sm text-theme-muted">
                                        {aktywneFiltry
                                            ? "Zmień wyszukiwanie lub wybrany status."
                                            : "Nowe podania studentów pojawią się tutaj."}
                                    </p>
                                    {aktywneFiltry && (
                                        <button
                                            type="button"
                                            onClick={wyczyscFiltry}
                                            className="rounded-[10px] bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text"
                                        >
                                            Wyczyść filtry
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Podania({ podania = [] }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Podania" />
            <MenuDziekanat />
            <Content podania={podania} />
        </div>
    );
}
