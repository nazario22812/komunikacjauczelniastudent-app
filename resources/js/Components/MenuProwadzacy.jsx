import { Link } from "@inertiajs/react";
import { useState } from "react";

// import ikonek
import Logo from '@/../images/logo.png';
import Notification from '@/../images/notifications-sharp.png';
import Settings from '@/../images/settings-rounded.png';
import Exit from '@/../images/logout-sharp.png';
import Account from '@/../images/account-box-outline.png';
import Calendar from '@/../images/calendar-month-outline-sharp.png';
import Map from '@/../images/map-search-outline-rounded.png';
import Bell from '@/../images/doorbell-outline.png';
import List from '@/../images/list-alt-outline-sharp.png';
import Reward from '@/../images/rewarded-ads-outline-rounded.png';
import Chat from '@/../images/chat-bubble-outline.png';


export default function MenuProwadzacy(){
    
    return(
        <nav className="bg-theme-page border border-theme-black w-[20%] h-screen">
            {/* top menu z logo i td */}
            <div className="bg-theme-dark-page px-[10px] py-[10px] gap-x-[10px] flex">
                <img src={Logo} alt="logo" className="w-[24px] h-[24px]" />
                <Link href='/stronaglowna/student' method="get" as='button' className="hover:cursor-pointer"><p className="font-bold text-white text-[14px]">MojaUczelnia</p></Link>
                <div className="w-full gap-x-[10px] px-[10px] flex items-center justify-end">
                    <Link href='/powiadomienia' method="get" as="button" className="hover:cursor-pointer"><img src={Notification} alt="powiadomienia" /></Link>
                    <Link href='/ustawienia' method="get" as="button" className="hover:cursor-pointer"><img src={Settings} alt="ustawienia" className="hover:cursor-pointer"/></Link>
                    <Link href='/logout' method="post" as="button" className="hover:cursor-pointer"><img src={Exit} alt="logout" /></Link>
                </div>
            </div>


            {/* tyl opcji menu */}
            <div className="px-[10px] text-theme-muted ">
                <Link href='/mojedane' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Account} alt="mojedane" />
                        <span className="text-[12px]">Moje dane</span>

                    </div>
                </Link>
                <Link href='/planzajec' method="get" as="button" className="hover:cursor-pointer w-full">    
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Calendar} alt="planzajec" />
                        <span className="text-[12px]">Plan Zajęć</span>
                    </div>
                </Link>
                
                <Link href='/mapa' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Map} alt="mapakampusu" />
                        <span className="text-[12px]">Mapa kampusu</span>
                    </div>
                </Link>

                <Link href='/ogloszeniaiankiety' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Bell} alt="ogloszeniaiankiety" />
                        <span className="text-[12px]">Ogłoszenia i ankiety</span>
                    </div>
                </Link>
                {/* nowe menu */}
                <Link href='/prowadzacy/konsultacje' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Chat} alt="ogloszeniaiankiety" />
                        <span className="text-[12px]">Konsultacje</span>
                    </div>
                </Link>
                <Link href='/prowadzacy/rezerwacje' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Chat} alt="ogloszeniaiankiety" />
                        <span className="text-[12px]">Rezerwacje sal</span>
                    </div>
                </Link>
                
                <Link href='/ogloszeniaiankiety' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Reward} alt="ogloszeniaiankiety" />
                        <span className="text-[12px]">Wystawienie ocen</span>
                    </div>
                </Link>
                <Link href='/ogloszeniaiankiety' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={List} alt="ogloszeniaiankiety" />
                        <span className="text-[12px]">Moje kursy</span>
                    </div>
                </Link>
                <Link href='/ogloszeniaiankiety' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-theme-muted flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Bell} alt="ogloszeniaiankiety" />
                        <span className="text-[12px]">Komunikaty</span>
                    </div>
                </Link>
                
            </div>
        </nav>
    );
}