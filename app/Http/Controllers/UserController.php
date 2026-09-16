<?php

namespace App\Http\Controllers;

use App\Models\Budynek;
use App\Models\Grupastudenta;
use App\Models\Kierunek;
use App\Models\Planzajec;
use App\Models\Rezerwacja;
use App\Models\Student;
use App\Models\Zajecie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    //

    public function mapaKampusu(){


        $listaBudynkow = Budynek::get()->values()->toArray();
        // dd($listaBudynkow);

        return Inertia::render('MapaKampusu', [
            'listaBudynkow' => $listaBudynkow,
        ]);
    }

    public function planzajecpost($grpa){
        $planzajec = Planzajec::where('GrupaStudenta_idGrupaStudenta', $grpa)->first();
        // dd($grpa);
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
        ->where('rezerwacja.Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec)
        ->get();
        $gotowyplan = $rezerwacje->map(function ($item) {
            return[
                'id' => $item->idRezerwacja,
                'dzien' => $item->DzienTygodnia,
                'godzina_rozpoczecia' => substr($item->GodzinaRozpoczecia, 0 , 5),
                'godzina_zakonczenia' => substr($item->GodzinaZakonczenia, 0, 5) ,
                'tytul' => $item->nazwa_przedmiotu,
                'typ' => $item->TypZajec,
                'parzystosc' => $item->Parzystosc,
                'numersali' => $item->numerSali,
                'imie' =>substr($item->name, 0, 1) ,
                'nazwisko' => $item->surname,
                'tytulNaukowy' => $item->TytulNaukowy

            ];
        })->sortBy('godzina_rozpoczecia')->values()->toArray();

        $listaKierunkow = Kierunek::get()->values()->toArray();
        $listaGrup = Grupastudenta::where('typGrupy', 'Laboratoryjna')->get()->values()->toArray();     

        return Inertia::render('PlanZajec',[
            'plan' => $gotowyplan,
            'listagrup' => $listaGrup,
            'listakierunkow' => $listaKierunkow
        ]);
    }

    public function planzajec(Request $request){

    
    

        $user = $request->user();
        $gotowyplan = null;
        if($user->isStudent()){
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

            ->where('rezerwacja.Zajęcie_PlanZajec_idPlanZajec', $planzajec->idPlanZajec)
            ->get();
            $gotowyplan = $rezerwacje->map(function ($item) {
                return[
                    'id' => $item->idRezerwacja,
                    'dzien' => $item->DzienTygodnia,
                    'godzina_rozpoczecia' => substr($item->GodzinaRozpoczecia, 0 , 5),
                    'godzina_zakonczenia' => substr($item->GodzinaZakonczenia, 0, 5) ,
                    'tytul' => $item->nazwa_przedmiotu,
                    'typ' => $item->TypZajec,
                    'parzystosc' => $item->Parzystosc,
                    'numersali' => $item->numerSali,
                    'imie' =>substr($item->name, 0, 1) ,
                    'nazwisko' => $item->surname,
                    'tytulNaukowy' => $item->TytulNaukowy
                ];
            })->sortBy('godzina_rozpoczecia')->values()->toArray();
        }
        
        // dd($gotowyplan);
       
        $listaKierunkow = Kierunek::get()->values()->toArray();
        $listaGrup = Grupastudenta::where('typGrupy', 'Laboratoryjna')->get()->values()->toArray();                       
 
        // dd($listaGrup);
        // dd($listaKierunkow);
        return Inertia::render('PlanZajec', [
            'plan' => $gotowyplan,
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
