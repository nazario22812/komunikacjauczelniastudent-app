<?php

namespace App\Http\Controllers;

use App\Models\Budynek;
use App\Models\Prowadzacy;
use Illuminate\Http\Request;
use App\Models\Rezerwacja;
use App\Models\Sala;
use Inertia\Inertia;
use App\Models\Komunikat;
use App\Models\Student;

class ProwadzacyController extends Controller
{
    //

    public function rezerwacjeform(Request $request){
        $budynki = Budynek::select('idBudynek','nazwa')->get()->toArray();
        $sali = Sala::select('idSala', 'numerSali', 'Budynek_idBudynek')->get()->toArray();
        // dd($sali);

        if($request->expectsJson()){
            return response()->json([
                'budynki' => $budynki,
                'sali' => $sali,    
            ]);
        }

        return Inertia::render('Prowadzacy/Rezerwacjaform', [
            'budynki' => $budynki,
            'sali' => $sali,
        ]);
    }

    public function usuniecieRezerwacji(Request $request, $idRezerwacja){
        Rezerwacja::where('idRezerwacja', $idRezerwacja)->delete();
        return redirect()->back()->with('status', 'Rezerwacja została usunięta');
    }

    public function mojerezerwacje(Request $request){
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();

        // $datadzisziejsza = date('y-m-d');
        $rezerwowanesale = Rezerwacja::select(
            'sala.numerSali',
            'budynek.nazwa',
            'rezerwacja.*'
        )->join('sala', function($join){
            $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala');
        })
        ->join('budynek', function($join){
            $join->on('rezerwacja.Sala_Budynek_idBudynek', '=', 'budynek.idBudynek');
        })
        ->where([['Prowadzacy_idProwadzacy', $prowadzacy->idProwadzacy ], ['rezerwacja.typWydarzenia', '!=' , 'Konsultacje'], ['rezerwacja.typWydarzenia', '!=', 'Zajęcia']])
        ->get()
        ->toArray();


        // dd($rezerwowanekonsultacje);

        if($request->expectsJson()){
            return response()->json([
                'rezerwowanesale' => $rezerwowanesale,
            ]);
        }

        return Inertia::render('Prowadzacy/Rezerwacje',[
            'rezerwowanesale' => $rezerwowanesale,
        ]);

    }

    public function stworzkonsultacje(Request $request){
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();
        $rezerwacja = Rezerwacja::where([['data', $request->data], ['GodzinaRozpoczecia', $request->godpocz], ['GodzinaZakonczenia', $request->godkon], ['Sala_idSala', $request->sala], ['Sala_Budynek_idBudynek', $request->budynek]])->exists();
        $listastudentow = Student::get();
        if(!$rezerwacja){
            Rezerwacja::create([
                'data' => $request->data,
                'GodzinaRozpoczecia' => $request->godpocz,
                'GodzinaZakonczenia' => $request->godkon,
                'typWydarzenia' => 'Konsultacje',
                'statusRezerwacji' => 'Zatwierdzona',
                'Zajęcie_idZajęcie' => null,
                'Zajęcie_PlanZajec_idPlanZajec' => null,
                'Prowadzacy_idProwadzacy' => $prowadzacy->idProwadzacy,
                'Sala_idSala' => $request->sala,
                'Sala_Budynek_idBudynek' => $request->budynek               
            ]);

            $komunikat = Komunikat::create([
                'temat' => 'Nowa konsultacja',
                'tresc' => 'Pojawiła się nowa konusltacja, sprawdź w zakładce moje konsultacje',
                'czyOgloszenie' => 0
            ]);

            foreach ($listastudentow as $student) {
                $komunikat->user()->attach($student->User_idUser);
            }
            return redirect()->back()->with('status', 'utworzona nowa rezerwacja');
        }
        return redirect()->back()->with('error', 'rezerwacja juz istnieje');
    }

    public function konsultacjaform(Request $request){
        $budynki = Budynek::select('idBudynek','nazwa')->get()->toArray();
        $sali = Sala::select('idSala', 'numerSali', 'Budynek_idBudynek')->get()->toArray();
        // dd($sali);

        if($request->expectsJson()){
            return response()->json([
                'budynki' => $budynki,
                'sali' => $sali,    
            ]);
        }

        return Inertia::render('Prowadzacy/Konsultacjaform', [
            'budynki' => $budynki,
            'sali' => $sali,
        ]);
    }
    public function usuniecieKonsultacji(Request $request, $idRezerwacja){
        Rezerwacja::where('idRezerwacja', $idRezerwacja)->delete();
        return redirect()->back()->with('status', 'konsultacja została usunięta');
    }

    public function mojekonsultacje(Request $request){
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();

        // $datadzisziejsza = date('y-m-d');
        $rezerwowanekonsultacje = Rezerwacja::select(
            'sala.numerSali',
            'budynek.nazwa',
            'rezerwacja.*'
        )->join('sala', function($join){
            $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala');
        })
        ->join('budynek', function($join){
            $join->on('rezerwacja.Sala_Budynek_idBudynek', '=', 'budynek.idBudynek');
        })
        ->where([['Prowadzacy_idProwadzacy', $prowadzacy->idProwadzacy ], ['rezerwacja.typWydarzenia', 'Konsultacje']])
        ->get()
        ->toArray();


        // dd($rezerwowanekonsultacje);

        if($request->expectsJson()){
            return response()->json([
                'rezerwowanekonsultacje' => $rezerwowanekonsultacje,
            ]);
        }

        return Inertia::render('Prowadzacy/Konsultacje',[
            'rezerwowanekonsultacje' => $rezerwowanekonsultacje,
        ]);

    }

}
