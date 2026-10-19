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
                <div className="w-full h-screen bg-theme-page text-center p-50 ">
                    <span className="text-theme-text font-bold text-[48px]">ładowanie mapy</span>
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
        
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
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
                <div className=" absolute top-8 right-5 z-50  ml-[75%] h-[30%] w-[30%] bg-theme-slate rounded-[10px] border border-theme-muted ">
                   
                    <div className="mx-auto w-full text-center">
                        <span className="w-full mx-auto text-theme-text text-[48px] font-bold  ">Mapa kampusu</span>
                    </div>
                    <div className=" mx-auto w-full flex text-center text-theme-text mt-10 ">
                        
                        <input type="text" placeholder="podaj numer sali (np. E201)" value={searchItem} onChange={(e) => {
                            setsearchItem(e.target.value);
                            setisOpen(true);
                        }} className="w-full ml-15 p-1 border-t border-b border-l border-theme-muted rounded-l-[10px]"></input>
                        <div className="mr-15 border-t border-b border-r border-theme-muted rounded-r-[10px] ">
                            <img src={Lupa} className=" w-[38px] h-[24px] mx-auto my-2 " alt="wyszukaj" />                            

                        </div>

                        {isOpen && searchItem.length > 0 && filtersale.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-theme-slate border border-theme-muted border-t-0 rounded-[10px] max-h-40 overflow-y-auto z-50 shadow-lg">
                                {filtersale.map((item, index) => (
                                    <li key={index} className="p-2 text-theme-text text-sm hover:bg-theme-slate-3 cursor-pointer border-b border-theme-black last:border-b-0"
                                    onClick={() => handleSelectSuggestion(item)}>
                                        <span className="font-bold">{item.numerSali}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className="w-full mx-auto h-[28px] px-[18px] my-3 flex items-center mt-10">
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
                                
                        }} className="text-[15px] h-[40px] mx-auto w-3/4  text-white bg-theme-orange rounded-[15px] hover:cursor-pointer active:bg-theme-orange">
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
        menu === <MenuDziekanat/>
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
