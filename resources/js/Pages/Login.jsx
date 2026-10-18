import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import image from '@/../images/logo.png';
import login from '@/../images/at.png'
import haslo from '@/../images/key.png';


export default function Login({ status }){
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        
    });


    const emailInput = useRef(null)
    useEffect(() => {
        emailInput.current?.focus()

    }, [] );

    const submit = (e) => {
        e.preventDefault();

        post('/login', {
            onFinish: () => reset('password') 
        });
    }

    return (
        <div className="bg-theme-panel min-h-screen p-4">
            
            <Head title="Logowanie" />
            
            <div className="bg-theme-login w-md h-1/2 mx-auto mt-60 overflow-hidden px-6 py-4 shadow-md rounded-lg border-[0.1px] border-theme-muted">
                <img src={image} alt="mojauczelnia" className="w-[240px] h-[240px] mx-auto mb-5" />
                <form onSubmit={submit} className="">
                    
                    {/* email input and label  */}
                    <div className="w-3/4 mx-auto h-[35] flex border-[0.1px] border-theme-muted m-1 rounded-lg mb-2">   
                        <label htmlFor="email" className="w-1/4"><img src={login} alt="login" className="w-[24px] h-[24px] mx-auto m-1 fill-white"/></label>

                        <input 
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-3/4 bg-white px-2 rounded-r-lg"
                            autoComplete="username"
                            placeholder="adam.zielinski@example.pl"

                            ref={emailInput}
                            onChange={(e) => setData('email', e.target.value)}

                        />

                    </div>
                    <p className="text-white text-[12px] mx-auto text-center ">{errors.email}</p>


                    {/* password input and label  */}
                    <div className="w-3/4 mx-auto h-[35] flex border-[0.1px] border-theme-muted m-1 rounded-lg">
                        <label htmlFor="password" className="w-1/4 h-full "><img src={haslo} alt="haslo" className="w-[24px] h-[24px] mx-auto m-1 fill-white"/></label>
                        
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-3/4 bg-white px-2 rounded-r-lg"
                            autoComplete="current-password"
                            placeholder="**************"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                    </div>
                    <p className="text-theme-text text-[12px] mx-auto text-center ">{errors.password}</p>


                    <div  className=" w-3/4 mx-auto pt-5">
                        <button className="w-full h-[35] mt-5 bg-white rounded-lg text-theme-dark-panel font-bold hover:bg-gray-300 hover:cursor-pointer active:bg-gray-500" disabled={processing}>
                            Zaloguj
                        </button>
                    </div>
                </form>
            </div>
            
        
        </div>
        
        

        

    );
}