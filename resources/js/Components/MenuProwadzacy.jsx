
import { Link } from "@inertiajs/react";
import { useState } from "react";

import Logo from "@/../images/logo.png";
import Notification from "@/../images/notifications-sharp.png";
import Settings from "@/../images/settings-rounded.png";
import Exit from "@/../images/logout-sharp.png";
import Account from "@/../images/account-box-outline.png";
import Calendar from "@/../images/calendar-month-outline-sharp.png";
import Map from "@/../images/map-search-outline-rounded.png";
import Bell from "@/../images/doorbell-outline.png";
import List from "@/../images/list-alt-outline-sharp.png";
import Reward from "@/../images/rewarded-ads-outline-rounded.png";
import Chat from "@/../images/chat-bubble-outline.png";

export default function MenuProwadzacy() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            href: "/mojedane",
            label: "Moje dane",
            icon: Account,
        },
        {
            href: "/planzajec",
            label: "Plan Zajęć",
            icon: Calendar,
        },
        {
            href: "/mapa",
            label: "Mapa kampusu",
            icon: Map,
        },
        {
            href: "/ogloszeniaiankiety",
            label: "Ogłoszenia i ankiety",
            icon: Bell,
        },
        {
            href: "/prowadzacy/konsultacje",
            label: "Konsultacje",
            icon: Chat,
        },
        {
            href: "/prowadzacy/rezerwacje",
            label: "Rezerwacje sal",
            icon: Chat,
        },
        {
            href: "/prowadzacy/wystawienieocen",
            label: "Wystawienie ocen",
            icon: Reward,
        },
        {
            href: "/prowadzacy/mojekursy",
            label: "Moje kursy",
            icon: List,
        },
        {
            href: "/prowadzacy/komunikaty",
            label: "Komunikaty",
            icon: Bell,
        },
    ];

    return (
        <>
            <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed left-3 top-3 z-[60] inline-flex h-9 w-9 items-center justify-center rounded-md border border-theme-muted bg-theme-surface text-theme-text md:hidden"
                aria-label={
                    isMenuOpen ? "Zamknij menu" : "Otwórz menu"
                }
                aria-expanded={isMenuOpen}
            >
                {isMenuOpen ? (
                    <span className="text-[24px] leading-none">
                        &times;
                    </span>
                ) : (
                    <span className="flex w-4 flex-col gap-1">
                        <span className="block h-0.5 w-full rounded-full bg-current" />
                        <span className="block h-0.5 w-full rounded-full bg-current" />
                        <span className="block h-0.5 w-full rounded-full bg-current" />
                    </span>
                )}
            </button>

            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-[40] bg-black/60 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-[50] flex h-dvh w-[85vw] max-w-[280px] shrink-0 flex-col overflow-hidden border-r border-[#2a3c6a] bg-[#0b1238] text-white transition-transform duration-300 md:sticky md:top-0 md:h-dvh md:w-[250px] md:max-w-none md:translate-x-0 ${
                    isMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                <div className="shrink-0 border-b border-[#2a3c6a] bg-[#0b1238] px-3 pb-4 pt-14 md:pt-4">
                    <Link
                        href="/stronaglowna/prowadzacy"
                        className="flex min-w-0 w-full items-center gap-3 no-underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f3f6ff]/5">
                            <img
                                src={Logo}
                                alt="logo"
                                className="!h-[30px] !w-[30px] !max-w-[30px] shrink-0 object-contain"
                            />
                        </div>

                        <span className="min-w-0 break-words text-[17px] font-semibold tracking-wide text-white">
                            MojaUczelnia
                        </span>
                    </Link>

                    <div className="mt-4 grid w-full grid-cols-3 gap-1 rounded-[12px] border border-[#2a3c6a] bg-[#121d4a] p-1">
                        <Link
                            href="/powiadomienia"
                            className="flex h-[38px] min-w-0 items-center justify-center rounded-[8px] transition-all duration-200 hover:bg-[#24345e]"
                            aria-label="Powiadomienia"
                            title="Powiadomienia"
                        >
                            <img
                                src={Notification}
                                alt=""
                                className="!h-[19px] !w-[19px] !max-w-[19px] shrink-0 object-contain"
                            />
                        </Link>

                        <Link
                            href="/ustawienia"
                            className="flex h-[38px] min-w-0 items-center justify-center rounded-[8px] transition-all duration-200 hover:bg-[#24345e]"
                            aria-label="Ustawienia"
                            title="Ustawienia"
                        >
                            <img
                                src={Settings}
                                alt=""
                                className="!h-[19px] !w-[19px] !max-w-[19px] shrink-0 object-contain"
                            />
                        </Link>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex h-[38px] min-w-0 cursor-pointer items-center justify-center rounded-[8px] transition-all duration-200 hover:bg-[#8b2635]"
                            aria-label="Wyloguj"
                            title="Wyloguj"
                        >
                            <img
                                src={Exit}
                                alt=""
                                className="!h-[19px] !w-[19px] !max-w-[19px] shrink-0 object-contain"
                            />
                        </Link>
                    </div>
                </div>

                <nav className="hide-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 text-[#eaf0ff]">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full no-underline"
                        >
                            <div className="flex min-h-[42px] items-center gap-[10px] border-b border-[#2a3c6a] px-2 py-2 text-[13px] text-white transition-colors hover:bg-[#121d4a]">
                                <img
                                    src={item.icon}
                                    alt=""
                                    className="!h-[16px] !w-[16px] !max-w-[16px] shrink-0 object-contain opacity-90"
                                />

                                <span className="min-w-0 break-words">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}
