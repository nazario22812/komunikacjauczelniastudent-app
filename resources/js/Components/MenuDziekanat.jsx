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
import Inbox from '@/../images/inbox-text-rounded.png';
import List from '@/../images/list-alt-outline-sharp.png';
import Wallet from '@/../images/wallet-sharp.png';

export default function MenuDziekanat(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md border border-theme-muted bg-theme-surface text-theme-text md:hidden"
                aria-label="Otwórz menu"
            >
                <span className="flex w-4 flex-col gap-1">
                    <span className="block h-0.5 w-full rounded-full bg-current" />
                    <span className="block h-0.5 w-full rounded-full bg-current" />
                    <span className="block h-0.5 w-full rounded-full bg-current" />
                </span>
            </button>

            <aside className={`fixed left-0 top-0 z-40 h-screen w-[78vw] max-w-[240px] border-r border-[#2a3c6a] bg-[#0b1238] text-white transition-transform duration-300 md:static md:w-[250px] md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-between gap-2 border-b border-[#2a3c6a] bg-[#0b1238] px-3 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#f3f6ff]/5 ring-1 ring-[#dfe8ff]/15">
                            <img src={Logo} alt="logo" className="h-6 w-6 shrink-0" />
                        </div>
                        <Link href='/stronaglowna/student' method="get" as='button' className="hover:cursor-pointer min-w-0 max-w-[calc(100%-48px)]">
                            <p className="truncate text-[11px] font-semibold tracking-wide text-white sm:text-sm">MojaUczelnia</p>
                        </Link>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <Link href='/powiadomienia' method="get" as="button" className="hover:cursor-pointer rounded-lg border border-[#2a3c6a] bg-[#121d4a] p-2"><img src={Notification} alt="powiadomienia" className="h-4 w-4" /></Link>
                        <Link href='/ustawienia' method="get" as="button" className="hover:cursor-pointer rounded-lg border border-[#2a3c6a] bg-[#121d4a] p-2"><img src={Settings} alt="ustawienia" className="h-4 w-4" /></Link>
                        <Link href='/logout' method="post" as="button" className="hover:cursor-pointer rounded-lg border border-[#2a3c6a] bg-[#121d4a] p-2"><img src={Exit} alt="logout" className="h-4 w-4" /></Link>
                    </div>
                </div>

                <div className="px-3 py-3 text-[#eaf0ff]">
                    <Link href='/mojedane' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[42px] items-center gap-x-[10px] border-b border-[#2a3c6a] px-2 text-[13px] text-white">
                            <img src={Account} alt="mojedane" className="h-4 w-4 shrink-0 object-contain opacity-90" />
                            <span>Moje dane</span>
                        </div>
                    </Link>
                    <Link href='' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[42px] items-center gap-x-[10px] border-b border-[#2a3c6a] px-2 text-[13px] text-white">
                            <img src={Calendar} alt="planzajec" className="h-4 w-4 shrink-0 object-contain opacity-90" />
                            <span>Plany Zajęć</span>
                        </div>
                    </Link>
                    <Link href='' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[42px] items-center gap-x-[10px] border-b border-[#2a3c6a] px-2 text-[13px] text-white">
                            <img src={Bell} alt="ogloszeniaiankiety" className="h-4 w-4 shrink-0 object-contain opacity-90" />
                            <span>Ogłoszenia i ankiety</span>
                        </div>
                    </Link>
                    <Link href='/dziekanat/podania' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[42px] items-center gap-x-[10px] border-b border-[#2a3c6a] px-2 text-[13px] text-white">
                            <img src={Inbox} alt="edziekanat" className="h-4 w-4 shrink-0 object-contain opacity-90" />
                            <span>Podania</span>
                        </div>
                    </Link>
                    <Link href='' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[42px] items-center gap-x-[10px] border-b border-[#2a3c6a] px-2 text-[13px] text-white">
                            <img src={List} alt="sylabusy" className="h-4 w-4 shrink-0 object-contain opacity-90" />
                            <span>Sylabusy</span>
                        </div>
                    </Link>
                    <Link href='' method="get" as="button" className="hover:cursor-pointer w-full block">
                        <div className="flex h-[42px] items-center gap-x-[10px] border-b border-[#2a3c6a] px-2 text-[13px] text-white">
                            <img src={Wallet} alt="finanse" className="h-4 w-4 shrink-0 object-contain opacity-90" />
                            <span>Finanse studentów</span>
                        </div>
                    </Link>
                </div>
            </aside>
        </>
    );
}