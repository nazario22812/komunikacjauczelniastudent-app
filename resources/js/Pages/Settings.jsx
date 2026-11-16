import { useForm , Head} from "@inertiajs/react";
import React from "react";
import BackButton from "../Components/BackButton";
import MenuStudenta from "../Components/MenuStudenta";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";


function Content({ theme = 'dark'  }){
    const currentTheme = typeof window !== 'undefined' && (localStorage.getItem('theme') === 'light' || localStorage.getItem('theme') === 'dark')
        ? localStorage.getItem('theme')
        : theme;

    const { data: themeData, setData: setThemeData, post: postTheme, processing: processingTheme } = useForm({
        theme: currentTheme,
    });

    const { data: passwordData, setData: setPasswordData, post: postPassword, processing: processingPassword, errors: passwordErrors } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const applyTheme = (nextTheme) => {
        const resolvedTheme = nextTheme === 'light' ? 'light' : 'dark';

        localStorage.setItem('theme', resolvedTheme);
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(resolvedTheme === 'light' ? 'theme-light' : 'theme-dark');
    };

    const submitTheme = (e) => {
        e.preventDefault();
        const nextTheme = themeData.theme === 'light' ? 'light' : 'dark';

        applyTheme(nextTheme);
        postTheme('/ustawienia/theme');
    };

    const submitPassword = (e) => {
        e.preventDefault();
        postPassword('/ustawienia/haslo');
    };
    
    return (
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[54px] mx-auto items-center justify-center border-b border-theme-muted px-3 rounded-t-[16px]">
                <div className="w-[42px] flex items-center justify-start">
                    <BackButton back={() => window.history.back()} />
                </div>
                <span className="font-bold text-[18px] text-theme-text flex-1 text-center">Ustawienia</span>
                <div className="w-[42px]" />
            </div>

            <div className="w-full flex-1 min-h-0 pt-4 pb-2 px-4 rounded-b-[16px] flex flex-col relative">
                <div className="bg-theme-slate w-full h-full mx-auto rounded-[20px] border border-theme-muted/70 overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                    <div className="bg-gradient-to-r from-theme-accent-indigo via-theme-accent-navy to-theme-orange/80 p-5 md:p-6">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Konto</p>
                                <h2 className="text-2xl font-bold text-white">Twoje ustawienia</h2>
                            </div>
                            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-sm">
                                {themeData.theme === 'light' ? 'Jasny motyw' : 'Ciemny motyw'}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 p-4 md:p-6 xl:grid-cols-[1.1fr_1.4fr]">
                        <form onSubmit={submitTheme} className="rounded-[18px] border border-theme-muted bg-theme-surface p-4 md:p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-orange/15 text-lg text-theme-orange">
                                    ☼
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-theme-text">Motyw interfejsu</h3>
                                    <p className="text-sm text-theme-muted">Dopasuj wygląd aplikacji do swoich preferencji.</p>
                                </div>
                            </div>

                            <label htmlFor="theme" className="mb-2 block text-sm font-medium text-theme-text">
                                Wybierz motyw
                            </label>
                            <select
                                id="theme"
                                value={themeData.theme}
                                onChange={(e) => setThemeData('theme', e.target.value)}
                                className="w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-base text-theme-text outline-none ring-0 transition focus:border-theme-orange"
                            >
                                <option value="dark">Ciemny</option>
                                <option value="light">Jasny</option>
                            </select>

                            <button
                                type="submit"
                                disabled={processingTheme}
                                className="mt-5 w-full rounded-xl bg-theme-orange px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processingTheme ? 'Zapisywanie...' : 'Zapisz motyw'}
                            </button>
                        </form>

                        <form onSubmit={submitPassword} className="rounded-[18px] border border-theme-muted bg-theme-surface p-4 md:p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-cyan/15 text-lg text-theme-cyan">
                                    🔒
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-theme-text">Zmiana hasła</h3>
                                    <p className="text-sm text-theme-muted">Ustaw nowe hasło do swojego konta.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="current_password" className="mb-2 block text-sm font-medium text-theme-text">Aktualne hasło</label>
                                    <input
                                        id="current_password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        className="w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-theme-text outline-none transition focus:border-theme-cyan"
                                        placeholder="Wpisz obecne hasło"
                                    />
                                    {passwordErrors.current_password && <p className="mt-1 text-xs text-red-400">{passwordErrors.current_password}</p>}
                                </div>

                                <div>
                                    <label htmlFor="new_password" className="mb-2 block text-sm font-medium text-theme-text">Nowe hasło</label>
                                    <input
                                        id="new_password"
                                        type="password"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData('new_password', e.target.value)}
                                        className="w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-theme-text outline-none transition focus:border-theme-cyan"
                                        placeholder="Minimum 8 znaków"
                                    />
                                    {passwordErrors.new_password && <p className="mt-1 text-xs text-red-400">{passwordErrors.new_password}</p>}
                                </div>

                                <div>
                                    <label htmlFor="new_password_confirmation" className="mb-2 block text-sm font-medium text-theme-text">Powtórz nowe hasło</label>
                                    <input
                                        id="new_password_confirmation"
                                        type="password"
                                        value={passwordData.new_password_confirmation}
                                        onChange={(e) => setPasswordData('new_password_confirmation', e.target.value)}
                                        className="w-full rounded-xl border border-theme-border bg-theme-page px-3 py-3 text-theme-text outline-none transition focus:border-theme-cyan"
                                        placeholder="Potwierdź nowe hasło"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processingPassword}
                                className="mt-5 w-full rounded-xl bg-theme-accent-indigo px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processingPassword ? 'Zmiana hasła...' : 'Zmień hasło'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default function Settings({ auth,  theme = 'dark', rol }) {
    let menu;
    if (rol === 'Student'){
        menu = <MenuStudenta/>
    }
    if (rol === 'Prowadzący'){
        menu = <MenuProwadzacy/>
    }
    if (rol === 'Pracownik Dziekanatu'){
        menu = <MenuDziekanat/>
    }

    return (
        <div className="flex">
            <Head title="Ustawienia"/>
            {menu}
            <Content theme={theme}/>
        </div>
        
    );
}
