import React, { useEffect, useMemo, useState } from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import BackButton from "../../Components/BackButton";
import { Head, router, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

const teacherName = (kurs) =>
    [
        kurs.prowadzacy?.TytulNaukowy,
        kurs.prowadzacy?.user?.name,
        kurs.prowadzacy?.user?.surname,
    ]
        .filter(Boolean)
        .join(" ") || "Nie przypisano prowadzącego";

function Content({
    mojekursy = [],
    wszystkiekursy = [],
    listasemestrow = [],
    kierunekstudenta,
}) {
    const [pokaz, setpokaz] = useState(false);
    const [znalezionyKurs, setznalezionyKurs] = useState("");
    const [szukaj, setSzukaj] = useState("");
    const [szukajWszystkie, setSzukajWszystkie] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleClose = () => setpokaz(false);
    const handleOpen = () => setpokaz(true);

    const znajdzKurs = () => {
        const kod = znalezionyKurs.trim();
        if (!kod) {
            toast.info("Wprowadź kod kursu");
            return;
        }
        const kurs = (wszystkiekursy ?? []).find((k) =>
            String(k.kod ?? "").trim() === kod
        );
        if (kurs) {
            router.post(`/student/mojekursy/${kurs.idkurs}`, {}, {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            });
        } else {
            toast.error("Nie znaleziono kursu");
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        znajdzKurs();
    };

    const filtrowaneKursy = useMemo(() => {
        const tekst = szukaj.trim().toLocaleLowerCase("pl-PL");
        if (!tekst) return mojekursy ?? [];
        return (mojekursy ?? []).filter((kurs) =>
            [kurs.nazwa, kurs.kod, teacherName(kurs), kurs.Semester]
                .some((pole) => String(pole ?? "").toLocaleLowerCase("pl-PL").includes(tekst))
        );
    }, [mojekursy, szukaj]);

    const semestry = useMemo(() => {
        const wartosci = (listasemestrow ?? []).map((x) => x.Semester);
        (wszystkiekursy ?? []).forEach((kurs) => wartosci.push(kurs.Semester));
        return [...new Set(wartosci.filter((x) => x !== null && x !== undefined))]
            .sort((a, b) => Number(b) - Number(a));
    }, [listasemestrow, wszystkiekursy]);

    useEffect(() => {
        if (!pokaz) return;
        const onKeyDown = (e) => e.key === "Escape" && handleClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [pokaz]);

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <div className="mx-auto flex h-[42px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">Moje kursy</span>
                <div className="w-[42px] shrink-0" />
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-b-[10px] pb-2 pt-3 sm:px-2 md:px-4">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[15px] bg-theme-slate p-2 sm:p-3 md:p-5">
                    <div className="flex min-w-0 shrink-0 flex-col gap-4 rounded-[14px] bg-theme-surface p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <h1 className="break-words text-2xl font-bold text-theme-text sm:text-3xl lg:text-[36px]">Twoje kursy</h1>
                            <p className="mt-1 break-words text-sm text-theme-muted">
                                Przeglądaj kursy, materiały i zadania oraz dołączaj do nowych kursów.
                            </p>
                            <p className="mt-2 text-xs font-medium text-theme-muted">
                                Zapisane kursy: <span className="font-bold text-theme-text">{(mojekursy ?? []).length}</span>
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleOpen}
                            className="w-full shrink-0 rounded-[12px] bg-theme-orange px-5 py-3 text-sm font-semibold text-theme-text transition hover:brightness-110 sm:w-auto"
                        >
                            Lista wszystkich kursów
                        </button>
                    </div>

                    <div className="mt-3 grid min-w-0 shrink-0 grid-cols-1 gap-3 rounded-[14px] bg-theme-surface p-3 sm:p-4 lg:grid-cols-2 lg:gap-4">
                        <div className="min-w-0">
                            <label htmlFor="szukaj-kurs" className="mb-2 block text-xs font-semibold text-theme-muted">Szukaj w moich kursach</label>
                            <div className="flex min-w-0 overflow-hidden rounded-[12px] border border-theme-muted bg-theme-slate focus-within:border-theme-orange">
                                <input
                                    id="szukaj-kurs"
                                    value={szukaj}
                                    onChange={(e) => setSzukaj(e.target.value)}
                                    placeholder="Nazwa, prowadzący, semestr..."
                                    className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-theme-text outline-none placeholder:text-theme-muted"
                                />
                                {szukaj && <button type="button" onClick={() => setSzukaj("")} className="shrink-0 px-3 text-xs text-theme-muted hover:text-theme-text">Wyczyść</button>}
                            </div>
                        </div>
                        <form onSubmit={handleSearchSubmit} className="min-w-0">
                            <label htmlFor="kod-kursu" className="mb-2 block text-xs font-semibold text-theme-muted">Dołącz do kursu za pomocą kodu</label>
                            <div className="flex min-w-0 gap-2">
                                <input
                                    id="kod-kursu"
                                    type="text"
                                    value={znalezionyKurs}
                                    maxLength={6}
                                    onChange={(e) => setznalezionyKurs(e.target.value)}
                                    placeholder="Wprowadź kod kursu"
                                    className="h-11 min-w-0 flex-1 rounded-[12px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                />
                                <button type="submit" disabled={processing} className="h-11 shrink-0 rounded-[12px] bg-theme-orange px-4 text-sm font-semibold text-theme-text transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                                    {processing ? "Zapisywanie..." : "Dołącz"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="custom-scrollbar mt-3 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[14px] bg-theme-surface p-3 sm:p-4">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-lg font-bold text-theme-text sm:text-xl">Lista kursów</h2>
                            <span className="text-xs text-theme-muted">Wyświetlono {filtrowaneKursy.length} z {(mojekursy ?? []).length}</span>
                        </div>
                        {filtrowaneKursy.length > 0 ? (
                            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {filtrowaneKursy.map((kurs) => (
                                    <div key={kurs.idkurs ?? kurs.idKurs ?? kurs.id} className="flex min-w-0 flex-col justify-between gap-5 rounded-[14px] border border-theme-muted bg-theme-slate p-4 transition-colors hover:border-theme-orange sm:p-5">
                                        <div className="min-w-0">
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                                <span className="rounded-lg bg-theme-surface px-2.5 py-1 text-xs font-semibold text-theme-muted">{kurs.Semester ? `Semestr ${kurs.Semester}` : "Kurs"}</span>
                                                {kurs.kod && <span className="break-all text-xs text-theme-muted">Kod: {kurs.kod}</span>}
                                            </div>
                                            <h3 className="break-words [overflow-wrap:anywhere] text-lg font-bold leading-snug text-theme-text">{kurs.nazwa}</h3>
                                            <p className="mt-3 break-words text-sm leading-relaxed text-theme-muted">Prowadzący: <span className="text-theme-text">{teacherName(kurs)}</span></p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => router.get(`/student/mojekursy/${kurs.nazwa}/${kurs.idkurs}`)}
                                            className="w-full rounded-[11px] bg-theme-surface px-4 py-2.5 text-sm font-semibold text-theme-text transition-colors hover:bg-theme-panel"
                                        >
                                            Otwórz kurs
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[190px] flex-col items-center justify-center gap-3 px-3 text-center">
                                <span className="text-3xl" aria-hidden="true">📚</span>
                                <p className="text-base font-semibold text-theme-text">{(mojekursy ?? []).length === 0 ? "Nie masz jeszcze kursów" : "Nie znaleziono kursów"}</p>
                                <p className="max-w-md text-sm text-theme-muted">{(mojekursy ?? []).length === 0 ? "Dołącz do kursu za pomocą kodu lub przejrzyj listę dostępnych kursów." : "Zmień wyszukiwaną frazę, aby zobaczyć inne kursy."}</p>
                                {(mojekursy ?? []).length === 0 && <button type="button" onClick={handleOpen} className="rounded-[12px] bg-theme-orange px-4 py-2 text-sm font-semibold text-theme-text">Przeglądaj kursy</button>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {pokaz && <div className="fixed inset-0 z-40 bg-black/70" onClick={handleClose} />}
            <div className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[520px] min-w-0 flex-col border-l border-theme-muted bg-theme-page p-4 text-theme-text shadow-2xl transition-transform duration-300 sm:p-6 ${pokaz ? "translate-x-0" : "translate-x-full"}`} aria-hidden={!pokaz} inert={!pokaz} role="dialog" aria-modal={pokaz} aria-label="Wszystkie kursy">
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-theme-muted pb-4">
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-theme-text">Wszystkie kursy</h2>
                        <p className="mt-1 break-words text-sm text-theme-muted">{kierunekstudenta?.nazwa ?? "Dostępne kursy"}</p>
                    </div>
                    <button type="button" onClick={handleClose} aria-label="Zamknij" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-slate text-xl text-theme-text hover:bg-theme-panel">×</button>
                </div>
                <div className="mt-4 shrink-0">
                    <label htmlFor="szukaj-wszystkie" className="mb-2 block text-xs font-semibold text-theme-muted">Szukaj kursu</label>
                    <input id="szukaj-wszystkie" value={szukajWszystkie} onChange={(e) => setSzukajWszystkie(e.target.value)} placeholder="Przedmiot, nazwa, prowadzący..." className="h-11 w-full min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange" />
                </div>
                <div className="custom-scrollbar mt-4 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                    {semestry.map((semestr) => {
                        const kursySemestru = (wszystkiekursy ?? []).filter((kurs) =>
                            String(kurs.Semester) === String(semestr) &&
                            [kurs.nazwa, kurs.przedmiot?.nazwa, teacherName(kurs), kurs.kod]
                                .some((v) => String(v ?? "").toLocaleLowerCase("pl-PL").includes(szukajWszystkie.trim().toLocaleLowerCase("pl-PL")))
                        );
                        if (!kursySemestru.length) return null;
                        const uniqPrzedmioty = Array.from(new Map(kursySemestru.map((kurs) => [kurs.Przedmiot_idPrzedmiot ?? kurs.przedmiot?.idPrzedmiot ?? kurs.idkurs, kurs.przedmiot ?? { idPrzedmiot: kurs.Przedmiot_idPrzedmiot, nazwa: "Inne kursy" }])).values());
                        return (
                            <section key={semestr} className="mb-5 rounded-[14px] bg-theme-surface p-3 sm:p-4">
                                <h3 className="mb-4 text-base font-bold text-theme-text">Semestr {semestr}</h3>
                                <div className="flex flex-col gap-4">
                                    {uniqPrzedmioty.map((przedmiot) => (
                                        <div key={przedmiot.idPrzedmiot ?? przedmiot.nazwa} className="min-w-0">
                                            <h4 className="mb-2 break-words text-sm font-semibold text-theme-muted">{przedmiot.nazwa}</h4>
                                            <div className="flex flex-col gap-2">
                                                {kursySemestru.filter((kurs) => String(kurs.Przedmiot_idPrzedmiot ?? kurs.przedmiot?.idPrzedmiot) === String(przedmiot.idPrzedmiot)).map((kurs) => (
                                                    <button key={kurs.idkurs} type="button" onClick={() => router.post(`/student/checkkurs/${kurs.idkurs}`)} className="min-w-0 rounded-[11px] border border-theme-muted bg-theme-slate p-3 text-left transition-colors hover:border-theme-orange hover:bg-theme-panel">
                                                        <span className="block break-words text-sm font-semibold text-theme-text">{kurs.nazwa}</span>
                                                        <span className="mt-1 block break-words text-xs text-theme-muted">{teacherName(kurs)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                    {!(wszystkiekursy ?? []).some((kurs) => [kurs.nazwa, kurs.przedmiot?.nazwa, teacherName(kurs), kurs.kod].some((x) => String(x ?? "").toLocaleLowerCase("pl-PL").includes(szukajWszystkie.trim().toLocaleLowerCase("pl-PL")))) && (
                        <div className="py-12 text-center text-sm text-theme-muted">Brak kursów pasujących do wyszukiwania</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Koddokursu({ isOpen, onClose, zwroconyKurs, wszystkiekursy = [] }) {
    const [znalezionyKurs, setznalezionyKurs] = useState("");
    const [processing, setProcessing] = useState(false);

    const znajdzKurs = () => {
        const kurs = (wszystkiekursy ?? []).find((k) => String(k.kod ?? "").trim() === znalezionyKurs.trim());
        if (kurs) {
            router.post(`/student/mojekursy/${kurs.idkurs}`, {}, {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: onClose,
            });
        } else {
            toast.error("Nie znaleziono kursu");
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5" role="dialog" aria-modal="true" aria-label="Podaj kod do kursu">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative z-10 w-full max-w-[540px] rounded-[16px] border border-theme-muted bg-theme-page p-4 text-theme-text shadow-2xl sm:p-6">
                <div className="flex items-start justify-between gap-3 border-b border-theme-muted pb-4">
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-theme-text">Podaj kod do kursu</h2>
                        <p className="mt-2 break-words text-sm text-theme-muted">{zwroconyKurs?.nazwa ?? "Wprowadź kod, aby zapisać się na kurs."}</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Zamknij" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-slate text-xl hover:bg-theme-panel">×</button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); znajdzKurs(); }} className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row">
                    <input autoFocus type="text" value={znalezionyKurs} maxLength={6} onChange={(e) => setznalezionyKurs(e.target.value)} placeholder="Kod kursu" className="h-11 min-w-0 flex-1 rounded-[12px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange" />
                    <button type="submit" disabled={processing || !znalezionyKurs.trim()} className="h-11 shrink-0 rounded-[12px] bg-theme-orange px-5 text-sm font-semibold text-theme-text transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{processing ? "Zapisywanie..." : "Dołącz"}</button>
                </form>
            </div>
        </div>
    );
}

export default function MojeKursy({ auth, mojekursy, wszystkiekursy, listasemestrow, kierunekstudenta }) {
    const pageProps = usePage().props;
    const message = pageProps.status || pageProps.flash?.status;
    const kurs = pageProps.kurs || pageProps.flash?.kurs;
    const [pokazKod, setpokazKod] = useState(false);
    const [zwroconyKurs, setzwroconyKurs] = useState(null);

    useEffect(() => {
        if (message && message !== "nie jestes zapisany na ten kurs") {
            toast.info(message);
        } else if (message === "nie jestes zapisany na ten kurs") {
            setpokazKod(true);
            setzwroconyKurs(kurs);
        }
    }, [message, kurs]);

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Head title="Moje kursy" />
            <MenuStudenta />
            <Content mojekursy={mojekursy} wszystkiekursy={wszystkiekursy} listasemestrow={listasemestrow} kierunekstudenta={kierunekstudenta} />
            <Koddokursu isOpen={pokazKod} onClose={() => setpokazKod(false)} zwroconyKurs={zwroconyKurs} wszystkiekursy={wszystkiekursy} />
        </div>
    );
}
