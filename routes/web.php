<?php

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
    // Route::get('/login', function() {
    //     return Inertia::render('Login');
    // });

});
Route::middleware(['auth', 'role:student'])->group(function (){

});

Route::middleware(['auth', 'role:prowadzacy'])->group(function (){
    
});

Route::middleware(['auth', 'role:pracownikdziekanatu'])->group(function (){
    
});