<?php

use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if(Auth::check()){
        return redirect()->route('strona-glowna');
    }

    return Inertia::render('Login');
})->name('main');

Route::middleware('guest')->group(function() {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});
Route::middleware(['auth', 'role:student'])->group(function (){

});

Route::middleware(['auth', 'role:prowadzacy'])->group(function (){
    
});

Route::middleware(['auth', 'role:pracownikdziekanatu'])->group(function (){
    
});