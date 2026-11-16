import { Head, Link, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="bg-theme-panel min-h-screen p-4 flex items-center justify-center">
            <Head title="Przypomnienie hasła" />

            <div className="bg-theme-login w-full max-w-md rounded-lg border border-theme-muted p-6 shadow-md">
                <h1 className="text-center text-2xl font-bold text-theme-text mb-6">Przypomnij hasło</h1>

                {status && (
                    <div className="mb-4 rounded bg-emerald-600/20 p-2 text-center text-sm text-emerald-200">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-theme-text">
                            Adres e-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="twoj@email.com"
                            className="w-full rounded-lg border border-theme-muted bg-white px-3 py-2 text-theme-dark-panel outline-none"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-white px-4 py-2 font-semibold text-theme-dark-panel transition hover:bg-gray-300 disabled:opacity-60"
                    >
                        Wyślij link resetujący
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
