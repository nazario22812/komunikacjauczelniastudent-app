import React, { useState } from "react";
import MenuStudenta from "../Components/MenuStudenta";
import BackButton from "../Components/BackButton";
import { Head, router, Link, useForm } from "@inertiajs/react";
import Form from 'react-bootstrap/Form';




function Content({}){
    const tematy = [
        'Podanie o warunkową rejestrację',
        'Podanie o powtarzanie roku / semestru',
        'Podanie o udzielenie urlopu',
        'Podanie o wznowienie studiów',
        'Wniosek o Indywidualną Organizację Studiów',
        'Prośba o wyrażenie zgody na dodatkowy termin egzaminu/zaliczenia lub egzamin komisyjny',
        'Podanie o wybór lub zmianę specjalności',
        'Wniosek o rozłożenie opłaty za czesne na raty',
        'Wniosek o rozłożenie na raty opłaty za punkty kredytowe ECTS',
        'Podanie o zwolnienie z opłat za czesne',
        'Podanie o wybór / zmianę promotora lub tematu pracy dyplomowej',
        'Podanie o przedłużenie terminu złożenia pracy dyplomowej',
        'Podanie o dopuszczenie do egzaminu dyplomowego',
        'Wniosek o wydanie dodatkowego odpisu dyplomu lub suplementu',
        'Podanie ogólne do Dziekana',
        'Wniosek o wydanie duplikatu legitymacji studenckiej',
        'Wnioski o stypendia'
    ];

    const [listaplikow, setlistaplikow] = useState([]);

    const { data, setData, get, post, processing, errors, reset } = useForm({
        temat:'',
        tresc:'',
        plik: []
    });

    const addPlik = (e) => {
        const nowyplik = Array.from(e.target.files);
        const aktulizacjalistyplikow = [...listaplikow, ...nowyplik];
        setlistaplikow(aktulizacjalistyplikow);
        setData('plik', aktulizacjalistyplikow);
        e.target.value = null;
    }

    const wyslijpodanie = (e) => {
        e.preventDefault();

        post('/zlozpodanie', {
            forceFormData: true,
        });
    }
    return (
       
        <div className="bg-[#04041D] w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-[#04041d] w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-white p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-white w-full ">E-Podanie</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-[#1e293b] w-full h-full mx-auto pt-[35px] pb-[10px] px-[75px] rounded-[15px] ">
                    <div className="w-full text-center text-white font-bold text-[58px]">
                        <span >Nowe podanie</span>
                    </div>
                    <form onSubmit={wyslijpodanie} >
                        <div className="px-[40px] py-[16px] w-full  ">
                            <span className="w-[60%] block mx-auto text-[24px] text-[white] text-left">Typ podania</span>
                            <Form.Select className="w-[60%] block mx-auto bg-[#06062c] rounded-[15px] text-[16px] h-[50px] px-3 text-[#73768C] border border-white" value={data.temat} onChange={(e) => {setData('temat', e.target.value)}}>
                                <option value="">wybierz typ podania</option>
                                {tematy.map((temat) => (
                                    <option key={temat}  value={temat}>{temat}</option>
                                ))}
                            
                            </Form.Select>
                            <p className="text-white text-[12px] mx-auto text-center ">{errors.temat}</p>

                        </div>
                        <div className="px-[40px] py-[16px] w-full mt-1">
                            <span  className="w-[60%] block mx-auto text-[24px] text-[white] text-left">Treść podania</span>
                            <textarea className="w-[60%] block mx-auto bg-[#06062c] rounded-[15px] text-[16px] h-[300px] px-3 py-2 text-[#73768C] border border-white" placeholder="podaj treść podania" value={data.tresc} onChange={(e) => {setData('tresc', e.target.value)}}/>
                            <p className="text-white text-[12px] mx-auto text-center ">{errors.tresc}</p>
                        </div>
                        <div className="px-[40px] py-[16px] w-full mt-1">
                            <span  className="w-[60%] block mx-auto text-[24px] text-[white] text-left">Załączniki</span>
                            <input
                                type="file"
                                multiple
                                
                                className="w-[60%] block mx-auto bg-[#06062c] rounded-[15px] text-[16px] h-[50px] px-3 py-3 text-[#73768C] border border-white file:text-black file:bg-white file:w-[30%]"
                                onChange={addPlik}
                            />
                            {listaplikow && listaplikow.length > 0  && ( 
                                <div className="flex gap-1 w-full pt-2">
                                    {Array.from(listaplikow).map((plik,index) => (
                                        <div key={index}>
                                            <span className="text-[17px] text-[#73768C]">🗒️{plik.name}, </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                        </div>
                        <div className="px-[40px] py-[16px] w-full ">
                            <button disabled={processing} type="submit" className="w-[20%] h-[60px] text-[32px] block mx-auto text-white bg-[#f97316] rounded-[15px] hover:cursor-pointer active:bg-[#c55b11]">
                                Wyślij
                            </button>
                        </div>
                    </form>
                    
                    
                
                </div>
                
            </div>        
        </div>
    );
}


export default function Podanieform({ auth }) {
    return (
      
        <div className="flex">
            <Head title="E-Dziekanat"/>
            <MenuStudenta/>
            <Content />
        </div>
    );
}
