import React, { useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Lupa from '@/../images/search-rounded.png';
import { MapContainer, Polygon, TileLayer, Polyline, Popup, Marker } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { useGeolocated } from "react-geolocated";



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
                <div className="w-full h-screen bg-[#04041D] text-center p-50 ">
                    <span className="text-white font-bold text-[48px]">ładowanie mapy</span>
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
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Mapa kampusu</span>
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
                <div className=" absolute top-8 right-5 z-50  ml-[75%] h-[30%] w-[30%] bg-[#1e293b] rounded-[10px] border border-white ">
                   
                    <div className="mx-auto w-full text-center">
                        <span className="w-full mx-auto text-white text-[48px] font-bold  ">Mapa kampusu</span>
                    </div>
                    <div className=" mx-auto w-full flex text-center text-white mt-10 ">
                        
                        <input type="text" placeholder="podaj numer sali (np. E201)" value={searchItem} onChange={(e) => {
                            setsearchItem(e.target.value);
                            setisOpen(true);
                        }} className="w-full ml-15 p-1 border-t border-b border-l border-white rounded-l-[10px]"></input>
                        <div className="mr-15 border-t border-b border-r border-white rounded-r-[10px] ">
                            <img src={Lupa} className=" w-[38px] h-[24px] mx-auto my-2 " alt="wyszukaj" />                            

                        </div>

                        {isOpen && searchItem.length > 0 && filtersale.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-[#1e293b] border border-white border-t-0 rounded-[10px] max-h-40 overflow-y-auto z-50 shadow-lg">
                                {filtersale.map((item, index) => (
                                    <li key={index} className="p-2 text-white text-sm hover:bg-[#334155] cursor-pointer border-b border-gray-700 last:border-b-0"
                                    onClick={() => handleSelectSuggestion(item)}>
                                        <span className="font-bold">{item.numerSali}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className="w-full mx-auto h-[28px] px-[18px] my-3 flex items-center mt-10">
                        <button  type="button" onClick={() => {
                            if(filtersale.length > 0){
                                if (!searchItem.trim()) {
                                        alert("Wpisz numer sali!");
                                        return;
                                    }
                                        
                                    const found = sale.find(item => 
                                        item.numerSali && item.numerSali.toLowerCase() === searchItem.toLowerCase()
                                    );
                                        
                                    if (found) {
                                        handleSelectSuggestion(found);
                                    } else if (filtersale.length > 0) {
                                        handleSelectSuggestion(filtersale[0]);
                                    } else {
                                        alert("Nie znaleziono takiej sali.");
                                    }                            }
                        }} className="text-[15px] h-[40px] mx-auto w-3/4  text-white bg-[#f97316] rounded-[15px] hover:cursor-pointer active:bg-[#c55b11]">
                            Wyszukaj
                        </button>
                    </div>
                </div>
                
            </div>        
        </div>
    );
}

export default function MapaKampusu({ auth, sale }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Mapa kampusu"/>
            <MenuStudenta/>
            <Content  sale={sale}/>
        </div>
    );
}
