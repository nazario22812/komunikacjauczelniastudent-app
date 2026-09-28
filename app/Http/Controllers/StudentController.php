<?php

namespace App\Http\Controllers;

use App\Models\Planzajec;
use App\Models\Platnosc;
use App\Models\Rezerwacja;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    //

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
