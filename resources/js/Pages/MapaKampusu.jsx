import React, { useEffect, useMemo, useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocated } from "react-geolocated";
import { ToastContainer, toast } from "react-toastify";

const DEFAULT_CENTER = [51.235, 22.552];

function MapController({ center }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, 17, { animate: true, duration: 0.6 });
    }, [map, center[0], center[1]]);

    useEffect(() => {
        const refreshMap = () => map.invalidateSize();
        refreshMap();

        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const observer = new ResizeObserver(refreshMap);
        observer.observe(map.getContainer());
        return () => observer.disconnect();
    }, [map]);

    return null;
}

function Content({ sale = [] }) {
    const [searchItem, setsearchItem] = useState("");
    const [isOpen, setisOpen] = useState(false);
    const [wybranaSala, setwybranaSala] = useState(null);
    const [panelOpen, setPanelOpen] = useState(true);

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: { enableHighAccuracy: false },
        userDecisionTimeout: 5000,
    });

    const filtersale = useMemo(() => {
        const tekst = searchItem.trim().toLocaleLowerCase("pl-PL");
        if (!tekst) return [];

        return (sale ?? []).filter((item) =>
            [item.numerSali, item.nazwa, item.ulica, item.nrBudynku]
                .some((pole) => String(pole ?? "").toLocaleLowerCase("pl-PL").includes(tekst))
        );
    }, [sale, searchItem]);

    const handleSelectSuggestion = (item) => {
        setsearchItem(String(item.numerSali ?? ""));
        setisOpen(false);
        setwybranaSala(item);
    };

    const salaCoordinates =
        wybranaSala?.szerokosc != null && wybranaSala?.dlugosc != null
            ? [Number(wybranaSala.szerokosc), Number(wybranaSala.dlugosc)]
            : null;

    const validSalaCoordinates =
        salaCoordinates && salaCoordinates.every(Number.isFinite)
            ? salaCoordinates
            : null;

    const userCoordinates = coords ? [coords.latitude, coords.longitude] : null;
    const mapCenter = validSalaCoordinates ?? userCoordinates ?? DEFAULT_CENTER;

    const handleSearch = () => {
        if (!searchItem.trim()) {
            toast.info("Wpisz numer sali lub nazwę budynku", {
                position: "bottom-right", theme: "dark",
            });
            return;
        }

        if (filtersale.length) {
            handleSelectSuggestion(filtersale[0]);
        } else {
            toast.error("Nie znaleziono sali ani budynku", {
                position: "bottom-right", theme: "dark",
            });
        }
    };

    const clearSearch = () => {
        setsearchItem("");
        setisOpen(false);
        setwybranaSala(null);
    };

    return (
        <div className="box-border flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-theme-page p-2 sm:p-[10px]">
            <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} theme="dark" />

            <div className="flex h-[44px] w-full shrink-0 items-center rounded-t-[10px] border-b border-theme-muted bg-theme-page px-2 sm:px-3">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Mapa kampusu
                </span>
                <div className="flex w-[42px] shrink-0 items-center justify-end">
                    <button
                        type="button"
                        onClick={() => setPanelOpen((previous) => !previous)}
                        className="rounded-lg border border-theme-muted px-2 py-1 text-xs font-medium text-theme-text transition-colors hover:bg-theme-slate"
                        aria-label={panelOpen ? "Ukryj wyszukiwarkę" : "Pokaż wyszukiwarkę"}
                        title={panelOpen ? "Ukryj wyszukiwarkę" : "Pokaż wyszukiwarkę"}
                    >
                        {panelOpen ? "−" : "+"}
                    </button>
                </div>
            </div>

            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] pt-3 sm:px-1">
                <div className="relative min-h-0 min-w-0 w-full flex-1 overflow-hidden rounded-[15px] border border-theme-muted bg-theme-slate">
                    <MapContainer
                        center={DEFAULT_CENTER}
                        zoom={17}
                        scrollWheelZoom={true}
                        className="!z-0 !h-full !w-full !min-h-0"
                    >
                        <MapController center={mapCenter} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {validSalaCoordinates && (
                            <Marker position={validSalaCoordinates}>
                                <Popup>
                                    <div className="min-w-[170px] text-sm text-black">
                                        <strong>Sala {wybranaSala.numerSali}</strong>
                                        <div>Budynek: {wybranaSala.nazwa || "Brak danych"}</div>
                                        <div>Adres: {[wybranaSala.ulica, wybranaSala.nrBudynku].filter(Boolean).join(" ") || "Brak danych"}</div>
                                        <div>Otwarcie: {wybranaSala.godzinaOtwarcia || "Brak danych"}</div>
                                        <div>Zamknięcie: {wybranaSala.godzinaZamkniecia || "Brak danych"}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>

                    {panelOpen && (
                        <div className="absolute left-2 right-2 top-2 z-[1000] flex max-h-[min(65%,520px)] min-w-0 flex-col overflow-visible rounded-[15px] border border-theme-muted bg-theme-surface p-3 shadow-xl sm:left-4 sm:right-4 sm:top-4 sm:p-4 md:left-auto md:right-5 md:top-5 md:w-[340px] md:max-w-[calc(100%-40px)] lg:w-[370px]">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-theme-muted">Nawigacja po kampusie</p>
                                <h1 className="mt-1 break-words text-xl font-bold text-theme-text sm:text-2xl">
                                    Znajdź salę
                                </h1>
                                <p className="mt-1 text-xs leading-relaxed text-theme-muted sm:text-sm">
                                    Wpisz numer sali lub nazwę budynku, aby zobaczyć lokalizację na mapie.
                                </p>
                            </div>

                            <div className="relative mt-4 min-w-0">
                                <label htmlFor="szukaj-sali" className="mb-1.5 block text-xs font-semibold text-theme-text">
                                    Sala lub budynek
                                </label>
                                <div className="flex min-w-0 items-center gap-2">
                                    <input
                                        id="szukaj-sali"
                                        type="search"
                                        autoComplete="off"
                                        placeholder="Np. E201, budynek..."
                                        value={searchItem}
                                        onFocus={() => setisOpen(true)}
                                        onChange={(e) => {
                                            setsearchItem(e.target.value);
                                            setisOpen(true);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleSearch();
                                            }
                                            if (e.key === "Escape") setisOpen(false);
                                        }}
                                        className="h-11 min-w-0 flex-1 rounded-[12px] border border-theme-muted bg-theme-slate px-3 text-sm text-theme-text outline-none placeholder:text-theme-muted focus:border-theme-orange"
                                    />
                                    {searchItem && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="flex h-11 w-10 shrink-0 items-center justify-center rounded-[12px] border border-theme-muted bg-theme-slate text-base text-theme-muted hover:text-theme-text"
                                            aria-label="Wyczyść wyszukiwanie"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                {isOpen && searchItem.trim() && filtersale.length > 0 && (
                                    <ul className="custom-scrollbar absolute left-0 right-0 top-full z-[1100] mt-2 max-h-[180px] overflow-y-auto rounded-[12px] border border-theme-muted bg-theme-slate p-1 shadow-lg">
                                        {filtersale.slice(0, 30).map((item, index) => (
                                            <li key={`${item.idSala ?? index}-${item.Budynek_idBudynek ?? item.nazwa ?? index}`}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectSuggestion(item)}
                                                    className="flex w-full min-w-0 flex-col rounded-lg px-3 py-2 text-left transition-colors hover:bg-theme-panel"
                                                >
                                                    <span className="break-words text-sm font-semibold text-theme-text">Sala {item.numerSali}</span>
                                                    <span className="break-words text-xs text-theme-muted">{item.nazwa || "Budynek bez nazwy"}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleSearch}
                                className="mt-3 h-10 w-full rounded-[12px] bg-theme-orange px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                            >
                                Wyszukaj na mapie
                            </button>

                            {wybranaSala && (
                                <div className="mt-4 min-w-0 rounded-[12px] border border-theme-muted bg-theme-slate p-3">
                                    <div className="flex min-w-0 items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-theme-muted">Wybrana lokalizacja</p>
                                            <p className="mt-1 break-words text-base font-bold text-theme-text">Sala {wybranaSala.numerSali}</p>
                                        </div>
                                        <span className="shrink-0 rounded-lg bg-theme-panel px-2 py-1 text-[11px] text-theme-muted">Budynek</span>
                                    </div>
                                    <p className="mt-2 break-words text-sm text-theme-text">{wybranaSala.nazwa || "Brak danych o budynku"}</p>
                                    <p className="mt-1 break-words text-xs text-theme-muted">
                                        {[wybranaSala.ulica, wybranaSala.nrBudynku].filter(Boolean).join(" ") || "Brak adresu"}
                                    </p>
                                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-theme-muted pt-3">
                                        <div>
                                            <p className="text-xs text-theme-muted">Otwarcie</p>
                                            <p className="mt-1 text-sm font-semibold text-theme-text">{wybranaSala.godzinaOtwarcia || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-theme-muted">Zamknięcie</p>
                                            <p className="mt-1 text-sm font-semibold text-theme-text">{wybranaSala.godzinaZamkniecia || "—"}</p>
                                        </div>
                                    </div>
                                    {!validSalaCoordinates && (
                                        <p className="mt-3 text-xs text-theme-muted">Brak współrzędnych tej lokalizacji.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pointer-events-none absolute bottom-3 left-3 z-[900] max-w-[calc(100%-24px)] rounded-[10px] border border-theme-muted bg-theme-surface px-3 py-2 text-xs text-theme-text shadow-md sm:bottom-4 sm:left-4">
                        {validSalaCoordinates
                            ? `Wyświetlono: sala ${wybranaSala.numerSali}`
                            : userCoordinates && isGeolocationAvailable && isGeolocationEnabled
                                ? "Mapa w pobliżu Twojej lokalizacji"
                                : "Wybierz salę, aby znaleźć ją na mapie"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MapaKampusu({ auth, sale = [], rol }) {
    let menu = null;
    if (rol === "Student") menu = <MenuStudenta />;
    if (rol === "Prowadzący") menu = <MenuProwadzacy />;
    if (rol === "Pracownik Dziekanatu") menu = <MenuDziekanat />;

    return (
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Mapa kampusu" />
            {menu}
            <Content sale={sale} />
        </div>
    );
}
