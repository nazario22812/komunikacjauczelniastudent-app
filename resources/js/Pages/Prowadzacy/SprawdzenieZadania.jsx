import React, { useEffect, useState } from "react";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import BackButton from "../../Components/BackButton";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MenuProwadzacy from "../../Components/MenuProwadzacy";
import { ToastContainer, toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

function Content({ studenci }) {
    console.log(studenci);
    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={() => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">
                    Sprawdzenie zadania
                </span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-1 rounded-b-[10px] flex flex-col relative ">
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-[15px]">
                    <div className=" bg-theme-surface h-full px-[37px] py-[22px] rounded-[15px] ">
                        <span className="text-theme-text font-bold text-[40px]">
                            Lista studentów
                        </span>
                        <div className="w-full h-[90%] grid grid-cols-2 py-4 px-2">
                            <div className="h-full rounded-[10px] border border-gray-700/60 overflow-y-auto pr-2 custom-scrollbar">
                                <table className="w-full text-center border-collapse">
                                    
                                    <tbody className="divide-y divide-gray-800 text-[14px] ">
                                        {studenci && studenci.length > 0 ? (
                                            studenci.map((student) => (
                                                <tr
                                                    key={
                                                        student.idStudent
                                                    }
                                                    className="border-b  border-gray-700/50  hover:bg-theme-dark-slate/50 transition-colors text-[20px] hover:cursor-pointer"
                                                    // onClick={() =>
                                                    //     router.get(
                                                    //         `/prowadzacy/otworzzadanie/${zadanie.idZadanie}`,
                                                    //     )
                                                    // }
                                                >
                                                    <td className="p-3 font-medium text-theme-text">
                                                        {student.index}
                                                    </td>
                                                    <td className="p-3 font-medium text-theme-text">
                                                        {student.user.name} {student.user.surname}
                                                    </td>
                                                    
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    className="p-4 text-theme-text text-theme-muted text-center"
                                                >
                                                    Brak studentów
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>


                            <div className="h-full rounded-[10px] border border-gray-700/60 overflow-y-auto pr-2 custom-scrollbar">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SprawdzenieZadania({ auth, studenci }) {
    // const props = usePage().props;

    // const message = props.flash?.status || props.status;
    // const error = props.flash?.error || props.error;
    // useEffect(() => {
    //     if (message) {
    //         toast.info(message, {
    //             position: "bottom-right",
    //             autoClose: 5000,
    //             theme: "dark",
    //         });
    //     }
    //     if (error) {
    //         toast.error(error, {
    //             position: "bottom-right",
    //             autoClose: 5000,
    //             theme: "dark",
    //         });
    //     }
    // }, [message, error]);

    return (
        <div className="flex">
            {/* <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            /> */}
            <Head title="Moje kursy" />
            <MenuProwadzacy />
            <Content studenci={studenci} />
        </div>
    );
}
