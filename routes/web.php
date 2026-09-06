<?php

use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;


Route::get('/', function () {
    if(Auth::check()){
        /** @var User $user */
        $user = Auth::user();
        if($user->isStudent()){
            return redirect()->route('stronaglownastudent');
        }
        if($user->isProwadzacy()){
            return redirect()->route('stronaglownaprowadzacy');
        }
        if($user->isPracownikDziekanatu()){
            return redirect()->route('stronaglownapracownikdziekanatu');
        }
        // return redirect()->route('strona-glowna');
    }

    return Inertia::render('Login');
})->name('main');

Route::middleware('guest')->group(function() {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});


//trasy dla studenta 
Route::middleware(['auth', 'role:student'])->group(function (){
    Route::get('/stronaglowna/student', function () {
        return Inertia::render('Student/StronaGlowna');
    })->name('stronaglownastudent');
});




//trasy dla prowadzacego 
Route::middleware(['auth', 'role:prowadzacy'])->group(function (){
    Route::get('/stronaglowna/prowadzacy', function () {
        return Inertia::render('Prowadzacy/StronaGlowna');
    })->name('stronaglownaprowadzacy');
});




// trasy dla pracownika dziekanatu 
Route::middleware(['auth', 'role:pracownikdziekanatu'])->group(function (){
    Route::get('/stronaglowna/pracownikdziekanatu', function () {
        return Inertia::render('PracownikDziekanatu/StronaGlowna');
    })->name('stronaglownapracownikdziekanatu');
});