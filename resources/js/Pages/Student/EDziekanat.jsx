import React, { useMemo, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head, router, Link } from "@inertiajs/react";

const getStatusStyle = (status) => {
    const value = String(status ?? "").toLocaleLowerCase("pl-PL");

    if (/zaakcept|zatwierdz|rozpatrzon|przyjęt|pozytywn/.test(value)) {
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
    }
    if (/odrzu|negatywn|anulowan/.test(value)) {
        return "border-red-500/30 bg-red-500/10 text-red-500";
    }
    if (/w trakcie|rozpatrywan|oczekuj|weryfik/.test(value)) {
        return "border-amber-500/30 bg-amber-500/10 text-amber-500";
    }
    return "border-theme-muted bg-theme-slate text-theme-text";
};

function StatusBadge({ status }) {
    return (
        <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-semibold break-words ${getStatusStyle(status)}`}>
            {status || "Brak statusu"}
        </span>
    );
}

function formatDate(date) {
    if (!date) return "—";
    const text = String(date);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
    if (match) {
        return `${match[3]}.${match[2]}.${match[1]}${match[4] ? `, ${match[4]}:${match[5]}` : ""}`;
    }
    return text;
}

export function Podanierow({ podanie }) {
    const open = () => router.get(`/student/edziekanat/${podanie.idPodanie}`);

    return (
        <tr
            onClick={open}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                }
            }}
            role="link"
            tabIndex={0}
            aria-label={`Otwórz podanie: ${podanie.temat}`}
            className="group cursor-pointer border-b border-theme-muted/50 text-left text-theme-text transition-colors hover:bg-theme-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme-orange"
        >
            <td className="min-w-0 py-4 pl-3 pr-4 align-middle sm:pl-4">
                <div className="break-words font-semibold leading-snug transition-colors group-hover:text-theme-orange">
                    {podanie.temat || "Bez tematu"}
                </div>
                <div className="mt-1 text-xs text-theme-muted">Podanie #{podanie.idPodanie}</div>
            </td>
            <td className="py-4 pr-4 align-middle text-sm text-theme-muted">
                {formatDate(podanie.data)}
            </td>
            <td className="py-4 pr-3 align-middle sm:pr-4">
                <StatusBadge status={podanie.status} />
            </td>
            <td className="py-4 pr-4 text-right align-middle text-xl text-theme-muted transition-colors group-hover:text-theme-orange">
                <span aria-hidden="true">›</span>
            </td>
        </tr>
    );
}

function PodanieMobile({ podanie }) {
    return (
        <button
            type="button"
            onClick={() => router.get(`/student/edziekanat/${podanie.idPodanie}`)}
            className="group flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-theme-muted bg-theme-slate p-4 text-left text-theme-text transition-colors hover:border-theme-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme-orange"
        >
            <div className="flex w-full min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-theme-muted">Podanie #{podanie.idPodanie}</span>
                    <span className="mt-1 block break-words [overflow-wrap:anywhere] text-base font-bold leading-snug text-theme-text">
                        {podanie.temat || "Bez tematu"}
                    </span>
                </div>
                <span className="shrink-0 text-2xl leading-none text-theme-muted group-hover:text-theme-orange" aria-hidden="true">›</span>
            </div>
            <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 border-t border-theme-muted pt-3">
                <div className="min-w-0">
                    <span className="block text-xs text-theme-muted">Data złożenia</span>
                    <span className="mt-1 block text-sm font-medium text-theme-text">{formatDate(podanie.data)}</span>
                </div>
                <StatusBadge status={podanie.status} />
            </div>
        </button>
    );
}

function Content({ podania = [] }) {
    const [wyszukiwanie, setWyszukiwanie] = useState("");
    const [wybranyStatus, setWybranyStatus] = useState("wszystkie");

    const listaPodan = Array.isArray(podania) ? podania : [];

    const statusy = useMemo(() => {
        return Array.from(new Set(listaPodan.map((podanie) => podanie.status).filter(Boolean)));
    }, [podania]);

    const filtrowanePodania = useMemo(() => {
        const fraza = wyszukiwanie.trim().toLocaleLowerCase("pl-PL");
        return listaPodan.filter((podanie) => {
            const pasujeStatus = wybranyStatus === "wszystkie" || podanie.status === wybranyStatus;
            const pasujeFraza = !fraza || [podanie.temat, podanie.data, podanie.status, podanie.idPodanie]
                .some((value) => String(value ?? "").toLocaleLowerCase("pl-PL").includes(fraza));
            return pasujeStatus && pasujeFraza;
        });
    }, [podania, wyszukiwanie, wybranyStatus]);

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[44px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-3">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-base font-bold text-theme-text">E-Dziekanat</span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 rounded-b-[10px] pt-3">
                <div className="flex min-w-0 shrink-0 flex-col gap-3 rounded-2xl bg-theme-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-bold tracking-tight text-theme-text sm:text-3xl lg:text-[34px]">
                            Historia podań
                        </h1>
                        <p className="mt-1 text-sm text-theme-muted">
                            Przeglądaj swoje podania i sprawdzaj ich status.
                        </p>
                    </div>
                    <Link
                        href="/student/zlozpodanie"
                        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-theme-orange px-5 py-2.5 text-sm font-bold text-theme-text transition-opacity hover:opacity-85 sm:w-auto"
                    >
                        <span className="text-lg leading-none" aria-hidden="true">+</span>
                        Złóż podanie
                    </Link>
                </div>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-theme-slate p-3 sm:p-4 md:p-5">
                    <div className="flex shrink-0 flex-col gap-3 rounded-xl bg-theme-surface p-3 sm:flex-row sm:items-end sm:p-4">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="szukaj-podania" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                                Szukaj podania
                            </label>
                            <div className="relative">
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center text-lg leading-none text-theme-muted"
                                >
                                    ⌕
                                </span>
                                <input
                                    id="szukaj-podania"
                                    type="search"
                                    placeholder="Temat, data, numer podania..."
                                    value={wyszukiwanie}
                                    onChange={(e) => setWyszukiwanie(e.target.value)}
                                    className="h-11 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate py-2 pl-10 pr-3 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                />
                            </div>
                        </div>
                        <div className="w-full min-w-0 sm:w-[210px]">
                            <label htmlFor="status-podania" className="mb-1.5 block text-xs font-semibold text-theme-muted">
                                Status
                            </label>
                            <select
                                id="status-podania"
                                value={wybranyStatus}
                                onChange={(e) => setWybranyStatus(e.target.value)}
                                className="h-11 w-full min-w-0 cursor-pointer rounded-xl border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none focus:border-theme-orange"
                            >
                                <option value="wszystkie">Wszystkie statusy</option>
                                {statusy.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-2 px-1 py-3 text-xs text-theme-muted sm:text-sm">
                        <span>Wyświetlono <strong className="text-theme-text">{filtrowanePodania.length}</strong> z {listaPodan.length} podań</span>
                        {(wyszukiwanie || wybranyStatus !== "wszystkie") && (
                            <button
                                type="button"
                                onClick={() => { setWyszukiwanie(""); setWybranyStatus("wszystkie"); }}
                                className="shrink-0 font-semibold text-theme-orange hover:underline"
                            >
                                Wyczyść filtry
                            </button>
                        )}
                    </div>

                    <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-xl bg-theme-surface">
                        {filtrowanePodania.length > 0 ? (
                            <>
                                <div className="hidden w-full min-w-0 md:block">
                                    <table className="w-full table-fixed border-collapse">
                                        <colgroup>
                                            <col style={{ width: "52%" }} />
                                            <col style={{ width: "24%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "4%" }} />
                                        </colgroup>
                                        <thead className="sticky top-0 z-10 bg-theme-surface">
                                            <tr className="border-b border-theme-muted text-left text-sm text-theme-muted">
                                                <th className="py-4 pl-3 pr-4 font-semibold sm:pl-4">Temat</th>
                                                <th className="py-4 pr-4 font-semibold">Data</th>
                                                <th className="py-4 pr-3 font-semibold">Status</th>
                                                <th className="py-4 pr-4"><span className="sr-only">Otwórz</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>{filtrowanePodania.map((podanie) => <Podanierow key={podanie.idPodanie} podanie={podanie} />)}</tbody>
                                    </table>
                                </div>
                                <div className="flex w-full min-w-0 flex-col gap-3 p-2 md:hidden">
                                    {filtrowanePodania.map((podanie) => <PodanieMobile key={podanie.idPodanie} podanie={podanie} />)}
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-slate text-2xl text-theme-muted" aria-hidden="true">⌕</div>
                                <p className="text-base font-semibold text-theme-text">
                                    {listaPodan.length === 0 ? "Brak podań" : "Nie znaleziono podań"}
                                </p>
                                <p className="max-w-sm text-sm text-theme-muted">
                                    {listaPodan.length === 0
                                        ? "Nie masz jeszcze żadnych podań. Możesz złożyć pierwsze podanie."
                                        : "Spróbuj zmienić frazę wyszukiwania lub wybrany status."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EDziekanat({ auth, podania }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="E-Dziekanat" />
            <MenuStudenta />
            <Content podania={podania} />
        </div>
    );
}
