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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(
        <aside className="w-full border-b border-theme-muted bg-theme-page md:w-[260px] md:border-b-0 md:border-r md:border-theme-muted md:h-screen">
            <div className="flex items-center justify-between gap-2 border-b border-theme-muted bg-theme-surface px-3 py-3">
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-theme-muted bg-theme-page text-lg text-theme-text md:hidden"
                        aria-label="Otwórz menu"
                    >
                        ☰
                    </button>
                    <img src={Logo} alt="logo" className="h-6 w-6 shrink-0" />
                    <Link href='/stronaglowna/student' method="get" as='button' className="hover:cursor-pointer min-w-0">
                        <p className="truncate text-sm font-bold text-theme-text">MojaUczelnia</p>
                    </Link>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Link href='/powiadomienia' method="get" as="button" className="hover:cursor-pointer rounded-lg border border-theme-muted bg-theme-page p-2"><img src={Notification} alt="powiadomienia" className="h-4 w-4" /></Link>
                    <Link href='/ustawienia' method="get" as="button" className="hover:cursor-pointer rounded-lg border border-theme-muted bg-theme-page p-2"><img src={Settings} alt="ustawienia" className="h-4 w-4" /></Link>
                    <Link href='/logout' method="post" as="button" className="hover:cursor-pointer rounded-lg border border-theme-muted bg-theme-page p-2"><img src={Exit} alt="logout" className="h-4 w-4" /></Link>
                </div>
            </div>

            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                <div className="flex items-center justify-end gap-2 border-b border-theme-muted px-3 py-2 md:hidden">
                    <Link href='/powiadomienia' method="get" as="button" className="hover:cursor-pointer rounded-lg border border-theme-muted bg-theme-page p-2"><img src={Notification} alt="powiadomienia" className="h-4 w-4" /></Link>
                    <Link href='/ustawienia' method="get" as="button" className="hover:cursor-pointer rounded-lg border border-theme-muted bg-theme-page p-2"><img src={Settings} alt="ustawienia" className="h-4 w-4" /></Link>
                    <Link href='/logout' method="post" as="button" className="hover:cursor-pointer rounded-lg border border-theme-muted bg-theme-page p-2"><img src={Exit} alt="logout" className="h-4 w-4" /></Link>
                </div>

                <div className="px-3 py-3 text-theme-muted">
                    <Link href='/mojedane' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Account} alt="mojedane" className="h-4 w-4" />
                            <span className="text-[12px]">Moje dane</span>
                        </div>
                    </Link>
                    <Link href='/planzajec' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Calendar} alt="planzajec" className="h-4 w-4" />
                            <span className="text-[12px]">Plan Zajęć</span>
                        </div>
                    </Link>
                    <Link href='/mapa' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Map} alt="mapakampusu" className="h-4 w-4" />
                            <span className="text-[12px]">Mapa kampusu</span>
                        </div>
                    </Link>
                    <Link href='/ogloszeniaiankiety' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Bell} alt="ogloszeniaiankiety" className="h-4 w-4" />
                            <span className="text-[12px]">Ogłoszenia i ankiety</span>
                        </div>
                    </Link>
                    <Link href='/prowadzacy/konsultacje' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Chat} alt="konsultacje" className="h-4 w-4" />
                            <span className="text-[12px]">Konsultacje</span>
                        </div>
                    </Link>
                    <Link href='/prowadzacy/rezerwacje' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Chat} alt="rezerwacje" className="h-4 w-4" />
                            <span className="text-[12px]">Rezerwacje sal</span>
                        </div>
                    </Link>
                    <Link href='/prowadzacy/wystawienieocen' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Reward} alt="wystawienieocen" className="h-4 w-4" />
                            <span className="text-[12px]">Wystawienie ocen</span>
                        </div>
                    </Link>
                    <Link href='/prowadzacy/mojekursy' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={List} alt="mojekursy" className="h-4 w-4" />
                            <span className="text-[12px]">Moje kursy</span>
                        </div>
                    </Link>
                    <Link href='/prowadzacy/komunikaty' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Bell} alt="komunikaty" className="h-4 w-4" />
                            <span className="text-[12px]">Komunikaty</span>
                        </div>
                    </Link>
                </div>
            </div>
        </aside>
    );
}