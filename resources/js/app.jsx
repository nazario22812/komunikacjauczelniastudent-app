import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const getStoredTheme = () => {
    if (typeof window === 'undefined') {
        return 'dark';
    }

    const storedTheme = localStorage.getItem('theme');

    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
};

const applyTheme = (theme) => {
    const resolvedTheme = theme === 'light' ? 'light' : 'dark';

    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(resolvedTheme === 'light' ? 'theme-light' : 'theme-dark');
    localStorage.setItem('theme', resolvedTheme);
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const storedTheme = getStoredTheme();
        const theme = storedTheme || props.initialPage?.props?.theme || 'dark';

        applyTheme(theme);

        root.render(<App {...props} />);
    },
    progress: {
        color: 'var(--theme-dark-progress)',
    },
});