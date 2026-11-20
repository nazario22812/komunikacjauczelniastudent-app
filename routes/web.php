<?php

use App\Http\Controllers\DziekanatController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProwadzacyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;


Route::get('/', function () {
    if (Auth::check()) {
        /** @var User $user */
        $user = Auth::user();
        if ($user->isStudent()) {
            return redirect()->route('stronaglownastudent');
        }
        if ($user->isProwadzacy()) {
            return redirect()->route('stronaglownaprowadzacy');
        }
        if ($user->isPracownikDziekanatu()) {
            return redirect()->route('stronaglownapracownikdziekanatu');
        }
        // return redirect()->route('strona-glowna');
    }

    return Inertia::render('Login');
})->name('main');



Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::post('/ustawienia/haslo', [UserController::class, 'ustawieniaHaslo'])->name('ustawienia.haslo');
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
Route::middleware(['auth', 'role:student'])->group(function () {
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
Route::middleware(['auth', 'role:prowadzacy'])->group(function () {
    Route::get('/stronaglowna/prowadzacy', [ProwadzacyController::class, 'stronaglowna'])->name('stronaglownaprowadzacy');


    Route::get('/prowadzacy/konsultacje', [ProwadzacyController::class, 'mojekonsultacje']);
    Route::post('/prowadzacy/konsultacja/usun/{idRezerwacja}', [ProwadzacyController::class, 'usuniecieKonsultacji']);
    Route::get('/prowadzacy/stworzkonsultacje', [ProwadzacyController::class, 'konsultacjaform']);
    Route::post('/prowadzacy/tworzeniekonsultacji', [ProwadzacyController::class, 'stworzkonsultacje']);

    Route::get('/prowadzacy/rezerwacje', [ProwadzacyController::class, 'mojerezerwacje']);
    Route::post('/prowadzacy/rezerwacja/usun/{idRezerwacja}', [ProwadzacyController::class, 'usuniecieRezerwacji']);
    Route::get('/prowadzacy/zarezerwujsale', [ProwadzacyController::class, 'rezerwacjeform']);
    Route::post('/prowadzacy/tworzenierezerwacji', [ProwadzacyController::class, 'stworzrezerwacje']);
    Route::get('/prowadzacy/wystawienieocen', [ProwadzacyController::class, 'wystawienieocen']);
    Route::post('/prowadzacy/ocenekoncowe/wystawienieoceny/{wybranyprzedmiot}/{idStudent}/{wybranaocena}', [ProwadzacyController::class, 'wystawienieoceny']);
    Route::get('/prowadzacy/mojekursy', [ProwadzacyController::class, 'mojekursy']);
    Route::get('/prowadzacy/mojekursy/{nazwa}/{idkurs}', [ProwadzacyController::class, 'kurs'])->name('prowadzacy.kurs');
    Route::post('/prowadzacy/usunstudentazkursu/{idStudent}/{idKurs}', [ProwadzacyController::class, 'usunstudentazkursu']);
    Route::post('/prowadzacy/usunmaterialy/{idKurs}/{idPlik}', [ProwadzacyController::class, 'usunmaterial']);
    Route::post('/prowadzacy/dodajmaterialy/{idKurs}', [ProwadzacyController::class, 'dodajmaterialy']);
    Route::post('/prowadzacy/usunzadanie/{kursId}/{idZadanie}', [ProwadzacyController::class, 'usunzadanie']);
    Route::post('/prowadzacy/dodajzadanie/{kursId}', [ProwadzacyController::class, 'dodajzadanie']);
    Route::get('/prowadzacy/otworzzadanie/{idZadanie}', [ProwadzacyController::class, 'otworzzadanie']);
    Route::post('/prowadzacy/ocenieniezadania/{idZadanie}/{student_id}/{wybranaocena}', [ProwadzacyController::class, 'ocenieniezadania']);
    Route::get('/prowadzacy/tworzeniekursu', [ProwadzacyController::class, 'tworzeniekursu']);
    Route::post('/prowadzacy/tworzeniekursu', [ProwadzacyController::class, 'stworzKurs']);
    Route::get('/prowadzacy/komunikaty', [ProwadzacyController::class, 'komunikaty']);
    Route::post('/prowadzacy/komunikaty', [ProwadzacyController::class, 'komunikatypost']);
});




// trasy dla pracownika dziekanatu 
Route::middleware(['auth', 'role:pracownikdziekanatu'])->group(function () {
    Route::get('/stronaglowna/pracownikdziekanatu',[DziekanatController::class, 'stronaGlowna'])->name('stronaglownapracownikdziekanatu');

    Route::get('/dziekanat/podania', [DziekanatController::class, 'podania']);
    Route::get('/dziekanat/szczegolypodania/{podanie}', [DziekanatController::class, 'szczegolypodania']);
    Route::post('/dziekanat/szczegolypodania/{podanie}', [DziekanatController::class, 'szczegolypodaniapost']);
    Route::get('/dziekanat/ogloszeniaankiety', [DziekanatController::class, 'ogloszenia']);
    Route::post('/dziekanat/ogloszenia', [DziekanatController::class, 'storeOgloszenie']);
    Route::post('/dziekanat/ankiety', [DziekanatController::class, 'storeAnkieta']);
    Route::get('/dziekanat/finansestudentow', [DziekanatController::class, 'finansestudentow']);
    Route::post('/dziekanat/platnosci/{student_id}/dodajPlatnosc', [DziekanatController::class, 'dodanieplatnosci']);
    Route::post('/dziekanat/platnosci/{student_id}/{platnosc_id}/zmienStatus', [DziekanatController::class, 'zmianastatusuplatnosci']);
    Route::post('/dziekanat/platnosci/{student_id}/{platnosc_id}/usunPlatnosc', [DziekanatController::class, 'usuniecieplatnosci']);
    Route::get('/dziekanat/sylabusy', [DziekanatController::class, 'sylabusy']);
    Route::get('/dziekanat/sylabusy', [DziekanatController::class, 'sylabusy']);
    Route::post('/dziekanat/sylabusy/{przedmiot_id}/dodaniesylabusa', [DziekanatController::class, 'dodaniesylabusa']);
    Route::post('/dziekanat/sylabusy/{przedmiot_id}/{sylabus_id}/aktualizacjasylabusa', [DziekanatController::class, 'aktualizacjasylabusa']);
    Route::post('/dziekanat/sylabusy/{przedmiot_id}/{sylabus_id}/dodanieliteratury', [DziekanatController::class, 'dodanieliteratury']);
    Route::post('/dziekanat/sylabusy/{przedmiot_id}/{sylabus_id}/{literatura_id}/usuniecieliteratury', [DziekanatController::class, 'usuniecieliteratury']);
    Route::get('/dziekanat/rezerwacje', [DziekanatController::class, 'rezerwacje']);
    Route::post('/dziekanat/rezerwacje/dodanie', [DziekanatController::class, 'dodanieRezerwacji']);
    Route::post('/dziekanat/rezerwacje/{id}/zatwierdzenie', [DziekanatController::class, 'zatwierdzenierezerwacji']);
    Route::post('/dziekanat/rezerwacje/{id}/odrzucenie', [DziekanatController::class, 'odrzucenierezerwacji']);
    Route::get('/dziekanat/plany-zajec', [DziekanatController::class, 'planyZajec']);
    Route::post('/dziekanat/plany-zajec/plan/dodaj', [DziekanatController::class, 'dodajPlanZajec']);
    Route::post('/dziekanat/plany-zajec/plan/{id}/aktualizuj', [DziekanatController::class, 'aktualizujPlanZajec']);
    Route::post('/dziekanat/plany-zajec/plan/{id}/usun', [DziekanatController::class, 'usunPlanZajec']);
    Route::post('/dziekanat/plany-zajec/dodaj', [DziekanatController::class, 'dodajZajecie']);
    Route::post('/dziekanat/plany-zajec/{id}/aktualizuj', [DziekanatController::class, 'aktualizujZajecie']);
    Route::post('/dziekanat/plany-zajec/{id}/usun', [DziekanatController::class, 'usunZajecie']);
});
