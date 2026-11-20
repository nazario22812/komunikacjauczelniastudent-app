import React, { useMemo, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    DoorOpen,
    Loader2,
    Plus,
    Search,
    XCircle,
    ClipboardList,
    AlertCircle,
} from "lucide-react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";

const ADRES_REZERWACJI = "/dziekanat/rezerwacje";

const klasaPola =
    "h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-[14px] text-theme-text outline-none transition-colors focus:border-theme-orange";
const klasaEtykiety = "mb-2 block text-[13px] font-semibold text-theme-text";

function pobierzIdRezerwacji(rezerwacja) {
    return rezerwacja.idRezerwacja;
}

function pobierzProwadzacego(rezerwacja) {
    const prowadzacy = rezerwacja.prowadzacy ?? {};
    const user = prowadzacy.user ?? {};
    const tytul = prowadzacy.TytulNaukowy ?? rezerwacja.TytulNaukowy ?? "";
    const imie = user.name ?? rezerwacja.name ?? "";
    const nazwisko = user.surname ?? rezerwacja.surname ?? "";
    const nazwa = [tytul, imie, nazwisko].filter(Boolean).join(" ");
    return nazwa || `Prowadzący #${rezerwacja.Prowadzacy_idProwadzacy ?? "—"}`;
}

function pobierzNumerSali(rezerwacja) {
    return rezerwacja.sala?.numerSali ?? rezerwacja.numerSali ?? rezerwacja.Sala_idSala ?? "—";
}

function pobierzBudynek(rezerwacja) {
    return (
        rezerwacja.sala?.budynek?.nazwa ??
        rezerwacja.budynek?.nazwa ??
        rezerwacja.nazwaBudynku ??
        `Budynek #${rezerwacja.Sala_Budynek_idBudynek ?? "—"}`
    );
}

function nazwaSali(sala) {
    const budynek = sala.budynek?.nazwa ?? sala.nazwaBudynku ?? `Budynek #${sala.Budynek_idBudynek ?? "—"}`;
    return `${budynek} — sala ${sala.numerSali ?? sala.idSala}`;
}

function formatujDate(data) {
    if (!data) return "—";
    const wartosc = String(data).slice(0, 10);
    const czesci = wartosc.split("-");
    return czesci.length === 3 ? `${czesci[2]}.${czesci[1]}.${czesci[0]}` : wartosc;
}

function formatujGodzine(godzina) {
    if (!godzina) return "—";
    const wartosc = String(godzina);
    const samCzas = wartosc.includes("T")
        ? wartosc.split("T")[1]
        : wartosc.includes(" ")
          ? wartosc.split(" ").pop()
          : wartosc;
    return samCzas.slice(0, 5);
}

function czyOczekujaca(rezerwacja) {
    return String(rezerwacja.statusRezerwacji ?? "").trim() === "Oczekująca";
}

function Blad({ tresc }) {
    return tresc ? <p className="mt-1 text-[12px] text-red-500">{tresc}</p> : null;
}

function PrzyciskiDecyzji({ rezerwacja, przetwarzanie, podejmijDecyzje }) {
    const id = pobierzIdRezerwacji(rezerwacja);
    const zajete = przetwarzanie !== null;
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
                type="button"
                disabled={zajete}
                onClick={() => podejmijDecyzje(rezerwacja, "zatwierdzenie")}
                className="flex min-h-[40px] items-center justify-center gap-2 rounded-[9px] border border-green-500/40 bg-green-500/10 px-3 text-[12px] font-bold text-green-500 transition-colors hover:bg-green-500/20 disabled:cursor-wait disabled:opacity-50"
            >
                {przetwarzanie === id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Zatwierdź
            </button>
            <button
                type="button"
                disabled={zajete}
                onClick={() => podejmijDecyzje(rezerwacja, "odrzucenie")}
                className="flex min-h-[40px] items-center justify-center gap-2 rounded-[9px] border border-red-500/40 bg-red-500/10 px-3 text-[12px] font-bold text-red-500 transition-colors hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50"
            >
                <XCircle size={16} /> Odrzuć
            </button>
        </div>
    );
}

function ListaOczekujacych({ rezerwacje = [] }) {
    const [wyszukiwanie, ustawWyszukiwanie] = useState("");
    const [przetwarzanie, ustawPrzetwarzanie] = useState(null);
    const [bladDecyzji, ustawBladDecyzji] = useState("");

    const oczekujace = useMemo(() => rezerwacje.filter(czyOczekujaca), [rezerwacje]);
    const przefiltrowane = useMemo(() => {
        const fraza = wyszukiwanie.trim().toLowerCase();
        if (!fraza) return oczekujace;
        return oczekujace.filter((rezerwacja) =>
            [pobierzProwadzacego(rezerwacja), pobierzNumerSali(rezerwacja), pobierzBudynek(rezerwacja), rezerwacja.data, rezerwacja.typWydarzenia]
                .join(" ")
                .toLowerCase()
                .includes(fraza)
        );
    }, [oczekujace, wyszukiwanie]);

    const podejmijDecyzje = (rezerwacja, decyzja) => {
        const id = pobierzIdRezerwacji(rezerwacja);
        if (id == null || przetwarzanie !== null) return;
        const zatwierdz = decyzja === "zatwierdzenie";
        if (!window.confirm(zatwierdz ? "Czy na pewno chcesz zatwierdzić tę rezerwację?" : "Czy na pewno chcesz odrzucić tę rezerwację?")) return;
        ustawBladDecyzji("");
        router.post(`${ADRES_REZERWACJI}/${id}/${decyzja}`, {}, {
            preserveScroll: true,
            onStart: () => ustawPrzetwarzanie(id),
            onFinish: () => ustawPrzetwarzanie(null),
            onError: (errors) => ustawBladDecyzji(errors.rezerwacja || Object.values(errors)[0] || "Nie udało się rozpatrzyć rezerwacji."),
        });
    };

    return (
        <div className="flex min-w-0 flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-[12px] border border-theme-muted bg-theme-page p-4">
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] bg-theme-slate"><ClipboardList size={23} className="text-theme-orange" /></div>
                    <div><p className="text-[12px] text-theme-muted">Oczekujące rezerwacje</p><p className="text-[23px] font-bold text-theme-text">{oczekujace.length}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-[12px] border border-theme-muted bg-theme-page p-4">
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] bg-theme-slate"><CalendarDays size={23} className="text-theme-orange" /></div>
                    <div><p className="text-[12px] text-theme-muted">Wyniki wyszukiwania</p><p className="text-[23px] font-bold text-theme-text">{przefiltrowane.length}</p></div>
                </div>
            </div>

            <div className="min-w-0 rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-[18px] font-bold text-theme-text sm:text-[20px]">Wnioski prowadzących</h2>
                        <p className="mt-1 text-[12px] text-theme-muted">Zatwierdź lub odrzuć rezerwacje oczekujące na decyzję.</p>
                    </div>
                    <div className="relative w-full md:max-w-[340px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
                        <input type="search" value={wyszukiwanie} onChange={(e) => ustawWyszukiwanie(e.target.value)} placeholder="Prowadzący, sala, data..." className={`${klasaPola} pl-10`} />
                    </div>
                </div>
                <Blad tresc={bladDecyzji} />
                {przefiltrowane.length === 0 ? (
                    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[12px] border border-theme-muted bg-theme-slate p-5 text-center">
                        <CheckCircle2 size={35} className="text-theme-orange" />
                        <p className="text-[16px] font-semibold text-theme-text">Brak oczekujących rezerwacji</p>
                        <p className="text-[12px] text-theme-muted">Nie znaleziono zgłoszeń pasujących do wyszukiwania.</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden min-w-0 overflow-x-auto lg:block">
                            <table className="w-full min-w-[960px] border-collapse text-left">
                                <thead><tr className="border-b border-theme-muted text-[12px] text-theme-muted">
                                    <th className="p-3 font-semibold">Prowadzący</th><th className="p-3 font-semibold">Sala</th><th className="p-3 font-semibold">Data</th><th className="p-3 font-semibold">Godziny</th><th className="p-3 font-semibold">Wydarzenie</th><th className="p-3 text-right font-semibold">Decyzja</th>
                                </tr></thead>
                                <tbody>
                                    {przefiltrowane.map((rezerwacja) => (
                                        <tr key={pobierzIdRezerwacji(rezerwacja)} className="border-b border-theme-muted/50 hover:bg-theme-slate/50">
                                            <td className="max-w-[220px] break-words p-3 text-[13px] font-semibold text-theme-text">{pobierzProwadzacego(rezerwacja)}</td>
                                            <td className="p-3 text-[13px] text-theme-text">{pobierzBudynek(rezerwacja)}<span className="block text-theme-muted">Sala {pobierzNumerSali(rezerwacja)}</span></td>
                                            <td className="whitespace-nowrap p-3 text-[13px] text-theme-text">{formatujDate(rezerwacja.data)}</td>
                                            <td className="whitespace-nowrap p-3 text-[13px] text-theme-text">{formatujGodzine(rezerwacja.GodzinaRozpoczecia)} – {formatujGodzine(rezerwacja.GodzinaZakonczenia)}</td>
                                            <td className="max-w-[180px] break-words p-3 text-[13px] text-theme-text">{rezerwacja.typWydarzenia ?? "—"}</td>
                                            <td className="p-3"><div className="flex justify-end"><PrzyciskiDecyzji rezerwacja={rezerwacja} przetwarzanie={przetwarzanie} podejmijDecyzje={podejmijDecyzje} /></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col gap-3 lg:hidden">
                            {przefiltrowane.map((rezerwacja) => (
                                <div key={pobierzIdRezerwacji(rezerwacja)} className="rounded-[12px] border border-theme-muted bg-theme-slate p-3 sm:p-4">
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="break-words text-[14px] font-bold text-theme-text">{pobierzProwadzacego(rezerwacja)}</h3>
                                        <span className="rounded-[7px] bg-amber-500/15 px-2 py-1 text-[11px] font-semibold text-amber-500">Oczekująca</span>
                                    </div>
                                    <div className="flex flex-col gap-2 text-[13px] text-theme-text">
                                        <p className="flex items-start gap-2"><DoorOpen size={16} className="mt-0.5 shrink-0 text-theme-muted" />{pobierzBudynek(rezerwacja)}, sala {pobierzNumerSali(rezerwacja)}</p>
                                        <p className="flex items-center gap-2"><CalendarDays size={16} className="shrink-0 text-theme-muted" />{formatujDate(rezerwacja.data)}</p>
                                        <p className="flex items-center gap-2"><Clock3 size={16} className="shrink-0 text-theme-muted" />{formatujGodzine(rezerwacja.GodzinaRozpoczecia)} – {formatujGodzine(rezerwacja.GodzinaZakonczenia)}</p>
                                        <p className="break-words text-theme-muted">{rezerwacja.typWydarzenia ?? "—"}</p>
                                    </div>
                                    <div className="mt-4 border-t border-theme-muted pt-4"><PrzyciskiDecyzji rezerwacja={rezerwacja} przetwarzanie={przetwarzanie} podejmijDecyzje={podejmijDecyzje} /></div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function FormularzRezerwacji({ sale = [] }) {
    const formularz = useForm({
        Sala_idSala: "",
        Sala_Budynek_idBudynek: "",
        data: "",
        GodzinaRozpoczecia: "",
        GodzinaZakonczenia: "",
        typWydarzenia: "",
    });
    const [blad, ustawBlad] = useState("");
    const [szukanaSala, ustawSzukanaSale] = useState("");

    const dostepneSale = useMemo(() => {
        const fraza = szukanaSala.trim().toLowerCase();
        return sale.filter((sala) => nazwaSali(sala).toLowerCase().includes(fraza));
    }, [sale, szukanaSala]);

    const wybierzSale = (wartosc) => {
        if (!wartosc) {
            formularz.setData((poprzednie) => ({ ...poprzednie, Sala_idSala: "", Sala_Budynek_idBudynek: "" }));
            return;
        }
        const wybrana = sale.find((sala) => `${sala.idSala}|${sala.Budynek_idBudynek}` === wartosc);
        if (!wybrana) return;
        formularz.setData((poprzednie) => ({
            ...poprzednie,
            Sala_idSala: wybrana.idSala,
            Sala_Budynek_idBudynek: wybrana.Budynek_idBudynek,
        }));
    };

    const zapiszRezerwacje = (e) => {
        e.preventDefault();
        ustawBlad("");
        if (!formularz.data.Sala_idSala || !formularz.data.Sala_Budynek_idBudynek) {
            ustawBlad("Wybierz salę.");
            return;
        }
        if (formularz.data.GodzinaRozpoczecia >= formularz.data.GodzinaZakonczenia) {
            ustawBlad("Godzina zakończenia musi być późniejsza od godziny rozpoczęcia.");
            return;
        }
        if (!window.confirm("Czy na pewno chcesz utworzyć rezerwację sali?")) return;
        formularz.post(`${ADRES_REZERWACJI}/dodanie`, {
            preserveScroll: true,
            onSuccess: () => {
                formularz.reset();
                ustawSzukanaSale("");
            },
            onError: (errors) => ustawBlad(errors.rezerwacja || ""),
        });
    };

    return (
        <div className="mx-auto w-full max-w-[900px] rounded-[15px] border border-theme-muted bg-theme-page p-3 sm:p-5 md:p-7">
            <div className="mb-6">
                <h2 className="text-[19px] font-bold text-theme-text">Nowa rezerwacja sali</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-theme-muted">Rezerwacja utworzona przez dziekanat nie wymaga przypisania prowadzącego. Termin zostanie sprawdzony przez serwer.</p>
            </div>
            {sale.length === 0 && (
                <div className="mb-5 flex items-center gap-2 rounded-[10px] border border-amber-500/30 bg-amber-500/10 p-3 text-[13px] text-amber-500"><AlertCircle size={18} />Brak sal do wyboru. Sprawdź dane przekazywane jako prop „sale”.</div>
            )}
            <form onSubmit={zapiszRezerwacje} className="flex min-w-0 flex-col gap-5">
                <div className="min-w-0">
                    <label htmlFor="szukana-sala" className={klasaEtykiety}>Wyszukaj salę</label>
                    <input id="szukana-sala" type="search" value={szukanaSala} onChange={(e) => ustawSzukanaSale(e.target.value)} placeholder="Numer sali lub budynek..." className={klasaPola} />
                </div>
                <div className="min-w-0">
                    <label htmlFor="sala" className={klasaEtykiety}>Sala *</label>
                    <select
                        id="sala" required
                        value={formularz.data.Sala_idSala !== "" ? `${formularz.data.Sala_idSala}|${formularz.data.Sala_Budynek_idBudynek}` : ""}
                        onChange={(e) => wybierzSale(e.target.value)}
                        className={klasaPola}
                    >
                        <option value="">Wybierz salę</option>
                        {dostepneSale.map((sala) => (
                            <option key={`${sala.idSala}-${sala.Budynek_idBudynek}`} value={`${sala.idSala}|${sala.Budynek_idBudynek}`}>
                                {nazwaSali(sala)}
                            </option>
                        ))}
                        {formularz.data.Sala_idSala !== "" && !dostepneSale.some((sala) => `${sala.idSala}|${sala.Budynek_idBudynek}` === `${formularz.data.Sala_idSala}|${formularz.data.Sala_Budynek_idBudynek}`) && (
                            <option value={`${formularz.data.Sala_idSala}|${formularz.data.Sala_Budynek_idBudynek}`}>
                                {nazwaSali(sale.find((sala) => `${sala.idSala}|${sala.Budynek_idBudynek}` === `${formularz.data.Sala_idSala}|${formularz.data.Sala_Budynek_idBudynek}`) ?? { idSala: formularz.data.Sala_idSala, Budynek_idBudynek: formularz.data.Sala_Budynek_idBudynek })}
                            </option>
                        )}
                    </select>
                    <Blad tresc={formularz.errors.Sala_idSala || formularz.errors.Sala_Budynek_idBudynek} />
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0 sm:col-span-2">
                        <label htmlFor="data" className={klasaEtykiety}>Data *</label>
                        <input id="data" required type="date" min={new Date().toLocaleDateString("en-CA")} value={formularz.data.data} onChange={(e) => formularz.setData("data", e.target.value)} className={klasaPola} />
                        <Blad tresc={formularz.errors.data} />
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="rozpoczecie" className={klasaEtykiety}>Godzina rozpoczęcia *</label>
                        <input id="rozpoczecie" required type="time" value={formularz.data.GodzinaRozpoczecia} onChange={(e) => formularz.setData("GodzinaRozpoczecia", e.target.value)} className={klasaPola} />
                        <Blad tresc={formularz.errors.GodzinaRozpoczecia} />
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="zakonczenie" className={klasaEtykiety}>Godzina zakończenia *</label>
                        <input id="zakonczenie" required type="time" value={formularz.data.GodzinaZakonczenia} onChange={(e) => formularz.setData("GodzinaZakonczenia", e.target.value)} className={klasaPola} />
                        <Blad tresc={formularz.errors.GodzinaZakonczenia} />
                    </div>
                </div>
                <div className="min-w-0">
                    <label htmlFor="typ" className={klasaEtykiety}>Typ wydarzenia *</label>
                    <input id="typ" required type="text" maxLength={45} value={formularz.data.typWydarzenia} onChange={(e) => formularz.setData("typWydarzenia", e.target.value)} placeholder="Np. Egzamin poprawkowy" className={klasaPola} />
                    <Blad tresc={formularz.errors.typWydarzenia} />
                </div>
                {(blad || formularz.errors.rezerwacja) && (
                    <div className="flex items-start gap-2 rounded-[10px] border border-red-500/30 bg-red-500/10 p-3 text-[13px] text-red-500">
                        <AlertCircle size={17} className="mt-0.5 shrink-0" />{blad || formularz.errors.rezerwacja}
                    </div>
                )}
                <div className="flex flex-col-reverse gap-3 border-t border-theme-muted pt-4 sm:flex-row sm:justify-end">
                    <button type="button" disabled={formularz.processing} onClick={() => { formularz.reset(); ustawSzukanaSale(""); ustawBlad(""); }} className="min-h-[44px] rounded-[10px] border border-theme-muted bg-theme-slate px-5 text-[13px] font-semibold text-theme-text disabled:opacity-50">Wyczyść</button>
                    <button type="submit" disabled={formularz.processing || sale.length === 0} className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-theme-orange px-5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                        {formularz.processing ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
                        {formularz.processing ? "Zapisywanie..." : "Utwórz rezerwację"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Zawartosc({ rezerwacje, sale }) {
    const [zakladka, ustawZakladke] = useState("oczekujace");
    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">Rezerwacje sal</span>
                <div className="w-[65px] shrink-0" />
            </div>
            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] bg-theme-slate p-2 sm:p-3 md:p-5">
                    <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] bg-theme-surface p-3 sm:p-5 md:p-7">
                        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
                            <div><h1 className="text-[26px] font-bold text-theme-text sm:text-[32px] lg:text-[40px]">Rezerwacje sal</h1><p className="mt-1 text-[13px] text-theme-muted sm:text-[14px]">Rozpatruj wnioski prowadzących i rezerwuj sale dla dziekanatu.</p></div>
                            <div className="flex min-w-0 flex-wrap border-b border-theme-muted">
                                <button type="button" onClick={() => ustawZakladke("oczekujace")} className={`flex min-h-[45px] items-center justify-center gap-2 border-b-[3px] px-3 text-[13px] font-bold sm:px-6 sm:text-[15px] ${zakladka === "oczekujace" ? "border-theme-orange text-theme-text" : "border-transparent text-theme-muted hover:text-theme-text"}`}><ClipboardList size={17} /> Oczekujące rezerwacje</button>
                                <button type="button" onClick={() => ustawZakladke("nowa")} className={`flex min-h-[45px] items-center justify-center gap-2 border-b-[3px] px-3 text-[13px] font-bold sm:px-6 sm:text-[15px] ${zakladka === "nowa" ? "border-theme-orange text-theme-text" : "border-transparent text-theme-muted hover:text-theme-text"}`}><Plus size={17} /> Nowa rezerwacja</button>
                            </div>
                            {zakladka === "oczekujace" ? <ListaOczekujacych rezerwacje={rezerwacje} /> : <FormularzRezerwacji sale={sale} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RezerwacjeSal({ rezerwacje = [], sale = [] }) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Rezerwacje sal" />
            <MenuDziekanat />
            <Zawartosc rezerwacje={rezerwacje} sale={sale} />
        </div>
    );
}
