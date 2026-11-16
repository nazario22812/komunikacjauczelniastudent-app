import { Link } from "@inertiajs/react";
import { useState } from "react";

// import ikonek
import Logo from '@/../images/logo.png';
import Notification from '@/../images/notifications-sharp.png';
import Settings from '@/../images/settings-rounded.png';
import Exit from '@/../images/logout-sharp.png';
import Account from '@/../images/account-box-outline.png';
import Calendar from '@/../images/calendar-month-outline-sharp.png';
import Inbox from '@/../images/inbox-text-rounded.png';
import Wallet from '@/../images/wallet-sharp.png';
import Chat from '@/../images/chat-bubble-outline.png';
import Map from '@/../images/map-search-outline-rounded.png';
import Bell from '@/../images/doorbell-outline.png';
import Reward from '@/../images/rewarded-ads-outline-rounded.png';
import List from '@/../images/list-alt-outline-sharp.png';
import Task from '@/../images/task-outline-sharp.png';

export default function MenuStudenta(){
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
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
                    <Link href='/student/edziekanat' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Inbox} alt="edziekanat" className="h-4 w-4" />
                            <span className="text-[12px]">E-Dziekanat</span>
                        </div>
                    </Link>
                    <Link href='/student/mojefinanse' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[38px] items-center gap-x-[10px] border-b border-theme-muted px-2">
                            <img src={Wallet} alt="finanse" className="h-4 w-4" />
                            <span className="text-[12px]">Moje Finanse</span>
                        </div>
                    </Link>

                    <div className="pt-3 pr-2">
                        <div className="text-theme-subtle">
                            <button onClick={() => { setIsOpen(!isOpen) }} className="flex w-full items-center justify-between gap-x-[5px] px-2 py-2 text-left hover:cursor-pointer">
                                <span className="text-[13px]">Komunikacja i organizacja</span>
                                <span className={`text-[12px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                        </div>
                        <div className={`overflow-hidden pl-3 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <Link href='/student/konsultacje' method="get" as="button" className="hover:cursor-pointer w-full block">
                                <div className="flex gap-x-[10px] px-2 py-2">
                                    <img src={Chat} className="h-4 w-4" alt="konsultacje" />
                                    <span> Konsultacje</span>
                                </div>
                            </Link>
                            <Link href='/mapa' method="get" as="button" className="hover:cursor-pointer w-full block">
                                <div className="flex gap-x-[10px] px-2 py-2">
                                    <img src={Map} className="h-4 w-4" alt="mapakampusu" />
                                    <span>Mapa kampusu</span>
                                </div>
                            </Link>
                            <Link href='/ogloszeniaiankiety' method="get" as="button" className="hover:cursor-pointer w-full block">
                                <div className="flex gap-x-[10px] px-2 py-2">
                                    <img src={Bell} className="h-4 w-4" alt="ogloszeniaiankiety" />
                                    <span>Ogłoszenia i ankiety</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="pt-3 pr-2">
                        <div className="text-theme-subtle">
                            <button onClick={() => { setIsOpen2(!isOpen2) }} className="flex w-full items-center justify-between gap-x-[5px] px-2 py-2 text-left hover:cursor-pointer">
                                <span className="text-[13px]">Nauka</span>
                                <span className={`text-[12px] transition-transform duration-300 ${isOpen2 ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                        </div>
                        <div className={`overflow-hidden pl-3 transition-all duration-300 ease-in-out ${isOpen2 ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <Link href='/student/ocenykoncowe' method="get" as="button" className="hover:cursor-pointer w-full block">
                                <div className="flex gap-x-[10px] px-2 py-2">
                                    <img src={Reward} className="h-4 w-4" alt="oceny" />
                                    <span>Oceny</span>
                                </div>
                            </Link>
                            <Link href='/student/mojekursy' method="get" as="button" className="hover:cursor-pointer w-full block">
                                <div className="flex gap-x-[10px] px-2 py-2">
                                    <img src={List} className="h-4 w-4" alt="mojekursy" />
                                    <span>Moje kursy</span>
                                </div>
                            </Link>
                            <Link href='/student/mojezadania' method="get" as="button" className="hover:cursor-pointer w-full block">
                                <div className="flex gap-x-[10px] px-2 py-2">
                                    <img src={Task} className="h-4 w-4" alt="mojezadania" />
                                    <span>Moje zadania</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}