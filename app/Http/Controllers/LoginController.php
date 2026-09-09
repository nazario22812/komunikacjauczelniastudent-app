<?php

namespace App\Http\Controllers;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
// use Illuminate\Validation\Validator;

class LoginController extends Controller
{
    //

    public function create(): Response {
        return Inertia::render('Login', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse {

        $validation = $request->validate([
            'email' => ['required', 'email', 'max:45'],
            'password' => ['required', 'max:255']
        ]);

        if(Auth::attempt($validation)){

            $request->session()->regenerate();
            
            /** @var User $user */
            $user = Auth::user();

            if($user->isStudent()){
                return redirect(route('stronaglownastudent'));
            }

            if($user->isProwadzacy()){
                return redirect(route('stronaglownaprowadzacy'));
            }

            if($user->isPracownikDziekanatu()){
                return redirect(route('stronaglownapracownikdziekanatu'));
            }            
        }


        return redirect('/login')->withErrors(['email' => 'Podany zły email', 'password' => 'Podane złe hasło']);

    }

    public function destroy(Request $request): RedirectResponse{
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
