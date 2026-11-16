
import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function Materialy({ materialy = [] }) {
    return (
        <div className="flex w-full min-w-0 flex-col gap-3 p-2 sm:p-4">
            {materialy && materialy.length > 0 ? (
                materialy.map((material, index) => {
                    const fileName =
                        material.nazwa?.split("/").pop() || "Plik";

                    return (
                        <a
                            key={material.id ?? index}
                            href={`/storage/${material.nazwa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex min-w-0 w-full items-center justify-between gap-3 rounded-[12px] border border-theme-muted/30 bg-theme-surface p-3 transition-all duration-200 hover:border-theme-orange"
                        >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <span className="shrink-0 text-[24px]">
                                    📄
                                </span>

                                <span className="min-w-0 break-words [overflow-wrap:anywhere] text-sm font-medium text-theme-text transition-colors group-hover:text-theme-orange sm:text-[16px]">
                                    {fileName}
                                </span>
                            </div>

                            <span className="shrink-0 text-xs text-theme-muted transition-transform group-hover:translate-x-1 sm:text-[14px]">
                                Otwórz
                            </span>
                        </a>
                    );
                })
            ) : (
                <div className="mx-auto mt-10 w-full text-center text-[20px] text-theme-muted">
                    <span>Brak materiałów</span>
                </div>
            )}
        </div>
    );
}

function Sylabusplusliteratura({
    sylabus,
    literatura = [],
    przedmiot,
    kurs,
}) {
    return (
        <div className="w-full min-w-0 text-theme-text">
            <div className="mb-4 min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Informacje o przedmiocie
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    <p className="break-words">
                        Przedmiot: {przedmiot?.nazwa}
                    </p>

                    <p>Semestr: {kurs?.Semester}</p>

                    <p>ECTS: {przedmiot?.punktyECTS}</p>

                    <p>Liczba godzin: {sylabus?.iloscGodzin}</p>

                    <p>
                        Egzamin:{" "}
                        {Number(sylabus?.czyEgzamin) === 1
                            ? "Tak"
                            : "Nie"}
                    </p>
                </div>
            </div>

            <div className="mb-4 min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Opis przedmiotu
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                        {sylabus?.opisPrzedmiotu}
                    </p>
                </div>
            </div>

            <div className="mb-4 min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Warunki zaliczenia
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                        {sylabus?.warunkiZaliczenia}
                    </p>
                </div>
            </div>

            <div className="min-w-0">
                <h2 className="mb-2 break-words text-lg font-bold sm:text-[22px]">
                    Literatura
                </h2>

                <div className="bg-theme-slate w-full min-w-0 rounded-[10px] p-3 sm:p-5">
                    {literatura && literatura.length > 0 ? (
                        literatura.map((ksiazka, index) => (
                            <div
                                key={ksiazka.id ?? index}
                                className="min-w-0 border-b border-theme-page py-2 last:border-b-0"
                            >
                                <p className="break-words [overflow-wrap:anywhere] text-base sm:text-[18px]">
                                    {ksiazka.nazwa}
                                </p>

                                <p className="mt-1 break-words whitespace-pre-wrap text-sm font-thin">
                                    {ksiazka.opis}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-theme-muted">
                            Brak literatury
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Oceny({ oceny = [] }) {
    return (
        <div className="min-w-0 w-full overflow-hidden rounded-[10px] border border-gray-700/60">
            <table className="w-full table-fixed border-collapse text-left">
                <colgroup>
                    <col style={{ width: "75%" }} />
                    <col style={{ width: "25%" }} />
                </colgroup>

                <thead>
                    <tr className="border-b border-gray-700 text-[14px] text-theme-muted">
                        <th className="p-2 font-medium sm:p-3">
                            Nazwa Zadania
                        </th>

                        <th className="p-2 font-medium sm:p-3">
                            Ocena
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {oceny && oceny.length > 0 ? (
                        oceny.map((ocena, index) => (
                            <tr
                                key={ocena.id ?? index}
                                className="transition-colors hover:bg-theme-slate/50"
                            >
                                <td className="break-words whitespace-normal [overflow-wrap:anywhere] p-2 font-medium text-theme-text sm:p-3">
                                    {ocena.nazwaZadania || "—"}
                                </td>

                                <td className="break-words whitespace-normal p-2 font-bold text-theme-text sm:p-3">
                                    {ocena.skalaOceny}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={2}
                                className="p-4 text-center text-theme-muted"
                            >
                                Brak ocen
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Zadania({ zadania = [] }) {
    return (
        <div className="min-w-0 w-full overflow-hidden rounded-[10px] border border-gray-700/60">
            <table className="w-full table-fixed border-collapse text-left">
                <thead>
                    <tr className="border-b border-gray-700 text-[14px] text-theme-muted">
                        <th className="p-2 font-medium sm:p-3">
                            Nazwa Zadania
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-[14px]">
                    {zadania && zadania.length > 0 ? (
                        zadania.map((zadanie, index) => (
                            <tr
                                key={zadanie.idZadanie ?? index}
                                onClick={() =>
                                    router.get(
                                        `/student/kurs/${zadanie.idZadanie}`
                                    )
                                }
                                className="cursor-pointer transition-colors hover:bg-theme-slate/50"
                            >
                                <td className="break-words whitespace-normal [overflow-wrap:anywhere] p-2 font-medium text-theme-text sm:p-3">
                                    {zadanie.nazwaZadania || "—"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center text-theme-muted">
                                Brak zadań
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Content({
    kurs,
    materialy,
    sylabus,
    literatura,
    przedmiot,
    oceny,
    zadania,
}) {
    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Kurs
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-w-0 w-full shrink-0 items-center rounded-t-[15px] px-3 py-4 sm:min-h-[100px] sm:px-4 md:px-[12px]">
                    <div className="min-w-0 w-full">
                        <h1 className="break-words [overflow-wrap:anywhere] text-xl font-bold text-theme-text sm:text-2xl lg:text-[36px]">
                            {kurs?.nazwa}
                        </h1>

                        <p className="mt-2 break-words text-sm font-thin text-theme-text sm:text-base lg:text-[20px]">
                            {kurs?.prowadzacy?.TytulNaukowy}{" "}
                            {kurs?.prowadzacy?.user?.name}{" "}
                            {kurs?.prowadzacy?.user?.surname}
                        </p>
                    </div>
                </div>

                <div className="bg-theme-slate flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[15px] p-2 sm:p-3 md:p-5">
                    <Tabs className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
                        <TabList className="hide-scrollbar flex w-full min-w-0 shrink-0 gap-1 overflow-x-auto overscroll-x-contain border-b border-theme-muted text-center text-theme-text sm:gap-3 lg:gap-8">
                            {[
                                "Materiały",
                                "Zadania",
                                "Oceny",
                                "Dodatkowa informacja",
                            ].map((label) => (
                                <Tab
                                    key={label}
                                    className="flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-t-[10px] px-3 py-2 text-sm outline-none sm:flex-1 sm:px-4 sm:text-base"
                                    selectedClassName="!border-0 !bg-theme-surface !rounded-t-[10px]"
                                >
                                    {label}
                                </Tab>
                            ))}
                        </TabList>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-2 text-theme-text custom-scrollbar sm:p-4 md:p-5"
                            selectedClassName="!block"
                        >
                            <Materialy materialy={materialy} />
                        </TabPanel>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-2 text-theme-text custom-scrollbar sm:p-4 md:p-5"
                            selectedClassName="!block"
                        >
                            <Zadania zadania={zadania} />
                        </TabPanel>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-2 text-theme-text custom-scrollbar sm:p-4 md:p-5"
                            selectedClassName="!block"
                        >
                            <Oceny oceny={oceny} />
                        </TabPanel>

                        <TabPanel
                            className="hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] bg-theme-surface p-2 text-theme-text custom-scrollbar sm:p-4 md:p-5"
                            selectedClassName="!block"
                        >
                            <Sylabusplusliteratura
                                sylabus={sylabus}
                                literatura={literatura}
                                przedmiot={przedmiot}
                                kurs={kurs}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default function MojeKursy({
    auth,
    kurs,
    materialy,
    sylabus,
    literatura,
    przedmiot,
    oceny,
    zadania,
}) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Moje kursy" />

            <MenuStudenta />

            <Content
                kurs={kurs}
                materialy={materialy}
                sylabus={sylabus}
                literatura={literatura}
                przedmiot={przedmiot}
                oceny={oceny}
                zadania={zadania}
            />
        </div>
    );
}
