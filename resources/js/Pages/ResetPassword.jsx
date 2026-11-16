import { Head, Link, useForm } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <div className="bg-theme-panel min-h-screen p-4 flex items-center justify-center">
            <Head title="Ustaw nowe hasło" />

            <div className="bg-theme-login w-full max-w-md rounded-lg border border-theme-muted p-6 shadow-md">
                <h1 className="text-center text-2xl font-bold text-theme-text mb-6">Ustaw nowe hasło</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-theme-text">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-lg border border-theme-muted bg-white px-3 py-2 text-theme-dark-panel outline-none"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-theme-text">
                            Nowe hasło
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-lg border border-theme-muted bg-white px-3 py-2 text-theme-dark-panel outline-none"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-theme-text">
                            Potwierdź hasło
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-lg border border-theme-muted bg-white px-3 py-2 text-theme-dark-panel outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-white px-4 py-2 font-semibold text-theme-dark-panel transition hover:bg-gray-300 disabled:opacity-60"
                    >
                        Zapisz hasło
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link href="/login" className="text-sm text-theme-text underline hover:text-theme-orange">
                        Wróć do logowania
                    </Link>
                </div>
            </div>
        </div>
    );
}
