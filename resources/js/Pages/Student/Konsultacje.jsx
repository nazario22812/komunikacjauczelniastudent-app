import React from "react";
import MenuStudenta from "../../Components/MenuStudenta";
import { Head } from "@inertiajs/react";


function Content({ konsultacje }){
    return (
        <>
            {konsultacje.map((konsultacja) => (
                <span>{konsultacja.TytulNaukowy} {konsultacja.name} {konsultacja.surname} {konsultacja.GodzinaRozpoczecia}-{konsultacja.GodzinaZakonczenia} {konsultacja.nazwa} {konsultacja.numerSali} {konsultacja.data}</span>  
            ) )}
        </>
    )
}


export default function Konsultacje({ auth, konsultacje }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div className="flex">
            <Head title="Konsultacje"/>
            <MenuStudenta/>
            <Content konsultacje={konsultacje}/>
        </div>
    );
}
