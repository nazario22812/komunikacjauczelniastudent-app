<?php

namespace App\Http\Controllers;

use App\Models\Budynek;
use App\Models\Prowadzacy;
use Illuminate\Http\Request;
use App\Models\Rezerwacja;
use App\Models\Sala;
use Inertia\Inertia;
class ProwadzacyController extends Controller
{
    //

    public function konsultacjaform(Request $request){
        $budynki = Budynek::select('idBudynek','nazwa')->get()->toArray();
        $sali = Sala::select('idSala', 'numerSali', 'Budynek_idBudynek')->get()->toArray();
        // dd($sali);
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


        return Inertia::render('Prowadzacy/Konsultacje',[
            'rezerwowanekonsultacje' => $rezerwowanekonsultacje,
        ]);

    }

}
