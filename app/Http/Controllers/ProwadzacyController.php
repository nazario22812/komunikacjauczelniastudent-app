<?php

namespace App\Http\Controllers;

use App\Models\Budynek;
use App\Models\Kierunek;
use App\Models\Prowadzacy;
use Illuminate\Http\Request;
use App\Models\Rezerwacja;
use App\Models\Sala;
use Inertia\Inertia;
use App\Models\Komunikat;
use App\Models\Student;
use App\Models\Zajecie;
use App\Models\Ocena;
use App\Models\Przedmiot;
use App\Models\Literatura;
use App\Models\Kurs;
use App\Models\Plik;
use App\Models\Sylabus;
use App\Models\Zadanie;
use Illuminate\Support\Facades\Storage;

class ProwadzacyController extends Controller
{
    //

    public function stworzKurs(Request $request){
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();

        $kurs = Kurs::where([['nazwa' , $request->input('nazwa')],
        ['Semester', $request->input('semester')],
        ['Przedmiot_idPrzedmiot', $request->input('przedmiot')],
        ['Kierunek_idKierunek', $request->input('kierunek')], 
        ['Prowadzacy_idProwadzacy', $prowadzacy->idProwadzacy], 
        ])->first();


        if($kurs){
            return redirect()->back()->with('error', 'Taki kurs już istnieje');
        }

        // dd($request->all());
        $nowykurs = Kurs::create([
            'nazwa' => $request->input('nazwa'),
            'kod' => $request->input('kod'),
            'Semester' => $request->input('semester'),
            'Przedmiot_idPrzedmiot' => $request->input('przedmiot'),
            'Prowadzacy_idProwadzacy' => $prowadzacy->idProwadzacy,
            'Kierunek_idKierunek' => $request->input('kierunek')
        ]);
        $status = 'Kurs ' . $request->input('nazwa') . ' został utworzony';
        return redirect()->back()->with('status', $status);
    }

    public function tworzeniekursu(Request $request){

        $przedmioty = Przedmiot::get()->toArray();
        $kierunki = Kierunek::get()->toArray();

        // dump($przedmioty);
        // dd($kierunki);

        return Inertia::render('Prowadzacy/TworzenieKursu', [
            'przedmioty' => $przedmioty,
            'kierunki' => $kierunki
        ]);
    }

    public function ocenieniezadania(Request $request, $idZadanie, $student_id, $wybranaocena){
        $znaleziony = Student::where('idStudent', $student_id)->first();
        
        $zadanie = Zadanie::where('idZadanie', $idZadanie)->first();
        $kurs = Kurs::where('idKurs', $zadanie->kurs_idkurs)->first();
        Ocena::create([
            'Semester' => $znaleziony->semester,
            'skalaOceny' => $wybranaocena,
            'czyKoncowa' => 0,
            'idStudent' => $student_id,
            'idPrzedmiot' => $kurs->Przedmiot_idPrzedmiot,
            'Zadanie_idZadanie' => $idZadanie,

        ]);

        $znaleziony->zadanie()->updateExistingPivot($idZadanie, ['status' => 'Ocenione']);
        return redirect()->back()->with('status', 'Ocena została wystawiona');
    }


    public function otworzzadanie(Request $request, $idZadanie){
        // dd($idZadanie);

        $studenci = Student::with('user')->whereHas('zadanie', function ($query) use ($idZadanie) {
            $query->where('student_has_zadanie.Zadanie_idZadanie', $idZadanie)
                ->where('student_has_zadanie.status', '!=', 'Ocenione');
        })
        ->get();

        $wybranystudent = $request->input('student_id');


        $pliks = []; 

        if ($wybranystudent) {
            $pliks = Plik::where('Zadanie_idZadanie', $idZadanie)
                ->where('Student_idStudent', $wybranystudent)
                ->get()
                ->toArray();
        }
        // dd($wybranystudent, $idZadanie, $pliks);
        return Inertia::render('Prowadzacy/SprawdzenieZadania',[
            'studenci' => $studenci,
            'idZadanie' => $idZadanie,
            'student_id' => $wybranystudent,  
            'pliks' => $pliks
        ]);
    }

    public function dodajzadanie(Request $request, $kursId){
        
        $zadanie = Zadanie::create([
            'nazwaZadania' => $request->input('nazwaZadania'),
            'tresc' => $request->input('opis'),
            'TerminOddania' => $request->input('termin'),
            'CzyNaOcene' => $request->input('czyNaOcene'),
            'kurs_idkurs' => $kursId
        ]);

        $studenty = Student::get();
        foreach($studenty as $student){
            if($student->kurs()->where('idKurs', $kursId)->exists()){
                $studentazadanie = $student->zadanie();
                $studentazadanie->attach($zadanie->idZadanie, ['status'=> 'Nie wysłane']);
                
            }
        }

        return redirect()->back()->with('status', 'Zadanie zostało dodane');
    }
    public function usunzadanie(Request $request, $kursId, $idZadanie){
        $zadanie = Zadanie::where([['idZadanie', $idZadanie], ['kurs_idkurs', $kursId]])->first();
        
        if ($zadanie) {
            $zadanie->delete();
            return redirect()->back()->with('status', 'Zadanie zostało usunięte');
        } else {
            return redirect()->back()->with('error', 'Nie znaleziono zadania');
        }
    }

    public function dodajmaterialy(Request $request, $idKurs){
        $user = $request->user();
        
        if (!$request->hasFile('pliks')) {
            return redirect()->back()->with('error', 'Nie wybrano pliku');
        }

        foreach($request->file('pliks') as $uploadedFile ){
            if (!$uploadedFile || !$uploadedFile->isValid()) {
               continue;
            }
            $originalnazwa = $uploadedFile->getClientOriginalName();
            $sciezka = $uploadedFile->storeAs('materialy', $originalnazwa, 'public');
            $typ = $uploadedFile->getMimeType();
            $size = $uploadedFile->getSize();
            $data = date("Y-m-d H:i:s");

            Plik::create([
                'nazwa' => $sciezka,
                'typ' => $typ,
                'rozmiar' => $size,
                'dataTworzenia' => $data,
                'Kurs_idkurs' => $idKurs
            ]);
        }

        return redirect()->back()->with('status', 'Materiały zostały dodane');   
    }

    public function usunmaterial(Request $request, $idKurs, $idPlik){
        $plik = Plik::where([['idPlik', $idPlik], ['Kurs_idKurs', $idKurs]])->first();
        if ($plik) {
            if(Storage::disk('public')->exists($plik->nazwa)){
                Storage::disk('public')->delete($plik->nazwa);
                $plik->delete();
            }
            $plik->delete();
            return redirect()->back()->with('status', 'Materiał został usunięty');
        } else {
            return redirect()->back()->with('error', 'Nie znaleziono materiału');
        }
    }

    public function usunstudentazkursu(Request $request, $idStudent, $idKurs){
        $kurs = Kurs::find($idKurs);
        if ($kurs) {
            $kurs->student()->detach($idStudent);
            return redirect()->back()->with('status', 'Student został usunięty z kursu');
        } else {
            return redirect()->back()->with('error', 'Nie znaleziono kursu');
        }
    }

    public function kurs(Request $request, $nazwa, $idkurs){


        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();

        $kurs = Kurs::where('idKurs', $idkurs)->with(['prowadzacy.user', 'przedmiot', 'student.user'])->first();
        $materialy = Plik::where('Kurs_idKurs', $idkurs)->get()->toArray();

        $przedmiot = Przedmiot::where('idPrzedmiot', $kurs->Przedmiot_idPrzedmiot)->first();
        $sylabus = Sylabus::where('Przedmiot_idPrzedmiot', $przedmiot->idPrzedmiot)->first();
        $literatura = Literatura::where('Sylabus_idSylabus', $sylabus->idSylabus)->get()->toArray();

        
        $zadania = Zadanie::where('kurs_idkurs', $idkurs)->get()->toArray();

        $studenci = $kurs->student()->with('user')->orderby('index', 'asc')->get()->toArray();
        //dd($studenci);
        // dd($oceny);
        return Inertia::render('Prowadzacy/Kurs', [
            'kurs' => $kurs,
            'materialy' => $materialy,
            'przedmiot' => $przedmiot,
            'sylabus' => $sylabus,
            'literatura' => $literatura,
            'zadania' => $zadania,
            'studenci' => $studenci
        ]);
    }

    public function mojekursy(Request $request){
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();
        $listakursow = $prowadzacy->kurs()->get()->toArray();
        

        if ($request->expectsJson()){
            return response()->json([
                'mojekursy' => $listakursow,
            ]);
        }

        return Inertia::render('Prowadzacy/MojeKursy',[
                'mojekursy' => $listakursow,
        
            ]);
    }

    public function wystawienieoceny(Request $request, $wybranyprzedmiot ,$idStudent, $wybranaocena){

        $zajecie = Zajecie::where('idZajęcie', $wybranyprzedmiot)->first();
        $przedmiot = Przedmiot::where('idPrzedmiot', $zajecie->Przedmiot_idPrzedmiot)->first();
        $student = Student::where('idStudent', $idStudent)->first();
        $istniejacaOcena = Ocena::where([['idStudent', $idStudent], ['idPrzedmiot', $przedmiot->idPrzedmiot], ['czyKoncowa', 1], ['typZajec', $zajecie->TypZajec]])
        ->first();
        

        $temat = '';
        $tresc = '';
        if ($istniejacaOcena) {
            $istniejacaOcena->skalaOceny = $wybranaocena;
            $istniejacaOcena->save();
        
            $temat = 'Aktualizacja oceny';
            $tresc = 'Twoja ocena końcowa z przedmiotu ' . $przedmiot->nazwa . ' ' . $zajecie->TypZajec . ' została zaktualizowana na ' . $wybranaocena . '. Sprawdź w zakładce moje oceny.';
        } else {
            Ocena::create([
                'idStudent' => $idStudent,
                'idPrzedmiot' => $przedmiot->idPrzedmiot,
                'skalaOceny' => $wybranaocena,
                'czyKoncowa' => 1,
                'typZajec' => $zajecie->TypZajec,
                'Semester' => $student->semester
            ]);

            $temat = 'Wystawienie oceny';
            $tresc = 'Twoja ocena końcowa z przedmiotu ' . $przedmiot->nazwa . ' ' . $zajecie->TypZajec . ' została wystawiona jako ' . $wybranaocena . '. Sprawdź w zakładce moje oceny.';
        }
        
        
        $komunikat = Komunikat::create([
            'temat' => $temat,
            'tresc' => $tresc,
            'czyOgloszenie' => 0
        ]);        

        $komunikat->user()->attach($student->User_idUser);
        return redirect()->back()->with('status', 'Ocena została wystawiona');

    }

    public function wystawienieocen(Request $request){
        // dd($request->all());
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();
        

        $zajecia = $prowadzacy->zajecie()
        ->join('przedmiot', function($join){
            $join->on('zajęcie.Przedmiot_idPrzedmiot', '=', 'przedmiot.idPrzedmiot');
        })
        ->select(
            'zajęcie.*',
            'przedmiot.nazwa as NazwaPrzedmiotu'
        )
        ->get()->toArray();

        $studenci = [];
        $wybranezajecie = $request->input('zajecie_id');
        
        if($wybranezajecie){
            $zajecie = Zajecie::with('planzajec.grupastudenta.grupastudenta.user')->find($wybranezajecie);
            // dd($zajecie?->planzajec?->grupastudenta?->grupastudenta);
            $studenci = $zajecie?->planzajec?->grupastudenta?->grupastudenta ?? [];
            
            if ($studenci->isNotEmpty() && $zajecie) {
                $przedmiotId = $zajecie->Przedmiot_idPrzedmiot;
                $typZajec = $zajecie->TypZajec;

                foreach ($studenci as $student) {
                    $istniejacaOcena = Ocena::where([['idStudent', $student->idStudent], ['idPrzedmiot', $przedmiotId], ['czyKoncowa', 1], ['typZajec', $typZajec]])
                    ->first();

                    $student->existingOcena = $istniejacaOcena?->skalaOceny ?? '';
                }
            }
        }

        if($request->expectsJson()){
            return response()->json([
                'zajecia' => $zajecia,
                'studenci' => $studenci,
                'selectedZajecieId' => $wybranezajecie,    
            ]);
        }

        // dd($zajecia);
        return Inertia::render('Prowadzacy/WystawienieOcen',[
            'zajecia' => $zajecia,
            'studenci' => $studenci,
            'selectedZajecieId' => $wybranezajecie,
        ]);   
    }


    public function stworzrezerwacje(Request $request){
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();
        $rezerwacja = Rezerwacja::where([['data', $request->data], ['GodzinaRozpoczecia', $request->godpocz], ['GodzinaZakonczenia', $request->godkon], ['Sala_idSala', $request->sala], ['Sala_Budynek_idBudynek', $request->budynek]])->exists();
        $listastudentow = Student::get();
        if(!$rezerwacja){
            if($request->zajecie != null){
                $znalezionezjecie = Zajecie::where('idZajęcie', $request->zajecie)->first();
                Rezerwacja::create([
                    'data' => $request->data,
                    'GodzinaRozpoczecia' => $request->godpocz,
                    'GodzinaZakonczenia' => $request->godkon,
                    'typWydarzenia' => $request->typ,
                    'statusRezerwacji' => 'Wysłana',
                    'Zajęcie_idZajęcie' => $znalezionezjecie->idZajęcie,
                    'Zajęcie_PlanZajec_idPlanZajec' => $znalezionezjecie->PlanZajec_idPlanZajec,
                    'Prowadzacy_idProwadzacy' => $prowadzacy->idProwadzacy,
                    'Sala_idSala' => $request->sala,
                    'Sala_Budynek_idBudynek' => $request->budynek               
                ]);


            }else{
                Rezerwacja::create([
                    'data' => $request->data,
                    'GodzinaRozpoczecia' => $request->godpocz,
                    'GodzinaZakonczenia' => $request->godkon,
                    'typWydarzenia' => $request->typ,
                    'statusRezerwacji' => 'Wysłana',
                    'Zajęcie_idZajęcie' => null,
                    'Zajęcie_PlanZajec_idPlanZajec' => null,
                    'Prowadzacy_idProwadzacy' => $prowadzacy->idProwadzacy,
                    'Sala_idSala' => $request->sala,
                    'Sala_Budynek_idBudynek' => $request->budynek               
                ]);

            }

            

            return redirect()->back()->with('status', 'utworzona nowa rezerwacja');
        }
        return redirect()->back()->with('error', 'rezerwacja juz istnieje');
    }

    public function rezerwacjeform(Request $request){
        $user = $request->user();
        $prowadzacy = Prowadzacy::where('User_idUser', $user->idUser)->first();

        $budynki = Budynek::select('idBudynek','nazwa')->get()->toArray();
        $sali = Sala::select('idSala', 'numerSali', 'Budynek_idBudynek')->get()->toArray();
        // dd($sali);


        $zajecia = $prowadzacy->zajecie()
        ->join('przedmiot', function($join){
            $join->on('zajęcie.Przedmiot_idPrzedmiot', '=', 'przedmiot.idPrzedmiot');
        })
        ->select(
            'zajęcie.*',
            'przedmiot.nazwa as NazwaPrzedmiotu'
        )
        ->get()->toArray();
        if($request->expectsJson()){
            return response()->json([
                'budynki' => $budynki,
                'sali' => $sali,    
                'zajecia' => $zajecia
            ]);
        }

        return Inertia::render('Prowadzacy/Rezerwacjaform', [
            'budynki' => $budynki,
            'sali' => $sali,
            'zajecia' => $zajecia
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
