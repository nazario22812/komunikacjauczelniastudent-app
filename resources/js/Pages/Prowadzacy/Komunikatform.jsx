import React, { useEffect, useMemo } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import BackButton from "../../Components/BackButton";
import { ToastContainer, toast } from "react-toastify";

const TARGET_OPTIONS = [
    { value: "kierunek", label: "Kierunek", description: "Studenci wybranego kierunku" },
    { value: "kurs", label: "Kurs", description: "Uczestnicy wybranego kursu" },
    { value: "grupa", label: "Grupa", description: "Wybrana grupa studentów" },
    { value: "student", label: "Student", description: "Jeden student według indeksu" },
];

const inputClass =
    "w-full min-w-0 rounded-xl border border-theme-muted bg-theme-slate px-4 py-3 text-sm text-theme-text outline-none transition-colors placeholder:text-theme-muted focus:border-theme-orange focus:ring-2 focus:ring-theme-orange sm:text-base";
const labelClass = "mb-2 block text-sm font-semibold text-theme-text";

function FieldError({ children }) {
    return children ? (
        <p role="alert" className="mt-2 break-words text-sm text-red-400">{children}</p>
    ) : null;
}

function SectionHeading({ number, title, description }) {
    return (
        <div className="mb-5 flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-orange text-sm font-bold text-theme-text">
                {number}
            </span>
            <div className="min-w-0">
                <h2 className="break-words text-lg font-bold text-theme-text sm:text-xl">{title}</h2>
                <p className="mt-1 text-sm text-theme-muted">{description}</p>
            </div>
        </div>
    );
}

function Content({ kursy = [], kierunki = [], grupy = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        target_type: "kurs",
        target_id: "",
        tytul: "",
        tresc: "",
    });

    const targetItems = useMemo(() => {
        if (data.target_type === "kierunek") {
            return (kierunki ?? []).map((k) => ({ id: k.idKierunek, name: k.nazwa }));
        }
        if (data.target_type === "kurs") {
            return (kursy ?? []).map((k) => ({ id: k.idkurs, name: k.nazwa }));
        }
        if (data.target_type === "grupa") {
            return (grupy ?? []).map((g) => ({ id: g.idGrupaStudenta, name: g.nazwaGrupy }));
        }
        return [];
    }, [data.target_type, kierunki, kursy, grupy]);

    const selectedTarget = data.target_type === "student"
        ? data.target_id.trim()
        : targetItems.find((item) => String(item.id) === String(data.target_id))?.name;

    const targetLabel = TARGET_OPTIONS.find((option) => option.value === data.target_type)?.label ?? "Adresat";

    const handleTypeChange = (type) => {
        setData((previous) => ({
            ...previous,
            target_type: type,
            target_id: "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;
        post("/prowadzacy/komunikaty", {
            onSuccess: () => reset(),
        });
    };

    return (
        <main className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-10 w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-sm font-bold text-theme-text sm:text-base">Nowy komunikat</span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-0 pb-3 pt-3 sm:px-2 md:px-4">
                <div className="mx-auto w-full max-w-[1160px] min-w-0 space-y-4">
                    <header className="rounded-2xl bg-theme-surface p-5 sm:p-7">
                        <div className="mb-2 inline-flex rounded-full bg-theme-slate px-3 py-1 text-xs font-semibold text-theme-muted">
                            KOMUNIKACJA ZE STUDENTAMI
                        </div>
                        <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl">Nowy komunikat</h1>
                        <p className="mt-2 max-w-[660px] text-sm leading-relaxed text-theme-muted sm:text-base">
                            Wybierz odbiorców, uzupełnij temat i treść, a następnie wyślij wiadomość.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <section className="rounded-2xl bg-theme-surface p-4 sm:p-6">
                            <SectionHeading number="01" title="Odbiorcy" description="Wybierz, do kogo trafi komunikat." />
                            <fieldset className="min-w-0">
                                <legend className="mb-3 text-sm font-medium text-theme-muted">Typ adresata</legend>
                                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                    {TARGET_OPTIONS.map((option) => {
                                        const active = data.target_type === option.value;
                                        return (
                                            <label
                                                key={option.value}
                                                className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4 ${
                                                    active
                                                        ? "border-theme-orange bg-theme-slate"
                                                        : "border-theme-muted bg-theme-panel hover:border-theme-orange"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="targetType"
                                                    value={option.value}
                                                    checked={active}
                                                    onChange={() => handleTypeChange(option.value)}
                                                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-orange-500"
                                                />
                                                <span className="min-w-0">
                                                    <span className="block break-words text-sm font-semibold text-theme-text sm:text-base">{option.label}</span>
                                                    <span className="mt-1 block text-xs leading-relaxed text-theme-muted">{option.description}</span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <FieldError>{errors.target_type}</FieldError>
                            </fieldset>

                            <div className="mt-5 min-w-0">
                                <label htmlFor="adresat-komunikatu" className={labelClass}>
                                    {data.target_type === "student" ? "Numer indeksu studenta" : `Wybierz: ${targetLabel.toLowerCase()}`}
                                </label>
                                {data.target_type === "student" ? (
                                    <input
                                        id="adresat-komunikatu"
                                        type="text"
                                        required
                                        autoComplete="off"
                                        placeholder="Wpisz indeks studenta"
                                        value={data.target_id}
                                        onChange={(e) => setData("target_id", e.target.value)}
                                        className={inputClass}
                                    />
                                ) : (
                                    <select
                                        id="adresat-komunikatu"
                                        required
                                        value={data.target_id}
                                        onChange={(e) => setData("target_id", e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="">Wybierz {targetLabel.toLowerCase()}</option>
                                        {targetItems.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                )}
                                <FieldError>{errors.target_id}</FieldError>
                            </div>
                        </section>

                        <section className="rounded-2xl bg-theme-surface p-4 sm:p-6">
                            <SectionHeading number="02" title="Treść komunikatu" description="Zadbaj o jasny temat i czytelną wiadomość." />
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="temat-komunikatu" className={labelClass}>Temat</label>
                                    <input
                                        id="temat-komunikatu"
                                        type="text"
                                        required
                                        placeholder="Wpisz temat komunikatu..."
                                        value={data.tytul}
                                        onChange={(e) => setData("tytul", e.target.value)}
                                        className={inputClass}
                                    />
                                    <FieldError>{errors.tytul}</FieldError>
                                </div>
                                <div>
                                    <label htmlFor="tresc-komunikatu" className={labelClass}>Treść komunikatu</label>
                                    <textarea
                                        id="tresc-komunikatu"
                                        required
                                        rows={7}
                                        placeholder="Wpisz treść wiadomości dla studentów..."
                                        value={data.tresc}
                                        onChange={(e) => setData("tresc", e.target.value)}
                                        className={`${inputClass} custom-scrollbar min-h-[180px] resize-y`}
                                    />
                                    <p className="mt-2 text-right text-xs text-theme-muted">{data.tresc.length} znaków</p>
                                    <FieldError>{errors.tresc}</FieldError>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl bg-theme-surface p-4 sm:p-6">
                            <SectionHeading number="03" title="Podsumowanie" description="Sprawdź odbiorcę i wiadomość przed wysłaniem." />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="min-w-0 rounded-xl bg-theme-slate p-4">
                                    <p className="text-xs font-medium text-theme-muted">Adresat</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-theme-text">{targetLabel}</p>
                                    <p className="mt-1 break-words text-sm text-theme-muted">{selectedTarget || "Nie wybrano adresata"}</p>
                                </div>
                                <div className="min-w-0 rounded-xl bg-theme-slate p-4">
                                    <p className="text-xs font-medium text-theme-muted">Temat</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-theme-text">{data.tytul.trim() || "Nie wpisano tematu"}</p>
                                </div>
                            </div>
                            <div className="mt-3 min-w-0 rounded-xl bg-theme-slate p-4">
                                <p className="text-xs font-medium text-theme-muted">Podgląd wiadomości</p>
                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-theme-text">{data.tresc.trim() || "Tutaj pojawi się treść komunikatu."}</p>
                            </div>
                            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="min-h-[46px] rounded-xl border border-theme-muted bg-theme-slate px-6 py-3 text-sm font-semibold text-theme-text transition-colors hover:bg-theme-panel sm:text-base"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="min-h-[46px] rounded-xl bg-theme-orange px-7 py-3 text-sm font-bold text-theme-text transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                                >
                                    {processing ? "Wysyłanie..." : "Wyślij komunikat"}
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default function Komunikatform({ kursy, kierunki, grupy }) {
    const props = usePage().props;
    const message = props.flash?.status || props.status;
    const error = props.flash?.error || props.error;

    useEffect(() => {
        if (message) {
            toast.info(message, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        }
        if (error) {
            toast.error(error, { position: "bottom-right", autoClose: 5000, theme: "dark" });
        }
    }, [message, error]);

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
            <Head title="Nowy komunikat" />
            <MenuProwadzacy />
            <Content kursy={kursy} kierunki={kierunki} grupy={grupy} />
        </div>
    );
}
