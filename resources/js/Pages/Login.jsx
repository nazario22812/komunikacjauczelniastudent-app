import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";


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

        post(route('login'), {
            onFinish: () => reset('password') 
        });
    }

    return (
        <div className="bg-[08083B] min-h-screen p-4">
            
            <Head title="Logowanie" />
            
            <div className="bg-[0B0B58] w-md h-1/2 mx-auto mt-60 overflow-hidden px-6 py-4 shadow-md rounded-lg border-[0.1px] border-white">
                <form onSubmit={submit} className="h-full">
                    
                    {/* email input and label  */}
                    <div className="w-3/4 mx-auto flex">   
                        <label htmlFor="email">Email</label>

                        <input 
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className=""
                            autoComplete="username"
                            placeholder="adam.zielinski@example.pl"

                            ref={emailInput}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>


                    {/* password input and label  */}
                    <div className="w-3/4 mx-auto flex">
                        <label htmlFor="passwd">Password</label>
                        
                        <input
                            id="passwd"
                            type="password"
                            name="passwd"
                            value={data.password}
                            className=""
                            autoComplete="current-password"
                            placeholder="**************"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <p>{errors.password}</p>
                    </div>

                    <div>
                        <button className="" disabled={processing}>
                            Log in
                        </button>
                    </div>
                </form>
            </div>
            
        
        </div>
        
        

        

    );
}