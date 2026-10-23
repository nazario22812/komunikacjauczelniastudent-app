import React from "react";
import { Head } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";


export default function Konsultacjaform({}){
    return (
        <div className="flex">
            <Head title="Nowa konsultacja"/>
            <MenuProwadzacy/>
        </div>
    );
}