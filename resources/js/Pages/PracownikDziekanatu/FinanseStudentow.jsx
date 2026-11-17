import React, { useMemo, useState, useEffect } from "react";
import { Head, router, useForm , usePage } from "@inertiajs/react";
import {
    Search,
    UserRound,
    Wallet,
    Plus,
    Trash2,
    Check,
    X,
    CalendarDays,
    CreditCard,
    Users,
    Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";


import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";

const ADRES_FINANSOW = "/dziekanat/finansestudentow";
const ADRES_PLATNOSCI = "/dziekanat/platnosci";

const klasaPola =
    "h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-[14px] text-theme-text outline-none transition-colors focus:border-theme-orange";

const klasaEtykiety = "mb-2 block text-[13px] font-semibold text-theme-text";

const klasaBledu = "mt-1 text-[12px] text-red-500";

function pobierzNazweStudenta(student) {
    const uzytkownik = student.user ?? {};

    const imie = uzytkownik.name ?? "";
    const nazwisko = uzytkownik.surname ?? "";

    return `${imie} ${nazwisko}`.trim() || "Nieznany student";
}

function czyOplacona(platnosc) {
    return (
        platnosc.czyOplacone === true ||
        platnosc.czyOplacone === 1 ||
        platnosc.czyOplacone === "1"
    );
}

function formatujKwote(kwota) {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(Number(kwota) || 0);
}

function formatujDate(wartosc) {
    if (!wartosc) return "—";

    const data = String(wartosc).slice(0, 10);
    const czesci = data.split("-");

    if (czesci.length === 3) {
        return `${czesci[2]}.${czesci[1]}.${czesci[0]}`;
    }

    return data;
}

function ListaStudentow({
    listastudentow,
    wybranystudent,
    wybierzStudenta,
    ladowanie,
}) {
    const [wyszukiwanie, ustawWyszukiwanie] = useState("");

    const przefiltrowaniStudenci = useMemo(() => {
        const zapytanie = wyszukiwanie.trim().toLowerCase();

        return listastudentow.filter((student) => {
            const nazwa = pobierzNazweStudenta(student);
            const numerAlbumu = student.index ?? "";

            return `${nazwa} ${numerAlbumu}`.toLowerCase().includes(zapytanie);
        });
    }, [listastudentow, wyszukiwanie]);

    return (
        <div className="flex min-h-0 min-w-0 flex-col rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-4 lg:h-full">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-[17px] font-bold text-theme-text">
                    Lista studentów
                </h2>

                <span className="rounded-[8px] bg-theme-slate px-3 py-1 text-[12px] text-theme-muted">
                    {listastudentow.length}
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
                    placeholder="Imię, nazwisko lub nr albumu..."
                    className={`${klasaPola} pl-10`}
                />
            </div>

            <div className="custom-scrollbar flex max-h-[280px] min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain pr-1 sm:max-h-[340px] lg:max-h-none lg:flex-1">
                {przefiltrowaniStudenci.length > 0 ? (
                    przefiltrowaniStudenci.map((student) => {
                        const id = student.idStudent;

                        const wybrany = String(id) === String(wybranystudent);

                        return (
                            <button
                                key={id}
                                type="button"
                                disabled={ladowanie}
                                onClick={() => wybierzStudenta(id)}
                                className={`flex w-full min-w-0 items-center gap-3 rounded-[11px] border p-3 text-left transition-colors disabled:cursor-wait ${
                                    wybrany
                                        ? "border-theme-orange bg-theme-panel"
                                        : "border-theme-muted bg-theme-slate hover:bg-theme-panel"
                                }`}
                            >
                                <div
                                    className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] ${
                                        wybrany
                                            ? "bg-theme-orange"
                                            : "bg-theme-panel"
                                    }`}
                                >
                                    <UserRound
                                        size={20}
                                        className={
                                            wybrany
                                                ? "text-white"
                                                : "text-theme-text"
                                        }
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-bold text-theme-text sm:text-[14px]">
                                        {pobierzNazweStudenta(student)}
                                    </p>

                                    <p className="mt-1 truncate text-[12px] text-theme-muted">
                                        Nr albumu: {student.index}
                                    </p>
                                </div>

                                {wybrany && (
                                    <Check
                                        size={18}
                                        className="shrink-0 text-theme-orange"
                                    />
                                )}
                            </button>
                        );
                    })
                ) : (
                    <div className="flex min-h-[130px] items-center justify-center rounded-[10px] border border-theme-muted bg-theme-slate p-4 text-center">
                        <span className="text-[13px] text-theme-muted">
                            Nie znaleziono studentów
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function KartaStatystyki({ tytul, wartosc, Ikona }) {
    return (
        <div className="flex min-w-0 items-center gap-3 rounded-[12px] border border-theme-muted bg-theme-slate p-3 sm:p-4">
            <div className="bg-theme-panel flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px]">
                <Ikona size={20} className="text-theme-orange" />
            </div>

            <div className="min-w-0">
                <p className="text-[11px] text-theme-muted sm:text-[12px]">
                    {tytul}
                </p>

                <p className="mt-1 break-words text-[15px] font-bold text-theme-text sm:text-[18px]">
                    {wartosc}
                </p>
            </div>
        </div>
    );
}

function FormularzPlatnosci({ idStudenta, zamknijFormularz }) {
    const formularz = useForm({
        Student_idStudent: idStudenta,
        tytul: "",
        kwota: "",
        termin: "",
        czyOplacone: 0,
    });

    const zapiszPlatnosc = (e) => {
        e.preventDefault();

        if (formularz.processing) return;

        if (!window.confirm("Czy na pewno chcesz wystawić tę płatność?")) {
            return;
        }

        formularz.post(`${ADRES_PLATNOSCI}/${idStudenta}/dodajPlatnosc`, {
            preserveScroll: true,
            onSuccess: () => {
                formularz.reset();
                zamknijFormularz();
            },
        });
    };

    return (
        <div className="rounded-[12px] border border-theme-orange bg-theme-page p-3 sm:p-5">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-theme-text">
                    Nowa płatność
                </h3>

                <button
                    type="button"
                    onClick={zamknijFormularz}
                    disabled={formularz.processing}
                    className="rounded-[8px] p-2 text-theme-muted hover:bg-theme-panel disabled:opacity-50"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={zapiszPlatnosc} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="tytul" className={klasaEtykiety}>
                        Tytuł płatności
                    </label>

                    <input
                        id="tytul"
                        type="text"
                        maxLength={45}
                        required
                        value={formularz.data.tytul}
                        onChange={(e) =>
                            formularz.setData("tytul", e.target.value)
                        }
                        placeholder="Np. Opłata za legitymację"
                        className={klasaPola}
                    />

                    {formularz.errors.tytul && (
                        <p className={klasaBledu}>{formularz.errors.tytul}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="kwota" className={klasaEtykiety}>
                            Kwota (PLN)
                        </label>

                        <input
                            id="kwota"
                            type="number"
                            min="0.01"
                            step="0.01"
                            required
                            value={formularz.data.kwota}
                            onChange={(e) =>
                                formularz.setData("kwota", e.target.value)
                            }
                            placeholder="0.00"
                            className={klasaPola}
                        />

                        {formularz.errors.kwota && (
                            <p className={klasaBledu}>
                                {formularz.errors.kwota}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="termin" className={klasaEtykiety}>
                            Termin płatności
                        </label>

                        <input
                            id="termin"
                            type="datetime-local"
                            required
                            value={formularz.data.termin}
                            onChange={(e) =>
                                formularz.setData("termin", e.target.value)
                            }
                            className={klasaPola}
                        />

                        {formularz.errors.termin && (
                            <p className={klasaBledu}>
                                {formularz.errors.termin}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-theme-muted pt-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={zamknijFormularz}
                        disabled={formularz.processing}
                        className="min-h-[44px] rounded-[10px] border border-theme-muted bg-theme-slate px-5 text-[13px] font-semibold text-theme-text disabled:opacity-50"
                    >
                        Anuluj
                    </button>

                    <button
                        type="submit"
                        disabled={formularz.processing}
                        className="bg-theme-orange flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-bold text-white disabled:opacity-50"
                    >
                        {formularz.processing && (
                            <Loader2 size={16} className="animate-spin" />
                        )}

                        {formularz.processing
                            ? "Zapisywanie..."
                            : "Wystaw płatność"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function KartaPlatnosci({ platnosc, idStudenta }) {
    const [przetwarzanie, ustawPrzetwarzanie] = useState(false);

    const id = platnosc.idPlatnosc;
    const oplacona = czyOplacona(platnosc);

    const zmienStatus = (nowyStatus) => {
        const nowaWartosc = Number(nowyStatus);

        if (nowaWartosc === Number(oplacona)) {
            return;
        }

        if (!window.confirm("Czy na pewno chcesz zmienić status płatności?")) {
            return;
        }

        router.post(
            `${ADRES_PLATNOSCI}/${idStudenta}/${id}/zmienStatus`,
            {
                czyOplacone: nowaWartosc,
            },
            {
                preserveScroll: true,
                onStart: () => ustawPrzetwarzanie(true),
                onFinish: () => ustawPrzetwarzanie(false),
            },
        );
    };

    const usunPlatnosc = () => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę płatność?")) {
            return;
        }

        router.post(
            `${ADRES_PLATNOSCI}/${idStudenta}/${id}/usunPlatnosc`,
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
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <h3 className="break-words text-[14px] font-bold text-theme-text sm:text-[15px]">
                        {platnosc.tytul}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-theme-muted">
                        <span>Wystawiono: {formatujDate(platnosc.data)}</span>

                        <span>Termin: {formatujDate(platnosc.termin)}</span>
                    </div>
                </div>

                <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <p className="text-[18px] font-bold text-theme-text">
                        {formatujKwote(platnosc.kwota)}
                    </p>

                    <span
                        className={`rounded-[7px] px-3 py-1 text-[11px] font-bold ${
                            oplacona
                                ? "bg-green-500/15 text-green-500"
                                : "bg-red-500/15 text-red-500"
                        }`}
                    >
                        {oplacona ? "Opłacone" : "Nie opłacone"}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-theme-muted pt-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1 sm:max-w-[250px]">
                    <label htmlFor={`status-${id}`} className={klasaEtykiety}>
                        Zmień status
                    </label>

                    <select
                        id={`status-${id}`}
                        value={oplacona ? 1 : 0}
                        onChange={(e) => zmienStatus(e.target.value)}
                        disabled={przetwarzanie}
                        className={klasaPola}
                    >
                        <option value={0}>Nie opłacone</option>

                        <option value={1}>Opłacone</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={usunPlatnosc}
                    disabled={przetwarzanie}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-red-500/40 px-4 text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                >
                    <Trash2 size={17} />
                    Usuń płatność
                </button>
            </div>
        </div>
    );
}

function Zawartosc({
    listastudentow = [],
    wybranystudent = null,
    platnosci = [],
}) {
    const [ladowanie, ustawLadowanie] = useState(false);
    const [pokazFormularz, ustawPokazFormularz] = useState(false);

    const wybranyStudent = listastudentow.find(
        (student) => String(student.idStudent) === String(wybranystudent),
    );

    const wybierzStudenta = (id) => {
        if (String(id) === String(wybranystudent)) {
            return;
        }

        ustawPokazFormularz(false);

        router.get(
            ADRES_FINANSOW,
            {
                student_id: id,
            },
            {
                only: ["wybranystudent", "platnosci"],
                preserveState: true,
                preserveScroll: true,
                onStart: () => ustawLadowanie(true),
                onFinish: () => ustawLadowanie(false),
            },
        );
    };

    const nieoplaconePlatnosci = platnosci.filter(
        (platnosc) => !czyOplacona(platnosc),
    );

    const sumaDoZaplaty = nieoplaconePlatnosci.reduce(
        (suma, platnosc) => suma + Number(platnosc.kwota || 0),
        0,
    );

    const najblizszaPlatnosc = [...nieoplaconePlatnosci]
        .filter((platnosc) => platnosc.termin)
        .sort((a, b) => String(a.termin).localeCompare(String(b.termin)))[0];

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">
                    Zarządzanie płatnościami
                </span>

                <div className="w-[65px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="bg-theme-slate flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] p-2 sm:p-3 md:p-5">
                    <div className="bg-theme-surface custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] p-3 sm:p-5 md:p-7 lg:overflow-hidden">
                        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 lg:h-full lg:min-h-0">
                            <div>
                                <h1 className="text-[26px] font-bold text-theme-text sm:text-[32px] lg:text-[40px]">
                                    Zarządzanie płatnościami
                                </h1>

                                <p className="mt-1 text-[13px] text-theme-muted sm:text-[14px]">
                                    Wyszukaj studenta, wystawiaj płatności i
                                    zarządzaj ich statusami.
                                </p>
                            </div>

                            <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:min-h-0 lg:flex-1 lg:items-stretch lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.7fr)]">
                                <ListaStudentow
                                    listastudentow={listastudentow}
                                    wybranystudent={wybranystudent}
                                    wybierzStudenta={wybierzStudenta}
                                    ladowanie={ladowanie}
                                />

                                <div className="flex min-w-0 flex-col gap-5 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1 custom-scrollbar">
                                    {ladowanie ? (
                                        <div className="flex min-h-[350px] flex-col items-center justify-center gap-3 rounded-[15px] border border-theme-muted bg-theme-page">
                                            <Loader2
                                                size={34}
                                                className="animate-spin text-theme-orange"
                                            />

                                            <span className="text-[14px] text-theme-muted">
                                                Ładowanie płatności...
                                            </span>
                                        </div>
                                    ) : wybranyStudent ? (
                                        <>
                                            <div className="rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="bg-theme-orange flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px]">
                                                            <UserRound
                                                                size={24}
                                                                className="text-white"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h2 className="break-words text-[17px] font-bold text-theme-text sm:text-[20px]">
                                                                {pobierzNazweStudenta(
                                                                    wybranyStudent,
                                                                )}
                                                            </h2>

                                                            <p className="mt-1 text-[12px] text-theme-muted sm:text-[13px]">
                                                                Nr albumu:{" "}
                                                                {
                                                                    wybranyStudent.index
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            ustawPokazFormularz(
                                                                !pokazFormularz,
                                                            )
                                                        }
                                                        className="bg-theme-orange flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-[10px] px-5 text-[13px] font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
                                                    >
                                                        {pokazFormularz ? (
                                                            <>
                                                                <X size={17} />
                                                                Zamknij
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus
                                                                    size={17}
                                                                />
                                                                Wystaw płatność
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                    <KartaStatystyki
                                                        tytul="Suma do zapłaty"
                                                        wartosc={formatujKwote(
                                                            sumaDoZaplaty,
                                                        )}
                                                        Ikona={Wallet}
                                                    />

                                                    <KartaStatystyki
                                                        tytul="Najbliższy termin"
                                                        wartosc={
                                                            najblizszaPlatnosc
                                                                ? formatujDate(
                                                                      najblizszaPlatnosc.termin,
                                                                  )
                                                                : "Brak"
                                                        }
                                                        Ikona={CalendarDays}
                                                    />

                                                    <KartaStatystyki
                                                        tytul="Liczba płatności"
                                                        wartosc={
                                                            platnosci.length
                                                        }
                                                        Ikona={CreditCard}
                                                    />
                                                </div>
                                            </div>

                                            {pokazFormularz && (
                                                <FormularzPlatnosci
                                                    key={String(wybranystudent)}
                                                    idStudenta={wybranystudent}
                                                    zamknijFormularz={() =>
                                                        ustawPokazFormularz(
                                                            false,
                                                        )
                                                    }
                                                />
                                            )}

                                            <div className="min-w-0 rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5">
                                                <div className="mb-5 flex items-center justify-between gap-3">
                                                    <h2 className="text-[18px] font-bold text-theme-text sm:text-[20px]">
                                                        Historia płatności
                                                    </h2>

                                                    <span className="text-[12px] text-theme-muted">
                                                        Liczba:{" "}
                                                        {platnosci.length}
                                                    </span>
                                                </div>

                                                <div className="flex min-w-0 flex-col gap-3">
                                                    {platnosci.length > 0 ? (
                                                        platnosci.map(
                                                            (platnosc) => (
                                                                <KartaPlatnosci
                                                                    key={
                                                                        platnosc.idPlatnosc
                                                                    }
                                                                    platnosc={
                                                                        platnosc
                                                                    }
                                                                    idStudenta={
                                                                        wybranystudent
                                                                    }
                                                                />
                                                            ),
                                                        )
                                                    ) : (
                                                        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-[12px] border border-theme-muted bg-theme-slate p-5 text-center">
                                                            <Wallet
                                                                size={34}
                                                                className="text-theme-muted"
                                                            />

                                                            <p className="text-[14px] font-semibold text-theme-text">
                                                                Brak płatności
                                                            </p>

                                                            <p className="text-[12px] text-theme-muted">
                                                                Ten student nie
                                                                ma jeszcze
                                                                przypisanych
                                                                płatności.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-[15px] border border-theme-muted bg-theme-page p-5 text-center sm:min-h-[450px]">
                                            <div className="bg-theme-slate flex h-[70px] w-[70px] items-center justify-center rounded-full">
                                                <Users
                                                    size={32}
                                                    className="text-theme-orange"
                                                />
                                            </div>

                                            <div>
                                                <h2 className="text-[19px] font-bold text-theme-text">
                                                    Wybierz studenta
                                                </h2>

                                                <p className="mt-2 max-w-[350px] text-[13px] leading-relaxed text-theme-muted">
                                                    Wyszukaj i wybierz studenta
                                                    z listy, aby wyświetlić jego
                                                    płatności oraz zarządzać
                                                    zobowiązaniami finansowymi.
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

export default function FinanseStudentow({
    listastudentow = [],
    wybranystudent = null,
    platnosci = [],
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
            <Head title="Zarządzanie płatnościami" />

            <MenuDziekanat />

            <Zawartosc
                listastudentow={listastudentow}
                wybranystudent={wybranystudent}
                platnosci={platnosci}
            />
        </div>
    );
}
