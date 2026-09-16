import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head } from "@inertiajs/react";
import Lupa from '@/../images/search-rounded.png';
import { MapContainer, Polygon, TileLayer, Polyline, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css'

function Content({listaBudynkow, sale}){
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

    const weii = [
        [51.236460, 22.548595],
        [51.236627, 22.548357],
        [51.237150, 22.549309],
        [51.236999, 22.549514],
        [51.236454, 22.548597]

    ]
    
    const wm = [
        [51.236745, 22.549608],
        [51.236314, 22.550217],
        [51.236674, 22.550830],
        [51.23709599588585, 22.550242687259296]
    ]

    const centech = [
        [51.23630617885355, 22.548058790038617],
        [51.23647044034992, 22.54836181170409],
        [51.23630617885355, 22.54863532862845],
        [51.236110961539595, 22.548365798831952]
    ]

    const rdzewiak = [
        [51.23668232379729, 22.550971424436383],
        [51.23633634473901, 22.550454924157847],
        [51.23570086622115, 22.551535289369284],
        [51.23607791786737, 22.552049534188093]
    ]

    const aspect = [
        [51.23605464796903, 22.552267952276175],
        [51.23579182634097, 22.55263005045883],
        [51.23566755233269, 22.552408768236095],
        [51.23593205404181, 22.552041305635917]

    ]

    const pentagon = [
        [51.235609084269335, 22.552983285379312],
        [51.2352068703085, 22.553531797070814],
        [51.234950761461526, 22.55307716268057],
        [51.235349618876704, 22.55251523994526]   
    ]

    const wf = [
        [51.23535045857289, 22.55250853442336],
        [51.23494908205459, 22.553069116054292],
        [51.23479961459027, 22.55279418965635],
        [51.23515480895011, 22.552310050975088],
        [51.23523625975253, 22.552444161413113],
        [51.235278244645905, 22.552378447298484]
    ]

    const rektorat = [
        [51.2356518262189, 22.550556832981055],
        [51.2354398566364, 22.55024958248456],
        [51.23554376341651, 22.550050438644238],
        [51.23574563877557, 22.550376655220763]
    ]

    const architektura = [
        [51.23592457999217, 22.548498128599427],
        [51.23567162280461, 22.54889834465922],
        [51.235409195268964, 22.548490533118287],
        [51.235430570411424, 22.548446911134224],
        [51.23540088271086, 22.548393806110134],
        [51.23535338235014, 22.548469670430258],
        [51.235105192167794, 22.548069486141614],
        [51.235412757793405, 22.547583954492833],
        [51.23565500880778, 22.547982242173475],
        [51.235601571193655, 22.548069486141614],
        [51.23563244626716, 22.54811500473369],
        [51.2356668838247, 22.548067589533613]
    ]

    const kazik = [
        [51.23527719319249, 22.54731523620295],
        [51.235215877529065, 22.547211941339416],
        [51.23513860021128, 22.547320582026458],
        [51.23519569977808, 22.5474399403163]
    ]
    const stolowka = [
        [51.23513860021128, 22.547320582026458],
        [51.23519569977808, 22.5474399403163],  
        [51.23499995730354, 22.54772672667797],
        [51.234709419299335, 22.547221130326626],
        [51.23498988087167, 22.54681075238628],
        [51.235215877529065, 22.547211941339416],

    ]

    const ds1 = [
        [51.23540660181964, 22.546274411201775],
        [51.23529544859557, 22.546417761242576],
        [51.23531625269537, 22.546450988073225],
        [51.23525502917478, 22.546537377832912],
        [51.23514506439438, 22.546340864863073],
        [51.23518429510294, 22.546280107229883],
        [51.23517597344028, 22.54626491782159],
        [51.23530971426502, 22.54607884756995],
        [51.235408385024236, 22.546273461863752]
    ]

    const ds2 = [
        [51.23506184228027, 22.54589170281674],
        [51.23495436037122, 22.54605799975989],
        [51.235002643291104, 22.546137795470514],
        [51.23494134496674, 22.546231672777125],
        [51.234809511306814, 22.54601642551986],
        [51.234850656884326, 22.545954064166175],
        [51.23483512233388, 22.54592791263076],
        [51.23496401695857, 22.545728758630297]
    ]

    const ds3 = [
        [51.23473006266764, 22.546276520842746],
        [51.23461867239202, 22.546450395063793],
        [51.23464354790803, 22.546491104535214],
        [51.23458350867049, 22.54658632294621],
        [51.234481483770864, 22.546420026003634],
        [51.234525568631085, 22.546349618023672],
        [51.23450247656672, 22.546312737653217],
        [51.23462927285004, 22.546111571996185]
    ]

    const ds4 = [
        [51.234784135131235, 22.546862206735913],
        [51.23467628783059, 22.54701850212126],
        [51.234707743319404, 22.547077511603486],
        [51.23464383373229, 22.547169215528562],
        [51.234537483988234, 22.5469810231258],
        [51.23457892546704, 22.546921216218138],
        [51.23456844027712, 22.546903672858555],
        [51.23470125250601, 22.546710695903176]
    ]

    const wis = [
        [51.23471571465495, 22.54840308821474],
        [51.23463567048683, 22.5485438901069],
        [51.234539480603445, 22.548403541108012],
        [51.23449435441557, 22.548398799586113],
        [51.23437441354634, 22.548191121004294],
        [51.234501197070585, 22.54802448884799],
        [51.23444657058333, 22.547916382191815],
        [51.23441510094915, 22.547958107585504],
        [51.234313827847316, 22.547764818817285],
        [51.234461082135184, 22.547569468218587],
        [51.2344414878418, 22.547531536037294],
        [51.23454005298981, 22.547402566679153],
        [51.23480528001556, 22.54790989535118],
        [51.234791844715765, 22.548034618058534],
        [51.23464489586784, 22.548298815621436]
    ]

    const zarzadzanie = [
        [51.23463888289917, 22.548544554572032],
        [51.23471796697612, 22.54866296623397],
        [51.2347066692601, 22.548686648570897],
        [51.234800581445334, 22.548823103884654],
        [51.234830237885035, 22.548774611500424],
        [51.23502159207219, 22.549046394398086],
        [51.23515670260448, 22.54898652751584],
        [51.2352001406788, 22.548913961802135],
        [51.2352156186029, 22.54893469486346],
        [51.23530998389865, 22.54876803294745],
        [51.235230597234214, 22.548650013983004],
        [51.23513373533232, 22.548823055302496],
        [51.23515670260585, 22.54885176261817],
        [51.23513024031144, 22.548901202995168],
        [51.23513047602642, 22.548899966565155],
        [51.23494916732396, 22.548629537850935],
        [51.23510548637625, 22.548361228707904],
        [51.23497491274141, 22.548162745240045],
        [51.23478107063355, 22.548495016453952],
        [51.234758300918415, 22.54846162363222],
        [51.23475788106492, 22.54846430584098],
        [51.2347637590134, 22.548401944487303],
        [51.23474570531208, 22.548378475160646],
        [51.23471463613369, 22.548402615034203]

    ]
    
    const wmit = [
        [51.23502159207219, 22.549046394398086],
        [51.234998965574576, 22.549089905408405],
        [51.235443166100744, 22.54968937910251],
        [51.23554308963468, 22.5495069889068],
        [51.23516186759208, 22.548989322598086]

    ]

    const citt = [
        [51.23625227029443, 22.549612617713994],
        [51.236125135520695, 22.549845086682545],
        [51.236025328536265, 22.54970845186021],
        [51.23615186949761, 22.549474085185796]
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
                    <Polygon positions={weii} color="yellow">
                        <Popup>
                            <div className="">
                                <span>Wydział Elektrotechniki i Informatyki</span><br />
                                <span>Nadbystrzycka 36B</span>
                            </div>
                        </Popup>
                    </Polygon>
                        
                    <Polygon positions={wm} color="orange">
                        <Popup>
                            <div className="">
                                <span>Wydział Mechaniczny</span><br />
                                <span>Nadbystrzycka 36</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={centech} color="lightblue">
                        <Popup>
                            <div className="">
                                <span>Centrum Technologii Informatycznych i Lingwistyki Technicznej CEN-TECH Politechniki Lubelskiej</span><br />
                                <span>Nadbystrzycka 38B</span>
                            </div>
                        </Popup>
                    </Polygon>
                    
                    <Polygon positions={rdzewiak} color="brown">
                        <Popup>
                            <div className="">
                                <span>Centrum Innowacji i Zaawansowanych Technologii Politechniki Lubelskiej „Rdzewiak”</span><br />
                                <span>Nadbystrzycka 36C</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={aspect} color="purple">
                        <Popup>
                            <div className="">
                                <span>Centrum Doskonałości Zastosowań Technologii Nadprzewodnikowych i Plazmowych w Energetyce CoE ASPPECT</span><br />
                                <span>Nadbystrzycka 36A</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={pentagon} color="pink">
                        <Popup>
                            <div className="">
                                <span>Wydział Elektrotechniki i Informatyki - Pentagon</span><br />
                                <span>Nadbystrzycka 36B</span>
                            </div>
                        </Popup>
                    </Polygon>
                    <Polygon positions={wf} color="green">
                        <Popup>
                            <div className="">
                                <span>Hala Sportowa Politechniki Lubelskej</span><br />
                                <span>Nadbystrzycka 36</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={rektorat} color="red">
                        <Popup>
                            <div className="">
                                <span>Rektorat</span><br />
                                <span>Nadbystrzycka 38D</span>
                            </div>
                        </Popup>
                    </Polygon>
                    <Polygon positions={architektura} color="grey">
                        <Popup>
                            <div className="">
                                <span>Wydział Budownictwa i Architektury</span><br />
                                <span>Nadbystrzycka 40</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={kazik} color="brown">
                        <Popup>
                            <div className="">
                                <span>Klub Studencki Kazik</span><br />
                                <span>Nadbystrzycka 40A</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={stolowka} color="orange">
                        <Popup>
                            <div className="">
                                <span>Lanczomania </span><br />
                                <span>Nadbystrzycka 40A</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={ds1} color="cyan">
                        <Popup>
                            <div className="">
                                <span>Dom studenta 1 </span><br />
                                <span>Nadbystrzycka 42</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={ds2} color="yellow">
                        <Popup>
                            <div className="">
                                <span>Dom studenta 2 </span><br />
                                <span>Nadbystrzycka 44</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={ds3} color="red">
                        <Popup>
                            <div className="">
                                <span>Dom studenta 3 </span><br />
                                <span>Nadbystrzycka 44A</span>
                            </div>
                        </Popup>
                    </Polygon>

                    <Polygon positions={ds4} color="green">
                        <Popup>
                            <div className="">
                                <span>Dom studenta 4 </span><br />
                                <span>Nadbystrzycka 42A</span>
                            </div>
                        </Popup>
                    </Polygon>
                    
                    <Polygon positions={wis} color="green">
                        <Popup>
                            <div className="">
                                <span>Wydział Inżynierii Środowiska</span><br />
                                <span>Nadbystrzycka 40B</span>
                            </div>
                        </Popup>
                    </Polygon>
                    
                    <Polygon positions={zarzadzanie} color="blue">
                        <Popup>
                            <div className="">
                                <span>Wydział Zarządzania</span><br />
                                <span>Nadbystrzycka 38</span>
                            </div>
                        </Popup>
                    </Polygon>
                    
                    <Polygon positions={wmit} color="red">
                        <Popup>
                            <div className="">
                                <span>Wydział Zarządzania</span><br />
                                <span>Nadbystrzycka 38</span>
                            </div>
                        </Popup>
                    </Polygon>
                    
                    <Polygon positions={citt} color="orange">
                        <Popup>
                            <div className="">
                                <span>Centrum Innowacji i Transferu Technologii Politechniki Lubelskiej</span><br />
                                <span>Nadbystrzycka 38H</span>
                            </div>
                        </Popup>
                    </Polygon>
                </MapContainer>
                <div className=" absolute top-8 right-5 z-50  ml-[75%] h-[30%] w-[30%] bg-[#1e293b] rounded-[10px] border border-white ">
                   
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

export default function MapaKampusu({ auth, listaBudynkow, sale }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Mapa kampusu"/>
            <MenuStudenta/>
            <Content listaBudynkow={listaBudynkow} sale={sale}/>
        </div>
    );
}
