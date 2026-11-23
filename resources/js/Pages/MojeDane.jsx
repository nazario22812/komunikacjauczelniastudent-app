
import React, { useEffect, useRef, useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";
import BackButton from "../Components/BackButton";
import { Head, useForm } from "@inertiajs/react";

function UserAvatar({ photo, name, surname }) {
    const inputRef = useRef(null);
    const [imageError, setImageError] = useState(false);
    const [preview, setPreview] = useState(null);
    const [clientError, setClientError] = useState("");
    const [success, setSuccess] = useState("");
    const { data, setData, post, processing, errors, reset } = useForm({
        avatar: null,
    });

    const initials =
        String(name || "?").charAt(0).toUpperCase() +
        String(surname || "?").charAt(0).toUpperCase();

    useEffect(() => {
        if (!data.avatar) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(data.avatar);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.avatar]);

    useEffect(() => {
        setImageError(false);
    }, [photo, preview]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setClientError("");
        setSuccess("");
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setClientError("Wybierz zdjęcie JPG, PNG lub WEBP.");
            event.target.value = "";
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setClientError("Zdjęcie może mieć maksymalnie 2 MB.");
            event.target.value = "";
            return;
        }
        setData("avatar", file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!data.avatar || processing) return;
        setSuccess("");
        post("/mojedane/avatar", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset("avatar");
                if (inputRef.current) inputRef.current.value = "";
                setSuccess("Zdjęcie profilowe zostało zaktualizowane.");
            },
        });
    };

    const currentPhoto = preview || photo;

    return (
        <div className="flex min-h-[200px] min-w-0 flex-col items-center justify-center gap-4 rounded-[14px] border border-[#304266] bg-[#101d43] p-4 sm:p-5">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#7da5ff] bg-[#1a2d56] text-3xl font-bold text-white sm:h-28 sm:w-28">
                {currentPhoto && !imageError ? (
                    <img
                        src={currentPhoto}
                        alt="Zdjęcie profilowe"
                        onError={() => setImageError(true)}
                        className="!absolute !inset-0 !h-full !w-full !max-w-none rounded-full object-cover"
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex w-full max-w-[260px] flex-col items-center gap-2">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Wybierz zdjęcie profilowe"
                />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={processing}
                    className="min-h-[40px] w-full cursor-pointer rounded-[10px] border border-[#526b9f] bg-[#21375f] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#304b7b] disabled:opacity-50"
                >
                    {photo ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
                </button>
                {data.avatar && (
                    <div className="flex w-full gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="min-h-[40px] flex-1 cursor-pointer rounded-[10px] bg-theme-orange px-3 py-2 text-sm font-semibold text-theme-text disabled:opacity-50"
                        >
                            {processing ? "Zapisywanie..." : "Zapisz zdjęcie"}
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => {
                                reset("avatar");
                                if (inputRef.current) inputRef.current.value = "";
                            }}
                            className="min-h-[40px] cursor-pointer rounded-[10px] border border-[#526b9f] px-3 py-2 text-sm text-white"
                        >
                            Anuluj
                        </button>
                    </div>
                )}
                {data.avatar && (
                    <p className="max-w-full break-all text-center text-xs text-[#c6d5f1]">
                        {data.avatar.name}
                    </p>
                )}
                {(clientError || errors.avatar) && (
                    <p role="alert" className="text-center text-sm text-red-400">
                        {clientError || errors.avatar}
                    </p>
                )}
                {success && (
                    <p role="status" className="text-center text-sm text-green-400">
                        {success}
                    </p>
                )}
                <p className="text-center text-xs text-[#c6d5f1]">JPG, PNG lub WEBP · maks. 2 MB</p>
            </form>
        </div>
    );
}

function Content({
    rol,
    name,
    surname,
    email,
    numerTelefonu,
    kontoBankowe,
    DataUrodzenia,
    photo,
    index,
    semester,
    stopien,
    trybStudiow,
    rok,
    Specjalnosc,
    kierunek,
    wydzial,
    TytulNaukowy,
    katedra,
    Odpowiedzialnosc,
    grupaLaboratoryjna,
    grupaCwiczeniowa,
    grupaWykladowa,
}) {
    const extraFields = [];

    if (rol === "Student") {
        extraFields.push(
            { label: "Wydział", value: wydzial },
            { label: "Kierunek", value: kierunek },
            { label: "Rok studiów", value: rok },
            { label: "Semestr", value: semester },
            { label: "Stopień", value: stopien },
            { label: "Tryb studiów", value: trybStudiow },
            { label: "Numer indeksu", value: index },
            { label: "Specjalność", value: Specjalnosc },
            { label: "Grupa laboratoryjna", value: grupaLaboratoryjna },
            { label: "Grupa ćwiczeniowa", value: grupaCwiczeniowa },
            { label: "Grupa wykładowa", value: grupaWykladowa }
        );
    }

    if (rol === "Prowadzący") {
        extraFields.push(
            { label: "Tytuł naukowy", value: TytulNaukowy },
            { label: "Katedra", value: katedra }
        );
    }

    if (rol === "Pracownik Dziekanatu" && Odpowiedzialnosc != null) {
        extraFields.push({
            label: "Odpowiedzialność",
            value: Odpowiedzialnosc,
        });
    }

    const personalFields = [
        { label: "Imię", value: name },
        { label: "Nazwisko", value: surname },
        { label: "Data urodzenia", value: DataUrodzenia },
        { label: "Email", value: email },
        { label: "Numer telefonu", value: numerTelefonu },
        { label: "Konto bankowe", value: kontoBankowe },
    ];

    const visibleExtraFields = extraFields.filter(
        (field) => field.value != null && field.value !== ""
    );

    return (
        <div className="bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px]">
            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Moje dane
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="bg-theme-panel min-w-0 w-full flex-1 rounded-b-[10px] border-[0.3px] border-theme-muted px-2 py-4 sm:px-4 sm:py-6 md:py-10">
                <div className="mx-auto w-full min-w-0 rounded-[18px] bg-[#0f1d3d] p-3 sm:p-4 md:w-[90%] md:p-6 xl:w-[80%]">
                    <div className="mb-6 flex min-w-0 items-center justify-between gap-3 border-b border-[#304266] pb-4">
                        <p className="min-w-0 break-words text-xl font-bold text-white sm:text-2xl md:text-3xl">
                            {rol}
                        </p>

                        <div className="hidden shrink-0 rounded-full border border-[#3b4d7b] bg-[#101d43] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#dfe8ff] md:block">
                            Konto
                        </div>
                    </div>

                    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)] md:gap-6">
                        <UserAvatar
                            photo={photo}
                            name={name}
                            surname={surname}
                        />

                        <div className="min-w-0 space-y-3 rounded-[14px] border border-[#304266] bg-[#101d43] p-3 sm:p-4">
                            {personalFields.map((field) => (
                                <div
                                    key={field.label}
                                    className="grid min-w-0 grid-cols-1 gap-1 sm:gap-2 lg:grid-cols-[minmax(120px,180px)_minmax(0,1fr)] lg:items-center"
                                >
                                    <p className="min-w-0 break-words font-bold text-[#dfe8ff]">
                                        {field.label}:
                                    </p>

                                    <p className="min-w-0 break-words [overflow-wrap:anywhere] text-white">
                                        {field.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {visibleExtraFields.length > 0 && (
                        <div className="mt-6 min-w-0 rounded-[14px] border border-[#304266] bg-[#101d43] p-3 sm:p-4">
                            {visibleExtraFields.map((field) => (
                                <div
                                    key={field.label}
                                    className="grid min-w-0 grid-cols-1 gap-1 py-2 sm:gap-2 lg:grid-cols-[minmax(140px,220px)_minmax(0,1fr)] lg:items-center"
                                >
                                    <p className="min-w-0 break-words font-bold text-[#dfe8ff]">
                                        {field.label}:
                                    </p>

                                    <p className="min-w-0 break-words [overflow-wrap:anywhere] text-white">
                                        {field.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MojeDane({
    auth,
    rol,
    name,
    surname,
    email,
    numerTelefonu,
    kontoBankowe,
    DataUrodzenia,
    photo,
    index,
    semester,
    stopien,
    trybStudiow,
    rok,
    Specjalnosc,
    kierunek,
    wydzial,
    TytulNaukowy,
    katedra,
    Odpowiedzialnosc,
    grupaLaboratoryjna,
    grupaCwiczeniowa,
    grupaWykladowa,
}) {
    let menu;

    if (rol === "Student") {
        menu = <MenuStudenta />;
    }

    if (rol === "Prowadzący") {
        menu = <MenuProwadzacy />;
    }

    if (rol === "Pracownik Dziekanatu") {
        menu = <MenuDziekanat />;
    }

    return (
        <div className="flex min-h-dvh min-w-0 w-full">
            <Head title="Moje dane" />

            {menu}

            <Content
                rol={rol}
                name={name}
                surname={surname}
                email={email}
                numerTelefonu={numerTelefonu}
                kontoBankowe={kontoBankowe}
                DataUrodzenia={DataUrodzenia}
                photo={photo}
                index={index}
                semester={semester}
                stopien={stopien}
                trybStudiow={trybStudiow}
                rok={rok}
                Specjalnosc={Specjalnosc}
                kierunek={kierunek}
                wydzial={wydzial}
                TytulNaukowy={TytulNaukowy}
                katedra={katedra}
                Odpowiedzialnosc={Odpowiedzialnosc}
                grupaLaboratoryjna={grupaLaboratoryjna}
                grupaCwiczeniowa={grupaCwiczeniowa}
                grupaWykladowa={grupaWykladowa}
            />
        </div>
    );
}
