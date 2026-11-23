import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head, router } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const panelClass =
    "custom-scrollbar hidden min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[15px] bg-theme-surface p-3 text-theme-text sm:p-5 lg:p-6";

const tabClass =
    "flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[11px] border border-transparent px-4 py-2.5 text-center text-sm font-semibold text-theme-muted outline-none transition-colors hover:bg-theme-surface hover:text-theme-text focus-visible:border-theme-orange sm:text-[15px]";

function EmptyState({ title, description }) {
    return (
        <div className="flex min-h-[180px] min-w-0 flex-col items-center justify-center rounded-[15px] border border-theme-muted bg-theme-slate px-4 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] bg-theme-surface text-2xl" aria-hidden="true">—</div>
            <p className="text-base font-semibold text-theme-text">{title}</p>
            {description && <p className="mt-1 max-w-md text-sm text-theme-muted">{description}</p>}
        </div>
    );
}

function Materialy({ materialy = [] }) {
    return (
        <section className="min-w-0">
            <div className="mb-5 flex min-w-0 flex-wrap items-end justify-between gap-2">
                <div>
                    <h2 className="text-xl font-bold text-theme-text sm:text-2xl">Materiały kursu</h2>
                    <p className="mt-1 text-sm text-theme-muted">Pliki udostępnione przez prowadzącego</p>
                </div>
                <span className="rounded-full border border-theme-muted bg-theme-slate px-3 py-1 text-xs font-medium text-theme-muted">
                    {materialy?.length ?? 0} plików
                </span>
            </div>
            {materialy?.length > 0 ? (
                <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
                    {materialy.map((material, index) => {
                        const fileName = material.nazwa?.split("/").pop() || "Plik";
                        return (
                            <a
                                key={material.idPlik ?? material.id ?? index}
                                href={`/storage/${material.nazwa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex min-w-0 items-center gap-3 rounded-[15px] border border-theme-muted bg-theme-slate p-4 no-underline transition-colors hover:border-theme-orange hover:bg-theme-panel"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-surface text-xl" aria-hidden="true">📄</span>
                                <span className="min-w-0 flex-1">
                                    <span className="block break-words [overflow-wrap:anywhere] text-sm font-semibold text-theme-text sm:text-base">{fileName}</span>
                                    <span className="mt-1 block text-xs text-theme-muted">Otwórz materiał w nowej karcie</span>
                                </span>
                                <span className="shrink-0 rounded-lg bg-theme-surface px-3 py-2 text-xs font-semibold text-theme-text group-hover:bg-theme-orange">Otwórz</span>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <EmptyState title="Brak materiałów" description="Prowadzący nie udostępnił jeszcze plików dla tego kursu." />
            )}
        </section>
    );
}

function Zadania({ zadania = [] }) {
    return (
        <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h2 className="text-xl font-bold text-theme-text sm:text-2xl">Zadania</h2>
                    <p className="mt-1 text-sm text-theme-muted">Wybierz zadanie, aby zobaczyć szczegóły i przesłać rozwiązanie</p>
                </div>
                <span className="rounded-full border border-theme-muted bg-theme-slate px-3 py-1 text-xs font-medium text-theme-muted">{zadania?.length ?? 0} zadań</span>
            </div>
            {zadania?.length > 0 ? (
                <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
                    {zadania.map((zadanie, index) => (
                        <button
                            type="button"
                            key={zadanie.idZadanie ?? index}
                            onClick={() => router.get(`/student/kurs/${zadanie.idZadanie}`)}
                            className="group flex min-w-0 flex-col gap-3 rounded-[15px] border border-theme-muted bg-theme-slate p-4 text-left text-theme-text transition-colors hover:border-theme-orange hover:bg-theme-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme-orange sm:p-5"
                        >
                            <span className="block min-w-0 break-words [overflow-wrap:anywhere] text-base font-bold sm:text-lg">{zadanie.nazwaZadania || "Bez nazwy"}</span>
                            {zadanie.TerminOddania && (
                                <span className="break-words text-xs text-theme-muted sm:text-sm">Termin oddania: {zadanie.TerminOddania}</span>
                            )}
                            <span className="mt-auto self-start rounded-[9px] bg-theme-surface px-3 py-2 text-sm font-semibold group-hover:bg-theme-orange">Zobacz zadanie</span>
                        </button>
                    ))}
                </div>
            ) : (
                <EmptyState title="Brak zadań" description="Nie dodano jeszcze żadnych zadań do tego kursu." />
            )}
        </section>
    );
}

function Oceny({ oceny = [] }) {
    return (
        <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h2 className="text-xl font-bold text-theme-text sm:text-2xl">Oceny z zadań</h2>
                    <p className="mt-1 text-sm text-theme-muted">Wyniki prac ocenionych przez prowadzącego</p>
                </div>
                <span className="rounded-full border border-theme-muted bg-theme-slate px-3 py-1 text-xs font-medium text-theme-muted">{oceny?.length ?? 0} ocen</span>
            </div>
            {oceny?.length > 0 ? (
                <div className="flex min-w-0 flex-col gap-3">
                    {oceny.map((ocena, index) => (
                        <div key={ocena.idOcena ?? ocena.id ?? index} className="flex min-w-0 items-center justify-between gap-4 rounded-[15px] border border-theme-muted bg-theme-slate p-4 sm:p-5">
                            <div className="min-w-0 flex-1">
                                <p className="break-words [overflow-wrap:anywhere] text-sm font-semibold text-theme-text sm:text-base">{ocena.nazwaZadania || "Zadanie"}</p>
                                <p className="mt-1 text-xs text-theme-muted">Ocena</p>
                            </div>
                            <span className="flex min-h-[48px] min-w-[55px] shrink-0 items-center justify-center rounded-xl bg-theme-surface px-3 text-lg font-bold text-theme-text">{ocena.skalaOceny ?? "—"}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState title="Brak ocen" description="Oceny za zadania pojawią się tutaj po sprawdzeniu prac." />
            )}
        </section>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="min-w-0 rounded-xl bg-theme-slate p-4">
            <span className="block text-xs font-medium text-theme-muted">{label}</span>
            <span className="mt-1 block break-words [overflow-wrap:anywhere] text-base font-semibold text-theme-text">{value ?? "—"}</span>
        </div>
    );
}

function Sylabusplusliteratura({ sylabus, literatura = [], przedmiot, kurs }) {
    return (
        <section className="flex min-w-0 flex-col gap-5">
            <div>
                <h2 className="mb-3 text-xl font-bold text-theme-text sm:text-2xl">Informacje o przedmiocie</h2>
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoItem label="Przedmiot" value={przedmiot?.nazwa} />
                    <InfoItem label="Semestr" value={kurs?.Semester} />
                    <InfoItem label="Punkty ECTS" value={przedmiot?.punktyECTS} />
                    <InfoItem label="Liczba godzin" value={sylabus?.iloscGodzin} />
                    <InfoItem label="Egzamin" value={sylabus ? (Number(sylabus.czyEgzamin) === 1 ? "Tak" : "Nie") : "—"} />
                </div>
            </div>
            {[
                { title: "Opis przedmiotu", text: sylabus?.opisPrzedmiotu },
                { title: "Warunki zaliczenia", text: sylabus?.warunkiZaliczenia },
            ].map((section) => (
                <div className="min-w-0" key={section.title}>
                    <h2 className="mb-3 text-lg font-bold text-theme-text sm:text-xl">{section.title}</h2>
                    <div className="min-h-[90px] rounded-[15px] bg-theme-slate p-4 sm:p-5">
                        <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-relaxed text-theme-text sm:text-base">{section.text || "Brak informacji"}</p>
                    </div>
                </div>
            ))}
            <div className="min-w-0">
                <h2 className="mb-3 text-lg font-bold text-theme-text sm:text-xl">Literatura</h2>
                {literatura?.length > 0 ? (
                    <div className="flex min-w-0 flex-col gap-3">
                        {literatura.map((ksiazka, index) => (
                            <div key={ksiazka.idLiteratura ?? ksiazka.id ?? index} className="min-w-0 rounded-[15px] bg-theme-slate p-4 sm:p-5">
                                <p className="break-words font-semibold text-theme-text">{ksiazka.nazwa}</p>
                                {ksiazka.opis && <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-relaxed text-theme-muted">{ksiazka.opis}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState title="Brak literatury" />
                )}
            </div>
        </section>
    );
}

function Content({ kurs, materialy, sylabus, literatura, przedmiot, oceny, zadania }) {
    const prowadzacy = [
        kurs?.prowadzacy?.TytulNaukowy,
        kurs?.prowadzacy?.user?.name,
        kurs?.prowadzacy?.user?.surname,
    ].filter(Boolean).join(" ");

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="flex h-[42px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-3">
                <div className="flex w-[42px] shrink-0 items-center"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 truncate text-center text-[15px] font-bold text-theme-text sm:text-base">Szczegóły kursu</span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 overflow-hidden rounded-b-[10px] pt-3 sm:px-2 md:px-4">
                <div className="flex min-w-0 shrink-0 flex-col gap-3 rounded-[15px] bg-theme-surface p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:px-7">
                    <div className="min-w-0">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-theme-muted">Moje kursy / Szczegóły kursu</p>
                        <h1 className="break-words [overflow-wrap:anywhere] text-xl font-bold leading-tight text-theme-text sm:text-2xl lg:text-[30px]">{kurs?.nazwa || "Kurs"}</h1>
                        <p className="mt-2 break-words text-sm text-theme-muted sm:text-base">{prowadzacy || "Brak informacji o prowadzącym"}</p>
                    </div>
                    {kurs?.Semester != null && <span className="shrink-0 self-start rounded-full border border-theme-muted bg-theme-slate px-3 py-2 text-sm font-medium text-theme-text lg:self-center">Semestr {kurs.Semester}</span>}
                </div>

                <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-2 sm:p-3">
                    <Tabs className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
                        <TabList className="hide-scrollbar mb-2 flex min-w-0 w-full shrink-0 gap-2 overflow-x-auto rounded-[12px] border-0 bg-theme-slate p-1 sm:mb-3" >
                            {["Materiały", "Zadania", "Oceny", "Dodatkowa informacja"].map((label) => (
                                <Tab key={label} className={tabClass} selectedClassName="!border-theme-muted !bg-theme-surface !text-theme-text !shadow-sm">{label}</Tab>
                            ))}
                        </TabList>
                        <TabPanel className={panelClass} selectedClassName="!block"><Materialy materialy={materialy} /></TabPanel>
                        <TabPanel className={panelClass} selectedClassName="!block"><Zadania zadania={zadania} /></TabPanel>
                        <TabPanel className={panelClass} selectedClassName="!block"><Oceny oceny={oceny} /></TabPanel>
                        <TabPanel className={panelClass} selectedClassName="!block"><Sylabusplusliteratura sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} kurs={kurs} /></TabPanel>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}

export default function MojeKursy({ auth, kurs, materialy, sylabus, literatura, przedmiot, oceny, zadania }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title={kurs?.nazwa || "Moje kursy"} />
            <MenuStudenta />
            <Content kurs={kurs} materialy={materialy} sylabus={sylabus} literatura={literatura} przedmiot={przedmiot} oceny={oceny} zadania={zadania} />
        </div>
    );
}
