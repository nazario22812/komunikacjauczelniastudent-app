import React from "react";
import MenuStudenta from "../Components/MenuStudenta";
import { Head } from "@inertiajs/react";

export default function EDziekanat({ auth }) {
    return (
        // <div>
        //     <p>ja student</p>
        // </div>

        // 
        <div>
            <Head title="E-Dziekanat"/>
            <MenuStudenta/>
        </div>
    );
}
