import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import themePlugin from "@fullcalendar/react/themes/classic";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";

const GODZINA = (wartosc) => String(wartosc ?? "").slice(0, 5);

function Zawartosc({ rezerwacje = [], sale = [], budynki = [] }) {
    const [wybranyBudynek, setWybranyBudynek] = useState("");
    const [wybranaSala, setWybranaSala] = useState("");
    const [wyszukiwanie, setWyszukiwanie] = useState("");
    const [wybranyTyp, setWybranyTyp] = useState("");

    const listaSal = useMemo(() =>
        sale.filter((sala) => !wybranyBudynek || String(sala.Budynek_idBudynek) === wybranyBudynek),
        [sale, wybranyBudynek]
    );

    const typy = useMemo(() =>
        [...new Set(rezerwacje.map((r) => r.typWydarzenia).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pl")),
        [rezerwacje]
    );

    const widoczneRezerwacje = useMemo(() => {
        const szukane = wyszukiwanie.trim().toLocaleLowerCase("pl-PL");
        return rezerwacje.filter((r) => {
            const budynekOk = !wybranyBudynek || String(r.Sala_Budynek_idBudynek) === wybranyBudynek;
            const salaOk = !wybranaSala || `${r.Sala_idSala}:${r.Sala_Budynek_idBudynek}` === wybranaSala;
            const typOk = !wybranyTyp || r.typWydarzenia === wybranyTyp;
            const tekst = `${r.typWydarzenia ?? ""} ${r.nazwaBudynku ?? ""} ${r.numerSali ?? ""} ${r.data ?? ""}`.toLocaleLowerCase("pl-PL");
            return budynekOk && salaOk && typOk && (!szukane || tekst.includes(szukane));
        });
    }, [rezerwacje, wybranyBudynek, wybranaSala, wybranyTyp, wyszukiwanie]);

    const wydarzenia = useMemo(() => widoczneRezerwacje.map((r) => ({
        id: String(r.idRezerwacja),
        title: r.typWydarzenia || "Rezerwacja sali",
        start: `${r.data}T${r.GodzinaRozpoczecia}`,
        end: `${r.data}T${r.GodzinaZakonczenia}`,
        extendedProps: {
            typ: r.typWydarzenia,
            nazwaBudynku: r.nazwaBudynku,
            numerSali: r.numerSali,
        },
    })), [widoczneRezerwacje]);

    const renderEventContent = (arg) => {
        const p = arg.event.extendedProps;
        return (
            <div className="h-full w-full overflow-hidden bg-theme-violet p-[3px] text-[10px] leading-tight text-white sm:text-[11px]">
                <b className="break-words whitespace-normal">{arg.event.title}</b>
                <div className="break-words">{p.nazwaBudynku || "Budynek"} · sala {p.numerSali || "—"}</div>
                <div>{GODZINA(arg.event.start?.toTimeString())} – {GODZINA(arg.event.end?.toTimeString())}</div>
            </div>
        );
    };

    const pole = "h-[38px] w-full min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none focus:border-theme-orange";

    return (
        <div className="bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px]">
            <div className="bg-theme-panel flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">Rezerwacje sal</span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="bg-theme-panel flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 rounded-b-[10px] border-[0.3px] border-theme-muted p-2 sm:p-3 lg:flex-row">
                <div className="bg-theme-page relative min-h-[470px] min-w-0 w-full flex-1 overflow-hidden rounded-[12px] border border-theme-muted sm:min-h-[570px] lg:min-h-[650px]">
                    <div className="h-[530px] w-full sm:h-[660px] lg:h-[calc(100dvh-120px)] lg:min-h-[650px]">
                        <FullCalendar
                            theme="monarch"
                            colorScheme="dark"
                            plugins={[timeGridPlugin, themePlugin]}
                            initialView="timeGridWeekCustom"
                            views={{
                                timeGridWeekCustom: { type: "timeGrid", duration: { days: 7 } },
                                timeGridThreeDay: { type: "timeGrid", duration: { days: 3 } },
                                timeGridTwoDay: { type: "timeGrid", duration: { days: 2 } },
                                timeGridOneDay: { type: "timeGrid", duration: { days: 1 } },
                            }}
                            datesSet={(arg) => {
                                const width = window.innerWidth;
                                const docelowy = width < 480 ? "timeGridOneDay" : width < 768 ? "timeGridTwoDay" : width < 1200 ? "timeGridThreeDay" : "timeGridWeekCustom";
                                if (arg.view.type !== docelowy) arg.view.calendar.changeView(docelowy);
                            }}
                            windowResizeDelay={150}
                            headerToolbar={{ left: "prev,next today", right: "" }}
                            events={wydarzenia}
                            eventContent={renderEventContent}
                            allDaySlot={false}
                            slotMinTime="07:00:00"
                            slotMaxTime="22:00:00"
                            slotDuration="01:00:00"
                            slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                            eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                            displayEventEnd
                            height="100%"
                            expandRows
                        />
                    </div>
                </div>

                <aside className="bg-theme-surface w-full min-w-0 shrink-0 rounded-[12px] p-4 text-theme-text lg:w-[300px]">
                    <h2 className="mb-1 text-lg font-bold">Filtry rezerwacji</h2>
                    <p className="mb-5 text-xs text-theme-muted">Konsultacje, egzaminy i pozostałe potwierdzone rezerwacje sal.</p>
                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col gap-1 text-sm">Budynek
                            <select className={pole} value={wybranyBudynek} onChange={(e) => { setWybranyBudynek(e.target.value); setWybranaSala(""); }}>
                                <option value="">Wszystkie budynki</option>
                                {budynki.map((b) => <option key={b.idBudynek} value={b.idBudynek}>{b.nazwa}</option>)}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-sm">Sala
                            <select className={pole} value={wybranaSala} onChange={(e) => setWybranaSala(e.target.value)}>
                                <option value="">Wszystkie sale</option>
                                {listaSal.map((s) => <option key={`${s.idSala}-${s.Budynek_idBudynek}`} value={`${s.idSala}:${s.Budynek_idBudynek}`}>{s.numerSali} · budynek {s.Budynek_idBudynek}</option>)}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-sm">Rodzaj wydarzenia
                            <select className={pole} value={wybranyTyp} onChange={(e) => setWybranyTyp(e.target.value)}>
                                <option value="">Wszystkie rodzaje</option>
                                {typy.map((typ) => <option key={typ} value={typ}>{typ}</option>)}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-sm">Szukaj
                            <input className={pole} value={wyszukiwanie} onChange={(e) => setWyszukiwanie(e.target.value)} placeholder="Wydarzenie, sala, data..." />
                        </label>
                        <button type="button" className="rounded-[12px] bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text" onClick={() => {setWybranyBudynek("");setWybranaSala("");setWyszukiwanie("");setWybranyTyp("");}}>Wyczyść filtry</button>
                        <p className="text-xs text-theme-muted">Znaleziono rezerwacji: {widoczneRezerwacje.length}</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function RezerwacjeSalPodglad({ rol = "Student", rezerwacje = [], sale = [], budynki = [] }) {
    return (
        <div className="flex min-h-dvh min-w-0 w-full">
            <Head title="Rezerwacje sal" />
            <MenuStudenta/>
            <Zawartosc rezerwacje={rezerwacje} sale={sale} budynki={budynki} />
        </div>
    );
}
