<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProwadzacyController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;


Route::get('/', function () {
    if(Auth::check()){
        /** @var User $user */
        $user = Auth::user();
        if($user->isStudent()){
            return redirect()->route('stronaglownastudent_mob');
        }
        if($user->isProwadzacy()){
            return redirect()->route('stronaglownaprowadzacy_mob');
        }
        if($user->isPracownikDziekanatu()){
            return redirect()->route('stronaglownapracownikdziekanatu_mob');
        }
        // return redirect()->route('strona-glowna');
    }

    return Inertia::render('Login');
});



Route::middleware('guest')->group(function() {
    Route::get('/login', [LoginController::class, 'create']);
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware(['auth:sanctum'])->group(function(){
    Route::post('/logout', [LoginController::class, 'destroy']);
    Route::get('/mojedane', [UserController::class, 'mojedane']);
    Route::get('/planzajec', [UserController::class, 'planzajec']);
    Route::get('/planzajec/{grupa}', [UserController::class, 'planzajecpost']);
    Route::get('/mapa', [UserController::class, 'mapaKampusu']);
    Route::get('/powiadomienia', [UserController::class, 'powiadomienia']);
    Route::get('/ogloszeniaiankiety', [UserController::class, 'ogloszniaiankiety']);
});

//trasy dla studenta 
Route::middleware(['auth:sanctum', 'role:student'])->group(function (){
    Route::get('/stronaglowna/student', [StudentController::class, 'stronaglowna'])->name('stronaglownastudent_mob');

    Route::get('/student/mojefinanse', [StudentController::class, 'finanse']);
    Route::get('/student/konsultacje', [StudentController::class, 'konsultacje']);
    Route::get('/student/edziekanat', [StudentController::class, 'edziekanat']);
    Route::get('/student/edziekanat/{podanie}', [StudentController::class, 'podanieinfo']);
    Route::get('/student/zlozpodanie', [StudentController::class, 'zlozpodanie']);
    Route::post('/student/zlozpodanie', [StudentController::class, 'zlozpodaniepost']);
    Route::get('/student/ocenykoncowe', [StudentController::class, 'ocenykoncowe']);
    Route::get('/student/mojekursy', [StudentController::class, 'mojekursy']);
    Route::post('/student/mojekursy/{idkurs}', [StudentController::class, 'mojekursypost']);
    Route::get('/student/mojekursy/{nazwa}/{idkurs}', [StudentController::class, 'kurs']);
    Route::post('/student/checkkurs/{idkurs}', [StudentController::class, 'sprawdzeniekursu']);
    Route::get('/student/kurs/{idZadanie}', [StudentController::class, 'zadanieform']);
    Route::post('/student/kurs/wyslijzadanie/{idZadanie}', [StudentController::class, 'wyslijzadanie']);
    Route::post('/student/kurs/redagujzadanie/{idZadanie}/{idPlik}', [StudentController::class, 'usuniecieplikuzadania']);
    Route::get('/student/mojezadania', [StudentController::class, 'mojezadania']);
});




//trasy dla prowadzacego 
Route::middleware(['auth:sanctum', 'role:prowadzacy'])->group(function (){
    Route::get('/stronaglowna/prowadzacy', function () {
        return Inertia::render('Prowadzacy/StronaGlowna');
    })->name('stronaglownaprowadzacy_mob');

    Route::get('/prowadzacy/konsultacje', [ProwadzacyController::class, 'mojekonsultacje']);
    Route::post('/prowadzacy/konsultacja/usun/{idRezerwacja}',[ProwadzacyController::class, 'usuniecieKonsultacji']);
    Route::get('/prowadzacy/stworzkonsultacje', [ProwadzacyController::class, 'konsultacjaform']);
    Route::post('/prowadzacy/tworzeniekonsultacji', [ProwadzacyController::class, 'stworzkonsultacje']);
});




// trasy dla pracownika dziekanatu 
Route::middleware(['auth:sanctum', 'role:pracownikdziekanatu'])->group(function (){
    Route::get('/stronaglowna/pracownikdziekanatu', function () {
        return Inertia::render('PracownikDziekanatu/StronaGlowna');
    })->name('stronaglownapracownikdziekanatu_mob');
});