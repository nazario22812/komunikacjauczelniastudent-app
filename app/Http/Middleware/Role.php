<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {

        $user = $request->user();
        
        $hasAccess = match ($role) {
            'student' => $user->isStudent(),
            'prowadzacy' => $user->isProwadzacy(),
            'pracownikdziekanatu' => $user->isPracownikDziekanatu(),
            default => false,
        };

        if ($hasAccess) {
            return $next($request);
        }

        return redirect('/')->with('error', "Brak uprawnień");
    }
}
