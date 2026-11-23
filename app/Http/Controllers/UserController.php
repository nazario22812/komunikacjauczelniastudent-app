<?php

namespace App\Http\Controllers;

use App\Models\Ankieta;
use App\Models\Grupastudenta;
use App\Models\Kierunek;
use App\Models\Planzajec;
use App\Models\Rezerwacja;
use App\Models\Sala;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Komunikat;

class UserController extends Controller
{

    public function ustawienia(Request $request)
    {
        $user = $request->user();
        $theme = session('theme', 'dark');

        if (! in_array($theme, ['dark', 'light'], true)) {
            $theme = 'dark';
        }

        $role = '';
        if ($user->isStudent()) {
            $role = 'Student';
        }
        if ($user->isProwadzacy()) {
            $role = 'Prowadzący';
        }
        if ($user->isPracownikDziekanatu()) {
            $role = 'Pracownik Dziekanatu';
        }

        return Inertia::render('Settings', [
            'rol' => $role,
            'theme' => $theme,
        ]);
    }

    public function ustawieniaTheme(Request $request)
    {
        $theme = $request->input('theme');

        if (! in_array($theme, ['dark', 'light'], true)) {
            $theme = 'dark';
        }

        session()->put('theme', $theme);

        return redirect()->back();
    }

    public function ustawieniaHaslo(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($request->input('new_password')),
        ]);

        return redirect()->back()->with('status', 'Hasło zostało zmienione.');
    }

    public function ogloszniaiankiety(Request $request)
    {
        $user = $request->user();
        $ogloszenia = Komunikat::where('czyOgloszenie', 1)->orderby('idKomunikat', 'desc')->get()->toArray();
        $ankiety = Ankieta::orderby('idAnkieta', 'desc')->get()->toArray();

        $role = '';
        if ($user->isStudent()) {
            $role = 'Student';
        }
        if ($user->isProwadzacy()) {
            $role = 'Prowadzący';
        }
        if ($user->isPracownikDziekanatu()) {
            $role = 'Pracownik Dziekanatu';
        }

        if ($request->expectsJson()) {
            return response()->json([
                'ogloszenia' => array_slice($ogloszenia, 0, 10),
                'ankiety' => array_slice($ankiety, 0, 10)
            ]);
        }

        return Inertia::render('Ogloszenia', [
            'rol' => $role,
            'ogloszenia' => array_slice($ogloszenia, 0, 10),
            'ankiety' => array_slice($ankiety, 0, 10)
        ]);
    }

    public function powiadomienia(Request $request)
    {
        $user = $request->user();
        $powiadomienia = $user->komunikat()->where('czyOgloszenie', 0)->orderBy('idKomunikat', 'desc')->get()->toArray();

        $role = '';
        if ($user->isStudent()) {
            $role = 'Student';
        }
        if ($user->isProwadzacy()) {
            $role = 'Prowadzący';
        }
        if ($user->isPracownikDziekanatu()) {
            $role = 'Pracownik Dziekanatu';
        }

        if ($request->expectsJson()) {
            return response()->json([
                'powiadomienia' => $powiadomienia
            ]);
        }

        return Inertia::render('Powiadomienia', [
            'rol' => $role,
            'powiadomienia' => $powiadomienia
        ]);
    }



    public function mapaKampusu(Request $request)
    {


        $sali = Sala::select(
            'budynek.*',
            'sala.numerSali'
        )
            ->join('budynek', function ($join) {
                $join->on('budynek.idBudynek', '=', 'sala.Budynek_idBudynek');
            })
            ->get();

        $salimapped = $sali->map(function ($item) {
            return [
                'id' => $item->idBudynek,
                'nazwa' => $item->nazwa,
                'ulica' => $item->ulica,
                'nrBudynku' => $item->nrBudynku,
                'godzinaOtwarcia' => $item->GodzinaOtwarcia,
                'godzinaZamkniecia' => $item->GodzinaZamkniecia,
                'numerSali' => $item->numerSali,
                'szerokosc' => $item->szerokosc,
                'dlugosc' => $item->dlugosc
            ];
        })->values()->toArray();


        $user = $request->user();
        $role = '';
        if ($user->isStudent()) {
            $role = 'Student';
        }
        if ($user->isProwadzacy()) {
            $role = 'Prowadzący';
        }
        if ($user->isPracownikDziekanatu()) {
            $role = 'Pracownik Dziekanatu';
        }

        if ($request->expectsJson()) {
            return response()->json([
                'sale' => $salimapped
            ]);
        }

        return Inertia::render('MapaKampusu', [
            'rol' => $role,
            'sale' => $salimapped
        ]);
    }

    public function planzajecpost(Request $request, $grpa)
    {

        $planzajec = Planzajec::where('GrupaStudenta_idGrupaStudenta', $grpa)->first();
        $rezerwacje = collect();

        if ($planzajec) {
            $rezerwacje = Rezerwacja::select(
            'rezerwacja.*',
            'zajęcie.DzienTygodnia',
            'zajęcie.TypZajec',
            'zajęcie.Parzystosc',
            'przedmiot.nazwa as nazwa_przedmiotu',
            'sala.numerSali',
            'user.name',
            'user.surname',
            'prowadzacy.TytulNaukowy',
        )
            ->join('zajęcie', function ($join) {
                $join->on('rezerwacja.Zajęcie_idZajęcie', '=', 'zajęcie.idZajęcie')
                    ->on('rezerwacja.Zajęcie_PlanZajec_idPlanZajec', '=', 'zajęcie.PlanZajec_idPlanZajec');
            })
            ->join('sala', function ($join) {
                $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala')
                    ->on('rezerwacja.Sala_Budynek_idBudynek', '=', 'sala.Budynek_idBudynek');
            })

            ->leftJoin('prowadzacy', function ($join) {
                $join->on('rezerwacja.Prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy');
            })
            ->leftJoin('przedmiot', 'zajęcie.Przedmiot_idPrzedmiot', '=', 'przedmiot.idPrzedmiot')
            ->leftJoin('user', 'prowadzacy.User_idUser', '=', 'user.idUser')

            ->where([['rezerwacja.Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec], ['rezerwacja.typWydarzenia', 'Zajęcia']])
            ->whereIn('rezerwacja.statusRezerwacji', ['Zaakceptowana', 'Zatwierdzona'])
            ->get();
        }

        $gotowyplan = $rezerwacje->map(function ($item) {
            return [
                'id' => $item->idRezerwacja,
                'start' => $item->data . 'T' . $item->GodzinaRozpoczecia,
                'end' => $item->data . 'T' . $item->GodzinaZakonczenia,
                'title' => $item->nazwa_przedmiotu . ' (' . $item->TypZajec . ')',
                'extendedProps' => [
                    'typ' => $item->TypZajec,
                    'parzystosc' => $item->Parzystosc,
                    'numersali' => $item->numerSali,
                    'imie' => $item->name ? substr($item->name, 0, 1) : '',
                    'nazwisko' => $item->surname,
                    'tytulNaukowy' => $item->TytulNaukowy,
                    'dzientygodnia' => $item->DzienTygodnia

                ]
            ];
        })->values()->toArray();



        $listaKierunkow = Kierunek::get()->values()->toArray();
        $listaGrup = Grupastudenta::where('typGrupy', 'Laboratoryjna')->get()->values()->toArray();
        $user = $request->user();
        $role = '';
        if ($user->isStudent()) {
            $role = 'Student';
        }
        if ($user->isProwadzacy()) {
            $role = 'Prowadzący';
        }
        if ($user->isPracownikDziekanatu()) {
            $role = 'Pracownik Dziekanatu';
        }

        if ($request->expectsJson()) {
            return response()->json([
                'plan' => $gotowyplan,
                'listagrup' => $listaGrup,
                'listakierunkow' => $listaKierunkow
            ]);
        }

        return Inertia::render('PlanZajec', [
            'rol' => $role,
            'plan' => $gotowyplan,
            'listagrup' => $listaGrup,
            'listakierunkow' => $listaKierunkow
        ]);
    }

    public function planzajec(Request $request)
    {




        $user = $request->user();
        $gotowyplan = null;
        $role = '';
        if ($user->isStudent()) {
            $role = 'Student';
            $student = Student::with('grupastudenta')->where('User_idUser', $user->idUser)->first();
            $grupa = $student?->grupastudenta()->first();
            $planzajec = $grupa
                ? Planzajec::where('GrupaStudenta_idGrupaStudenta', $grupa->idGrupaStudenta)->first()
                : null;
            
            if ($planzajec) {
                $rezerwacje = Rezerwacja::select(
                'rezerwacja.*',
                'zajęcie.DzienTygodnia',
                'zajęcie.TypZajec',
                'zajęcie.Parzystosc',
                'przedmiot.nazwa as nazwa_przedmiotu',
                'sala.idSala',
                'sala.numerSali',
                'budynek.idBudynek',
                'budynek.nazwa as nazwa_budynku',
                'budynek.ulica',
                'budynek.nrBudynku',
                'user.name',
                'user.surname',
                'prowadzacy.TytulNaukowy',
            )
                ->leftJoin('zajęcie', function ($join) {
                    $join->on('rezerwacja.Zajęcie_idZajęcie', '=', 'zajęcie.idZajęcie')
                        ->on('rezerwacja.Zajęcie_PlanZajec_idPlanZajec', '=', 'zajęcie.PlanZajec_idPlanZajec');
                })
                ->leftJoin('sala', function ($join) {
                    $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala')
                        ->on('rezerwacja.Sala_Budynek_idBudynek', '=', 'sala.Budynek_idBudynek');
                })
                ->leftJoin('budynek', 'sala.Budynek_idBudynek', '=', 'budynek.idBudynek')
                ->leftJoin('prowadzacy', 'rezerwacja.Prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy')
                ->leftJoin('przedmiot', 'zajęcie.Przedmiot_idPrzedmiot', '=', 'przedmiot.idPrzedmiot')
                ->leftJoin('user', 'prowadzacy.User_idUser', '=', 'user.idUser')
                ->where('rezerwacja.Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec)
                ->whereIn('rezerwacja.typWydarzenia', ['Zajęcia', 'Godziny dziekańskie', 'Godziny rektorskie'])
                ->whereIn('rezerwacja.statusRezerwacji', ['Zaakceptowana', 'Zatwierdzona'])
                ->get();

            $gotowyplan = $rezerwacje->map(function ($item) {
                $isDekanskie = in_array($item->typWydarzenia, ['Godziny dziekańskie', 'Godziny rektorskie']);

                return [
                    'id' => $item->idRezerwacja,
                    'start' => $item->data . 'T' . $item->GodzinaRozpoczecia,
                    'end' => $item->data . 'T' . $item->GodzinaZakonczenia,
                    'title' => $isDekanskie
                        ? $item->typWydarzenia
                        : ($item->nazwa_przedmiotu . ' (' . $item->TypZajec . ')'),
                    'backgroundColor' => $isDekanskie ? '#d97706' : null,
                    'extendedProps' => [
                        'typWydarzenia' => $item->typWydarzenia,
                        'typ' => $isDekanskie ? $item->typWydarzenia : ($item->TypZajec ?? null),
                        'parzystosc' => $item->Parzystosc ?? null,

                        'idSala' => $item->idSala ?? null,
                        'numersali' => $item->numerSali ?? 'Brak',

                        'idBudynek' => $item->idBudynek ?? null,
                        'nazwaBudynku' => $item->nazwa_budynku ?? '',
                        'ulica' => $item->ulica ?? '',
                        'nrBudynku' => $item->nrBudynku ?? '',

                        'imie' => $item->name ? substr($item->name, 0, 1) : '',
                        'nazwisko' => $item->surname ?? '',
                        'tytulNaukowy' => $item->TytulNaukowy ?? '',
                        'dzientygodnia' => $item->DzienTygodnia ?? ''
                    ]
                ];
            })->values()->toArray();
            }
        }
        if ($user->isProwadzacy()) {
            $role = 'Prowadzący';
        }
        if ($user->isPracownikDziekanatu()) {
            $role = 'Pracownik Dziekanatu';
        }


        $listaKierunkow = Kierunek::get()->values()->toArray();
        $listaGrup = Grupastudenta::where('typGrupy', 'Laboratoryjna')->get()->values()->toArray();

        if ($request->expectsJson()) {
            return response()->json([
                'plan' => $gotowyplan ?? null,
                'listagrup' => $listaGrup,
                'listakierunkow' => $listaKierunkow
            ]);
        }

        return Inertia::render('PlanZajec', [
            'rol' => $role,
            'plan' => $gotowyplan ?? null,
            'listagrup' => $listaGrup,
            'listakierunkow' => $listaKierunkow
        ]);
    }

   
    public function aktualizujAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $uploaded = $validated['avatar'];
        $binary = file_get_contents($uploaded->getRealPath());

        if ($binary === false || getimagesizefromstring($binary) === false) {
            return back()->withErrors(['avatar' => 'Nieprawidłowy plik graficzny.']);
        }

        $user = $request->user();
        $user->photo = base64_encode($binary);
        $user->save();

        return back()->with('status', 'Zdjęcie profilowe zostało zmienione.');
    }

    public function mojedane(Request $request)
    {
        $user = $request->user();
        $role = '';
        $polaroli = [];
        $grupalaboratoryjna = null;
        $grupacwiczeniowa = null;
        $grupawykladowa = null;
        if ($user->isStudent()) {
            $role = 'Student';

            $student = Student::with('grupastudenta')->where('User_idUser', $user->idUser)->first();


            if ($student && $student->grupastudenta) {

                $id_nadgrupy_lab = $student->grupastudenta->where('typGrupy', 'Laboratoryjna')->value('id_nadgrupy');
                $id_nadgrupy_cw = $id_nadgrupy_lab
                    ? Grupastudenta::where('typGrupy', 'Cwiczeniowa')
                        ->where('idGrupaStudenta', $id_nadgrupy_lab)
                        ->value('id_nadgrupy')
                    : null;


                $grupalaboratoryjna = $student->grupastudenta()
                    ->where('typGrupy', 'Laboratoryjna')
                    ->pluck('nazwaGrupy')
                    ->implode(', ');
                if ($id_nadgrupy_lab) {
                    $grupacwiczeniowa = Grupastudenta::where([['typGrupy', 'Cwiczeniowa'], ['idGrupaStudenta', $id_nadgrupy_lab]])
                        ->pluck('nazwaGrupy')
                        ->implode(', ');
                }

                if ($id_nadgrupy_cw) {
                    $grupawykladowa = Grupastudenta::where([['typGrupy', 'Wykladowa'], ['idGrupaStudenta', $id_nadgrupy_cw]])
                        ->pluck('nazwaGrupy')
                        ->implode(', ');
                }
            }

            $polaroli = [
                'index' => $user->student?->index,
                'semester' => $user->student?->semester,
                'stopien' => $user->student?->stopien,
                'trybStudiow' => $user->student?->trybStudiow,
                'rok' => $user->student?->rok,
                'Specjalnosc' => $user->student?->Specjalnosc,
                'kierunek' => $user->student?->kierunek?->nazwa,
                'wydzial' => $user->student?->kierunek?->wydzial?->nazwa,
                'grupaLaboratoryjna' => $grupalaboratoryjna ?? null,
                'grupaCwiczeniowa' => $grupacwiczeniowa ?? null,
                'grupaWykladowa' => $grupawykladowa ?? null,

            ];
        }
        if ($user->isProwadzacy()) {
            $role = 'Prowadzący';
            $polaroli = [
                'TytulNaukowy' => $user->prowadzacy?->TytulNaukowy,
                'katedra' => $user->prowadzacy?->katedra,
            ];
        }
        if ($user->isPracownikDziekanatu()) {
            $role = 'Pracownik Dziekanatu';
            $polaroli = [
                'Odpowiedzialnosc' => $user->pracownikdziekanatu->Odpowiedzialnosc ?? null,
            ];
        }
        $base64data = $user->photo;
        $photourl = null;
        if ($base64data) {
            $binaryPhoto = base64_decode($base64data, true);
            if ($binaryPhoto !== false) {
                $imageInfo = @getimagesizefromstring($binaryPhoto);
                if ($imageInfo && in_array($imageInfo['mime'], ['image/jpeg', 'image/png', 'image/webp'], true)) {
                    $photourl = 'data:' . $imageInfo['mime'] . ';base64,' . $base64data;
                }
            }
        }

        if ($request->expectsJson()) {
            return response()->json(array_merge([
                'rol' => $role,
                'name' => $user->name,
                'surname' => $user->surname,
                'email' => $user->email,
                'numerTelefonu' => $user->numerTelefonu,
                'kontoBankowe' => $user->kontoBankowe,
                'DataUrodzenia' => $user->DataUrodzenia,
                'photo' => $photourl
            ], $polaroli));
        }

        return Inertia::render('MojeDane', array_merge([
            'rol' => $role,
            'name' => $user->name,
            'surname' => $user->surname,
            'email' => $user->email,
            'numerTelefonu' => $user->numerTelefonu,
            'kontoBankowe' => $user->kontoBankowe,
            'DataUrodzenia' => $user->DataUrodzenia,
            'photo' => $photourl
        ], $polaroli));
    }
}
