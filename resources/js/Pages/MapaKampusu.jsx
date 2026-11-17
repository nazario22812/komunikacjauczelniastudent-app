
import React, { useEffect, useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Lupa from "@/../images/search-rounded.png";
import {
    MapContainer,
    TileLayer,
    Popup,
    Marker,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocated } from "react-geolocated";
import { ToastContainer, toast } from "react-toastify";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";

const DEFAULT_CENTER = [51.235, 22.552];

function MapController({ center }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, 17);
    }, [map, center[0], center[1]]);

    useEffect(() => {
        const refreshMap = () => map.invalidateSize();

        refreshMap();

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

    const {
        coords,
        isGeolocationAvailable,
        isGeolocationEnabled,
    } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    });

    const filtersale = (sale ?? []).filter(
        (item) =>
            item.numerSali &&
            item.numerSali
                .toLowerCase()
                .includes(searchItem.toLowerCase())
    );

    const handleSelectSuggestion = (item) => {
        setsearchItem(item.numerSali);
        setisOpen(false);
        setwybranaSala(item);
    };

    const salaCoordinates =
        wybranaSala?.szerokosc != null &&
        wybranaSala?.dlugosc != null
            ? [
                  Number(wybranaSala.szerokosc),
                  Number(wybranaSala.dlugosc),
              ]
            : null;

    const validSalaCoordinates =
        salaCoordinates &&
        salaCoordinates.every(Number.isFinite)
            ? salaCoordinates
            : null;

    const userCoordinates = coords
        ? [coords.latitude, coords.longitude]
        : null;

    const mapCenter =
        validSalaCoordinates ??
        userCoordinates ??
        DEFAULT_CENTER;

    const handleSearch = () => {
        if (!searchItem.trim()) {
            toast.info("Wpisz salę", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
            return;
        }

        const found = (sale ?? []).find(
            (item) =>
                item.numerSali &&
                item.numerSali.toLowerCase() ===
                    searchItem.trim().toLowerCase()
        );

        if (found) {
            handleSelectSuggestion(found);
        } else {
            toast.error("Nie znaleziono takiej sali", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    };

    return (
        <div className="bg-theme-page flex h-dvh min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden box-border p-2 sm:p-[10px]">
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

            <div className="bg-theme-page mx-auto flex h-[40px] w-full shrink-0 items-center rounded-t-[10px] border-b-[0.3px] border-theme-muted px-2 sm:px-[10px]">
                <div className="flex w-[42px] shrink-0 items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="min-w-0 flex-1 text-center text-[16px] font-bold text-theme-text">
                    Mapa kampusu
                </span>

                <div className="w-[42px] shrink-0" />
            </div>

            <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col rounded-b-[10px] px-0 pb-2 pt-3 sm:px-1">
                <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[10px]">
                    <MapContainer
                        center={mapCenter}
                        zoom={17}
                        scrollWheelZoom={true}
                        className="!h-full !w-full !min-h-0 z-0 rounded-[10px]"
                    >
                        <MapController center={mapCenter} />

                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {validSalaCoordinates && (
                            <Marker position={validSalaCoordinates}>
                                <Popup>
                                    <div className="text-black">
                                        <strong>
                                            Sala: {wybranaSala.numerSali}
                                        </strong>
                                        <br />
                                        Budynek: {wybranaSala.nazwa}
                                        <br />
                                        Godzina otwarcia:{" "}
                                        {wybranaSala.godzinaOtwarcia}
                                        <br />
                                        Godzina zamknięcia:{" "}
                                        {wybranaSala.godzinaZamkniecia}
                                        <br />
                                        Adres: {wybranaSala.ulica}{" "}
                                        {wybranaSala.nrBudynku}
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>

                    <div className="absolute left-2 right-2 top-2 z-[1000] max-h-[calc(100%-16px)] overflow-y-auto rounded-[10px] border border-theme-muted bg-theme-slate p-3 sm:left-3 sm:right-3 sm:top-3 md:left-auto md:right-5 md:top-8 md:w-[30%] md:min-w-[220px] md:max-w-[360px] md:p-4">
                        <div className="mx-auto w-full text-center">
                            <h2 className="text-xl font-bold text-theme-text sm:text-2xl md:text-[clamp(1.5rem,2.5vw,3rem)]">
                                Mapa kampusu
                            </h2>
                        </div>

                        <div className="relative mx-auto mt-4 flex w-full min-w-0 items-stretch text-center text-theme-text md:mt-10">
                            <input
                                type="text"
                                placeholder="podaj numer sali (np. E201)"
                                value={searchItem}
                                onChange={(e) => {
                                    setsearchItem(e.target.value);
                                    setisOpen(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                                className="min-w-0 w-full flex-1 rounded-l-[10px] border border-theme-muted bg-theme-page p-2 text-sm text-theme-text outline-none md:p-1"
                            />

                            <div className="flex shrink-0 items-center justify-center rounded-r-[10px] border border-l-0 border-theme-muted bg-theme-page px-2">
                                <img
                                    src={Lupa}
                                    className="!h-[20px] !w-[20px] object-contain md:!h-[24px] md:!w-[24px]"
                                    alt="wyszukaj"
                                />
                            </div>

                            {isOpen &&
                                searchItem.length > 0 &&
                                filtersale.length > 0 && (
                                    <ul className="absolute left-0 right-0 top-full z-[1100] mt-1 max-h-40 overflow-y-auto rounded-[10px] border border-theme-muted bg-theme-slate">
                                        {filtersale.map((item, index) => (
                                            <li
                                                key={
                                                    item.idSala ??
                                                    item.numerSali ??
                                                    index
                                                }
                                                className="cursor-pointer break-words border-b border-theme-black p-2 text-left text-sm text-theme-text last:border-b-0 hover:bg-theme-panel"
                                                onClick={() =>
                                                    handleSelectSuggestion(item)
                                                }
                                            >
                                                <span className="font-bold">
                                                    {item.numerSali},{" "}
                                                    {item.nazwa}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                        </div>

                        <div className="mx-auto mt-5 flex w-full items-center justify-center px-1 md:mt-10 md:px-[18px]">
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="h-[40px] w-full rounded-[15px] bg-theme-orange px-4 text-[15px] text-white hover:cursor-pointer active:bg-theme-orange md:w-3/4"
                            >
                                Wyszukaj
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MapaKampusu({ auth, sale, rol }) {
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
        <div className="flex h-dvh min-h-0 min-w-0 w-full overflow-hidden">
            <Head title="Mapa kampusu" />

            {menu}

            <Content sale={sale} />
        </div>
    );
}
