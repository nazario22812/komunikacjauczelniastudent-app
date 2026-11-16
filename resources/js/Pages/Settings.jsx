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
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Ustawienia</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">  
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    <form onSubmit={submitTheme} className="space-y-5 h-full">
                        <div className="flex items-center justify-between w-full ">
                            <label htmlFor="theme" className="mb-2 block text-[20px] font-medium text-theme-text">
                                Wybierz motyw
                            </label>
                            <select
                                id="theme"
                                value={themeData.theme}
                                onChange={(e) => setThemeData('theme', e.target.value)}
                                className="w-[20%] rounded-lg border border-theme-border bg-theme-surface px-3 py-2 text-theme-text outline-none flex right-1"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        <div className="w-full mx-auto flex items-center bottom-1">
                            <button type="submit" disabled={processingTheme} className="w-[30%] mx-auto rounded-lg bg-theme-orange px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
                                Zapisz
                            </button>
                        </div>
                    </form>

                    <form onSubmit={submitPassword} className="mt-8 space-y-4 border-t border-theme-muted pt-6">
                        <h3 className="text-[20px] font-medium text-theme-text">Zmiana hasła</h3>

                        <div>
                            <label htmlFor="current_password" className="mb-2 block text-sm text-theme-text">Aktualne hasło</label>
                            <input
                                id="current_password"
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                className="w-full rounded-lg border border-theme-border bg-theme-surface px-3 py-2 text-theme-text outline-none"
                            />
                            {passwordErrors.current_password && <p className="mt-1 text-xs text-red-300">{passwordErrors.current_password}</p>}
                        </div>

                        <div>
                            <label htmlFor="new_password" className="mb-2 block text-sm text-theme-text">Nowe hasło</label>
                            <input
                                id="new_password"
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData('new_password', e.target.value)}
                                className="w-full rounded-lg border border-theme-border bg-theme-surface px-3 py-2 text-theme-text outline-none"
                            />
                            {passwordErrors.new_password && <p className="mt-1 text-xs text-red-300">{passwordErrors.new_password}</p>}
                        </div>

                        <div>
                            <label htmlFor="new_password_confirmation" className="mb-2 block text-sm text-theme-text">Powtórz nowe hasło</label>
                            <input
                                id="new_password_confirmation"
                                type="password"
                                value={passwordData.new_password_confirmation}
                                onChange={(e) => setPasswordData('new_password_confirmation', e.target.value)}
                                className="w-full rounded-lg border border-theme-border bg-theme-surface px-3 py-2 text-theme-text outline-none"
                            />
                        </div>

                        <div className="w-full mx-auto flex items-center">
                            <button type="submit" disabled={processingPassword} className="w-[40%] mx-auto rounded-lg bg-theme-orange px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
                                Zmień hasło
                            </button>
                        </div>
                    </form>
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
