import { useForm , Head} from "@inertiajs/react";
import React from "react";
import BackButton from "../Components/BackButton";
import MenuStudenta from "../Components/MenuStudenta";
import MenuProwadzacy from "../Components/MenuProwadzacy";
import MenuDziekanat from "../Components/MenuDziekanat";


function Content({ theme = 'dark'  }){
    const { data, setData, post, processing } = useForm({
        theme,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/ustawienia/theme');
    };
    
    return (
       
        <div className="bg-theme-page w-full p-[10px] h-screen flex flex-col box-border">
            <div className="bg-theme-page w-full flex shrink-0 h-[40px] mx-auto text-center border-b-[0.3px] border-theme-muted p-[10px] rounded-t-[10px]">
                <BackButton back={ () => window.history.back()} />
                <span className="font-bold text-[16px] text-theme-text w-full">Ustawienia</span>
            </div>
            <div className="w-full flex-1 min-h-0 pt-3 pb-2 px-4 rounded-b-[10px] flex flex-col relative ">  
                <div className="bg-theme-slate w-full h-full mx-auto p-5 rounded-[15px] overflow-y-auto pr-2 custom-scrollbar">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="theme" className="mb-2 block text-sm font-medium text-theme-muted">
                                Wybierz motyw
                            </label>
                            <select
                                id="theme"
                                value={data.theme}
                                onChange={(e) => setData('theme', e.target.value)}
                                className="w-[20%] rounded-lg border border-theme-border bg-theme-surface px-3 py-2 text-theme-text outline-none"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        <button type="submit" disabled={processing} className="rounded-lg bg-theme-orange px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
                            {processing ? 'Zapisywanie...' : 'Zapisz'}
                        </button>
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
        menu === <MenuDziekanat/>
    }

    return (
        <div className="flex">
            <Head title="Ustawienia"/>
            {menu}
            <Content theme={theme}/>
        </div>
        
    );
}
