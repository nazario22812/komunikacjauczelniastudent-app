import React, { useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Lupa from '@/../images/search-rounded.png';
import { MapContainer, Polygon, TileLayer, Polyline, Popup, Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { useGeolocated } from "react-geolocated";
import { ToastContainer, toast } from "react-toastify";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";


function Content({sale}){
    const [searchItem, setsearchItem] = useState("");
    const [isOpen, setisOpen] = useState(false);
    const [wybranaSala, setwybranaSala] = useState(null);
    const { coords, isGeolocationAvailable, isGeolocationEnabled} = 
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        })
        if(!coords){
            return (
                <div className="flex min-h-screen w-full items-center justify-center bg-theme-page p-6 text-center">
                    <span className="text-theme-text text-[clamp(1.5rem,2vw+1rem,3rem)] font-bold">ładowanie mapy</span>
                </div>
            )
        }
    const kordinate = [coords.latitude, coords.longitude]
    
    const filtersale = sale ? sale.filter(item => 
        item.numerSali && item.numerSali.toLowerCase().includes(searchItem.toLowerCase())
    ) : [];
    
    const handleSelectSuggestion = (item) => {
        setsearchItem(item.numerSali);
        setisOpen(false);
        setwybranaSala(item);
    }

    const mapCenter = wybranaSala && wybranaSala.szerokosc && wybranaSala.dlugosc 
        ? [wybranaSala.szerokosc, wybranaSala.dlugosc] 
        : kordinate;
    return (
        // <div className="w-full">
        // </div>
        
        <div className="bg-theme-page w-full min-h-screen p-[10px] flex flex-col box-border">
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
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Mapa kampusu</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <MapContainer key={mapCenter.join(',')} center={mapCenter} zoom={17} scrollWheelZoom={true} className="w-full h-full rounded-[10px] z-0">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {wybranaSala && wybranaSala.szerokosc && wybranaSala.dlugosc && (
                        <Marker position={[wybranaSala.szerokosc, wybranaSala.dlugosc]}>
                            <Popup>
                                <div className="text-black">
                                    <strong>Sala: {wybranaSala.numerSali}</strong><br />
                                    Budynek: {wybranaSala.nazwa}<br />
                                    Godzina otwarcia: {wybranaSala.godzinaOtwarcia} <br />
                                    Godzina zamknięcia: {wybranaSala.godzinaZamkniecia} <br />
                                    Adres: {wybranaSala.ulica} {wybranaSala.nrBudynku}
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
                <div className="absolute left-3 right-3 top-3 z-50 rounded-[10px] border border-theme-muted bg-theme-slate p-3 md:left-auto md:right-5 md:top-8 md:w-[30%] md:min-w-[220px] md:max-w-[360px]">
                    
                    <div className="mx-auto w-full text-center">
                       <span className="w-full mx-auto text-theme-text text-[24px] font-bold md:text-[48px]">Mapa kampusu</span>
                    </div>
                   <div className="mx-auto mt-4 flex w-full items-stretch text-center text-theme-text md:mt-10">
                         
                        <input type="text" placeholder="podaj numer sali (np. E201)" value={searchItem} onChange={(e) => {
                            setsearchItem(e.target.value);
                            setisOpen(true);
                       }} className="w-full border border-theme-muted rounded-l-[10px] bg-theme-page p-2 text-sm text-theme-text outline-none md:ml-15 md:p-1"></input>
                       <div className="flex items-center justify-center border border-l-0 border-theme-muted rounded-r-[10px] bg-theme-page px-2 md:mr-15">
                           <img src={Lupa} className="h-[20px] w-[20px] md:h-[24px] md:w-[38px]" alt="wyszukaj" />                            

                        </div>

                        {isOpen && searchItem.length > 0 && filtersale.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-theme-slate border border-theme-muted border-t-0 rounded-[10px] max-h-40 overflow-y-auto z-50 shadow-lg">
                                {filtersale.map((item, index) => (
                                    <li key={index} className="p-2 text-theme-text text-sm hover:bg-theme-slate-3 cursor-pointer border-b border-theme-black last:border-b-0"
                                    onClick={() => handleSelectSuggestion(item)}>
                                        <span className="font-bold">{item.numerSali}, {item.nazwa}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className="mx-auto my-3 mt-10 flex h-[28px] w-full items-center px-[18px]">
                        <button  type="button" onClick={() => {
                            if (!searchItem.trim()) {
                                    toast.info('Wpisz salę', {
                                            position: "bottom-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: false,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "dark",
                                        });
                                    return;
                                }
                                        
                                const found = sale.find(item => 
                                    item.numerSali && item.numerSali.toLowerCase() === searchItem.toLowerCase()
                                );
                                        
                                if (found) {
                                    handleSelectSuggestion(found);
                                } 
                                else {
                                    toast.error('Nie znaleziono takiej sali', {
                                        position: "bottom-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: false,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "dark",
                                    });
                                }                           
                                
                        }} className="mx-auto h-[40px] w-full rounded-[15px] bg-theme-orange px-4 text-[15px] text-white hover:cursor-pointer active:bg-theme-orange md:w-3/4">
                            Wyszukaj
                        </button>
                    </div>
                </div>
                
            </div>        
        </div>
    );
}

export default function MapaKampusu({ auth, sale, rol }) {
    let menu;
    if (rol === 'Student'){
        menu = <MenuStudenta/>
    }
    if (rol === 'Prowadzący'){
        menu = <MenuProwadzacy/>
    }
    if (rol === 'Pracownik Dziekanatu'){
        menu = <MenuDziekanat/>
    }
    
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Mapa kampusu"/>
            {menu}
            <Content sale={sale}/>
        </div>
    );
}
