import React, { useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

const fieldClass =
    "h-12 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-4 text-sm text-theme-text outline-none transition-colors focus:border-theme-orange focus:ring-2 focus:ring-theme-orange sm:text-base";
const labelClass = "mb-2 block text-sm font-semibold text-theme-text";

function Field({ id, label, error, children }) {
    return (
        <div className="min-w-0">
            <label htmlFor={id} className={labelClass}>{label}</label>
            {children}
            {error && <p className="mt-1.5 break-words text-sm text-red-400">{error}</p>}
        </div>
    );
}

function Content({ budynki = [], sali = [], zajecia = [] }) {
    const [zaznaczonyCheck, setZaznaczonyCheck] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        data: "",
        godpocz: "",
        godkon: "",
        budynek: "",
        sala: "",
        typ: "",
        zajecie: null,
    });

    const filtersal = (sali ?? []).filter(
        (s) => String(s.Budynek_idBudynek) === String(data.budynek)
    );
    const budynek = (budynki ?? []).find((b) => String(b.idBudynek) === String(data.budynek));
    const sala = filtersal.find((s) => String(s.idSala) === String(data.sala));
    const zajecie = (zajecia ?? []).find((z) => String(z.idZajęcie) === String(data.zajecie));
    const invalidHours = Boolean(data.godpocz && data.godkon && data.godkon <= data.godpocz);
    const missingZajecie = zaznaczonyCheck && !data.zajecie;

    const handleBudynekChange = (event) => {
        const nowyBudynek = event.target.value;
        setData((previous) => ({ ...previous, budynek: nowyBudynek, sala: "" }));
    };

    const handleCheckChange = (event) => {
        const checked = event.target.checked;
        setZaznaczonyCheck(checked);
        if (!checked) setData("zajecie", null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowValidation(true);
        if (processing || invalidHours || missingZajecie) return;
        post("/prowadzacy/tworzenierezerwacji");
    };

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[48px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-sm font-bold text-theme-text sm:text-base">Nowa rezerwacja</span>
                <div className="w-[48px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col pb-2 pt-3 sm:px-2 md:px-4">
                <div className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto rounded-[16px] bg-theme-slate p-3 sm:p-5 lg:p-7">
                    <div className="mx-auto max-w-[1100px]">
                        <header className="mb-5 rounded-[16px] bg-theme-surface p-4 sm:p-6">
                            <div className="mb-2 inline-flex rounded-full bg-theme-slate px-3 py-1 text-xs font-semibold text-theme-muted">Rezerwacja sali</div>
                            <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">Zarezerwuj salę</h1>
                            <p className="mt-2 text-sm text-theme-muted sm:text-base">Wybierz termin, miejsce oraz typ wydarzenia. Następnie sprawdź dane rezerwacji.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <section className="rounded-[16px] bg-theme-surface p-4 sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate font-bold text-theme-text">1</span>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold text-theme-text">Termin rezerwacji</h2>
                                        <p className="text-xs text-theme-muted sm:text-sm">Podaj datę oraz godziny rozpoczęcia i zakończenia.</p>
                                    </div>
                                </div>
                                <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
                                    <Field id="data-rezerwacji" label="Data" error={errors.data}>
                                        <input id="data-rezerwacji" type="date" value={data.data} onChange={(e) => setData("data", e.target.value)} className={fieldClass} required />
                                    </Field>
                                    <Field id="godzina-poczatek" label="Godzina rozpoczęcia" error={errors.godpocz}>
                                        <input id="godzina-poczatek" type="time" value={data.godpocz} onChange={(e) => setData("godpocz", e.target.value)} className={fieldClass} required />
                                    </Field>
                                    <Field id="godzina-koniec" label="Godzina zakończenia" error={errors.godkon}>
                                        <input id="godzina-koniec" type="time" value={data.godkon} min={data.godpocz || undefined} onChange={(e) => setData("godkon", e.target.value)} className={fieldClass} required />
                                    </Field>
                                </div>
                                {invalidHours && <p className="mt-3 text-sm text-red-400">Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.</p>}
                            </section>

                            <section className="rounded-[16px] bg-theme-surface p-4 sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate font-bold text-theme-text">2</span>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold text-theme-text">Miejsce i typ wydarzenia</h2>
                                        <p className="text-xs text-theme-muted sm:text-sm">Najpierw wybierz budynek, a następnie salę.</p>
                                    </div>
                                </div>
                                <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                                    <Field id="budynek-rezerwacji" label="Budynek" error={errors.budynek}>
                                        <select id="budynek-rezerwacji" value={data.budynek} onChange={handleBudynekChange} className={fieldClass} required>
                                            <option value="">Wybierz budynek</option>
                                            {(budynki ?? []).map((b) => <option key={b.idBudynek} value={b.idBudynek}>{b.nazwa}</option>)}
                                        </select>
                                    </Field>
                                    <Field id="sala-rezerwacji" label="Sala" error={errors.sala}>
                                        <select id="sala-rezerwacji" value={data.sala} onChange={(e) => setData("sala", e.target.value)} disabled={!data.budynek} className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-60`} required>
                                            <option value="">Wybierz salę</option>
                                            {filtersal.map((s) => <option key={s.idSala} value={s.idSala}>{s.numerSali}</option>)}
                                        </select>
                                    </Field>
                                    <div className="md:col-span-2">
                                        <Field id="typ-rezerwacji" label="Typ wydarzenia" error={errors.typ}>
                                            <select id="typ-rezerwacji" value={data.typ} onChange={(e) => setData("typ", e.target.value)} className={fieldClass} required>
                                                <option value="">Wybierz typ rezerwacji</option>
                                                {["Egzamin", "Zaliczenie", "Odrabianie", "Poprawa", "Inne"].map((typ) => <option key={typ} value={typ}>{typ}</option>)}
                                            </select>
                                        </Field>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[16px] bg-theme-surface p-4 sm:p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate font-bold text-theme-text">3</span>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold text-theme-text">Powiązanie z zajęciami</h2>
                                        <p className="text-xs text-theme-muted sm:text-sm">Opcjonalnie powiąż rezerwację z konkretnymi zajęciami.</p>
                                    </div>
                                </div>
                                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-theme-slate p-4 text-sm font-medium text-theme-text sm:text-base">
                                    <input type="checkbox" checked={zaznaczonyCheck} onChange={handleCheckChange} className="h-5 w-5 shrink-0 accent-orange-500" />
                                    <span>Dla konkretnych zajęć</span>
                                </label>
                                {zaznaczonyCheck && (
                                    <div className="mt-4">
                                        <Field id="zajecie-rezerwacji" label="Zajęcie" error={errors.zajecie}>
                                            <select id="zajecie-rezerwacji" value={data.zajecie ?? ""} onChange={(e) => setData("zajecie", e.target.value || null)} className={fieldClass} required>
                                                <option value="">Wybierz zajęcie</option>
                                                {(zajecia ?? []).map((z) => <option key={z.idZajęcie} value={z.idZajęcie}>{z.NazwaPrzedmiotu}, {z.TypZajec}</option>)}
                                            </select>
                                        </Field>
                                        {showValidation && missingZajecie && <p className="mt-2 text-sm text-red-400">Wybierz zajęcie lub odznacz tę opcję.</p>}
                                    </div>
                                )}
                            </section>

                            <section className="rounded-[16px] bg-theme-surface p-4 sm:p-6">
                                <h2 className="text-lg font-bold text-theme-text">Podsumowanie rezerwacji</h2>
                                <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        ["Data", data.data || "Nie wybrano"],
                                        ["Godziny", data.godpocz && data.godkon ? `${data.godpocz} – ${data.godkon}` : "Nie wybrano"],
                                        ["Budynek", budynek?.nazwa || "Nie wybrano"],
                                        ["Sala", sala?.numerSali || "Nie wybrano"],
                                        ["Typ wydarzenia", data.typ || "Nie wybrano"],
                                        ["Zajęcie", zaznaczonyCheck ? (zajecie ? `${zajecie.NazwaPrzedmiotu}, ${zajecie.TypZajec}` : "Nie wybrano") : "Bez powiązania"],
                                    ].map(([label, value]) => (
                                        <div key={label} className="min-w-0 rounded-xl bg-theme-slate p-3">
                                            <p className="text-xs text-theme-muted">{label}</p>
                                            <p className="mt-1 break-words font-semibold text-theme-text [overflow-wrap:anywhere]">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => window.history.back()} className="min-h-[46px] rounded-xl border border-theme-muted bg-theme-surface px-6 py-3 font-semibold text-theme-text transition-colors hover:bg-theme-panel">Anuluj</button>
                                <button type="submit" disabled={processing} className="min-h-[46px] rounded-xl bg-theme-orange px-7 py-3 font-bold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                                    {processing ? "Wysyłanie..." : "Utwórz rezerwację"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function Rezerwacja({ budynki, sali, zajecia }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;

    useEffect(() => {
        if (message) toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        if (error) toast.error(error, { position: "bottom-right", autoClose: 5000, theme: "dark" });
    }, [message, error]);

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Head title="Nowa rezerwacja" />
            <MenuProwadzacy />
            <Content budynki={budynki} sali={sali} zajecia={zajecia} />
        </div>
    );
}
