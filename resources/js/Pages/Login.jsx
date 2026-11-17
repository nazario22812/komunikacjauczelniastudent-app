import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import image from "@/../images/logo.png";
import login from "@/../images/at.png";
import haslo from "@/../images/key.png";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });

    const emailInput = useRef(null);
    useEffect(() => {
        emailInput.current?.focus();
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen bg-[#040d2a] px-4 py-6 text-white sm:px-5 sm:py-8">
            <Head title="Logowanie" />

            <div className="mx-auto mt-6 w-full max-w-[520px] overflow-hidden rounded-[18px] border border-[#2e3d67] bg-[#0d173a] shadow-[0_0_0_1px_rgba(147,167,255,0.08)] sm:mt-10">
                <div className="border-b border-[#2e3d67] bg-[#0d173a] px-5 py-5 sm:px-6">
                    <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-[20px] bg-[#0b112d] ring-1 ring-[#f2f7ff]/10 sm:h-[140px] sm:w-[140px]">
                        <img
                            src={image}
                            alt="mojauczelnia"
                            className="h-[76px] w-[76px] object-contain sm:h-[100px] sm:w-[100px]"
                        />
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-4 px-4 py-5 sm:px-8 sm:py-6"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-[#dfe8ff]"
                        >
                            Email
                        </label>
                        <div className="flex items-center overflow-hidden rounded-xl border border-[#2e3d67] bg-[#0c1535] focus-within:border-[#6ab2ff]">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center border-r border-[#2e3d67] bg-[#0d173a] sm:h-12 sm:w-12">
                                <img
                                    src={login}
                                    alt="login"
                                    className="!h-[18px] !w-[18px] !max-w-[18px] shrink-0 object-contain sm:!h-[20px] sm:!w-[20px] sm:!max-w-[20px]"
                                />{" "}
                            </span>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="h-11 w-full bg-transparent px-3 text-sm text-white placeholder:text-[#8aa0cf] outline-none sm:h-12 sm:text-base"
                                autoComplete="username"
                                placeholder="adam.zielinski@example.pl"
                                ref={emailInput}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>
                        <p className="min-h-[18px] text-xs text-red-300">
                            {errors.email}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[#dfe8ff]"
                        >
                            Hasło
                        </label>
                        <div className="flex items-center overflow-hidden rounded-xl border border-[#2e3d67] bg-[#0c1535] focus-within:border-[#6ab2ff]">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center border-r border-[#2e3d67] bg-[#0d173a] sm:h-12 sm:w-12">
                                <img
                                    src={haslo}
                                    alt="haslo"
                                    className="!h-[18px] !w-[18px] !max-w-[18px] shrink-0 object-contain sm:!h-[20px] sm:!w-[20px] sm:!max-w-[20px]"
                                />
                            </span>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="h-11 w-full bg-transparent px-3 text-sm text-white placeholder:text-[#8aa0cf] outline-none sm:h-12 sm:text-base"
                                autoComplete="current-password"
                                placeholder="**************"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                        </div>
                        <p className="min-h-[18px] text-xs text-red-300">
                            {errors.password}
                        </p>
                    </div>

                    {status && (
                        <p className="text-center text-sm text-[#dfe8ff]">
                            {status}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 h-12 w-full rounded-xl bg-[#3b60d4] text-base font-semibold text-white transition hover:bg-[#2d4eb3] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing ? "Logowanie..." : "Zaloguj"}
                    </button>
                </form>
            </div>
        </div>
    );
}
