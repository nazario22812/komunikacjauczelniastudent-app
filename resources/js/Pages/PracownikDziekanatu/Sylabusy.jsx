import React, { useMemo, useState, useEffect } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    Search,
    BookOpen,
    BookText,
    LibraryBig,
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    Loader2,
    FileText,
    ChevronRight,
    Save,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";

const ADRES_SYLABUSOW = "/dziekanat/sylabusy";

const klasaPola =
    "h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-[14px] text-theme-text outline-none transition-colors focus:border-theme-orange";

const klasaTekstu =
    "custom-scrollbar min-h-[115px] w-full min-w-0 resize-y rounded-[10px] border border-theme-muted bg-theme-slate px-3 py-3 text-[14px] text-theme-text outline-none transition-colors focus:border-theme-orange";

const klasaEtykiety = "mb-2 block text-[13px] font-semibold text-theme-text";

const klasaBledu = "mt-1 block text-[12px] text-red-500";

const polaNowegoSylabusa = [
    { nazwa: "iloscGodzin", etykieta: "Liczba godzin", typ: "number" },
    { nazwa: "czyEgzamin", etykieta: "Egzamin", typ: "select" },
    { nazwa: "opisPrzedmiotu", etykieta: "Opis przedmiotu", typ: "textarea" },
    {
        nazwa: "warunkiZaliczenia",
        etykieta: "Warunki zaliczenia",
        typ: "textarea",
    },
];

const polaNowejLiteratury = [
    { nazwa: "nazwa", etykieta: "Nazwa literatury", typ: "text" },
    { nazwa: "opis", etykieta: "Opis", typ: "textarea" },
];

function pobierzNazwePrzedmiotu(przedmiot) {
    return (
        przedmiot.nazwa ??
        przedmiot.nazwaPrzedmiotu ??
        przedmiot.Nazwa ??
        `Przedmiot ${przedmiot.idPrzedmiot}`
    );
}

function pobierzSylabusy(przedmiot) {
    if (!przedmiot) return [];

    const dane = przedmiot.sylabus;

    if (!dane) return [];

    return Array.isArray(dane) ? dane : [dane];
}

function pobierzLiterature(sylabus) {
    if (!sylabus) return [];
    return Array.isArray(sylabus.literatura) ? sylabus.literatura : [];
}

function pobierzIdLiteratury(literatura) {
    return literatura.idLiteratura ?? literatura.id;
}

function pobierzNazweLiteratury(literatura) {
    return (
        literatura.nazwa ??
        `Literatura ${pobierzIdLiteratury(literatura) ?? ""}`
    );
}

function pobierzPolaObiektu(obiekt) {
    if (!obiekt) return [];

    return Object.entries(obiekt)
        .filter(([klucz, wartosc]) => {
            if (klucz.startsWith("id")) return false;
            if (klucz.endsWith("_idPrzedmiot")) return false;
            if (klucz.endsWith("_idSylabus")) return false;
            if (klucz.endsWith("_idLiteratura")) return false;
            if (klucz === "created_at") return false;
            if (klucz === "updated_at") return false;
            if (klucz === "sylabus") return false;
            if (klucz === "literatura") return false;

            return (
                wartosc === null ||
                typeof wartosc === "string" ||
                typeof wartosc === "number" ||
                typeof wartosc === "boolean"
            );
        })
        .map(([nazwa, wartosc]) => ({
            nazwa,
            wartosc: wartosc ?? "",
        }));
}

function formatujNazwePola(nazwa) {
    return nazwa
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/^./, (znak) => znak.toUpperCase());
}

function ListaPrzedmiotow({
    listaprzedmiotow,
    wybranyprzedmiot,
    wybierzPrzedmiot,
    ladowanie,
}) {
    const [wyszukiwanie, ustawWyszukiwanie] = useState("");

    const przefiltrowanePrzedmioty = useMemo(() => {
        const zapytanie = wyszukiwanie.trim().toLowerCase();

        return listaprzedmiotow.filter((przedmiot) => {
            const nazwa = pobierzNazwePrzedmiotu(przedmiot);

            return nazwa.toLowerCase().includes(zapytanie);
        });
    }, [listaprzedmiotow, wyszukiwanie]);

    return (
        <div className="flex min-h-0 min-w-0 flex-col rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-4 lg:h-full">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-[17px] font-bold text-theme-text">
                    Lista przedmiotów
                </h2>

                <span className="rounded-[8px] bg-theme-slate px-3 py-1 text-[12px] text-theme-muted">
                    {listaprzedmiotow.length}
                </span>
            </div>

            <div className="relative mb-4">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
                />

                <input
                    type="text"
                    value={wyszukiwanie}
                    onChange={(e) => ustawWyszukiwanie(e.target.value)}
                    placeholder="Wyszukaj przedmiot..."
                    className={`${klasaPola} pl-10`}
                />
            </div>

            <div className="custom-scrollbar flex max-h-[300px] min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain pr-1 sm:max-h-[380px] lg:max-h-none lg:flex-1">
                {przefiltrowanePrzedmioty.length > 0 ? (
                    przefiltrowanePrzedmioty.map((przedmiot) => {
                        const id = przedmiot.idPrzedmiot;

                        const wybrany = String(id) === String(wybranyprzedmiot);

                        return (
                            <button
                                key={id}
                                type="button"
                                disabled={ladowanie}
                                onClick={() => wybierzPrzedmiot(id)}
                                className={`flex w-full min-w-0 items-center gap-3 rounded-[11px] border p-3 text-left transition-colors disabled:cursor-wait ${
                                    wybrany
                                        ? "border-theme-orange bg-theme-panel"
                                        : "border-theme-muted bg-theme-slate hover:bg-theme-panel"
                                }`}
                            >
                                <div
                                    className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] ${
                                        wybrany
                                            ? "bg-theme-orange"
                                            : "bg-theme-panel"
                                    }`}
                                >
                                    <BookOpen
                                        size={20}
                                        className={
                                            wybrany
                                                ? "text-white"
                                                : "text-theme-text"
                                        }
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="break-words text-[13px] font-bold text-theme-text sm:text-[14px]">
                                        {pobierzNazwePrzedmiotu(przedmiot)}
                                    </p>

                                    <p className="mt-1 text-[12px] text-theme-muted">
                                        {przedmiot.punktyECTS != null &&
                                            ` · ${przedmiot.punktyECTS} ECTS`}
                                    </p>
                                </div>

                                {wybrany ? (
                                    <Check
                                        size={18}
                                        className="shrink-0 text-theme-orange"
                                    />
                                ) : (
                                    <ChevronRight
                                        size={17}
                                        className="shrink-0 text-theme-muted"
                                    />
                                )}
                            </button>
                        );
                    })
                ) : (
                    <div className="flex min-h-[140px] items-center justify-center rounded-[10px] border border-theme-muted bg-theme-slate p-4 text-center">
                        <p className="text-[13px] text-theme-muted">
                            Nie znaleziono przedmiotów
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function PoleFormularza({
    nazwa,
    etykieta,
    wartosc,
    zmienWartosc,
    blad,
    typ = "text",
}) {
    const dlugiTekst =
        typ === "textarea" ||
        ["opis", "tresc", "warunkiZaliczenia", "cele", "efektyUczenia"].some(
            (pole) => nazwa.toLowerCase().includes(pole.toLowerCase()),
        );

    return (
        <div className="min-w-0">
            <label htmlFor={nazwa} className={klasaEtykiety}>
                {etykieta}
            </label>

            {typ === "select" ? (
                <select
                    id={nazwa}
                    value={String(wartosc ?? 0)}
                    onChange={(e) =>
                        zmienWartosc(nazwa, Number(e.target.value))
                    }
                    className={klasaPola}
                >
                    <option value="0">Nie</option>
                    <option value="1">Tak</option>
                </select>
            ) : dlugiTekst ? (
                <textarea
                    id={nazwa}
                    value={wartosc ?? ""}
                    onChange={(e) => zmienWartosc(nazwa, e.target.value)}
                    className={klasaTekstu}
                    rows={4}
                />
            ) : (
                <input
                    id={nazwa}
                    type={typ}
                    value={wartosc ?? ""}
                    onChange={(e) => zmienWartosc(nazwa, e.target.value)}
                    className={klasaPola}
                />
            )}

            {blad && <p className={klasaBledu}>{blad}</p>}
        </div>
    );
}

function FormularzSylabusa({ idPrzedmiotu, sylabus, zamknijFormularz }) {
    const edycja = Boolean(sylabus?.idSylabus);

    const pola = polaNowegoSylabusa;

    const danePoczatkowe = {
        iloscGodzin: sylabus?.iloscGodzin ?? "",
        czyEgzamin: Number(sylabus?.czyEgzamin ?? 0),
        opisPrzedmiotu: sylabus?.opisPrzedmiotu ?? "",
        warunkiZaliczenia: sylabus?.warunkiZaliczenia ?? "",
    };

    const formularz = useForm(danePoczatkowe);

    const zapiszSylabus = (e) => {
        e.preventDefault();

        if (formularz.processing) return;

        const potwierdzenie = window.confirm(
            edycja
                ? "Czy na pewno chcesz zapisać zmiany w sylabusie?"
                : "Czy na pewno chcesz utworzyć sylabus?",
        );

        if (!potwierdzenie) return;

        const adres = edycja
            ? `${ADRES_SYLABUSOW}/${idPrzedmiotu}/${sylabus.idSylabus}/aktualizacjasylabusa`
            : `${ADRES_SYLABUSOW}/${idPrzedmiotu}/dodaniesylabusa`;

        formularz.post(adres, {
            preserveScroll: true,
            onSuccess: () => {
                zamknijFormularz();
            },
        });
    };

    return (
        <div className="rounded-[12px] border border-theme-orange bg-theme-page p-3 sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-[17px] font-bold text-theme-text">
                    {edycja ? "Edytuj sylabus" : "Nowy sylabus"}
                </h3>

                <button
                    type="button"
                    disabled={formularz.processing}
                    onClick={zamknijFormularz}
                    className="rounded-[8px] p-2 text-theme-muted hover:bg-theme-panel"
                >
                    <X size={20} />
                </button>
            </div>

            <form
                onSubmit={zapiszSylabus}
                className="flex min-w-0 flex-col gap-4"
            >
                {pola.map((pole) => (
                    <PoleFormularza
                        key={pole.nazwa}
                        nazwa={pole.nazwa}
                        etykieta={pole.etykieta}
                        typ={pole.typ}
                        wartosc={formularz.data[pole.nazwa]}
                        zmienWartosc={formularz.setData}
                        blad={formularz.errors[pole.nazwa]}
                    />
                ))}

                {pola.length === 0 && (
                    <p className="text-[13px] text-theme-muted">
                        Brak pól do edycji.
                    </p>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-theme-muted pt-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={zamknijFormularz}
                        disabled={formularz.processing}
                        className="min-h-[44px] rounded-[10px] border border-theme-muted bg-theme-slate px-5 text-[13px] font-semibold text-theme-text"
                    >
                        Anuluj
                    </button>

                    <button
                        type="submit"
                        disabled={formularz.processing || pola.length === 0}
                        className="bg-theme-orange flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-bold text-white disabled:opacity-50"
                    >
                        {formularz.processing ? (
                            <Loader2 size={17} className="animate-spin" />
                        ) : (
                            <Save size={17} />
                        )}

                        {formularz.processing
                            ? "Zapisywanie..."
                            : "Zapisz sylabus"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function SzczegolySylabusa({ idPrzedmiotu, sylabus }) {
    const [pokazFormularz, ustawPokazFormularz] = useState(false);

    const pola = pobierzPolaObiektu(sylabus);

    return (
        <div className="flex min-w-0 flex-col gap-4">
            {sylabus ? (
                <>
                    <div className="rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-[18px] font-bold text-theme-text">
                                    Karta przedmiotu
                                </h3>

                                <p className="mt-1 text-[12px] text-theme-muted">
                                    Sylabus ID: {sylabus.idSylabus}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    ustawPokazFormularz(!pokazFormularz)
                                }
                                className="bg-theme-orange flex min-h-[42px] items-center justify-center gap-2 rounded-[10px] px-4 text-[13px] font-bold text-white"
                            >
                                {pokazFormularz ? (
                                    <X size={16} />
                                ) : (
                                    <Pencil size={16} />
                                )}

                                {pokazFormularz ? "Zamknij" : "Edytuj sylabus"}
                            </button>
                        </div>

                        {!pokazFormularz && (
                            <div className="flex flex-col gap-4">
                                {pola.length > 0 ? (
                                    pola.map((pole) => (
                                        <div
                                            key={pole.nazwa}
                                            className="min-w-0 border-b border-theme-muted pb-4 last:border-0 last:pb-0"
                                        >
                                            <p className="mb-2 text-[13px] font-semibold text-theme-muted">
                                                {polaNowegoSylabusa.find(
                                                    (p) =>
                                                        p.nazwa === pole.nazwa,
                                                )?.etykieta ??
                                                    formatujNazwePola(
                                                        pole.nazwa,
                                                    )}
                                            </p>

                                            <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-theme-text">
                                                {pole.nazwa === "czyEgzamin"
                                                    ? Number(pole.wartosc) === 1
                                                        ? "Tak"
                                                        : "Nie"
                                                    : pole.wartosc === null ||
                                                        pole.wartosc === ""
                                                      ? "Brak danych"
                                                      : String(pole.wartosc)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[13px] text-theme-muted">
                                        Brak szczegółowych danych sylabusa.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {pokazFormularz && (
                        <FormularzSylabusa
                            key={`${idPrzedmiotu}-${sylabus.idSylabus}`}
                            idPrzedmiotu={idPrzedmiotu}
                            sylabus={sylabus}
                            zamknijFormularz={() => ustawPokazFormularz(false)}
                        />
                    )}
                </>
            ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[15px] border border-theme-muted bg-theme-page p-5 text-center">
                    <div className="bg-theme-slate flex h-[65px] w-[65px] items-center justify-center rounded-full">
                        <FileText size={30} className="text-theme-orange" />
                    </div>

                    <div>
                        <h3 className="text-[18px] font-bold text-theme-text">
                            Brak sylabusa
                        </h3>

                        <p className="mt-2 text-[13px] text-theme-muted">
                            Dla tego przedmiotu nie utworzono jeszcze sylabusa.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => ustawPokazFormularz(true)}
                        className="bg-theme-orange flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-bold text-white"
                    >
                        <Plus size={17} />
                        Utwórz sylabus
                    </button>

                    {pokazFormularz && (
                        <div className="w-full max-w-[650px] text-left">
                            <FormularzSylabusa
                                idPrzedmiotu={idPrzedmiotu}
                                sylabus={null}
                                zamknijFormularz={() =>
                                    ustawPokazFormularz(false)
                                }
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function FormularzLiteratury({ idPrzedmiotu, idSylabusa, zamknijFormularz }) {
    const formularz = useForm({
        nazwa: "",
        opis: "",
    });

    const zapiszLiterature = (e) => {
        e.preventDefault();

        if (
            !window.confirm("Czy na pewno chcesz dodać tę pozycję literatury?")
        ) {
            return;
        }

        formularz.post(
            `${ADRES_SYLABUSOW}/${idPrzedmiotu}/${idSylabusa}/dodanieliteratury`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    formularz.reset();
                    zamknijFormularz();
                },
            },
        );
    };

    return (
        <div className="rounded-[12px] border border-theme-orange bg-theme-page p-3 sm:p-5">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-theme-text">
                    Nowa pozycja literatury
                </h3>

                <button
                    type="button"
                    onClick={zamknijFormularz}
                    disabled={formularz.processing}
                    className="rounded-[8px] p-2 text-theme-muted hover:bg-theme-panel"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={zapiszLiterature} className="flex flex-col gap-4">
                {polaNowejLiteratury.map((pole) => (
                    <PoleFormularza
                        key={pole.nazwa}
                        nazwa={pole.nazwa}
                        etykieta={pole.etykieta}
                        typ={pole.typ}
                        wartosc={formularz.data[pole.nazwa]}
                        zmienWartosc={formularz.setData}
                        blad={formularz.errors[pole.nazwa]}
                    />
                ))}

                <div className="flex flex-col-reverse gap-3 border-t border-theme-muted pt-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={zamknijFormularz}
                        className="min-h-[44px] rounded-[10px] border border-theme-muted bg-theme-slate px-5 text-[13px] font-semibold text-theme-text"
                    >
                        Anuluj
                    </button>

                    <button
                        type="submit"
                        disabled={formularz.processing}
                        className="bg-theme-orange flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-bold text-white disabled:opacity-50"
                    >
                        {formularz.processing ? (
                            <Loader2 size={17} className="animate-spin" />
                        ) : (
                            <Plus size={17} />
                        )}
                        Dodaj literaturę
                    </button>
                </div>
            </form>
        </div>
    );
}

function KartaLiteratury({ literatura, idPrzedmiotu, idSylabusa }) {
    const [przetwarzanie, ustawPrzetwarzanie] = useState(false);

    const idLiteratury = pobierzIdLiteratury(literatura);
    const pola = pobierzPolaObiektu(literatura);

    const usunLiterature = () => {
        if (
            !window.confirm("Czy na pewno chcesz usunąć tę pozycję literatury?")
        ) {
            return;
        }

        router.post(
            `${ADRES_SYLABUSOW}/${idPrzedmiotu}/${idSylabusa}/${idLiteratury}/usuniecieliteratury`,
            {},
            {
                preserveScroll: true,
                onStart: () => ustawPrzetwarzanie(true),
                onFinish: () => ustawPrzetwarzanie(false),
            },
        );
    };

    return (
        <div className="min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate p-3 sm:p-4">
            <div className="flex min-w-0 items-start gap-3">
                <div className="bg-theme-panel flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px]">
                    <BookText size={21} className="text-theme-orange" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="break-words text-[14px] font-bold text-theme-text sm:text-[15px]">
                        {pobierzNazweLiteratury(literatura)}
                    </h3>

                    <div className="mt-3 flex flex-col gap-2">
                        {pola
                            .filter(
                                (pole) =>
                                    ![
                                        "tytul",
                                        "nazwa",
                                        "nazwaLiteratury",
                                        "tytulKsiazki",
                                    ].includes(pole.nazwa),
                            )
                            .map((pole) => (
                                <p
                                    key={pole.nazwa}
                                    className="break-words text-[12px] text-theme-muted"
                                >
                                    <span className="font-semibold">
                                        {formatujNazwePola(pole.nazwa)}:
                                    </span>{" "}
                                    {pole.wartosc === null ||
                                    pole.wartosc === ""
                                        ? "—"
                                        : String(pole.wartosc)}
                                </p>
                            ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end border-t border-theme-muted pt-4">
                <button
                    type="button"
                    disabled={przetwarzanie}
                    onClick={usunLiterature}
                    className="flex min-h-[42px] items-center justify-center gap-2 rounded-[10px] border border-red-500/40 px-4 text-[13px] font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                >
                    {przetwarzanie ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Trash2 size={16} />
                    )}
                    Usuń literaturę
                </button>
            </div>
        </div>
    );
}

function ListaLiteratury({ idPrzedmiotu, sylabus }) {
    const [pokazFormularz, ustawPokazFormularz] = useState(false);

    const literatura = pobierzLiterature(sylabus);

    if (!sylabus) {
        return (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-[15px] border border-theme-muted bg-theme-page p-5 text-center">
                <LibraryBig size={32} className="text-theme-orange" />

                <h3 className="text-[17px] font-bold text-theme-text">
                    Brak sylabusa
                </h3>

                <p className="text-[13px] text-theme-muted">
                    Najpierw utwórz sylabus dla wybranego przedmiotu.
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-[18px] font-bold text-theme-text">
                            Literatura przedmiotu
                        </h3>

                        <p className="mt-1 text-[12px] text-theme-muted">
                            Liczba pozycji: {literatura.length}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => ustawPokazFormularz(!pokazFormularz)}
                        className="bg-theme-orange flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-bold text-white"
                    >
                        {pokazFormularz ? <X size={17} /> : <Plus size={17} />}

                        {pokazFormularz ? "Zamknij" : "Dodaj literaturę"}
                    </button>
                </div>
            </div>

            {pokazFormularz && (
                <FormularzLiteratury
                    idPrzedmiotu={idPrzedmiotu}
                    idSylabusa={sylabus.idSylabus}
                    zamknijFormularz={() => ustawPokazFormularz(false)}
                />
            )}

            <div className="flex min-w-0 flex-col gap-3">
                {literatura.length > 0 ? (
                    literatura.map((pozycja, indeks) => (
                        <KartaLiteratury
                            key={pobierzIdLiteratury(pozycja) ?? indeks}
                            literatura={pozycja}
                            idPrzedmiotu={idPrzedmiotu}
                            idSylabusa={sylabus.idSylabus}
                        />
                    ))
                ) : (
                    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[15px] border border-theme-muted bg-theme-page p-5 text-center">
                        <LibraryBig size={34} className="text-theme-muted" />

                        <p className="text-[14px] font-semibold text-theme-text">
                            Brak literatury
                        </p>

                        <p className="text-[12px] text-theme-muted">
                            Do tego sylabusa nie przypisano jeszcze literatury.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Zawartosc({
    listaprzedmiotow = [],
    wybranyprzedmiot = null,
    sylabusy = [],
}) {
    const [ladowanie, ustawLadowanie] = useState(false);
    const [aktywnaZakladka, ustawAktywnaZakladke] = useState("sylabus");

    const [wybranySylabusId, ustawWybranySylabusId] = useState(null);

    const aktualnyPrzedmiot = listaprzedmiotow.find(
        (przedmiot) =>
            String(przedmiot.idPrzedmiot) === String(wybranyprzedmiot),
    );

    const danePrzedmiotu = sylabusy.find(
        (przedmiot) =>
            String(przedmiot.idPrzedmiot) === String(wybranyprzedmiot),
    );

    const dostepneSylabusy = pobierzSylabusy(danePrzedmiotu);

    const wybranySylabus =
        dostepneSylabusy.find(
            (sylabus) => String(sylabus.idSylabus) === String(wybranySylabusId),
        ) ??
        dostepneSylabusy[0] ??
        null;

    const wybierzPrzedmiot = (id) => {
        if (String(id) === String(wybranyprzedmiot)) {
            return;
        }

        ustawAktywnaZakladke("sylabus");
        ustawWybranySylabusId(null);

        router.get(
            ADRES_SYLABUSOW,
            {
                przedmiot_id: id,
            },
            {
                only: ["wybranyprzedmiot", "sylabusy"],
                preserveState: true,
                preserveScroll: true,
                onStart: () => ustawLadowanie(true),
                onFinish: () => ustawLadowanie(false),
            },
        );
    };

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Zarządzanie sylabusami
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] p-2 sm:p-3 md:p-5">
                    <div className="bg-theme-surface custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] p-3 sm:p-5 md:p-7 lg:overflow-hidden">
                        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 lg:h-full lg:min-h-0">
                            <div>
                                <h1 className="text-[26px] font-bold text-theme-text sm:text-[32px] lg:text-[40px]">
                                    Zarządzanie sylabusami
                                </h1>

                                <p className="mt-1 text-[13px] leading-relaxed text-theme-muted sm:text-[14px]">
                                    Wyszukaj przedmiot, zarządzaj jego sylabusem
                                    oraz przypisaną literaturą.
                                </p>
                            </div>

                            <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:min-h-0 lg:flex-1 lg:items-stretch lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.7fr)]">
                                <ListaPrzedmiotow
                                    listaprzedmiotow={listaprzedmiotow}
                                    wybranyprzedmiot={wybranyprzedmiot}
                                    wybierzPrzedmiot={wybierzPrzedmiot}
                                    ladowanie={ladowanie}
                                />

                                <div className="custom-scrollbar flex min-w-0 flex-col gap-5 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
                                    {ladowanie ? (
                                        <div className="flex min-h-[350px] flex-col items-center justify-center gap-3 rounded-[15px] border border-theme-muted bg-theme-page">
                                            <Loader2
                                                size={34}
                                                className="animate-spin text-theme-orange"
                                            />

                                            <span className="text-[14px] text-theme-muted">
                                                Ładowanie sylabusa...
                                            </span>
                                        </div>
                                    ) : aktualnyPrzedmiot ? (
                                        <>
                                            <div className="rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="bg-theme-orange flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px]">
                                                        <BookOpen
                                                            size={25}
                                                            className="text-white"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h2 className="break-words text-[18px] font-bold text-theme-text sm:text-[21px]">
                                                            {pobierzNazwePrzedmiotu(
                                                                aktualnyPrzedmiot,
                                                            )}
                                                        </h2>
                                                    </div>
                                                </div>

                                                {dostepneSylabusy.length >
                                                    1 && (
                                                    <div className="mt-5">
                                                        <label
                                                            htmlFor="wybor-sylabusa"
                                                            className={
                                                                klasaEtykiety
                                                            }
                                                        >
                                                            Wybierz sylabus
                                                        </label>

                                                        <select
                                                            id="wybor-sylabusa"
                                                            value={
                                                                wybranySylabus?.idSylabus ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                ustawWybranySylabusId(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={
                                                                klasaPola
                                                            }
                                                        >
                                                            {dostepneSylabusy.map(
                                                                (sylabus) => (
                                                                    <option
                                                                        key={
                                                                            sylabus.idSylabus
                                                                        }
                                                                        value={
                                                                            sylabus.idSylabus
                                                                        }
                                                                    >
                                                                        Sylabus
                                                                        #
                                                                        {
                                                                            sylabus.idSylabus
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex min-w-0 border-b border-theme-muted">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        ustawAktywnaZakladke(
                                                            "sylabus",
                                                        )
                                                    }
                                                    className={`flex min-w-0 flex-1 items-center justify-center gap-2 border-b-[3px] px-3 py-3 text-[13px] font-bold transition-colors sm:flex-none sm:px-7 sm:text-[15px] ${
                                                        aktywnaZakladka ===
                                                        "sylabus"
                                                            ? "border-theme-orange text-theme-text"
                                                            : "border-transparent text-theme-muted hover:text-theme-text"
                                                    }`}
                                                >
                                                    <FileText size={17} />
                                                    Sylabus
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        ustawAktywnaZakladke(
                                                            "literatura",
                                                        )
                                                    }
                                                    className={`flex min-w-0 flex-1 items-center justify-center gap-2 border-b-[3px] px-3 py-3 text-[13px] font-bold transition-colors sm:flex-none sm:px-7 sm:text-[15px] ${
                                                        aktywnaZakladka ===
                                                        "literatura"
                                                            ? "border-theme-orange text-theme-text"
                                                            : "border-transparent text-theme-muted hover:text-theme-text"
                                                    }`}
                                                >
                                                    <LibraryBig size={17} />
                                                    Literatura
                                                </button>
                                            </div>

                                            {aktywnaZakladka === "sylabus" ? (
                                                <SzczegolySylabusa
                                                    key={`s-${wybranyprzedmiot}-${wybranySylabus?.idSylabus ?? "nowy"}`}
                                                    idPrzedmiotu={
                                                        wybranyprzedmiot
                                                    }
                                                    sylabus={wybranySylabus}
                                                />
                                            ) : (
                                                <ListaLiteratury
                                                    key={`l-${wybranyprzedmiot}-${wybranySylabus?.idSylabus ?? "brak"}`}
                                                    idPrzedmiotu={
                                                        wybranyprzedmiot
                                                    }
                                                    sylabus={wybranySylabus}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-[15px] border border-theme-muted bg-theme-page p-5 text-center sm:min-h-[450px]">
                                            <div className="bg-theme-slate flex h-[75px] w-[75px] items-center justify-center rounded-full">
                                                <BookOpen
                                                    size={34}
                                                    className="text-theme-orange"
                                                />
                                            </div>

                                            <div>
                                                <h2 className="text-[19px] font-bold text-theme-text">
                                                    Wybierz przedmiot
                                                </h2>

                                                <p className="mt-2 max-w-[350px] text-[13px] leading-relaxed text-theme-muted">
                                                    Wyszukaj i wybierz przedmiot
                                                    z listy, aby wyświetlić jego
                                                    sylabus oraz zarządzać
                                                    literaturą.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Sylabusy({
    listaprzedmiotow = [],
    wybranyprzedmiot = null,
    sylabusy = [],
}) {
    const props = usePage().props;

    const message = props.flash?.status || props.status;

    useEffect(() => {
        if (message) {
            toast.info(message, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }, [message]);
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Head title="Zarządzanie sylabusami" />

            <MenuDziekanat />

            <Zawartosc
                listaprzedmiotow={listaprzedmiotow}
                wybranyprzedmiot={wybranyprzedmiot}
                sylabusy={sylabusy}
            />
        </div>
    );
}
