<?php

namespace App\Http\Controllers;

use App\Models\Planzajec;
use Illuminate\Http\RedirectResponse;
use App\Models\Podanie;
use App\Models\Plik;
use App\Models\Platnosc;
use App\Models\Rezerwacja;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Ocena;
class StudentController extends Controller
{
    //

    public function ocenykoncowe(Request $request){
       

        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $ocenykoncowe = Ocena::select(
            'ocena.*',
            'przedmiot.nazwa',
            'przedmiot.typ',
            'prowadzacy.TytulNaukowy',
            'user.name AS wykladowca_imie',
            'user.surname AS wykladowca_nazwisko'
        )
        ->join('przedmiot', function($join){
            $join->on('ocena.idPrzedmiot', '=', 'przedmiot.idPrzedmiot');
        })
        ->join('Prowadzacy_has_Przedmiot', function($join){
            $join->on('przedmiot.idPrzedmiot', '=', 'Prowadzacy_has_Przedmiot.Przedmiot_idPrzedmiot');
        })
        ->join('prowadzacy', function($join){
            $join->on('Prowadzacy_has_Przedmiot.Prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy');
        })
        ->leftjoin('user', 'prowadzacy.User_idUser', '=', 'user.idUser')
        ->where([['ocena.idStudent', $student->idStudent], ['ocena.CzyKoncowa', 1]])
        ->get()
        ->toArray();

        // dd($ocenykoncowe);
        

        return Inertia::render('Student/Oceny', [
            'oceny' => $ocenykoncowe
        ]);
    }

    public function zlozpodaniepost(Request $request): RedirectResponse {
        if(empty($request->temat) || empty($request->tresc)){
            return redirect('/zlozpodanie')->withErrors(['temat' => 'Wybierz temat', 'tresc' => 'Podaj treść podania']);
        }  
        $user = $request->user();
        $nowePodanieid = Podanie::create([
            'temat' => $request->temat,
            'tresc' => $request->tresc,
            'data' => date("y-m-d H:i"),
            'autor' => $user->idUser,
            'status' => 'Wysłano',
            'odpowiedz' => null
        ]);

        
        // dd($nowePodanieid->idPodanie);
        $listaplikow = ($request->file('plik'));
        if($listaplikow != null){

            $listaplikow = is_array($listaplikow) ? $listaplikow : [$listaplikow];
            foreach ($listaplikow as $plik){
                $nazwa = $plik->getClientOriginalName();
                $sciezka = $plik->storeAs('podania', $nazwa, 'public');
                $typ = $plik->getMimeType();
                $size = $plik->getSize();
                $data = date("Y-m-d H:i:s");

                // dd($typ);

                Plik::create([
                    'nazwa' => $sciezka,
                    'typ' => $typ,
                    'rozmiar' => $size,
                    'dataTworzenia' => $data,
                    'Podanie_idPodanie' => $nowePodanieid->idPodanie
                ]);

            };
        }
        
        return redirect('/edziekanat'); 
    }

    public function zlozpodanie(){
        return Inertia::render('Student/Podanieform');
    }

    public function podanieinfo($podanie){
        
        $szczegolypodania = Podanie::where('idPodanie', $podanie)->first();
        $pliki = Plik::where('Podanie_idPodanie', $podanie)->get()->toArray();
        // dd($pliki);

        $listaplikow = [];

        foreach ($pliki as $plik){
            if(Storage::disk('public')->exists($plik['nazwa'])){
                array_push($listaplikow, $plik);
            }
        }
        // dd($listaplikow);

        return Inertia::render('Student/Podanieinfo',[
            'szczegoly' => $szczegolypodania,
            'listaplikow' => $listaplikow
        ]);
    }

    public function edziekanat(Request $request){
        $user = $request->user();


        // $podania = Podanie::select(
        //     'podanie.*',
        //     'plik.*'
        // )
        // ->join('plik', function($join){
        //     $join->on('idPodanie', '=', 'plik.Podanie_idPodanie');
        // })
        // ->where('podanie.autor', $user->idUser)
        // ->get()
        // ->values()
        // ->toArray();
        $podania = Podanie::with('plik')->where('autor', $user->idUser)->get();
        // dd($podania);

        return Inertia::render('Student/EDziekanat', [
            'podania' => $podania,
        ]);
    }

    public function konsultacje(Request $request){
//         SELECT `prowadzacy`.`TytulNaukowy`, `user`.`name`, `user`.`surname`, `sala`.`numerSali`,`budynek`.`nazwa`, `rezerwacja`.*
// FROM `rezerwacja`
// INNER JOIN `sala` ON `rezerwacja`.`Sala_idSala` = `sala`.`idSala` 
// INNER JOIN `budynek` ON `rezerwacja`.`Sala_Budynek_idBudynek` = `budynek`.`idBudynek`
// INNER JOIN `prowadzacy` ON `rezerwacja`.`Prowadzacy_idProwadzacy` = `prowadzacy`.`idProwadzacy`
// LEFT JOIN `user` ON `prowadzacy`.`User_idUser` = `user`.`idUser`
        $user = $request->user();
        $student = Student::with('grupastudenta')->where('User_idUser', $user->idUser)->first();
        $idgrupy =  $student->grupastudenta->where('typGrupy', 'Laboratoryjna')->value('idGrupaStudenta');
        $planzajec = Planzajec::where('GrupaStudenta_idGrupaStudenta', $idgrupy)->first();
        
        $datadzisziejsza = date('y-m-d');
        $rezerwowanekonsultacje = Rezerwacja::select(
            'prowadzacy.TytulNaukowy',
            'user.name',
            'user.surname',
            'sala.numerSali',
            'budynek.nazwa',
            'rezerwacja.*'
        )->join('sala', function($join){
            $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala');
        })
        ->join('budynek', function($join){
            $join->on('rezerwacja.Sala_Budynek_idBudynek', '=', 'budynek.idBudynek');
        })
        ->join('prowadzacy', function($join){
            $join->on('rezerwacja.Prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy');
        })
        ->leftjoin('user', 'prowadzacy.User_idUser', '=', 'user.idUser')
        ->where([['rezerwacja.Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec], ['rezerwacja.typWydarzenia', 'Konsultacje'], ['rezerwacja.data', '>=' , $datadzisziejsza]])
        ->get()
        ->toArray();


        return Inertia::render('Student/Konsultacje',[
            'konsultacje' => $rezerwowanekonsultacje
        ]);
    }

    public function finanse(Request $request){

        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $platnosci = Platnosc::select(
            'idPlatnosc',
            'kwota',
            'termin',
            'data',
            'tytul',
            'czyOplacone'
        )
        ->where('Student_idStudent', '=', $student->idStudent)
        ->get()
        ->values()
        ->toArray();
        // dd($platnosci);

        $suma = 0;
        $wszystkiekwoty = Platnosc::select(
            'kwota',
            
        )
        ->where([['Student_idStudent', '=', $student->idStudent], ['czyOplacone', '=', 0]])
        ->get()
        ->values()
        ->toArray();

        foreach($wszystkiekwoty as $kwoty){
            foreach($kwoty as $kwota){
                $suma += $kwota;
            }
        }
        $najblizszytermin = Platnosc::select(
            'termin',
            
        )
        ->where([['Student_idStudent', '=', $student->idStudent], ['czyOplacone', '=', 0]])
        ->orderBy('termin','asc')
        ->first();
        
        return Inertia::render('Student/MojeFinanse',[
            'platnosci' => $platnosci,
            'suma' => $suma,
            'najblizszytermin' => substr($najblizszytermin?->termin, 0, 16) ?: null,
        ]);
    }
}
