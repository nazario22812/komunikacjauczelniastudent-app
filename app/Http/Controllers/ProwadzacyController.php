<?php

namespace App\Http\Controllers;

use App\Models\Prowadzacy;
use Illuminate\Http\Request;
use App\Models\Rezerwacja;
use Inertia\Inertia;
class ProwadzacyController extends Controller
{
    //

    public function konsultacjaform(){
        return Inertia::render('Prowadzacy/Konsultacjaform');
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
