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

class StudentController extends Controller
{
    //


    public function stronaglowna(Request $request){
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $listakursow = $student->kurs()->with('prowadzacy.user')->orderBy('Kurs_idkurs', 'desc')->limit(5)->get()->toArray();
        $listawszystkichkursow = Kurs::where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->with(['prowadzacy.user', 'przedmiot'])->get()->toArray();
        $zadanie = $student->zadanie()->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->withPivot('status')->orderBy('Zadanie_idZadanie', 'desc')->first();
        // dd($zadanie);

        $powiadomienie = $user->komunikat()->where('czyOgloszenie', 0)->orderby('idKomunikat', 'desc')->first();
        dd($powiadomienie);
        return Inertia::render('Student/StronaGlowna', [
            'kursy' => $listakursow,
            'powiadomienie' => $powiadomienie,
            'wszystkiekursy' => $listawszystkichkursow,
            'zadanie' => $zadanie
        ]);
    }

    public function mojezadania(Request $request){
        $user = request()->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $zadania = $student->zadanie()->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->withPivot('status')->get()->toArray();
        return Inertia::render('Student/Mojezadania', [
            'zadania' => $zadania
        ]);
    }

    public function usuniecieplikuzadania($idZadanie, $idPlik){
        $plik = Plik::where([['idPlik', $idPlik], ['Zadanie_idZadanie', $idZadanie]])->first();
        

        if($plik){
            if(Storage::disk('public')->exists($plik->nazwa)){
                Storage::disk('public')->delete($plik->nazwa);
                $plik->delete();
            }
            return redirect('/student/kurs/' . $idZadanie)->with('status', 'plik został usunięty');
        }else{
            return redirect('/student/kurs/' . $idZadanie)->with('error', 'nie znaleziono pliku');
        }

        
    }

    public function wyslijzadanie(Request $request, $idZadanie){
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        
        if($request->file('pliks') == null){
            return redirect('/student/kurs/' . $idZadanie)->with('error', 'Nie wybrano pliku');
        }
        $pliki = Plik::where('Zadanie_idZadanie', $idZadanie)->get()->toArray();

        $zadanie = $student->zadanie()->where('Zadanie_idZadanie', $idZadanie)->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->first();
        $prowadzacy = $zadanie->kurs->prowadzacy->User_idUser;

        $temat = "Masz zadanie do sprawdzania";
        $tresc = $user->name . "" . $user->surname . " wysłał pliki do sprawdzenia zadania " . $zadanie->nazwaZadania . "do kursu" . $zadanie->kurs->nazwa;
        

        $istniejacynazwy = Plik::where('Zadanie_idZadanie', $idZadanie)->pluck('nazwa')->toArray();
        foreach($request->file('pliks') as $uploadedFile ){
            if (!$uploadedFile || !$uploadedFile->isValid()) {
               continue;
            }
            $originalnazwa = $uploadedFile->getClientOriginalName();
            $sciezka = $uploadedFile->storeAs('zadania', $originalnazwa, 'public');
            $typ = $uploadedFile->getMimeType();
            $size = $uploadedFile->getSize();
            $data = date("Y-m-d H:i:s");

            Plik::create([
                'nazwa' => $sciezka,
                'typ' => $typ,
                'rozmiar' => $size,
                'dataTworzenia' => $data,
                'Zadanie_idZadanie' => $idZadanie
            ]);
        }

       
        $zadanie->pivot->update([
            'status' => 'Wysłane'
        ]);
        $komunikat = Komunikat::create([
            'temat' => $temat,
            'tresc' => $tresc,
            'czyOgloszenie' => 0
        ]);
        $komunikat->user()->attach($prowadzacy);
        return redirect('/student/kurs/' . $idZadanie)->with('status', 'Zadanie zostało wysłane');
    }
    public function zadanieform(Request $request, $idZadanie){
        //zadanie ocena plik
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $zadanie = $student->zadanie()->where('Zadanie_idZadanie', $idZadanie)->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->withPivot('status')->first();
        $pliki = Plik::where('Zadanie_idZadanie', $idZadanie)->get()->toArray();
        $ocena = Ocena::where([['Zadanie_idZadanie', $idZadanie], ['idStudent', $student->idStudent]])->first();
        // dd($zadanie);
        return Inertia::render('Student/Zadanie',[
            'zadanie' => $zadanie,
            'pliki' => $pliki ? $pliki : null,
            'ocena' => $ocena ? $ocena : null
        ]);
    }

    public function sprawdzeniekursu(Request $request , $idkurs){
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $kurs = Kurs::where('idkurs', $idkurs)->with(['prowadzacy.user', 'przedmiot'])->first();

        // dd($kurs);
        // /student/mojekursy/{nazwa}/{idkurs}
        if($student->kurs()->where('Kurs_idkurs', $idkurs)->exists()){
            // return redirect(`/student/mojekursy/$kurs->nazwa/$idkurs`);
            return redirect()->route('student.kurs', ['nazwa' => $kurs->nazwa, 'idkurs' => $idkurs]);
        }else{
            return redirect('/student/mojekursy')->with('status', 'nie jestes zapisany na ten kurs')->with('kurs', $kurs);
        }
    }

    public function kurs(Request $request, $nazwa, $idkurs){


        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();

        $kurs = Kurs::where('idKurs', $idkurs)->with(['prowadzacy.user', 'przedmiot'])->first();
        $materialy = Plik::where('Kurs_idKurs', $idkurs)->get()->toArray();

        $przedmiot = Przedmiot::where('idPrzedmiot', $kurs->Przedmiot_idPrzedmiot)->first();
        $sylabus = Sylabus::where('Przedmiot_idPrzedmiot', $przedmiot->idPrzedmiot)->first();
        $literatura = Literatura::where('Sylabus_idSylabus', $sylabus->idSylabus)->get()->toArray();

        $oceny = Ocena::select(
            'ocena.*',
            'zadanie.*',
            'kurs.*'
        )
        ->join('zadanie', function($join){
            $join->on('ocena.Zadanie_idZadanie', '=', 'zadanie.idZadanie');
        })
        ->join('kurs', function($join){
            $join->on('zadanie.kurs_idkurs', '=', 'kurs.idkurs');
        })
        ->where([['ocena.idStudent', $student->idStudent], ['kurs.idkurs', $idkurs], ['ocena.czyKoncowa', 0]])
        ->whereNotNull('ocena.Zadanie_idZadanie')
        ->orderby('ocena.idOcena', 'desc')
        ->get()->toArray();


        $zadania = Zadanie::where('kurs_idkurs', $idkurs)->get()->toArray();

        // dd($oceny);
        return Inertia::render('Student/Kurs', [
            'kurs' => $kurs,
            'materialy' => $materialy,
            'przedmiot' => $przedmiot,
            'sylabus' => $sylabus,
            'literatura' => $literatura,
            'oceny' => $oceny,
            'zadania' => $zadania

        ]);
    }

    public function mojekursypost(Request $request, $idkurs) : RedirectResponse{
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $kurs = Kurs::where('idkurs', $idkurs)->first();
        if($student->kurs()->where('Kurs_idkurs', $idkurs)->exists()){
            return redirect('/student/mojekursy')->with('status', 'Jesteś już na tym kursie');
        }
        $student->kurs()->syncWithoutDetaching([$idkurs]);  // przypisuje do tabeli pomocniczej ale jezeli taki wpis jest to nic z nim nie robie
        return redirect('/student/mojekursy')->with('status', 'Jesteś zapisany na kurs');
    }
    public function mojekursy(Request $request){
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->first();
        $listakursow = $student->kurs()->with('prowadzacy.user')->get()->toArray();
        $listawszystkichkursow = Kurs::where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->with(['prowadzacy.user', 'przedmiot'])->get()->toArray();
        $semestrykursow = Kurs::select('Semester')->distinct()->orderby('Semester', 'desc')->where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->get()->toArray();
        $kierunek = Kierunek::where('idKierunek', $student->Kierunek_idKierunek)->first();
        // dd($przedmiotykursow);
        return Inertia::render('Student/Mojekursy',[
            'mojekursy' => $listakursow,
            'wszystkiekursy' => $listawszystkichkursow,
            'listasemestrow' => $semestrykursow,
            'kierunekstudenta' => $kierunek
        ]);
    }

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
        ->join('prowadzacy_has_przedmiot', function($join){
            $join->on('przedmiot.idPrzedmiot', '=', 'prowadzacy_has_przedmiot.przedmiot_idPrzedmiot');
        })
        ->join('prowadzacy', function($join){
            $join->on('prowadzacy_has_przedmiot.prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy');
        })
        ->leftjoin('user', 'prowadzacy.User_idUser', '=', 'user.idUser')
        ->where([['ocena.idStudent', $student->idStudent], ['ocena.CzyKoncowa', 1]])
        ->get()
        ->toArray();
        // SELECT DISTINCT `Semester` FROM `ocena` ORDER BY `Semester` DESC;
        $semestry = Ocena::select('Semester')->distinct()->orderby('Semester', 'desc')->where([['idStudent', $student->idStudent], ['ocena.CzyKoncowa', 1]])->get()->toArray();
        $studentsem = $student->semester;
        // substr($item->GodzinaZakonczenia, 0, 5) ,
        // dd($semestry);
        

        return Inertia::render('Student/Oceny', [
            'oceny' => $ocenykoncowe,
            'semestry' => $semestry,
            'studentsem' => $studentsem
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
        
        return redirect('/student/edziekanat'); 
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
        $podania = Podanie::where('autor', $user->idUser)->orderBy('data', 'desc')->get();
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
