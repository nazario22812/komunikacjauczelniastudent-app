<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class ThemeMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $theme = session('theme', 'dark');

        if ($request->user()) {
            $rawSettings = $request->user()->Ustawienia ?? null;
            $settings = $this->decodeSettings($rawSettings);

            $requestedTheme = $settings['theme'] ?? $theme;

            if (in_array($requestedTheme, ['dark', 'light'], true)) {
                $theme = $requestedTheme;
            }
        }

        session()->put('theme', $theme);
        View::share('theme', $theme);
        Inertia::share('theme', $theme);
        $request->attributes->set('theme', $theme);

        return $next($request);
    }

    protected function decodeSettings($rawSettings): array
    {
        if (is_array($rawSettings)) {
            return $rawSettings;
        }

        if (is_string($rawSettings)) {
            $decoded = json_decode($rawSettings, true);

            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return [];
    }
}
