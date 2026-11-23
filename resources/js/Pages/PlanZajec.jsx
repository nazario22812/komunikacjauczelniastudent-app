import React, { useMemo, useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head, useForm } from "@inertiajs/react";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import themePlugin from "@fullcalendar/react/themes/classic";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

const pole =
    "mt-1.5 h-11 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none transition-colors focus:border-theme-orange disabled:cursor-not-allowed disabled:opacity-50";

function Content({ plan = null, listagrup = [], listakierunkow = [] }) {
    const [wybranyKierunek, setwybranyKierunek] = useState("");
    const [wybranaGrupa, setwybranaGrupa] = useState("");
    const [widokFiltrow, setWidokFiltrow] = useState(true);
    const [widoczneTypy, setWidoczneTypy] = useState([
        "Laboratorium",
        "Wykład",
        "Ćwiczenia",
        "Pozostałe",
    ]);

    const { data, setData, get, processing } = useForm({
        kierunk: "",
        grpa: "",
    });

    const filtergrup = useMemo(
        () =>
            (listagrup ?? []).filter(
                (g) =>
                    String(g.Kierunek_idKierunek) ===
                    String(wybranyKierunek),
            ),
        [listagrup, wybranyKierunek],
    );

    const wyszukajGrupe = (e) => {
        e.preventDefault();
        if (!data.grpa) return;
        get(`/planzajec/${data.grpa}`, { preserveScroll: true });
    };

    const formatTime = (date) => {
        if (!date) return "";
        return new Intl.DateTimeFormat("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).format(date);
    };

    const typWydarzenia = (wydarzenie) => {
        const typ = wydarzenie?.extendedProps?.typ;
        if (["Laboratorium", "Wykład", "Ćwiczenia"].includes(typ)) {
            return typ;
        }
        return "Pozostałe";
    };

    const widocznyPlan = useMemo(
        () =>
            (Array.isArray(plan) ? plan : []).filter((wydarzenie) =>
                widoczneTypy.includes(typWydarzenia(wydarzenie)),
            ),
        [plan, widoczneTypy],
    );

    const zmienWidocznosc = (typ) => {
        setWidoczneTypy((poprzednie) =>
            poprzednie.includes(typ)
                ? poprzednie.filter((element) => element !== typ)
                : [...poprzednie, typ],
        );
    };

    const renderEventContent = (arg) => {
        const props = arg.event.extendedProps;
        const title = arg.event.title;
        const isGodziny =
            title === "Godziny dziekańskie" ||
            title === "Godziny rektorskie";

        const eventClass =
            {
                Laboratorium: "bg-theme-orange",
                Wykład: "bg-theme-violet",
                Ćwiczenia: "bg-theme-cyan",
            }[props.typ] ?? "bg-theme-blue";

        const startTime = formatTime(arg.event.start);
        const endTime = formatTime(arg.event.end);
        const timeText =
            startTime && endTime
                ? `${startTime} – ${endTime}`
                : startTime || arg.timeText;

        return (
            <div
                className={`${eventClass} flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[3px] px-1.5 py-1 text-[10px] leading-[1.3] text-white sm:text-[11px]`}
                title={`${title}${timeText ? ` · ${timeText}` : ""}`}
            >
                <b className="break-words whitespace-normal font-semibold">
                    {title}
                </b>
                {!isGodziny && (
                    <>
                        {props.imie && (
                            <span className="break-words whitespace-normal opacity-95">
                                {props.tytulNaukowy || ""} {props.imie}. {props.nazwisko}
                            </span>
                        )}
                        {props.parzystosc && props.parzystosc !== "Brak" && (
                            <span className="break-words whitespace-normal opacity-90">
                                {props.parzystosc}
                            </span>
                        )}
                        {props.numersali && props.numersali !== "Brak" && (
                            <span className="break-words whitespace-normal opacity-90">
                                Sala {props.numersali}
                            </span>
                        )}
                    </>
                )}
                <span className="mt-auto whitespace-nowrap pt-1 font-semibold">
                    {timeText}
                </span>
            </div>
        );
    };

    const typy = [
        { nazwa: "Laboratorium", kolor: "bg-theme-orange" },
        { nazwa: "Wykład", kolor: "bg-theme-violet" },
        { nazwa: "Ćwiczenia", kolor: "bg-theme-cyan" },
        { nazwa: "Pozostałe", kolor: "bg-theme-blue" },
    ];

    return (
        <div className="box-border flex min-h-dvh min-w-0 w-full flex-1 flex-col bg-theme-page p-2 sm:p-[10px]">
            <div className="bg-theme-panel flex h-[44px] w-full shrink-0 items-center rounded-t-[10px] border border-theme-muted px-2 sm:px-3">
                <div className="flex w-11 shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Plan zajęć
                </span>
                <div className="w-11 shrink-0" />
            </div>

            <div className="bg-theme-panel flex min-h-0 min-w-0 flex-1 flex-col gap-3 rounded-b-[10px] border border-t-0 border-theme-muted p-2 sm:p-3 lg:flex-row lg:gap-4">
                <section className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 lg:order-1">
                    <div className="bg-theme-surface flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-theme-muted p-3 sm:p-4">
                        <div className="min-w-0">
                            <h1 className="text-base font-bold text-theme-text sm:text-xl">
                                Harmonogram zajęć
                            </h1>
                            <p className="mt-1 text-xs text-theme-muted sm:text-sm">
                                Przeglądaj plan i sprawdzaj godziny zajęć.
                            </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-theme-slate px-3 py-1.5 text-xs font-medium text-theme-text">
                            {widocznyPlan.length} wydarzeń
                        </span>
                    </div>

                    <div className="bg-theme-surface flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-theme-muted p-2.5 sm:p-3">
                        <span className="mr-1 text-xs font-medium text-theme-muted">Pokaż:</span>
                        {typy.map((typ) => {
                            const aktywny = widoczneTypy.includes(typ.nazwa);
                            return (
                                <button
                                    key={typ.nazwa}
                                    type="button"
                                    onClick={() => zmienWidocznosc(typ.nazwa)}
                                    aria-pressed={aktywny}
                                    className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors sm:px-3 ${
                                        aktywny
                                            ? "border-theme-muted bg-theme-slate text-theme-text"
                                            : "border-transparent bg-theme-page text-theme-muted opacity-60"
                                    }`}
                                >
                                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${typ.kolor}`} />
                                    {typ.nazwa}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-theme-muted bg-theme-page">
                        <div className="h-[530px] w-full min-w-0 sm:h-[620px] lg:h-[calc(100dvh-245px)] lg:min-h-[560px]">
                            <FullCalendar
                                theme="monarch"
                                colorScheme="dark"
                                plugins={[timeGridPlugin, themePlugin]}
                                initialView="timeGridFourDay"
                                views={{
                                    timeGridFourDay: { type: "timeGrid", duration: { days: 7 } },
                                    timeGridThreeDay: { type: "timeGrid", duration: { days: 3 } },
                                    timeGridTwoDay: { type: "timeGrid", duration: { days: 2 } },
                                    timeGridOneDay: { type: "timeGrid", duration: { days: 1 } },
                                }}
                                windowResizeDelay={150}
                                viewClassNames={() => "responsive-calendar-view"}
                                datesSet={(arg) => {
                                    const width = window.innerWidth;
                                    let targetView = "timeGridFourDay";
                                    if (width < 480) targetView = "timeGridOneDay";
                                    else if (width < 768) targetView = "timeGridTwoDay";
                                    else if (width < 1200) targetView = "timeGridThreeDay";
                                    if (arg.view.type !== targetView) {
                                        arg.view.calendar.changeView(targetView);
                                    }
                                }}
                                events={widocznyPlan}
                                headerToolbar={{ left: "prev,next today", right: "" }}
                                allDaySlot={false}
                                slotMinTime="08:00:00"
                                slotMaxTime="22:00:00"
                                slotDuration="01:00:00"
                                slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                                eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                                displayEventEnd={true}
                                height="100%"
                                expandRows={true}
                                weekNumberFormat={{ week: "narrow" }}
                                eventContent={renderEventContent}
                            />
                        </div>
                    </div>
                </section>

                <aside className="bg-theme-surface w-full shrink-0 self-start overflow-hidden rounded-xl border border-theme-muted lg:order-2 lg:w-[290px] xl:w-[315px]">
                    <button
                        type="button"
                        onClick={() => setWidokFiltrow((poprzedni) => !poprzedni)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left lg:cursor-default"
                        aria-expanded={widokFiltrow}
                    >
                        <span>
                            <span className="block text-base font-bold text-theme-text">Wybierz grupę</span>
                            <span className="mt-1 block text-xs text-theme-muted">Wyświetl plan wybranej grupy</span>
                        </span>
                        <span className="text-xl text-theme-muted lg:hidden">{widokFiltrow ? "−" : "+"}</span>
                    </button>
                    <div className={`${widokFiltrow ? "block" : "hidden"} border-t border-theme-muted p-4 lg:block`}>
                        <form onSubmit={wyszukajGrupe} className="flex flex-col gap-4">
                            <label className="block min-w-0">
                                <span className="text-sm font-medium text-theme-text">Kierunek</span>
                                <select
                                    value={wybranyKierunek}
                                    onChange={(e) => {
                                        setwybranyKierunek(e.target.value);
                                        setwybranaGrupa("");
                                        setData({ ...data, kierunk: e.target.value, grpa: "" });
                                    }}
                                    className={pole}
                                >
                                    <option value="">Wybierz kierunek</option>
                                    {(listakierunkow ?? []).map((kierunek) => (
                                        <option key={kierunek.idKierunek} value={kierunek.idKierunek}>
                                            {kierunek.nazwa}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block min-w-0">
                                <span className="text-sm font-medium text-theme-text">Grupa</span>
                                <select
                                    value={wybranaGrupa}
                                    onChange={(e) => {
                                        setwybranaGrupa(e.target.value);
                                        setData("grpa", e.target.value);
                                    }}
                                    disabled={!wybranyKierunek}
                                    className={pole}
                                >
                                    <option value="">Wybierz grupę</option>
                                    {filtergrup.map((grupa) => (
                                        <option key={grupa.idGrupaStudenta} value={grupa.idGrupaStudenta}>
                                            {grupa.nazwaGrupy}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button
                                type="submit"
                                disabled={processing || !data.grpa}
                                className="flex h-11 w-full items-center justify-center rounded-xl bg-theme-orange px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? "Wyszukiwanie..." : "Wyszukaj plan"}
                            </button>
                        </form>
                    </div>
                    <div className="border-t border-theme-muted px-4 py-4">
                        <h2 className="text-sm font-semibold text-theme-text">Informacje</h2>
                        <p className="mt-1 text-xs leading-5 text-theme-muted">
                            Wybierz kierunek i grupę, aby wyświetlić harmonogram. Kolory oznaczają rodzaj zajęć.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function PlanZajec({
    auth,
    plan = null,
    listagrup = [],
    listakierunkow = [],
    rol,
}) {
    let menu = null;
    if (rol === "Student") menu = <MenuStudenta />;
    if (rol === "Prowadzący") menu = <MenuProwadzacy />;
    if (rol === "Pracownik Dziekanatu") menu = <MenuDziekanat />;

    return (
        <div className="flex min-h-dvh min-w-0 w-full">
            <Head title="Plan zajęć" />
            {menu}
            <Content plan={plan} listagrup={listagrup} listakierunkow={listakierunkow} />
        </div>
    );
}
