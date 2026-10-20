<?php

namespace App\Http\Controllers;

use App\Models\Ankieta;
use App\Models\Budynek;
use App\Models\Grupastudenta;
use App\Models\Kierunek;
use App\Models\Planzajec;
use App\Models\Plik;
use App\Models\Podanie;
use App\Models\Rezerwacja;
use App\Models\Sala;
use App\Models\Student;
use App\Models\Zajecie;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Komunikat;
use function PHPSTORM_META\map;
use Carbon\Carbon;
class UserController extends Controller
{   

    public function ustawienia(Request $request){
        $user = $request->user();
        $settings = json_decode($user?->Ustawienia ?? '{}', true);

        $user = $request->user();
        $role = '';
        if($user->isStudent()){
            $role = 'Student';
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
        }

        return Inertia::render('Settings', [
            'rol' => $role,
            'theme' => $settings['theme'] ?? 'dark',
        ]);
    }

    public function ustawieniaTheme(Request $request){
        $user = $request->user();
        $theme = $request->input('theme');

        if (! in_array($theme, ['dark', 'light'], true)) {
            $theme = 'dark';
        }

        $settings = json_decode($user->Ustawienia ?? '{}', true);
        $settings['theme'] = $theme;

        $user->update([
            'Ustawienia' => json_encode($settings),
        ]);

        session()->put('theme', $theme);
    
        return redirect()->back();
    }

    public function ogloszniaiankiety(Request $request){
        $user = $request->user();
        $ogloszenia = Komunikat::where('czyOgloszenie', 1)->orderby('idKomunikat', 'desc')->get()->toArray();
        $ankiety = Ankieta::orderby('idAnkieta', 'desc')->get()->toArray();
        
        $role = '';
        if($user->isStudent()){
            $role = 'Student';
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
        }
        
        if($request->expectsJson()){
            return response()->json([
                'ogloszenia' => array_slice($ogloszenia, 0, 10),
                'ankiety' => array_slice($ankiety, 0, 10)
            ]);
        }

        return Inertia::render('Ogloszenia',[
            'rol' => $role,
            'ogloszenia' => array_slice($ogloszenia, 0, 10),
            'ankiety' => array_slice($ankiety, 0, 10)
        ]);
    }

    public function powiadomienia(Request $request){
        $user = $request->user();
        // $powiadomienia = User::with('komunikat')->where('User_idUser', $user->idUser)->get();
        $powiadomienia = $user->komunikat()->where('czyOgloszenie', 0)->orderby('idKomunikat', 'desc')->get()->toArray();

        $role = '';
        if($user->isStudent()){
            $role = 'Student';
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
        }

        if($request->expectsJson()){
            return response()->json([
                'powiadomienia' => $powiadomienia
            ]);
        }

        return Inertia::render('Powiadomienia',[
            'rol' => $role,
            'powiadomienia' => $powiadomienia
        ]);
    }
    
    

    public function mapaKampusu(Request $request){


        $sali = Sala::select(
            'budynek.*',
            'sala.numerSali'
        )
        ->join('budynek', function($join){
            $join->on('budynek.idBudynek', '=', 'sala.Budynek_idBudynek');
        })
        ->get();

        $salimapped = $sali->map(function ($item){
            return[
                'id' => $item->idBudynek,
                'nazwa' => $item->nazwa,
                'ulica' => $item->ulica,
                'nrBudynku' => $item->nrBudynku,
                'godzinaOtwarcia' => $item->GodzinaOtwarcia,
                'godzinaZamkniecia' =>$item->GodzinaZamkniecia,
                'numerSali' => $item->numerSali,
                'szerokosc' => $item->szerokosc,
                'dlugosc' => $item->dlugosc
            ];
        })->values()->toArray();

        // $listaBudynkow = Budynek::get()->values()->toArray();
        // dd($salimapped);

        $user = $request->user();
        $role = '';
        if($user->isStudent()){
            $role = 'Student';
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
        }

        if($request->expectsJson()){
            return response()->json([
                'sale' => $salimapped
            ]);
        }

        return Inertia::render('MapaKampusu', [
            'rol' => $role,
            'sale' => $salimapped
        ]);
    }

    public function planzajecpost(Request $request , $grpa){
        
        $planzajec = Planzajec::where('GrupaStudenta_idGrupaStudenta', $grpa)->first();
        // $rezerwacje = Rezerwacja::with('zajecie.przedmiot')->where('Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec)->get();
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
        ->join('zajęcie', function($join){
            $join->on('rezerwacja.Zajęcie_idZajęcie', '=', 'zajęcie.idZajęcie')
                ->on('rezerwacja.Zajęcie_PlanZajec_idPlanZajec', '=', 'zajęcie.PlanZajec_idPlanZajec');
        })
        ->join('sala', function($join){
            $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala');
        })
        ->join('prowadzacy', function($join){
            $join->on('rezerwacja.Prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy');    
        })
        ->leftJoin('przedmiot', 'zajęcie.Przedmiot_idPrzedmiot', '=', 'przedmiot.idPrzedmiot')
        ->leftJoin('user', 'prowadzacy.User_idUser' , '=' , 'user.idUser')

        ->where([['rezerwacja.Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec], ['rezerwacja.typWydarzenia', 'Zajęcia']])
        ->get();
        
        $gotowyplan = $rezerwacje->map(function ($item) {
            $dniMapowania = [
                'Poniedziałek' => 1,
                'Wtorek' => 2,
                'Środa' => 3,
                'Czwartek' => 4,
                'Piątek' => 5,
                'Sobota' => 6,
                'Niedziela' => 7,
            ];

            $numerDnia = $dniMapowania[$item->DzienTygodnia] ?? 1;
            
            // $dataZajec = Carbon::now()->startOfWeek()->addDays($numerDnia - 1)->format('Y-m-d');
            // dd($dataZajec); 
            return [
                'id' => $item->idRezerwacja,
                'start' => $item->data . 'T' . $item->GodzinaRozpoczecia,
                'end' => $item->data . 'T' . $item->GodzinaZakonczenia,
                'title' => $item->nazwa_przedmiotu . ' (' . $item->TypZajec . ')',
                'extendedProps' => [
                    'typ' => $item->TypZajec,
                    'parzystosc' => $item->Parzystosc,
                    'numersali' => $item->numerSali,
                    'imie' => substr($item->name, 0, 1),
                    'nazwisko' => $item->surname,
                    'tytulNaukowy' => $item->TytulNaukowy
                ]
            ];
        })->values()->toArray();
        
        
        // dd($gotowyplan);
       
        $listaKierunkow = Kierunek::get()->values()->toArray();
        $listaGrup = Grupastudenta::where('typGrupy', 'Laboratoryjna')->get()->values()->toArray();                       
        $user = $request->user();
        $role = '';
        if($user->isStudent()){
            $role = 'Student';
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
        }

        if($request->expectsJson()){
            return response()->json([
                'plan' => $gotowyplan,
                'listagrup' => $listaGrup,
                'listakierunkow' => $listaKierunkow
            ]);
        }

        // dd($listaGrup);
        // dd($listaKierunkow);
        return Inertia::render('PlanZajec', [
            'rol' => $role,
            'plan' => $gotowyplan,
            'listagrup' => $listaGrup,
            'listakierunkow' => $listaKierunkow
        ]);}

    public function planzajec(Request $request){

    
    

        $user = $request->user();
        $gotowyplan = null;
        $role = '';
        if($user->isStudent()){
            $role = 'Student';
            $student = Student::with('grupastudenta')->where('User_idUser', $user->idUser)->first();
            $grupa = $student->grupastudenta()->first();
            $planzajec = Planzajec::where('GrupaStudenta_idGrupaStudenta', $grupa->idGrupaStudenta)->first();
            // $rezerwacje = Rezerwacja::with('zajecie.przedmiot')->where('Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec)->get();
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
            ->join('zajęcie', function($join){
                $join->on('rezerwacja.Zajęcie_idZajęcie', '=', 'zajęcie.idZajęcie')
                    ->on('rezerwacja.Zajęcie_PlanZajec_idPlanZajec', '=', 'zajęcie.PlanZajec_idPlanZajec');
            })
            ->join('sala', function($join){
                $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala');
            })
            ->join('prowadzacy', function($join){
                $join->on('rezerwacja.Prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy');    
            })
            ->leftJoin('przedmiot', 'zajęcie.Przedmiot_idPrzedmiot', '=', 'przedmiot.idPrzedmiot')
            ->leftJoin('user', 'prowadzacy.User_idUser' , '=' , 'user.idUser')

            ->where([['rezerwacja.Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec], ['rezerwacja.typWydarzenia', 'Zajęcia']])
            ->get();
            
            $gotowyplan = $rezerwacje->map(function ($item) {
                
                // $dataZajec = Carbon::now()->startOfWeek()->addDays($numerDnia - 1)->format('Y-m-d');
                // dd($dataZajec); 
                return [
                    'id' => $item->idRezerwacja,
                    'start' => $item->data . 'T' . $item->GodzinaRozpoczecia,
                    'end' => $item->data . 'T' . $item->GodzinaZakonczenia,
                    'title' => $item->nazwa_przedmiotu . ' (' . $item->TypZajec . ')',
                    'extendedProps' => [
                        'typ' => $item->TypZajec,
                        'parzystosc' => $item->Parzystosc,
                        'numersali' => $item->numerSali,
                        'imie' => substr($item->name, 0, 1),
                        'nazwisko' => $item->surname,
                        'tytulNaukowy' => $item->TytulNaukowy
                    ]
                ];
            })->values()->toArray();
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
        }
        
        // dd($gotowyplan);
       
        $listaKierunkow = Kierunek::get()->values()->toArray();
        $listaGrup = Grupastudenta::where('typGrupy', 'Laboratoryjna')->get()->values()->toArray();                       
 
        if($request->expectsJson()){
            return response()->json([[
                'plan' => $gotowyplan ?? null,
                'listagrup' => $listaGrup,
                'listakierunkow' => $listaKierunkow
            ]]);
        }

        // dd($listaGrup);
        // dd($listaKierunkow);
        return Inertia::render('PlanZajec', [
            'rol' => $role,
            'plan' => $gotowyplan ?? null,
            'listagrup' => $listaGrup,
            'listakierunkow' => $listaKierunkow
        ]);
    }

    public function mojedane(Request $request){
        $user = $request->user();
        $role = '';
        $polaroli = [];
        $grupalaboratoryjna = null;
        $grupacwiczeniowa = null;
        $grupawykladowa = null;
        if($user->isStudent()){
            $role = 'Student';

            $student = Student::with('grupastudenta')->where('User_idUser', $user->idUser)->first();
            // dd($student->grupastudenta->toArray());


            if($student && $student->grupastudenta){

                $id_nadgrupy_lab = $student->grupastudenta->where('typGrupy', 'Laboratoryjna')->value('id_nadgrupy');
                $id_nadgrupy_cw = Grupastudenta::where('typGrupy', 'Cwiczeniowa')->value('id_nadgrupy');


                $grupalaboratoryjna = $student->grupastudenta()
                    ->where('typGrupy', 'Laboratoryjna')
                    ->pluck('nazwaGrupy')
                    ->implode(', ');
                if($id_nadgrupy_lab){
                    $grupacwiczeniowa = Grupastudenta::
                        where([['typGrupy', 'Cwiczeniowa'], ['idGrupaStudenta', $id_nadgrupy_lab]])
                        ->pluck('nazwaGrupy')
                        ->implode(', ');

                }
                    
                if($id_nadgrupy_cw){
                    $grupawykladowa = Grupastudenta::
                        where([['typGrupy', 'Wykladowa'], ['idGrupaStudenta', $id_nadgrupy_cw]])
                        ->pluck('nazwaGrupy')
                        ->implode(', ');
                }
                
            }

            $polaroli = [
                'index' => $user->student->index,
                'semester' => $user->student->semester,
                'stopien' => $user->student->stopien,
                'trybStudiow' => $user->student->trybStudiow,
                'rok' => $user->student->rok,
                'Specjalnosc' => $user->student->Specjalnosc ?? null,
                'kierunek' => $user->student->kierunek->nazwa,
                'wydzial' => $user->student->kierunek->wydzial->nazwa,
                'grupaLaboratoryjna' => $grupalaboratoryjna ?? null,
                'grupaCwiczeniowa' => $grupacwiczeniowa ?? null,
                'grupaWykladowa' => $grupawykladowa ?? null,

            ];
        }
        if($user->isProwadzacy()){
            $role = 'Prowadzący';
            $polaroli = [
                'TytulNaukowy' => $user->prowadzacy->TytulNaukowy,
                'katedra' => $user->prowadzacy->katedra,
            ];
        }
        if($user->isPracownikDziekanatu()){
            $role = 'Pracownik Dziekanatu';
            $polaroli = [
                'Odpowiedzialnosc' => $user->pracownikdziekanatu->Odpowiedzialnosc ?? null,
            ];
        }
        //czesc dla wyciagniecia zdjecia z bazy
        $base64data = $user->photo; 
        $photourl = $base64data ? 'data:image/jpeg;base64,' . $base64data : null;
        
        if($request->expectsJson()){
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
