import React, { useEffect } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { useMask } from "@react-input/mask";
import { ToastContainer, toast } from "react-toastify";

const fieldClass =
    "h-12 w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-4 text-sm text-theme-text outline-none transition-colors focus:border-theme-orange focus:ring-2 focus:ring-theme-orange sm:text-base";
const labelClass = "mb-2 block text-sm font-semibold text-theme-text";

function Field({ label, error, children, htmlFor }) {
    return (
        <div className="min-w-0">
            <label htmlFor={htmlFor} className={labelClass}>{label}</label>
            {children}
            {error && <p className="mt-1.5 break-words text-sm text-red-400">{error}</p>}
        </div>
    );
}

function Content({ przedmioty = [], kierunki = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nazwa: "",
        kod: "",
        semester: "",
        przedmiot: "",
        kierunek: "",
    });

    const kodref = useMask({
        mask: "______",
        replacement: { _: /[A-Za-z0-9]/ },
    });

    const selectedKierunek = (kierunki ?? []).find(
        (item) => String(item.idKierunek) === String(data.kierunek)
    );
    const selectedPrzedmiot = (przedmioty ?? []).find(
        (item) => String(item.idPrzedmiot) === String(data.przedmiot)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;
        if (data.kod.length !== 6) {
            toast.error("Kod kursu musi mieć 6 znaków.");
            return;
        }
        if (window.confirm("Czy na pewno chcesz utworzyć kurs?")) {
            post("/prowadzacy/tworzeniekursu");
        }
    };

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-10 w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[46px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-sm font-bold text-theme-text sm:text-base">
                    Tworzenie kursu
                </span>
                <div className="w-[46px] shrink-0" />
            </div>

            <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-0 pb-3 pt-3 sm:px-2 md:px-4">
                <div className="mx-auto flex w-full max-w-[1220px] min-w-0 flex-col gap-4 sm:gap-5">
                    <header className="rounded-2xl bg-theme-surface px-4 py-5 sm:px-6 sm:py-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-theme-muted">Zarządzanie kursami</span>
                        <h1 className="mt-1 break-words text-2xl font-bold text-theme-text sm:text-3xl">
                            Utwórz nowy kurs
                        </h1>
                        <p className="mt-2 text-sm text-theme-muted sm:text-base">
                            Uzupełnij podstawowe informacje, wybierz kierunek i przedmiot, a następnie utwórz kurs.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4 sm:gap-5">
                        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
                            <section className="min-w-0 rounded-2xl bg-theme-surface p-4 sm:p-6">
                                <div className="mb-5 flex min-w-0 items-start gap-3 border-b border-theme-muted pb-4">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-lg text-theme-text">01</span>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold text-theme-text">Dane kursu</h2>
                                        <p className="mt-1 text-sm text-theme-muted">Nazwa, kod dostępu i semestr</p>
                                    </div>
                                </div>
                                <div className="flex min-w-0 flex-col gap-5">
                                    <Field label="Nazwa kursu" htmlFor="nazwa-kursu" error={errors.nazwa}>
                                        <input id="nazwa-kursu" type="text" required value={data.nazwa}
                                            onChange={(e) => setData("nazwa", e.target.value)}
                                            placeholder="Np. Programowanie aplikacji webowych" className={fieldClass} />
                                    </Field>
                                    <Field label="Kod kursu" htmlFor="kod-kursu" error={errors.kod}>
                                        <input id="kod-kursu" ref={kodref} type="text" required
                                            minLength={6} maxLength={6} value={data.kod}
                                            onChange={(e) => setData("kod", e.target.value)}
                                            placeholder="6 znaków, np. ABC123" autoComplete="off"
                                            className={`${fieldClass} font-semibold tracking-wider`} />
                                        <p className="mt-1.5 text-xs text-theme-muted">
                                            Kod służy studentom do dołączania do kursu ({data.kod.length}/6 znaków).
                                        </p>
                                    </Field>
                                    <Field label="Semestr" htmlFor="semestr-kursu" error={errors.semester}>
                                        <input id="semestr-kursu" type="number" min={1} max={10} required
                                            value={data.semester} onChange={(e) => setData("semester", e.target.value)}
                                            placeholder="Wybierz numer semestru (1–10)" className={fieldClass} />
                                    </Field>
                                </div>
                            </section>

                            <section className="min-w-0 rounded-2xl bg-theme-surface p-4 sm:p-6">
                                <div className="mb-5 flex min-w-0 items-start gap-3 border-b border-theme-muted pb-4">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-lg text-theme-text">02</span>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold text-theme-text">Przypisanie kursu</h2>
                                        <p className="mt-1 text-sm text-theme-muted">Kierunek studiów i przedmiot</p>
                                    </div>
                                </div>
                                <div className="flex min-w-0 flex-col gap-5">
                                    <Field label="Kierunek" htmlFor="kierunek-kursu" error={errors.kierunek}>
                                        <select id="kierunek-kursu" required value={data.kierunek}
                                            onChange={(e) => setData("kierunek", e.target.value)} className={fieldClass}>
                                            <option value="">Wybierz kierunek</option>
                                            {(kierunki ?? []).map((kierunek) => (
                                                <option key={kierunek.idKierunek} value={kierunek.idKierunek}>
                                                    {kierunek.nazwa}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Przedmiot" htmlFor="przedmiot-kursu" error={errors.przedmiot}>
                                        <select id="przedmiot-kursu" required value={data.przedmiot}
                                            onChange={(e) => setData("przedmiot", e.target.value)} className={fieldClass}>
                                            <option value="">Wybierz przedmiot</option>
                                            {(przedmioty ?? []).map((przedmiot) => (
                                                <option key={przedmiot.idPrzedmiot} value={przedmiot.idPrzedmiot}>
                                                    {przedmiot.nazwa}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <div className="rounded-xl bg-theme-slate p-4 text-sm text-theme-muted">
                                        Sprawdź, czy wybierasz właściwy kierunek i przedmiot. Te dane zostaną przypisane do nowego kursu.
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section className="min-w-0 rounded-2xl bg-theme-surface p-4 sm:p-6">
                            <div className="mb-4 flex items-center gap-3 border-b border-theme-muted pb-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-slate text-lg text-theme-text">03</span>
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold text-theme-text">Podsumowanie</h2>
                                    <p className="text-sm text-theme-muted">Sprawdź dane przed utworzeniem kursu</p>
                                </div>
                            </div>
                            <dl className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {[
                                    ["Nazwa", data.nazwa],
                                    ["Kod", data.kod],
                                    ["Semestr", data.semester ? `Semestr ${data.semester}` : ""],
                                    ["Kierunek", selectedKierunek?.nazwa],
                                    ["Przedmiot", selectedPrzedmiot?.nazwa],
                                ].map(([label, value]) => (
                                    <div key={label} className="min-w-0 rounded-xl bg-theme-slate p-3.5">
                                        <dt className="text-xs font-medium text-theme-muted">{label}</dt>
                                        <dd className="mt-1 break-words font-semibold text-theme-text [overflow-wrap:anywhere]">
                                            {value || "Nie wybrano"}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => window.history.back()}
                                    className="min-h-[46px] rounded-xl border border-theme-muted bg-theme-slate px-6 py-3 font-semibold text-theme-text transition-colors hover:bg-theme-panel">
                                    Anuluj
                                </button>
                                <button type="submit" disabled={processing}
                                    className="min-h-[46px] rounded-xl bg-theme-orange px-6 py-3 font-bold text-theme-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                                    {processing ? "Tworzenie..." : "+ Utwórz kurs"}
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default function TworzenieKursu({ przedmioty, kierunki }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;

    useEffect(() => {
        if (message) toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        if (error) toast.error(error, { position: "bottom-right", autoClose: 5000, theme: "dark" });
    }, [message, error]);

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}
                newestOnTop={false} closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Head title="Tworzenie kursu" />
            <MenuProwadzacy />
            <Content przedmioty={przedmioty} kierunki={kierunki} />
        </div>
    );
}
