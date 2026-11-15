import React from "react";
import MenuDziekanat from "../../Components/MenuDziekanat";
import { Head } from "@inertiajs/react";

export default function Main({ auth }){
    return (
        <div className="flex">
            <Head title="Strona główna"/>
            <MenuDziekanat/>
        </div>
    );
}