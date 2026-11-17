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

        if (! in_array($theme, ['dark', 'light'], true)) {
            $theme = 'dark';
        }

        session()->put('theme', $theme);
        View::share('theme', $theme);
        Inertia::share('theme', $theme);
        $request->attributes->set('theme', $theme);

        return $next($request);
    }
}
