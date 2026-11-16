import React, { useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";
import Form from "react-bootstrap/Form";

function Content({ oceny = [], semestry = [], studentsem }) {
    const [sem, setsem] = useState(studentsem ?? "");

    const filteroceny = (oceny ?? []).filter(
        (ocena) => ocena.Semester === Number(sem),
    );

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-muted">
                    Twoje oceny
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-2 md:px-4">
                <div className="bg-theme-surface flex min-w-0 w-full shrink-0 flex-col gap-3 rounded-t-[15px] px-3 py-4 sm:px-4 md:min-h-[90px] md:flex-row md:items-center md:justify-between md:gap-4 md:py-3">
                    <h1 className="min-w-0 break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[36px]">
                        Oceny końcowe
                    </h1>

                    <div className="w-full min-w-0 sm:w-[220px] md:w-[200px] md:shrink-0 lg:w-[15%] lg:min-w-[160px]">
                        <Form.Select
                            value={sem}
                            onChange={(e) => setsem(e.target.value)}
                            className="h-[40px] w-full min-w-0 rounded-[15px] border border-theme-muted bg-theme-slate px-3 text-theme-muted"
                        >
                            <option value="" disabled>
                                Wybierz semestr
                            </option>

                            {(semestry ?? []).map((semester, index) => (
                                <option
                                    key={semester.id ?? index}
                                    value={semester.Semester}
                                >
                                    Semestr {semester.Semester}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>

                <div className="bg-theme-slate custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-b-[15px] p-3 sm:p-4 md:p-5">
                    {filteroceny.length > 0 ? (
                        <div className="flex min-w-0 w-full flex-col gap-3 sm:gap-4">
                            {filteroceny.map((ocena, index) => (
                                <div
                                    key={ocena.id ?? index}
                                    className="bg-theme-muted grid min-w-0 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[15px] p-3 text-[15px] text-theme-text sm:p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(60px,0.5fr)] lg:gap-4 lg:px-5"
                                >
                                    <div className="min-w-0">
                                        <span className="block break-words [overflow-wrap:anywhere]">
                                            {ocena.nazwa} {ocena.TypZajec}
                                        </span>
                                    </div>

                                    <div className="hidden min-w-0 lg:block">
                                        <span className="block break-words [overflow-wrap:anywhere]">
                                            {ocena.TytulNaukowy}{" "}
                                            {ocena.wykladowca_imie}{" "}
                                            {ocena.wykladowca_nazwisko}
                                        </span>
                                    </div>

                                    <div className="hidden min-w-0 lg:block">
                                        <span className="block break-words">
                                            {ocena.typ}
                                        </span>
                                    </div>

                                    <div className="min-w-0 text-right lg:text-left">
                                        <span className="block text-lg font-bold lg:text-[15px]">
                                            {ocena.skalaOceny}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mx-auto mt-10 w-full text-center text-[24px] text-theme-muted">
                            <span>Brak ocen</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Oceny({ auth, oceny, semestry, studentsem }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Oceny" />

            <MenuStudenta />

            <Content
                oceny={oceny}
                semestry={semestry}
                studentsem={studentsem}
            />
        </div>
    );
}
