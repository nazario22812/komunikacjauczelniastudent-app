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
    const [isOpen2, setIsOpen2] = useState(false)
    return(
        <nav className="bg-[#04041D] border border-[000000] w-[20%] h-screen">
            {/* top menu z logo i td */}
            <div className="px-[10px] py-[10px] gap-x-[10px] flex">
                <img src={Logo} alt="logo" className="w-[24px] h-[24px]" />
                <Link href='/stronaglowna/student' method="get" as='button' className="hover:cursor-pointer"><p className="font-bold text-white text-[14px]">MojaUczelnia</p></Link>
                <div className="w-full gap-x-[10px] px-[10px] flex items-center justify-end">
                    <Link><img src={Notification} alt="powiadomienia" className="hover:cursor-pointer" /></Link>
                    <Link><img src={Settings} alt="ustawienia" className="hover:cursor-pointer"/></Link>
                    <Link href='/logout' method="post" as="button" className="hover:cursor-pointer"><img src={Exit} alt="logout" /></Link>
                </div>
            </div>


            {/* tyl opcji menu */}
            <div className="px-[10px] text-[#73768C] ">
                <Link href='/mojedane' method="get" as="button" className="hover:cursor-pointer w-full">
                    <div className="border-b-1 border-[#73768C] flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Account} alt="mojedane" />
                        <span className="text-[12px]">Moje dane</span>

                    </div>
                </Link>
                <Link>    
                    <div className="border-b-1 border-[#73768C] flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Calendar} alt="planzajec" />
                        <span className="text-[12px]">Plan Zajęć</span>
                    </div>
                </Link>
                
                <Link>
                    <div className="border-b-1 border-[#73768C] flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Inbox} alt="edziekanat" />
                        <span className="text-[12px]">E-Dziekanat</span>
                    </div>
                </Link>

                <Link>    
                    <div className="border-b-1 border-[#73768C] flex h-[30px] gap-x-[10px] items-center fustify-start">
                        <img src={Wallet} alt="finanse" />
                        <span className="text-[12px]">Moje Finanse</span>
                    </div>
                </Link>
                {/* pierwszy dropdown  */}
                <div className="pt-[10px] pr-[10px] ">
                    <div className="text-[#676C98]">
                        <button onClick={() => { setIsOpen(!isOpen) }} className="flex items-center fustify-start gap-x-[5px] hover:cursor-pointer">
                            <span className="text-[13px]">Komunikacja i organizacja</span>
                            <span className={`text-[12px] transform transition-transform duration-300  ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                    </div>
                    <div className={`text-[13px] pl-[15px] overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[150px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <Link>
                            <div className="flex p-1 gap-x-[10px]">
                                <img src={Chat} alt="konsultacje" />
                                <span> Konsultacje</span>    
                            </div>
                        </Link>


                        <Link>
                            <div className="flex p-1 gap-x-[10px]">
                                <img src={Map} alt="mapakampusu" />
                                <span>Mapa kampusu</span>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex p-1 gap-x-[10px]">
                                <img src={Bell} alt="ogloszeniaiankiety" />
                                <span>Ogłoszenia i ankiety</span>
                            </div>
                        </Link>    
                    </div> 
                </div>

                {/* drugi dropdown */}
                <div className="pt-[10px] pr-[10px] ">
                    <div className="text-[#676C98]">
                        <button onClick={() => { setIsOpen2(!isOpen2) }} className="flex items-center fustify-start gap-x-[5px] hover:cursor-pointer">
                            <span className="text-[13px]">Nauka</span>
                            <span className={`text-[12px] transform transition-transform duration-300  ${isOpen2 ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                    </div>
                    <div className={`text-[13px] pl-[15px] overflow-hidden transition-all duration-400 ease-in-out ${isOpen2 ? 'max-h-[150px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <Link>    
                            <div className="flex p-1 gap-x-[10px]">
                                <img src={Reward} alt="oceny" />
                                <span>Oceny</span>    
                            </div>
                        </Link>
                        <Link>
                            <div className="flex p-1 gap-x-[10px]">
                                <img src={List} alt="mojekursy" />
                                <span>Moje kursy</span>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex p-1 gap-x-[10px]">
                                <img src={Task} alt="mojezadania" />
                                <span>Moje zadania</span>
                            </div>
                        </Link>
                    </div> 
                </div>
            </div>
        </nav>
    );
}