import React, { useEffect, useMemo } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

const fieldClass =
    "block h-12 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-4 text-sm text-theme-text outline-none transition-colors focus:border-theme-orange focus:ring-2 focus:ring-theme-orange sm:text-base disabled:cursor-not-allowed disabled:opacity-60";

function Field({ label, htmlFor, error, hint, children }) {
    return (
        <div className="min-w-0">
            <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-theme-text">
                {label}
            </label>
            {children}
            {hint && <p className="mt-2 text-xs text-theme-muted">{hint}</p>}
            {error && <p className="mt-2 break-words text-xs font-medium text-red-400" role="alert">{error}</p>}
        </div>
    );
}

function Content({ budynki = [], sali = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        data: "",
        godpocz: "",
        godkon: "",
        budynek: "",
        sala: "",
    });

    const dostepneSale = useMemo(
        () => (sali ?? []).filter((s) => String(s.Budynek_idBudynek) === String(data.budynek)),
        [sali, data.budynek],
    );

    const wybranyBudynek = (budynki ?? []).find(
        (budynek) => String(budynek.idBudynek) === String(data.budynek),
    );
    const wybranaSala = dostepneSale.find(
        (sala) => String(sala.idSala) === String(data.sala),
    );
    const niepoprawneGodziny = Boolean(data.godpocz && data.godkon && data.godkon <= data.godpocz);

    const handleBudynekChange = (e) => {
        const budynek = e.target.value;
        setData((previous) => ({ ...previous, budynek, sala: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;
        if (niepoprawneGodziny) {
            toast.error("Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.");
            return;
        }
        post("/prowadzacy/tworzeniekonsultacji");
    };

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-10 w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-12 shrink-0 items-center"><BackButton back={() => window.history.back()} /></div>
                <span className="min-w-0 flex-1 text-center text-sm font-bold text-theme-text sm:text-base">Nowa konsultacja</span>
                <div className="w-12 shrink-0" />
            </div>

            <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-0 pb-3 pt-3 sm:px-2 md:px-4">
                <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-theme-slate p-3 sm:p-5 lg:p-7">
                    <section className="mb-4 rounded-2xl bg-theme-surface p-4 sm:mb-5 sm:p-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-theme-muted">Konsultacje</p>
                        <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">Utwórz konsultację</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-theme-muted sm:text-base">
                            Wybierz termin i salę, w której odbędzie się spotkanie ze studentami.
                        </p>
                    </section>

                    <form onSubmit={handleSubmit} className="min-w-0 rounded-2xl bg-theme-surface p-4 sm:p-6 lg:p-7">
                        <div className="mb-5 flex items-center gap-3 border-b border-theme-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-lg" aria-hidden="true">📅</span>
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-theme-text">Termin spotkania</h2>
                                <p className="text-xs text-theme-muted">Podaj datę oraz godziny konsultacji.</p>
                            </div>
                        </div>
                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                            <div className="sm:col-span-2">
                                <Field label="Data konsultacji" htmlFor="data-konsultacji" error={errors.data}>
                                    <input id="data-konsultacji" type="date" value={data.data} onChange={(e) => setData("data", e.target.value)} required className={fieldClass} />
                                </Field>
                            </div>
                            <Field label="Godzina rozpoczęcia" htmlFor="godzina-poczatek" error={errors.godpocz}>
                                <input id="godzina-poczatek" type="time" value={data.godpocz} onChange={(e) => setData("godpocz", e.target.value)} required className={fieldClass} />
                            </Field>
                            <Field label="Godzina zakończenia" htmlFor="godzina-koniec" error={errors.godkon || (niepoprawneGodziny ? "Godzina zakończenia musi być późniejsza niż rozpoczęcia." : null)}>
                                <input id="godzina-koniec" type="time" value={data.godkon} min={data.godpocz || undefined} onChange={(e) => setData("godkon", e.target.value)} required className={fieldClass} />
                            </Field>
                        </div>

                        <div className="mb-5 mt-8 flex items-center gap-3 border-b border-theme-muted pb-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-lg" aria-hidden="true">🏫</span>
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-theme-text">Miejsce konsultacji</h2>
                                <p className="text-xs text-theme-muted">Najpierw wybierz budynek, a następnie salę.</p>
                            </div>
                        </div>
                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                            <Field label="Budynek" htmlFor="budynek-konsultacji" error={errors.budynek}>
                                <select id="budynek-konsultacji" required value={data.budynek} onChange={handleBudynekChange} className={fieldClass}>
                                    <option value="">Wybierz budynek</option>
                                    {(budynki ?? []).map((budynek) => <option key={budynek.idBudynek} value={budynek.idBudynek}>{budynek.nazwa}</option>)}
                                </select>
                            </Field>
                            <Field label="Sala" htmlFor="sala-konsultacji" error={errors.sala} hint={!data.budynek ? "Aby wybrać salę, najpierw wskaż budynek." : dostepneSale.length === 0 ? "Brak sal w wybranym budynku." : null}>
                                <select id="sala-konsultacji" required value={data.sala} onChange={(e) => setData("sala", e.target.value)} disabled={!data.budynek || dostepneSale.length === 0} className={fieldClass}>
                                    <option value="">Wybierz salę</option>
                                    {dostepneSale.map((sala) => <option key={sala.idSala} value={sala.idSala}>{sala.numerSali}</option>)}
                                </select>
                            </Field>
                        </div>

                        {(data.data || data.godpocz || data.godkon || data.budynek || data.sala) && (
                            <div className="mt-7 min-w-0 rounded-xl border border-theme-muted bg-theme-slate p-4">
                                <h3 className="mb-2 text-sm font-bold text-theme-text">Podsumowanie konsultacji</h3>
                                <div className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-2 text-sm text-theme-muted sm:grid-cols-2">
                                    <p className="break-words">Data: <span className="font-medium text-theme-text">{data.data || "—"}</span></p>
                                    <p className="break-words">Godziny: <span className="font-medium text-theme-text">{data.godpocz || "—"} – {data.godkon || "—"}</span></p>
                                    <p className="break-words">Budynek: <span className="font-medium text-theme-text">{wybranyBudynek?.nazwa || "—"}</span></p>
                                    <p className="break-words">Sala: <span className="font-medium text-theme-text">{wybranaSala?.numerSali || "—"}</span></p>
                                </div>
                            </div>
                        )}

                        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-theme-muted pt-5 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => window.history.back()} className="min-h-11 w-full rounded-xl border border-theme-muted bg-theme-slate px-5 py-2 text-sm font-semibold text-theme-text transition-colors hover:bg-theme-panel sm:w-auto">Anuluj</button>
                            <button type="submit" disabled={processing || niepoprawneGodziny} className="min-h-11 w-full rounded-xl bg-theme-orange px-6 py-2 text-sm font-bold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{processing ? "Zapisywanie..." : "Utwórz konsultację"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default function Konsultacjaform({ budynki, sali }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;

    useEffect(() => {
        if (message) toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        if (error) toast.error(error, { position: "bottom-right", autoClose: 5000, theme: "dark" });
    }, [message, error]);

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Nowa konsultacja" />
            <MenuProwadzacy />
            <Content budynki={budynki} sali={sali} />
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
        </div>
    );
}
