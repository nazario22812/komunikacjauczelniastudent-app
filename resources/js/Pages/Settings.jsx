import { useForm } from "@inertiajs/react";
import React from "react";

export default function Settings({ auth,  theme = 'dark' }) {
    const { data, setData, post, processing } = useForm({
        theme,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/ustawienia/theme');
    };

    return (
        <div className="min-h-screen bg-theme-page text-theme-text p-6">
            <div className="mx-auto max-w-xl rounded-2xl border border-theme-border bg-theme-panel p-6 shadow-lg">
                <h1 className="mb-6 text-2xl font-bold">Ustawienia</h1>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="theme" className="mb-2 block text-sm font-medium text-theme-muted">
                            Wybierz motyw
                        </label>
                        <select
                            id="theme"
                            value={data.theme}
                            onChange={(e) => setData('theme', e.target.value)}
                            className="w-full rounded-lg border border-theme-border bg-theme-surface px-3 py-2 text-theme-text outline-none"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-theme-orange px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {processing ? 'Zapisywanie...' : 'Zapisz'}
                    </button>
                </form>
            </div>
        </div>
    );
}
