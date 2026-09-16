import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Lupa from '@/../images/search-rounded.png';
import { MapContainer, Polygon, TileLayer, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css'

function Content({listaBudynkow}){
    const terytorimPolitechniki = [
        [51.235246, 22.553532],
        [51.233042, 22.549852],
        [51.234268, 22.548281],
        [51.234434, 22.546310],
        [51.235158, 22.545286],
        [51.236010, 22.546878],
        [51.235570, 22.547462],
        [51.236048, 22.548323],
        [51.236466, 22.547728],
        [51.237473, 22.549628],
        [51.236150, 22.552094],
        [51.235679, 22.552959],
        [51.235246, 22.553532],

    ]
    return (
        // <div className="w-full">
        // </div>
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#08083b] w-full flex shrink-0 h-[40px] mx-auto text-center border-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full">Mapa kampusu</span>
            </div>
            <div className="w-full flex-1 min-h-0 border border-white pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <MapContainer center={[51.235581, 22.549308]} zoom={17} scrollWheelZoom={true} className="w-full h-full rounded-[10px] z-0">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker> */}
                    <Polyline positions={terytorimPolitechniki}/>
                    
                </MapContainer>
                <div className=" absolute top-8 right-5 z-50  ml-[75%] h-[30%] w-[30%] bg-[#1e293b] rounded-[10px] border border-white ">
                    1
                    <div className="mx-auto w-full text-center">
                        <span className="w-full mx-auto text-white text-[48px] font-bold  ">Mapa kampusu</span>
                    </div>
                    <div className=" mx-auto w-full flex text-center text-white mt-10 ">
                       
                        <input type="text" placeholder="podaj numer sali (np. E201)" className="w-full ml-15 p-1 border-t border-b border-l border-white rounded-l-[10px]"></input>
                        <div className="mr-15 border-t border-b border-r border-white rounded-r-[10px] ">
                            <img src={Lupa} className=" w-[38px] h-[24px] mx-auto my-2 " alt="wyszukaj" />                            

                        </div>
                    </div>
                    <div className="w-full mx-auto h-[28px] px-[18px] my-3 flex items-center mt-10">
                        <button  type="submit" className="text-[15px] h-[40px] mx-auto w-3/4  text-white bg-[#f97316] rounded-[15px] hover:cursor-pointer active:bg-[#c55b11]">
                            Wyszukaj
                        </button>
                    </div>
                </div>
                
            </div>        
        </div>
    );
}

export default function MapaKampusu({ auth, listaBudynkow }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Mapa kampusu"/>
            <MenuStudenta/>
            <Content listaBudynkow={listaBudynkow}/>
        </div>
    );
}
