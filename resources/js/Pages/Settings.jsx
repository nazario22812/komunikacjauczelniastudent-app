import React, { useEffect, useState } from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import BackButton from "../Components/BackButton";
import MenuStudenta from "../Components/MenuStudenta";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";
import { ToastContainer, toast } from "react-toastify";

function Content({ theme = "dark" }) {
    const currentTheme =
        typeof window !== "undefined" &&
        (localStorage.getItem("theme") === "light" ||
            localStorage.getItem("theme") === "dark")
            ? localStorage.getItem("theme")
            : theme;

    const {
        data: themeData,
        setData: setThemeData,
        post: postTheme,
        processing: processingTheme,
    } = useForm({
        theme: currentTheme,
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        post: postPassword,
        processing: processingPassword,
        errors: passwordErrors,
    } = useForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const applyTheme = (nextTheme) => {
        const resolvedTheme = nextTheme === "light" ? "light" : "dark";

        localStorage.setItem("theme", resolvedTheme);
        document.body.classList.remove("theme-dark", "theme-light");
        document.body.classList.add(
            resolvedTheme === "light" ? "theme-light" : "theme-dark"
        );
    };

    const submitTheme = (e) => {
        e.preventDefault();

        const nextTheme = themeData.theme === "light" ? "light" : "dark";

        applyTheme(nextTheme);
        postTheme("/ustawienia/theme");
    };

    const submitPassword = (e) => {
        e.preventDefault();
        postPassword("/ustawienia/haslo", {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="settings-page bg-theme-page flex min-h-dvh min-w-0 w-full flex-1 flex-col box-border p-2 sm:p-[10px]">
            {/* Nagłówek strony */}
            <div className="bg-theme-page mx-auto flex h-[54px] w-full shrink-0 items-center justify-center rounded-t-[16px] border-b border-theme-muted px-2 sm:px-3">
                <div className="w-[42px] flex items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>

                <span className="font-bold text-[18px] text-theme-text flex-1 text-center">
                    Ustawienia
                </span>

                <div className="w-[42px]" />
            </div>

            {/* Główna zawartość */}
            <div className="relative flex min-h-0 w-full flex-1 flex-col rounded-b-[16px] px-0 pb-2 pt-3 sm:px-2 md:px-4 md:pt-4">
                <div className="bg-theme-slate mx-auto w-full min-w-0 flex-1 overflow-hidden rounded-[20px] border border-theme-muted">

                    {/* Nagłówek ustawień */}
                    <div className="border-b border-theme-muted bg-theme-surface p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-muted">
                                    Konto
                                </p>

                                <h2 className="text-xl font-bold text-theme-text sm:text-2xl">
                                    Twoje ustawienia
                                </h2>
                            </div>

                            <div className="w-fit max-w-full rounded-full border border-theme-muted bg-theme-page px-3 py-1 text-sm text-theme-text">
                                {themeData.theme === "light"
                                    ? "Jasny motyw"
                                    : "Ciemny motyw"}
                            </div>
                        </div>
                    </div>

                    {/* Responsywna siatka formularzy */}
                    <div className="grid min-w-0 grid-cols-1 gap-4 p-3 sm:gap-5 sm:p-4 md:p-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">

                        {/* Formularz motywu */}
                        <form
                            onSubmit={submitTheme}
                            className="min-w-0 rounded-[18px] border border-theme-muted bg-theme-surface p-3 sm:p-4 md:p-5"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-orange/15 text-lg text-theme-orange">
                                    ☼
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold text-theme-text">
                                        Motyw interfejsu
                                    </h3>

                                    <p className="text-sm text-theme-muted">
                                        Dopasuj wygląd aplikacji do swoich preferencji.
                                    </p>
                                </div>
                            </div>

                            <label
                                htmlFor="theme"
                                className="mb-2 block text-sm font-medium text-theme-text"
                            >
                                Wybierz motyw
                            </label>

                            <select
                                id="theme"
                                value={themeData.theme}
                                onChange={(e) =>
                                    setThemeData("theme", e.target.value)
                                }
                                className="block min-w-0 w-full max-w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-base text-theme-text outline-none ring-0 transition focus:border-theme-orange"
                            >
                                <option value="dark">Ciemny</option>
                                <option value="light">Jasny</option>
                            </select>

                            <button
                                type="submit"
                                disabled={processingTheme}
                                className="mt-5 w-full rounded-xl bg-theme-orange px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processingTheme
                                    ? "Zapisywanie..."
                                    : "Zapisz motyw"}
                            </button>
                        </form>

                        {/* Formularz zmiany hasła */}
                        <form
                            onSubmit={submitPassword}
                            className="min-w-0 rounded-[18px] border border-theme-muted bg-theme-surface p-3 sm:p-4 md:p-5"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-cyan/15 text-lg text-theme-cyan">
                                    🔒
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold text-theme-text">
                                        Zmiana hasła
                                    </h3>

                                    <p className="text-sm text-theme-muted">
                                        Ustaw nowe hasło do swojego konta.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Aktualne hasło */}
                                <div>
                                    <label
                                        htmlFor="current_password"
                                        className="mb-2 block text-sm font-medium text-theme-text"
                                    >
                                        Aktualne hasło
                                    </label>

                                    <input
                                        id="current_password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                        className="block min-w-0 w-full max-w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-theme-text outline-none transition focus:border-theme-cyan"
                                        placeholder="Wpisz obecne hasło"
                                    />

                                    {passwordErrors.current_password && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {passwordErrors.current_password}
                                        </p>
                                    )}
                                </div>

                                {/* Nowe hasło */}
                                <div>
                                    <label
                                        htmlFor="new_password"
                                        className="mb-2 block text-sm font-medium text-theme-text"
                                    >
                                        Nowe hasło
                                    </label>

                                    <input
                                        id="new_password"
                                        type="password"
                                        value={passwordData.new_password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "new_password",
                                                e.target.value
                                            )
                                        }
                                        className="block min-w-0 w-full max-w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-theme-text outline-none transition focus:border-theme-cyan"
                                        placeholder="Minimum 8 znaków"
                                    />

                                    {passwordErrors.new_password && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {passwordErrors.new_password}
                                        </p>
                                    )}
                                </div>

                                {/* Potwierdzenie hasła */}
                                <div>
                                    <label
                                        htmlFor="new_password_confirmation"
                                        className="mb-2 block text-sm font-medium text-theme-text"
                                    >
                                        Powtórz nowe hasło
                                    </label>

                                    <input
                                        id="new_password_confirmation"
                                        type="password"
                                        value={
                                            passwordData.new_password_confirmation
                                        }
                                        onChange={(e) =>
                                            setPasswordData(
                                                "new_password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="block min-w-0 w-full max-w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-theme-text outline-none transition focus:border-theme-cyan"
                                        placeholder="Potwierdź nowe hasło"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processingPassword}
                                className="mt-5 w-full rounded-xl bg-theme-accent-indigo px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processingPassword
                                    ? "Zmiana hasła..."
                                    : "Zmień hasło"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Settings({ auth, theme = "dark", rol }) {

    const props = usePage().props;
        const message = props.flash?.status || props.status;
    
        useEffect(() => {
            if (message) {
                toast.info(message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "dark",
                });
            }
        }, [message]);

    let menu;

    if (rol === "Student") {
        menu = <MenuStudenta />;
    }

    if (rol === "Prowadzący") {
        menu = <MenuProwadzacy />;
    }

    if (rol === "Pracownik Dziekanatu") {
        menu = <MenuDziekanat />;
    }

    return (
        <div className="flex min-h-dvh min-w-0 w-full">
            <ToastContainer
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
            />
            <Head title="Ustawienia" />
            {menu}
            <Content theme={theme} />
        </div>
    );
}
