import React, { useMemo, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import themePlugin from "@fullcalendar/react/themes/classic";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";
import { CalendarDays, Plus, Pencil, Trash2, X, Loader2, Search, BookOpen, List, CalendarClock, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import BackButton from "../../Components/BackButton";

const BASE = "/dziekanat/plany-zajec";
const dni = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
const klasyPola = "h-[44px] w-full min-w-0 rounded-[10px] border border-theme-muted bg-theme-slate px-3 text-[14px] text-theme-text outline-none transition-colors focus:border-theme-orange";
const klasyLabel = "mb-2 block text-[13px] font-semibold text-theme-text";
const pierwszaData = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-"); };
const godzina = (x) => String(x || "").slice(0, 5);
const dataISO = (x) => String(x || "").slice(0, 10);
const liczba = (v) => Number(v) || 0;
const salaKlucz = (s) => `${s.Budynek_idBudynek}:${s.idSala}`;
const nazwaSali = (s) => `${s.budynek?.nazwa ?? s.nazwaBudynku ?? `Budynek ${s.Budynek_idBudynek}`} · sala ${s.numerSali ?? s.idSala}`;
const nazwaProwadzacego = (p) => [p.TytulNaukowy, p.user?.name, p.user?.surname].filter(Boolean).join(" ") || `Prowadzący #${p.idProwadzacy}`;
const pusteZajecie = (planId = "") => ({
    plany: planId ? [String(planId)] : [],
    PlanZajec_idPlanZajec: String(planId || ""),
    DzienTygodnia: "Poniedziałek",
    Parzystosc: "TygodnieAB",
    TypZajec: "Wykład",
    LiczbaGodzin: "2",
    Przedmiot_idPrzedmiot: "",
    Prowadzacy_idProwadzacy: "",
    Sala_idSala: "",
    Sala_Budynek_idBudynek: "",
    dataOd: pierwszaData(),
    dataDo: pierwszaData(),
    GodzinaRozpoczecia: "08:00",
    GodzinaZakonczenia: "09:30",
});
const pusteDanePlanu = () => ({
    rok: String(new Date().getFullYear()), Semester: "1", trybStudiow: "stacjonarne", stopien: "1", Specjalnosc: "", GrupaStudenta_idGrupaStudenta: "",
});
function Pole({ label, error, children, className = "" }) {
    return <div className={className}><label className={klasyLabel}>{label}</label>{children}{error && <p className="mt-1 text-xs text-red-500">{error}</p>}</div>;
}
function Modal({ tytul, onClose, children, szeroki = false }) {
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div role="dialog" aria-modal="true" aria-label={tytul} className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-theme-muted bg-theme-page p-4 text-theme-text shadow-2xl sm:p-6 ${szeroki ? "max-w-3xl" : "max-w-xl"}`}>
            <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-lg font-bold">{tytul}</h2><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-theme-slate" aria-label="Zamknij"><X size={19} /></button></div>
            {children}
        </div>
    </div>;
}
function FormularzPlanu({ plan, grupy, onClose, onSaved }) {
    const form = useForm(plan ? {
        rok: String(plan.rok ?? ""), Semester: String(plan.Semester ?? "1"), trybStudiow: plan.trybStudiow ?? "stacjonarne", stopien: String(plan.stopien ?? "1"), Specjalnosc: plan.Specjalnosc ?? "", GrupaStudenta_idGrupaStudenta: String(plan.GrupaStudenta_idGrupaStudenta ?? ""),
    } : pusteDanePlanu());
    const zapisz = (e) => {
        e.preventDefault();
        form.post(plan ? `${BASE}/plan/${plan.idPlanZajec}/aktualizuj` : `${BASE}/plan/dodaj`, { preserveScroll: true, onSuccess: () => { onClose(); onSaved?.(); } });
    };
    return <form onSubmit={zapisz} className="space-y-4">
        <Pole label="Grupa studencka" error={form.errors.GrupaStudenta_idGrupaStudenta}>
            <select className={klasyPola} value={form.data.GrupaStudenta_idGrupaStudenta} onChange={e => form.setData("GrupaStudenta_idGrupaStudenta", e.target.value)} required>
                <option value="">Wybierz grupę</option>{grupy.map(g => <option key={g.idGrupaStudenta} value={g.idGrupaStudenta}>{g.nazwaGrupy} · {g.typGrupy}</option>)}
            </select>
        </Pole>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Pole label="Rok" error={form.errors.rok}><input type="number" min="2000" max="2100" className={klasyPola} value={form.data.rok} onChange={e => form.setData("rok", e.target.value)} required /></Pole>
            <Pole label="Semestr" error={form.errors.Semester}><input type="number" min="1" max="12" className={klasyPola} value={form.data.Semester} onChange={e => form.setData("Semester", e.target.value)} required /></Pole>
            <Pole label="Tryb studiów" error={form.errors.trybStudiow}><select className={klasyPola} value={form.data.trybStudiow} onChange={e => form.setData("trybStudiow", e.target.value)}><option value="stacjonarne">Stacjonarne</option><option value="niestacjonarne">Niestacjonarne</option></select></Pole>
            <Pole label="Stopień" error={form.errors.stopien}><select className={klasyPola} value={form.data.stopien} onChange={e => form.setData("stopien", e.target.value)}><option value="1">I stopnia</option><option value="2">II stopnia</option><option value="3">III stopnia</option></select></Pole>
        </div>
        <Pole label="Specjalność (opcjonalnie)" error={form.errors.Specjalnosc}><input className={klasyPola} maxLength={45} value={form.data.Specjalnosc} onChange={e => form.setData("Specjalnosc", e.target.value)} /></Pole>
        {form.errors.plan && <p className="text-sm text-red-500">{form.errors.plan}</p>}
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="rounded-xl border border-theme-muted px-4 py-2.5 text-sm">Anuluj</button><button disabled={form.processing} type="submit" className="flex items-center gap-2 rounded-xl bg-theme-orange px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{form.processing && <Loader2 size={16} className="animate-spin" />}Zapisz plan</button></div>
    </form>;
}
function FormularzZajec({ zajecie, planId, sale, prowadzacy, przedmioty, onClose, wstepne = null }) {
    const rez = [...(zajecie?.rezerwacje ?? zajecie?.rezerwacja ?? [])].sort((a, b) => dataISO(a.data).localeCompare(dataISO(b.data)));
    const prowadzacyId = zajecie?.prowadzacy_ids?.[0] ?? zajecie?.prowadzacy?.[0]?.idProwadzacy ?? rez[0]?.Prowadzacy_idProwadzacy ?? "";
    const form = useForm(zajecie ? {
        ...pusteZajecie(planId),
        PlanZajec_idPlanZajec: String(planId),
        DzienTygodnia: zajecie.DzienTygodnia ?? "Poniedziałek",
        Parzystosc: zajecie.Parzystosc ?? "TygodnieAB",
        TypZajec: zajecie.TypZajec ?? "Wykład",
        LiczbaGodzin: String(zajecie.LiczbaGodzin ?? 2),
        Przedmiot_idPrzedmiot: String(zajecie.Przedmiot_idPrzedmiot ?? ""),
        Prowadzacy_idProwadzacy: String(prowadzacyId),
        Sala_idSala: String(zajecie.Sala_idSala ?? ""),
        Sala_Budynek_idBudynek: String(zajecie.Sala_Budynek_idBudynek ?? ""),
        dataOd: dataISO(rez[0]?.data) || pierwszaData(),
        dataDo: dataISO(rez.at(-1)?.data) || pierwszaData(),
        GodzinaRozpoczecia: godzina(rez[0]?.GodzinaRozpoczecia) || "08:00",
        GodzinaZakonczenia: godzina(rez[0]?.GodzinaZakonczenia) || "09:30",
    } : { ...pusteZajecie(planId), ...(wstepne ? { dataOd: wstepne.data, dataDo: wstepne.data, DzienTygodnia: dni[(new Date(`${wstepne.data}T12:00:00`).getDay() + 6) % 7], GodzinaRozpoczecia: wstepne.godz } : {}) });
    const klucz = `${form.data.Sala_Budynek_idBudynek}:${form.data.Sala_idSala}`;
    const zapisz = (e) => {
        e.preventDefault();
        const url = zajecie ? `${BASE}/${zajecie.idZajęcie}/aktualizuj` : `${BASE}/dodaj`;
        form.post(url, { preserveScroll: true, onSuccess: onClose });
    };
    const bladGlobalny = form.errors.termin || form.errors.zajecie || form.errors.plany || form.errors.dataOd;
    return <form onSubmit={zapisz} className="space-y-4">
        {bladGlobalny && <div className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500"><AlertCircle size={18} className="shrink-0" />{bladGlobalny}</div>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Pole label="Przedmiot" error={form.errors.Przedmiot_idPrzedmiot}>
                <select required className={klasyPola} value={form.data.Przedmiot_idPrzedmiot} onChange={e => form.setData("Przedmiot_idPrzedmiot", e.target.value)}><option value="">Wybierz przedmiot</option>{przedmioty.map(p => <option key={p.idPrzedmiot} value={p.idPrzedmiot}>{p.nazwa}</option>)}</select>
            </Pole>
            <Pole label="Prowadzący" error={form.errors.Prowadzacy_idProwadzacy}>
                <select required className={klasyPola} value={form.data.Prowadzacy_idProwadzacy} onChange={e => form.setData("Prowadzacy_idProwadzacy", e.target.value)}><option value="">Wybierz prowadzącego</option>{prowadzacy.map(p => <option key={p.idProwadzacy} value={p.idProwadzacy}>{nazwaProwadzacego(p)}</option>)}</select>
            </Pole>
            <Pole label="Sala" error={form.errors.Sala_idSala || form.errors.Sala_Budynek_idBudynek}>
                <select required className={klasyPola} value={klucz === ":" ? "" : klucz} onChange={e => { const [budynek, sala] = e.target.value.split(":"); form.setData(d => ({...d, Sala_idSala: sala || "", Sala_Budynek_idBudynek: budynek || ""})); }}><option value="">Wybierz salę</option>{sale.map(s => <option key={salaKlucz(s)} value={salaKlucz(s)}>{nazwaSali(s)}</option>)}</select>
            </Pole>
            <Pole label="Rodzaj zajęć" error={form.errors.TypZajec}>
                <select className={klasyPola} value={form.data.TypZajec} onChange={e => form.setData("TypZajec", e.target.value)}><option>Wykład</option><option>Ćwiczenia</option><option>Laboratorium</option><option>Projekt</option><option>Seminarium</option><option>Egzamin</option><option>Inne</option></select>
            </Pole>
            <Pole label="Dzień tygodnia" error={form.errors.DzienTygodnia}>
                <select className={klasyPola} value={form.data.DzienTygodnia} onChange={e => form.setData("DzienTygodnia", e.target.value)}>{dni.map(d => <option key={d}>{d}</option>)}</select>
            </Pole>
            <Pole label="Tygodnie" error={form.errors.Parzystosc}>
                <select className={klasyPola} value={form.data.Parzystosc} onChange={e => form.setData("Parzystosc", e.target.value)}><option value="TygodnieAB">Każdy tydzień (AB)</option><option value="TygodnieA">Tygodnie A</option><option value="TygodnieB">Tygodnie B</option></select>
            </Pole>
            <Pole label="Liczba godzin (dydaktycznych)" error={form.errors.LiczbaGodzin}><input type="number" min="1" max="24" required className={klasyPola} value={form.data.LiczbaGodzin} onChange={e => form.setData("LiczbaGodzin", e.target.value)} /></Pole>
            <div className="hidden sm:block" />
            <Pole label="Data od" error={form.errors.dataOd}><input type="date" className={klasyPola} required value={form.data.dataOd} onChange={e => form.setData("dataOd", e.target.value)} /></Pole>
            <Pole label="Data do (ta sama data = jednorazowe)" error={form.errors.dataDo}><input type="date" className={klasyPola} required min={form.data.dataOd} value={form.data.dataDo} onChange={e => form.setData("dataDo", e.target.value)} /></Pole>
            <Pole label="Godzina rozpoczęcia" error={form.errors.GodzinaRozpoczecia}><input type="time" className={klasyPola} required value={form.data.GodzinaRozpoczecia} onChange={e => form.setData("GodzinaRozpoczecia", e.target.value)} /></Pole>
            <Pole label="Godzina zakończenia" error={form.errors.GodzinaZakonczenia}><input type="time" className={klasyPola} required value={form.data.GodzinaZakonczenia} onChange={e => form.setData("GodzinaZakonczenia", e.target.value)} /></Pole>
        </div>
        {zajecie && <p className="rounded-xl bg-theme-slate p-3 text-xs text-theme-muted">Zmiana odtwarza wszystkie terminy tego zajęcia w podanym zakresie dat.</p>}
        <div className="flex justify-end gap-2 border-t border-theme-muted pt-4"><button type="button" onClick={onClose} className="rounded-xl border border-theme-muted px-4 py-2.5 text-sm">Anuluj</button><button disabled={form.processing} type="submit" className="flex items-center gap-2 rounded-xl bg-theme-orange px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{form.processing && <Loader2 size={16} className="animate-spin" />}{zajecie ? "Zapisz zmiany" : "Dodaj zajęcia"}</button></div>
    </form>;
}
function formatujGodzine(data) {
    if (!data) return "";
    return new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(data);
}
function renderujZajecie(arg) {
    const p = arg.event.extendedProps;
    const kolor = {
        Laboratorium: "bg-theme-orange",
        "Wykład": "bg-theme-violet",
        "Ćwiczenia": "bg-theme-cyan",
    }[p.typ] ?? "bg-theme-blue";
    const godziny = `${formatujGodzine(arg.event.start)} – ${formatujGodzine(arg.event.end)}`;
    return (
        <div className={`${kolor} h-full w-full overflow-hidden p-[2px] text-[10px] leading-[1.2] text-white sm:text-[11px]`}>
            <b className="break-words whitespace-normal">{arg.event.title}</b>
            {p.prowadzacy && <div className="break-words whitespace-normal">{p.prowadzacy}</div>}
            {p.parzystosc && p.parzystosc !== "Brak" && <div className="break-words whitespace-normal">{p.parzystosc}</div>}
            {p.numersali && <div className="break-words whitespace-normal">Sala {p.numersali}</div>}
            <div className="mt-[2px] whitespace-nowrap">{godziny}</div>
        </div>
    );
}
function Zawartosc({ plany = [], grupy = [], sale = [], prowadzacy = [], przedmioty = [], wybranyPlan = null, zajecia = [] }) {
    const { flash = {}, errors: bledyStrony = {} } = usePage().props;
    const [zakladka, setZakladka] = useState("kalendarz");
    const [szukaj, setSzukaj] = useState("");
    const [modalZajecie, setModalZajecie] = useState(null);
    const [modalPlan, setModalPlan] = useState(null);
    const [usuwanie, setUsuwanie] = useState(false);
    const planId = String(wybranyPlan || "");
    const grupyMapa = useMemo(() => new Map(grupy.map(g => [String(g.idGrupaStudenta), g])), [grupy]);
    const saleMapa = useMemo(() => new Map(sale.map(s => [salaKlucz(s), s])), [sale]);
    const wybrany = plany.find(p => String(p.idPlanZajec) === planId);
    const planyFiltrowane = useMemo(() => plany.filter(p => {
        const g = grupyMapa.get(String(p.GrupaStudenta_idGrupaStudenta));
        const tekst = [g?.nazwaGrupy, p.rok, p.Semester, p.trybStudiow, p.Specjalnosc].join(" ").toLocaleLowerCase("pl-PL");
        return tekst.includes(szukaj.toLocaleLowerCase("pl-PL"));
    }), [plany, grupyMapa, szukaj]);
    const wydarzenia = useMemo(() => zajecia.flatMap(z =>
        (z.rezerwacje ?? z.rezerwacja ?? [])
            .filter(r => ["Zaakceptowana", "Zatwierdzona"].includes(r.statusRezerwacji))
            .map(r => ({
                id: String(r.idRezerwacja),
                title: z.nazwaPrzedmiotu ?? z.przedmiot?.nazwa ?? "Zajęcia",
                start: `${dataISO(r.data)}T${godzina(r.GodzinaRozpoczecia)}:00`,
                end: `${dataISO(r.data)}T${godzina(r.GodzinaZakonczenia)}:00`,
                extendedProps: {
                    zajecieId: z.idZajęcie,
                    typ: z.TypZajec,
                    parzystosc: z.Parzystosc,
                    numersali: z.numerSali ?? z.Sala_idSala,
                    prowadzacy: (z.prowadzacy ?? []).map(nazwaProwadzacego).join(", "),
                },
            }))
    ), [zajecia]);
    const wybierzPlan = (id) => router.get(BASE, id ? { plan_id: id } : {}, { preserveScroll: true, preserveState: true, only: ["wybranyPlan", "zajecia"] });
    const edytujZajecie = (id) => { const z = zajecia.find(z => String(z.idZajęcie) === String(id)); if (z) setModalZajecie(z); };
    const usunZajecie = (z) => {
        if (!window.confirm(`Usunąć zajęcia „${z.nazwaPrzedmiotu ?? z.przedmiot?.nazwa ?? z.idZajęcie}” wraz ze wszystkimi terminami?`)) return;
        setUsuwanie(true);
        router.post(`${BASE}/${z.idZajęcie}/usun`, { PlanZajec_idPlanZajec: planId }, { preserveScroll: true, onFinish: () => setUsuwanie(false) });
    };
    const usunPlan = (p) => {
        if (!window.confirm(`Usunąć plan grupy ${grupyMapa.get(String(p.GrupaStudenta_idGrupaStudenta))?.nazwaGrupy ?? p.idPlanZajec}? Plan musi być pusty.`)) return;
        setUsuwanie(true);
        router.post(`${BASE}/plan/${p.idPlanZajec}/usun`, {}, { onFinish: () => setUsuwanie(false) });
    };
    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[65px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[14px] font-bold text-theme-text sm:text-[16px]">Plany zajęć</span>
                <div className="w-[65px] shrink-0" />
            </div>
            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-[15px] bg-theme-slate p-2 sm:p-3 md:p-5">
                    <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[15px] bg-theme-surface p-3 sm:p-5 md:p-7">
                        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div><div className="flex items-center gap-2"><CalendarDays className="text-theme-orange" size={25} /><h1 className="text-2xl font-bold">Plany zajęć</h1></div><p className="mt-1 text-sm text-theme-muted">Tworzenie planów, zarządzanie zajęciami i terminami sal.</p></div>
                    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setModalPlan("nowy")} className="flex items-center gap-2 rounded-xl border border-theme-muted bg-theme-slate px-4 py-2.5 text-sm font-semibold"><Plus size={17} />Nowy plan</button><button type="button" disabled={!planId} onClick={() => setModalZajecie("nowe")} className="flex items-center gap-2 rounded-xl bg-theme-orange px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Plus size={17} />Dodaj zajęcia</button></div>
                </div>
                {(flash.status || bledyStrony.plan || bledyStrony.termin || bledyStrony.zajecie) && <div className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${flash.status ? "border-green-500/30 bg-green-500/10 text-green-500" : "border-red-500/30 bg-red-500/10 text-red-500"}`}>{flash.status ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}{flash.status || bledyStrony.plan || bledyStrony.termin || bledyStrony.zajecie}</div>}
                <div className="grid min-w-0 gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
                    <aside className="min-w-0 rounded-2xl border border-theme-muted bg-theme-surface p-3 sm:p-4">
                        <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Lista planów</h2><span className="text-xs text-theme-muted">{planyFiltrowane.length}</span></div>
                        <div className="relative mb-3"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" /><input value={szukaj} onChange={e => setSzukaj(e.target.value)} placeholder="Grupa, rok, semestr..." className={`${klasyPola} pl-9`} /></div>
                        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">{planyFiltrowane.map(p => { const g = grupyMapa.get(String(p.GrupaStudenta_idGrupaStudenta)); const aktywny = planId === String(p.idPlanZajec); return <div key={p.idPlanZajec} className={`rounded-xl border p-3 ${aktywny ? "border-theme-orange bg-theme-orange/10" : "border-theme-muted"}`}><button type="button" className="w-full text-left" onClick={() => wybierzPlan(p.idPlanZajec)}><p className="truncate text-sm font-bold">{g?.nazwaGrupy ?? `Grupa #${p.GrupaStudenta_idGrupaStudenta}`}</p><p className="mt-1 text-xs text-theme-muted">{p.rok} · sem. {p.Semester} · {p.trybStudiow}</p>{p.Specjalnosc && <p className="mt-1 truncate text-xs text-theme-muted">{p.Specjalnosc}</p>}</button><div className="mt-2 flex justify-end gap-1"><button type="button" title="Edytuj plan" onClick={() => setModalPlan(p)} className="rounded-lg p-2 hover:bg-theme-slate"><Pencil size={15} /></button><button type="button" title="Usuń plan" disabled={usuwanie} onClick={() => usunPlan(p)} className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"><Trash2 size={15} /></button></div></div>; })}{planyFiltrowane.length === 0 && <p className="py-8 text-center text-sm text-theme-muted">Nie znaleziono planów.</p>}</div>
                    </aside>
                    <section className="min-w-0 rounded-2xl border border-theme-muted bg-theme-surface p-3 sm:p-4">
                        {!planId ? <div className="flex min-h-[450px] flex-col items-center justify-center gap-3 text-center"><CalendarDays size={42} className="text-theme-muted" /><h2 className="font-semibold">Wybierz plan zajęć</h2><p className="max-w-sm text-sm text-theme-muted">Wybierz grupę po lewej stronie, aby zobaczyć kalendarz i zarządzać zajęciami.</p></div> : <>
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h2 className="truncate text-base font-bold">{grupyMapa.get(String(wybrany?.GrupaStudenta_idGrupaStudenta))?.nazwaGrupy ?? `Plan #${planId}`}</h2><p className="text-xs text-theme-muted">{zajecia.length} rodzajów zajęć · {wydarzenia.length} terminów</p></div><div className="flex rounded-xl border border-theme-muted bg-theme-slate p-1"><button type="button" onClick={() => setZakladka("kalendarz")} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold ${zakladka === "kalendarz" ? "bg-theme-surface text-theme-text" : "text-theme-muted"}`}><CalendarDays size={15} />Kalendarz</button><button type="button" onClick={() => setZakladka("lista")} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold ${zakladka === "lista" ? "bg-theme-surface text-theme-text" : "text-theme-muted"}`}><List size={15} />Lista</button></div></div>
                            {zakladka === "kalendarz" ? (
                                <div className="min-w-0 overflow-hidden rounded-xl border border-theme-muted bg-theme-page">
                                    <div className="h-[520px] w-full sm:h-[650px] lg:h-[calc(100dvh-260px)] lg:min-h-[600px]">
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
                                                const szerokosc = window.innerWidth;
                                                const widok = szerokosc < 480 ? "timeGridOneDay" : szerokosc < 768 ? "timeGridTwoDay" : szerokosc < 1200 ? "timeGridThreeDay" : "timeGridFourDay";
                                                if (arg.view.type !== widok) arg.view.calendar.changeView(widok);
                                            }}
                                            events={wydarzenia}
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
                                            firstDay={1}
                                            eventContent={renderujZajecie}
                                            eventClick={(arg) => edytujZajecie(arg.event.extendedProps.zajecieId)}
                                        />
                                    </div>
                                </div>
                            ) : <div className="space-y-3">{zajecia.map(z => { const r = z.rezerwacje ?? z.rezerwacja ?? []; return <div key={z.idZajęcie} className="flex flex-col gap-3 rounded-xl border border-theme-muted p-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-semibold">{z.nazwaPrzedmiotu ?? z.przedmiot?.nazwa ?? `Zajęcie #${z.idZajęcie}`}</p><p className="mt-1 text-xs text-theme-muted">{z.TypZajec} · {z.DzienTygodnia} · {z.Parzystosc} · sala {z.numerSali ?? z.Sala_idSala}</p><p className="mt-1 text-xs text-theme-muted">{r.length} terminów{r[0] ? ` · ${godzina(r[0].GodzinaRozpoczecia)}–${godzina(r[0].GodzinaZakonczenia)}` : ""}</p></div><div className="flex gap-2"><button type="button" onClick={() => edytujZajecie(z.idZajęcie)} className="flex items-center gap-1 rounded-lg border border-theme-muted px-3 py-2 text-xs font-semibold"><Pencil size={14} />Edytuj</button><button type="button" disabled={usuwanie} onClick={() => usunZajecie(z)} className="flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-500"><Trash2 size={14} />Usuń</button></div></div>; })}{zajecia.length === 0 && <p className="py-12 text-center text-sm text-theme-muted">Brak zajęć w wybranym planie.</p>}</div>}
                        </>}
                    </section>
                </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalPlan && <Modal tytul={modalPlan === "nowy" ? "Nowy plan zajęć" : "Edytuj plan zajęć"} onClose={() => setModalPlan(null)}><FormularzPlanu key={modalPlan === "nowy" ? "nowy" : modalPlan.idPlanZajec} plan={modalPlan === "nowy" ? null : modalPlan} grupy={grupy} onClose={() => setModalPlan(null)} /></Modal>}
        {modalZajecie && <Modal szeroki tytul={modalZajecie === "nowe" || modalZajecie.__nowe ? "Dodaj zajęcia" : "Edytuj zajęcia"} onClose={() => setModalZajecie(null)}><FormularzZajec key={modalZajecie === "nowe" ? "nowe" : modalZajecie.__nowe ? `data-${modalZajecie.data}` : modalZajecie.idZajęcie} zajecie={modalZajecie === "nowe" || modalZajecie.__nowe ? null : modalZajecie} planId={planId} sale={sale} prowadzacy={prowadzacy} przedmioty={przedmioty} wstepne={modalZajecie.__nowe ? modalZajecie : null} onClose={() => setModalZajecie(null)} /></Modal>}
        </div>
    );
}

export default function PlanyZajec(props) {
    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Plany zajęć" />
            <MenuDziekanat />
            <Zawartosc {...props} />
        </div>
    );
}
