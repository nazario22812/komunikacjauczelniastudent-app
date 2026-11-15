<?php

namespace App\Http\Controllers;

use App\Models\Kierunek;
use App\Models\Komunikat;
use App\Models\Kurs;
use App\Models\Literatura;
use App\Models\Planzajec;
use App\Models\Zadanie;
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
use App\Models\Przedmiot;
use App\Models\Sylabus;


class DziekanatController extends Controller
{
    //

    public function szczegolypodaniapost(Request $request, $podanie){

    }
    public function szczegolypodania(Request $request, $podanie){
        
        $szczegolypodania = Podanie::with('user')->where('idPodanie', $podanie)->first();
        $pliki = Plik::where('Podanie_idPodanie', $podanie)->get()->toArray();

        $listaplikow = [];

        foreach ($pliki as $plik){
            if(Storage::disk('public')->exists($plik['nazwa'])){
                array_push($listaplikow, $plik);
            }
        }
        return Inertia::render('PracownikDziekanatu/SzczegolyPodania',[
            'szczegoly' => $szczegolypodania,
            'listaplikow' => $listaplikow,
            'podanie'=> $podanie
        ]);
    }
    public function podania(Request $request){
        $podania = Podanie::with(['user', 'plik'])->where('status', 'Wysłano')->get()->toArray();
        
        return Inertia::render('PracownikDziekanatu/Podania',[
            'podania' => $podania,
        ]);
    }
}
