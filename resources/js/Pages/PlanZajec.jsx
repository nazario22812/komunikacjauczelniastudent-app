
import React, { useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head, useForm } from "@inertiajs/react";
import Form from "react-bootstrap/Form";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import themePlugin from "@fullcalendar/react/themes/classic";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

function Content({ plan = null, listagrup = [], listakierunkow = [] }) {
    const [wybranyKierunek, setwybranyKierunek] = useState("");
    const [wybranaGrupa, setwybranaGrupa] = useState("");

    const filtergrup = (listagrup ?? []).filter(
        (g) =>
            String(g.Kierunek_idKierunek) ===
            String(wybranyKierunek)
    );

    const { data, setData, get, processing } = useForm({
        kierunk: "",
        grpa: "",
    });

    const wyszukajGrupe = (e) => {
        e.preventDefault();
        get(`/planzajec/${data.grpa}`);
    };

    const renderEventContent = (arg) => {
        const props = arg.event.extendedProps;

        const eventClass =
            {
                Laboratorium: "bg-theme-orange",
                Wykład: "bg-theme-violet",
                Ćwiczenia: "bg-theme-cyan",
            }[props.typ] ?? "bg-theme-blue";

        return (
            <div
                className={`${eventClass} h-full w-full overflow-hidden p-[2px] text-[10px] leading-[1.2] text-white sm:text-[11px]`}
            >
                <b className="break-words whitespace-normal">
                    {arg.event.title}
                </b>

                <div className="break-words whitespace-normal">
                    {props.tytulNaukowy || ""} {props.imie}.{" "}
                    {props.nazwisko}
                </div>

                <div className="break-words whitespace-normal">
                    {props.parzystosc}
                </div>

                <div className="break-words whitespace-normal">
                    {props.numersali}
                </div>

                <div>{arg.timeText}</div>
            </div>
        );
    };

    return (
        <div className="bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px]">
            <div className="bg-theme-panel mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Plan zajęć
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="bg-theme-panel flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 rounded-b-[10px] border-[0.3px] border-theme-muted px-1 pb-5 pt-3 lg:flex-row">
                <div className="bg-theme-page relative min-h-[440px] min-w-0 w-full flex-1 overflow-hidden rounded-xl border border-theme-muted sm:min-h-[550px] lg:min-h-[650px]">
                    <div className="h-[520px] w-full sm:h-[650px] lg:h-[calc(100dvh-110px)] lg:min-h-[650px]">
                        <FullCalendar
                            theme="monarch"
                            colorScheme="dark"
                            plugins={[timeGridPlugin, themePlugin]}
                            initialView="timeGridFourDay"
                            views={{
                                timeGridFourDay: {
                                    type: "timeGrid",
                                    duration: { days: 7 },
                                },
                                timeGridThreeDay: {
                                    type: "timeGrid",
                                    duration: { days: 3 },
                                },
                                timeGridTwoDay: {
                                    type: "timeGrid",
                                    duration: { days: 2 },
                                },
                                timeGridOneDay: {
                                    type: "timeGrid",
                                    duration: { days: 1 },
                                },
                            }}
                            windowResizeDelay={150}
                            viewClassNames={(arg) => {
                                return "responsive-calendar-view";
                            }}
                            datesSet={(arg) => {
                                const calendar = arg.view.calendar;
                                const width = window.innerWidth;

                                let targetView = "timeGridFourDay";

                                if (width < 480) {
                                    targetView = "timeGridOneDay";
                                } else if (width < 768) {
                                    targetView = "timeGridTwoDay";
                                } else if (width < 1200) {
                                    targetView = "timeGridThreeDay";
                                }

                                if (arg.view.type !== targetView) {
                                    calendar.changeView(targetView);
                                }
                            }}
                            events={plan ?? []}
                            headerToolbar={{
                                left: "prev,next today",
                                right: "",
                            }}
                            allDaySlot={false}
                            slotMinTime="08:00:00"
                            slotMaxTime="22:00:00"
                            slotDuration="01:00:00"
                            height="100%"
                            expandRows={true}
                            weekNumberFormat={{
                                week: "narrow",
                            }}
                            eventContent={renderEventContent}
                        />
                    </div>
                </div>

                <div className="bg-theme-surface w-full min-w-0 shrink-0 rounded-[10px] px-4 py-5 sm:px-[20px] sm:py-[33px] lg:w-[280px] lg:min-w-[280px] lg:rounded-l-none lg:rounded-r-[10px]">
                    <form onSubmit={wyszukajGrupe}>
                        <div className="px-1 py-[10px] sm:px-[10px]">
                            <div className="mx-auto w-full text-center text-[clamp(0.9rem,1vw+0.6rem,1.1rem)] text-theme-text">
                                Wybierz grupę
                            </div>

                            <div className="w-full pt-6">
                                <span className="text-[13px] text-theme-text">
                                    Kierunek
                                </span>

                                <Form.Select
                                    value={wybranyKierunek}
                                    onChange={(e) => {
                                        setwybranyKierunek(e.target.value);
                                        setwybranaGrupa("");
                                        setData({
                                            ...data,
                                            kierunk: e.target.value,
                                            grpa: "",
                                        });
                                    }}
                                    className="h-[32px] w-full min-w-0 max-w-full rounded-[15px] border border-theme-muted bg-theme-slate text-theme-text"
                                >
                                    <option value="">
                                        Wybierz kierunek
                                    </option>

                                    {(listakierunkow ?? []).map(
                                        (kierunek) => (
                                            <option
                                                key={kierunek.idKierunek}
                                                value={kierunek.idKierunek}
                                            >
                                                {kierunek.nazwa}
                                            </option>
                                        )
                                    )}
                                </Form.Select>
                            </div>

                            <div className="w-full pt-6">
                                <span className="text-[13px] text-theme-text">
                                    Grupa
                                </span>

                                <Form.Select
                                    value={wybranaGrupa}
                                    onChange={(e) => {
                                        setwybranaGrupa(e.target.value);
                                        setData("grpa", e.target.value);
                                    }}
                                    disabled={!wybranyKierunek}
                                    className="h-[32px] w-full min-w-0 max-w-full rounded-[15px] border border-theme-muted bg-theme-slate text-theme-text"
                                >
                                    <option value="">
                                        Wybierz grupę
                                    </option>

                                    {filtergrup.map((grupa) => (
                                        <option
                                            key={grupa.idGrupaStudenta}
                                            value={grupa.idGrupaStudenta}
                                        >
                                            {grupa.nazwaGrupy}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>

                            <div className="mx-auto mt-10 flex h-[36px] w-full items-center justify-center">
                                <button
                                    disabled={processing || !data.grpa}
                                    type="submit"
                                    className="h-full w-3/4 rounded-[15px] bg-theme-orange text-[13px] text-theme-text hover:cursor-pointer active:bg-theme-orange disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? "Wyszukiwanie..."
                                        : "Wyszukaj"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function PlanZajec({
    auth,
    plan = null,
    listagrup,
    listakierunkow,
    rol,
}) {
    let menu;

    if (rol === "Student") {
        menu = <MenuStudenta />;
    }

    if (rol === "Prowadzący") {
        menu = <MenuProwadzacy />;
    }

    if (rol === "Pracownik Dziekanatu") {
        menu = <MenuDziekanat />;
    }

    return (
        <div className="flex min-h-dvh min-w-0 w-full">
            <Head title="Plan zajęć" />
            {menu}
            <Content
                plan={plan}
                listagrup={listagrup}
                listakierunkow={listakierunkow}
            />
        </div>
    );
}
