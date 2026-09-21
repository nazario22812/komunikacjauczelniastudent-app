<?php

namespace App\Http\Controllers;

use App\Models\Platnosc;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    //

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
