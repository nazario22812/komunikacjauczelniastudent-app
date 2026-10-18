import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const theme = props.initialPage?.props?.theme ?? 'dark';

        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');

        root.render(<App {...props} />);
    },
    progress: {
        color: 'var(--theme-dark-progress)',
    },
});