<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProwadzacyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
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

Route::middleware(['auth'])->group(function(){
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::get('/mojedane', [UserController::class, 'mojedane']);
    Route::get('/planzajec', [UserController::class, 'planzajec'])->name('planzajec');
    Route::get('/planzajec/{grupa}', [UserController::class, 'planzajecpost'])->name('planzajec.szukaniegrupy');
    Route::get('/mapa', [UserController::class, 'mapaKampusu']);
    Route::get('/powiadomienia', [UserController::class, 'powiadomienia']);
    Route::get('/ogloszeniaiankiety', [UserController::class, 'ogloszniaiankiety']);
    Route::get('/ustawienia', [UserController::class, 'ustawienia']);
    Route::post('/ustawienia/theme', [UserController::class, 'ustawieniaTheme'])->name('ustawienia.theme');
});

//trasy dla studenta 
Route::middleware(['auth', 'role:student'])->group(function (){
    Route::get('/stronaglowna/student', [StudentController::class, 'stronaglowna'])->name('stronaglownastudent');

    Route::get('/student/mojefinanse', [StudentController::class, 'finanse']);
    Route::get('/student/konsultacje', [StudentController::class, 'konsultacje']);
    Route::get('/student/edziekanat', [StudentController::class, 'edziekanat']);
    Route::get('/student/edziekanat/{podanie}', [StudentController::class, 'podanieinfo']);
    Route::get('/student/zlozpodanie', [StudentController::class, 'zlozpodanie']);
    Route::post('/student/zlozpodanie', [StudentController::class, 'zlozpodaniepost']);
    Route::get('/student/ocenykoncowe', [StudentController::class, 'ocenykoncowe']);
    Route::get('/student/mojekursy', [StudentController::class, 'mojekursy']);
    Route::post('/student/mojekursy/{idkurs}', [StudentController::class, 'mojekursypost']);
    Route::get('/student/mojekursy/{nazwa}/{idkurs}', [StudentController::class, 'kurs'])->name('student.kurs');
    Route::post('/student/checkkurs/{idkurs}', [StudentController::class, 'sprawdzeniekursu']);
    Route::get('/student/kurs/{idZadanie}', [StudentController::class, 'zadanieform']);
    Route::post('/student/kurs/wyslijzadanie/{idZadanie}', [StudentController::class, 'wyslijzadanie']);
    Route::post('/student/kurs/redagujzadanie/{idZadanie}/{idPlik}', [StudentController::class, 'usuniecieplikuzadania']);
    Route::get('/student/mojezadania', [StudentController::class, 'mojezadania']);
});




//trasy dla prowadzacego 
Route::middleware(['auth', 'role:prowadzacy'])->group(function (){
    Route::get('/stronaglowna/prowadzacy', function () {
        return Inertia::render('Prowadzacy/StronaGlowna');
    })->name('stronaglownaprowadzacy');


    Route::get('/prowadzacy/konsultacje', [ProwadzacyController::class, 'mojekonsultacje']);
    Route::post('/prowadzacy/konsultacja/usun/{idRezerwacja}',[ProwadzacyController::class, 'usuniecieKonsultacji']);
    Route::get('/prowadzacy/stworzkonsultacje', [ProwadzacyController::class, 'konsultacjaform']);
    Route::post('/prowadzacy/tworzeniekonsultacji', [ProwadzacyController::class, 'stworzkonsultacje']);
    
    Route::get('/prowadzacy/rezerwacje', [ProwadzacyController::class, 'mojerezerwacje']);
    Route::post('/prowadzacy/rezerwacja/usun/{idRezerwacja}', [ProwadzacyController::class, 'usuniecieRezerwacji']);
    Route::get('/prowadzacy/zarezerwujsale', [ProwadzacyController::class, 'rezerwacjeform']);
});




// trasy dla pracownika dziekanatu 
Route::middleware(['auth', 'role:pracownikdziekanatu'])->group(function (){
    Route::get('/stronaglowna/pracownikdziekanatu', function () {
        return Inertia::render('PracownikDziekanatu/StronaGlowna');
    })->name('stronaglownapracownikdziekanatu');
});