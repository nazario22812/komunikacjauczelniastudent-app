<?php

namespace App\Http\Controllers;

use App\Models\Grupastudenta;
use App\Models\Planzajec;
use App\Models\Rezerwacja;
use App\Models\Student;
use App\Models\Zajecie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    //
    public function planzajec(Request $request){

    
    // SELECT
    //     z.DzienTygodnia,
    //     r.GodzinaRozpoczecia,
    //     r.GodzinaZakonczenia,
    //     p.nazwa AS Przedmiot,
    //     z.TypZajec,
    //     s.numerSali,
    //     pro.idProwadzacy
    // FROM zajęcie z
    // JOIN przedmiot p
    //     ON z.Przedmiot_idPrzedmiot = p.idPrzedmiot
    // JOIN sala s
    //     ON z.Sala_idSala = s.idSala
    // JOIN prowadzacy pro
    //     ON pro.Zajęcie_idZajęcie = z.idZajęcie
    //     AND pro.Zajęcie_PlanZajec_idPlanZajec = z.PlanZajec_idPlanZajec
    // JOIN rezerwacja r
    //     ON z.idZajęcie = r.Zajęcie_idZajęcie
    //     AND z.PlanZajec_idPlanZajec = r.Zajęcie_PlanZajec_idPlanZajec
    // WHERE z.PlanZajec_idPlanZajec = 1
    // ORDER BY
    //     FIELD(
    //         z.DzienTygodnia,
    //         'Poniedziałek',
    //         'Wtorek',
    //         'Środa',
    //         'Czwartek',
    //         'Piątek'
    //     ),
    //     r.GodzinaRozpoczecia

        $user = $request->user();
        $student = Student::with('grupastudenta')->where('User_idUser', $user->idUser)->first();
        $planzajec = Planzajec::where('GrupaStudenta_idGrupaStudenta', $student->grupastudenta->first()?->idGrupaStudenta)->first();
        $zajecia = Zajecie::where('PlanZajec_idPlanZajec', $planzajec->idPlanZajec)->get();
        $rezerwowanezajecia = Rezerwacja::where('Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec)->get();

        $gotowyplan = $zajecia->concat($rezerwowanezajecia)->sortBy('GodzinaRozpoczecia');
        dd($gotowyplan->toArray());

        return Inertia::render('PlanZajec', [
            'paln' => $gotowyplan->values()->toArray(),
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
