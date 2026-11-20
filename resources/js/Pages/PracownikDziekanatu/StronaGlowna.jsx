import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    FileText,
    CalendarClock,
    CalendarDays,
    Wallet,
    BookOpen,
    Megaphone,
    ArrowRight,
    Clock3,
    ClipboardCheck,
} from "lucide-react";
import MenuDziekanat from "../../Components/MenuDziekanat";

const domyslneLinki = {
    rezerwacje: "/dziekanat/rezerwacje",
    plany: "/dziekanat/plany-zajec",
    sylabusy: "/dziekanat/sylabusy",
};

function liczbaLubKreska(wartosc) {
    return typeof wartosc === "number" ? wartosc : "—";
}

function przyjaznaData(data) {
    if (!data) return "";
    const date = new Date(data);
    if (Number.isNaN(date.getTime())) return String(data);
    return date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function Kafelek({ href, ikona: Ikona, tytul, opis, liczba }) {
    const zawartosc = (
        <>
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-theme-orange">
                    <Ikona size={21} />
                </div>
                {href && <ArrowRight size={19} className="text-theme-muted" />}
            </div>
            <div className="mt-5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[17px] font-bold text-theme-text sm:text-[19px]">{tytul}</h3>
                    {liczba !== undefined && liczba !== null && (
                        <span className="rounded-full bg-theme-slate px-2 py-0.5 text-[12px] text-theme-text">
                            {liczba}
                        </span>
                    )}
                </div>
                <p className="mt-1 text-[13px] leading-5 text-theme-muted">{opis}</p>
            </div>
        </>
    );

    const klasa =
        "flex min-h-[180px] min-w-0 flex-col justify-between rounded-[15px] border border-theme-muted bg-theme-surface p-4 transition-colors sm:p-5" +
        (href ? " hover:border-theme-orange" : "");

    return href ? (
        <Link href={href} className={klasa}>
            {zawartosc}
        </Link>
    ) : (
        <div className={klasa}>{zawartosc}</div>
    );
}

function Panel({ tytul, podtytul, ikona: Ikona, elementy, pustyTekst, renderujElement, href }) {
    return (
        <section className="flex min-h-[290px] min-w-0 flex-col overflow-hidden rounded-[15px] border border-theme-muted bg-theme-surface lg:flex-row">
            <div className="flex shrink-0 items-center justify-center gap-3 bg-theme-slate px-5 py-5 lg:w-[35%] lg:flex-col lg:px-4 lg:text-center">
                <Ikona size={25} className="text-theme-orange lg:mb-2" />
                <div className="min-w-0">
                    <h2 className="text-[20px] font-bold text-theme-text sm:text-[24px]">{tytul}</h2>
                    <p className="mt-1 text-[12px] text-theme-muted">{podtytul}</p>
                </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                <div className="flex min-h-0 flex-1 flex-col gap-2">
                    {elementy.length ? (
                        elementy.slice(0, 3).map((element, indeks) => (
                            <div key={element.idPodanie ?? element.idRezerwacja ?? element.id ?? indeks} className="rounded-xl bg-theme-slate p-3">
                                {renderujElement(element)}
                            </div>
                        ))
                    ) : (
                        <div className="flex min-h-[160px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-theme-muted px-4 text-center">
                            <ClipboardCheck size={25} className="text-theme-muted" />
                            <p className="text-[13px] text-theme-muted">{pustyTekst}</p>
                        </div>
                    )}
                </div>
                {href && (
                    <Link href={href} className="mt-3 flex items-center justify-end gap-2 text-[13px] font-semibold text-theme-orange hover:underline">
                        Zobacz wszystkie <ArrowRight size={15} />
                    </Link>
                )}
            </div>
        </section>
    );
}

function Zawartosc({ podania = [], rezerwacje = [], statystyki = {}, linki = {} }) {
    const adresy = { ...domyslneLinki, ...linki };
    const listaPodan = Array.isArray(podania) ? podania : [];
    const listaRezerwacji = Array.isArray(rezerwacje) ? rezerwacje : [];

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <header className="flex h-[40px] w-full shrink-0 items-center justify-center rounded-t-[10px] border border-theme-muted bg-theme-panel px-3">
                <h1 className="text-[14px] font-bold text-theme-text sm:text-[16px]">Strona główna</h1>
            </header>
            <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-b-[10px] border border-t-0 border-theme-muted bg-theme-panel p-2 sm:p-3">
                <div className="mx-auto flex w-full max-w-[1550px] flex-col gap-4 rounded-[15px] bg-theme-slate p-2 sm:p-4 lg:gap-5 lg:p-5">
                    <div className="flex flex-col gap-1 px-1 py-2">
                        <h2 className="text-[23px] font-bold text-theme-text sm:text-[30px]">Panel dziekanatu</h2>
                        <p className="text-[13px] text-theme-muted sm:text-[14px]">Najważniejsze sprawy i szybki dostęp do zarządzania uczelnią.</p>
                    </div>

                    <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
                        <Panel
                            tytul="Podania"
                            podtytul={`${liczbaLubKreska(statystyki.podaniaOczekujace ?? (listaPodan.length ? listaPodan.length : null))} do rozpatrzenia`}
                            ikona={FileText}
                            elementy={listaPodan}
                            pustyTekst="Brak podań do wyświetlenia"
                            href={adresy.podania}
                            renderujElement={(p) => (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <strong className="break-words text-[13px] text-theme-text">{p.temat ?? p.tytul ?? "Podanie studenta"}</strong>
                                        <span className="text-[11px] text-theme-muted">{przyjaznaData(p.dataZlozenia ?? p.data)}</span>
                                    </div>
                                    <p className="mt-2 break-words text-[12px] text-theme-muted">{p.student?.user ? `${p.student.user.name ?? ""} ${p.student.user.surname ?? ""}`.trim() : p.autorNazwa ?? "Oczekuje na rozpatrzenie"}</p>
                                </>
                            )}
                        />
                        <Panel
                            tytul="Rezerwacje"
                            podtytul={`${liczbaLubKreska(statystyki.rezerwacjeOczekujace ?? (listaRezerwacji.length ? listaRezerwacji.length : null))} oczekujących`}
                            ikona={CalendarClock}
                            elementy={listaRezerwacji}
                            pustyTekst="Brak rezerwacji do wyświetlenia"
                            href={adresy.rezerwacje}
                            renderujElement={(r) => (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <strong className="break-words text-[13px] text-theme-text">{r.typWydarzenia ?? "Rezerwacja sali"}</strong>
                                        <span className="text-[11px] text-theme-muted">{przyjaznaData(r.data)}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-theme-muted">
                                        <Clock3 size={14} />
                                        {String(r.GodzinaRozpoczecia ?? "").slice(0, 5)} – {String(r.GodzinaZakonczenia ?? "").slice(0, 5)}
                                        <span>· Sala {r.sala?.numerSali ?? r.Sala_idSala ?? "—"}</span>
                                    </div>
                                </>
                            )}
                        />
                    </div>

                    <section className="min-w-0 rounded-[15px] bg-theme-page p-3 sm:p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-[17px] font-bold text-theme-text sm:text-[20px]">Zarządzanie</h2>
                            <span className="text-[12px] text-theme-muted">Najczęściej używane funkcje</span>
                        </div>
                        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <Kafelek href={adresy.plany} ikona={CalendarDays} tytul="Plany zajęć" opis="Tworzenie i edycja rozkładów oraz zajęć" liczba={statystyki.plany} />
                            <Kafelek href={adresy.rezerwacje} ikona={CalendarClock} tytul="Rezerwacje sal" opis="Zatwierdzanie wniosków i rezerwacja sal" liczba={statystyki.rezerwacjeOczekujace} />
                            <Kafelek href={adresy.podania} ikona={FileText} tytul="Podania" opis="Rozpatrywanie podań studentów" liczba={statystyki.podaniaOczekujace} />
                            <Kafelek href={adresy.finanse} ikona={Wallet} tytul="Finanse studentów" opis="Płatności i zaległe opłaty" liczba={statystyki.nieoplaconePlatnosci} />
                            <Kafelek href={adresy.sylabusy} ikona={BookOpen} tytul="Sylabusy" opis="Zarządzanie opisami przedmiotów i literaturą" />
                            <Kafelek href={adresy.ogloszenia} ikona={Megaphone} tytul="Ogłoszenia i ankiety" opis="Komunikaty i informacje dla studentów" />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default function StronaGlownaDziekanat({ podania = [], rezerwacje = [], statystyki = {}, linki = {} }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Strona główna" />
            <MenuDziekanat />
            <Zawartosc podania={podania} rezerwacje={rezerwacje} statystyki={statystyki} linki={linki} />
        </div>
    );
}
