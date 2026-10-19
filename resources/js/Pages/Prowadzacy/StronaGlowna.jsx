import { Head } from "@inertiajs/react";
import MenuProwadzacy from "../../Components/MenuProwadzacy";

export default function ProwadzacyGlowna({ auth }){
    return (
        <div className="flex">
            <Head title="Strona główna"/>
            <MenuProwadzacy/>
        </div>
    );
}