<?php

namespace App\Http\Controllers;

use App\Models\Kierunek;
use App\Models\Komunikat;
use App\Models\Kurs;
use App\Models\Literatura;
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
use Illuminate\Support\Facades\DB;
use App\Models\Ocena;
use App\Models\Przedmiot;
use App\Models\Sylabus;
use App\Models\Sala;
use App\Models\Budynek;
class StudentController extends Controller
{

    public function podgladRezerwacji(Request $request)
    {
        $user = $request->user();
        $rol = 'Student';

        if ($user->isProwadzacy()) {
            $rol = 'Prowadzący';
        }

        if ($user->isPracownikDziekanatu()) {
            $rol = 'Pracownik Dziekanatu';
        }

        $rezerwacje = Rezerwacja::select(
            'rezerwacja.idRezerwacja',
            'rezerwacja.data',
            'rezerwacja.GodzinaRozpoczecia',
            'rezerwacja.GodzinaZakonczenia',
            'rezerwacja.typWydarzenia',
            'rezerwacja.Sala_idSala',
            'rezerwacja.Sala_Budynek_idBudynek',
            'sala.numerSali',
            'budynek.nazwa as nazwaBudynku'
        )
            ->leftJoin('sala', function ($join) {
                $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala')
                    ->on('rezerwacja.Sala_Budynek_idBudynek', '=', 'sala.Budynek_idBudynek');
            })
            ->leftJoin('budynek', 'rezerwacja.Sala_Budynek_idBudynek', '=', 'budynek.idBudynek')
            ->whereIn('rezerwacja.statusRezerwacji', ['Zaakceptowana', 'Zatwierdzona'])
            ->whereNotIn('rezerwacja.typWydarzenia', [
                'Zajęcia',
                'Godziny dziekańskie',
                'Godziny rektorskie',
            ])
            ->orderBy('rezerwacja.data')
            ->orderBy('rezerwacja.GodzinaRozpoczecia')
            ->get();

        $sale = Sala::select('idSala', 'numerSali', 'Budynek_idBudynek')->get();
        $budynki = Budynek::select('idBudynek', 'nazwa')->get();

        $props = [
            'rol' => $rol,
            'rezerwacje' => $rezerwacje,
            'sale' => $sale,
            'budynki' => $budynki,
        ];

        if ($request->expectsJson()) {
            return response()->json($props);
        }

        return Inertia::render('Student/Rezerwacje', $props);
    }

    public function stronaglowna(Request $request)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $listakursow = $student->kurs()->with('prowadzacy.user')->orderBy('Kurs_idkurs', 'desc')->limit(5)->get()->toArray();
        $listawszystkichkursow = Kurs::where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->with(['prowadzacy.user', 'przedmiot'])->get()->toArray();
        $zadanie = $student->zadanie()->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->withPivot('status')->orderBy('Zadanie_idZadanie', 'desc')->first();
        $powiadomienie = $user->komunikat()->where('czyOgloszenie', 0)->orderBy('idKomunikat', 'desc')->first();

        return Inertia::render('Student/StronaGlowna', [
            'kursy' => $listakursow,
            'powiadomienie' => $powiadomienie,
            'wszystkiekursy' => $listawszystkichkursow,
            'zadanie' => $zadanie
        ]);
    }

    public function mojezadania(Request $request)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $zadania = $student->zadanie()->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->withPivot('status')->get()->toArray();

        if ($request->expectsJson()) {
            return response()->json(['zadania' => $zadania]);
        }

        return Inertia::render('Student/Mojezadania', ['zadania' => $zadania]);
    }

    public function usuniecieplikuzadania(Request $request, $idZadanie, $idPlik)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $zadanie = $student->zadanie()->where('Zadanie_idZadanie', $idZadanie)->firstOrFail();
        $plik = Plik::where('idPlik', $idPlik)
            ->where('Zadanie_idZadanie', $idZadanie)
            ->where('Student_idStudent', $student->idStudent)
            ->first();

        if (!$plik) {
            return back()->with('error', 'Nie znaleziono pliku');
        }

        if (Storage::disk('public')->exists($plik->nazwa) && !Storage::disk('public')->delete($plik->nazwa)) {
            return back()->with('error', 'Nie udało się usunąć pliku');
        }

        $plik->delete();

        return back()->with('status', 'Plik został usunięty');
    }

    public function wyslijzadanie(Request $request, $idZadanie)
    {
        $request->validate([
            'pliks' => 'required|array|min:1',
            'pliks.*' => 'required|file|max:10240',
        ]);

        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $zadanie = $student->zadanie()->where('Zadanie_idZadanie', $idZadanie)
            ->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->firstOrFail();
        $prowadzacy = $zadanie->kurs?->prowadzacy?->User_idUser;

        if (!$prowadzacy) {
            return back()->withErrors(['pliks' => 'Nie znaleziono prowadzącego dla tego zadania.']);
        }

        $temat = 'Masz zadanie do sprawdzania';
        $tresc = $user->name . ' ' . $user->surname . ' wysłał pliki do sprawdzenia zadania ' . $zadanie->nazwaZadania . ' do kursu ' . $zadanie->kurs->nazwa;

        DB::transaction(function () use ($request, $student, $zadanie, $idZadanie, $prowadzacy, $temat, $tresc) {
            foreach ($request->file('pliks', []) as $uploadedFile) {
                $sciezka = $uploadedFile->store('zadania', 'public');
                $typ = $uploadedFile->getMimeType();
                $size = $uploadedFile->getSize();
                $data = now()->format('Y-m-d H:i:s');

                Plik::create([
                    'nazwa' => $sciezka,
                    'typ' => $typ,
                    'rozmiar' => $size,
                    'dataTworzenia' => $data,
                    'Zadanie_idZadanie' => $idZadanie,
                    'Student_idStudent' => $student->idStudent
                ]);
            }

            $zadanie->pivot->update(['status' => 'Wysłane']);
            $komunikat = Komunikat::create([
                'temat' => $temat,
                'tresc' => $tresc,
                'czyOgloszenie' => 0
            ]);
            $komunikat->user()->syncWithoutDetaching([$prowadzacy]);
        });

        return back()->with('status', 'Zadanie zostało wysłane');
    }

    public function zadanieform(Request $request, $idZadanie)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $zadanie = $student->zadanie()->where('Zadanie_idZadanie', $idZadanie)
            ->with(['kurs.przedmiot', 'kurs.prowadzacy.user'])->withPivot('status')->firstOrFail();
        $pliki = Plik::where('Zadanie_idZadanie', $idZadanie)
            ->where('Student_idStudent', $student->idStudent)->get()->toArray();
        $ocena = Ocena::where('Zadanie_idZadanie', $idZadanie)
            ->where('idStudent', $student->idStudent)->first();

        if ($request->expectsJson()) {
            return response()->json([
                'zadanie' => $zadanie,
                'pliki' => $pliki,
                'ocena' => $ocena
            ]);
        }

        return Inertia::render('Student/Zadanie', [
            'zadanie' => $zadanie,
            'pliki' => $pliki,
            'ocena' => $ocena
        ]);
    }

    public function sprawdzeniekursu(Request $request, $idkurs)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $kurs = Kurs::where('idkurs', $idkurs)->with(['prowadzacy.user', 'przedmiot'])->firstOrFail();

        if ($student->kurs()->where('Kurs_idkurs', $idkurs)->exists()) {
            return redirect()->route('student.kurs', ['nazwa' => $kurs->nazwa, 'idkurs' => $idkurs]);
        }

        return redirect('/student/mojekursy')->with('status', 'Nie jesteś zapisany na ten kurs')->with('kurs', $kurs);
    }

    public function kurs(Request $request, $nazwa, $idkurs)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $kurs = $student->kurs()->where('Kurs_idkurs', $idkurs)
            ->with(['prowadzacy.user', 'przedmiot'])->firstOrFail();
        $materialy = Plik::where('Kurs_idkurs', $idkurs)->get()->toArray();
        $przedmiot = Przedmiot::where('idPrzedmiot', $kurs->Przedmiot_idPrzedmiot)->first();
        $sylabus = $przedmiot ? Sylabus::where('Przedmiot_idPrzedmiot', $przedmiot->idPrzedmiot)->first() : null;
        $literatura = $sylabus ? Literatura::where('Sylabus_idSylabus', $sylabus->idSylabus)->get()->toArray() : [];

        $oceny = Ocena::select('ocena.*', 'zadanie.*', 'kurs.*')
            ->join('zadanie', 'ocena.Zadanie_idZadanie', '=', 'zadanie.idZadanie')
            ->join('kurs', 'zadanie.kurs_idkurs', '=', 'kurs.idkurs')
            ->where('ocena.idStudent', $student->idStudent)
            ->where('kurs.idkurs', $idkurs)
            ->where('ocena.czyKoncowa', 0)
            ->whereNotNull('ocena.Zadanie_idZadanie')
            ->orderBy('ocena.idOcena', 'desc')
            ->get()->toArray();

        $zadania = Zadanie::where('kurs_idkurs', $idkurs)->get()->toArray();

        $dane = [
            'kurs' => $kurs,
            'materialy' => $materialy,
            'przedmiot' => $przedmiot,
            'sylabus' => $sylabus,
            'literatura' => $literatura,
            'oceny' => $oceny,
            'zadania' => $zadania
        ];

        if ($request->expectsJson()) {
            return response()->json($dane);
        }

        return Inertia::render('Student/Kurs', $dane);
    }

    public function mojekursypost(Request $request, $idkurs): RedirectResponse
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $kurs = Kurs::where('idkurs', $idkurs)
            ->where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->firstOrFail();

        if ($student->kurs()->where('Kurs_idkurs', $idkurs)->exists()) {
            return redirect('/student/mojekursy')->with('status', 'Jesteś już na tym kursie');
        }

        $student->kurs()->syncWithoutDetaching([$idkurs]);
        return redirect('/student/mojekursy')->with('status', 'Jesteś zapisany na kurs');
    }

    public function mojekursy(Request $request)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $listakursow = $student->kurs()->with('prowadzacy.user')->get()->toArray();
        $listawszystkichkursow = Kurs::where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->with(['prowadzacy.user', 'przedmiot'])->get()->toArray();
        $semestrykursow = Kurs::select('Semester')->distinct()->orderBy('Semester', 'desc')->where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->get()->toArray();
        $kierunek = Kierunek::where('idKierunek', $student->Kierunek_idKierunek)->first();

        $dane = [
            'mojekursy' => $listakursow,
            'wszystkiekursy' => $listawszystkichkursow,
            'listasemestrow' => $semestrykursow,
            'kierunekstudenta' => $kierunek
        ];

        if ($request->expectsJson()) {
            return response()->json($dane);
        }

        return Inertia::render('Student/Mojekursy', $dane);
    }

    public function ocenykoncowe(Request $request)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $ocenykoncowe = Ocena::select('ocena.*', 'przedmiot.nazwa')
            ->join('przedmiot', 'ocena.idPrzedmiot', '=', 'przedmiot.idPrzedmiot')
            ->where('ocena.idStudent', $student->idStudent)
            ->where('ocena.CzyKoncowa', 1)
            ->get()->toArray();
        $semestry = Ocena::select('Semester')->distinct()->orderBy('Semester', 'desc')
            ->where('idStudent', $student->idStudent)->where('CzyKoncowa', 1)
            ->get()->toArray();
        $studentsem = $student->semester;

        $dane = ['oceny' => $ocenykoncowe, 'semestry' => $semestry, 'studentsem' => $studentsem];

        if ($request->expectsJson()) {
            return response()->json($dane);
        }

        return Inertia::render('Student/Oceny', $dane);
    }

    public function zlozpodaniepost(Request $request): RedirectResponse
    {
        $request->validate([
            'temat' => 'required|string|max:255',
            'tresc' => 'required|string',
            'files' => 'nullable|array',
            'files.*' => 'file|max:10240'
        ]);

        $user = $request->user();
        $listaplikow = $request->file('files', []);

        DB::transaction(function () use ($request, $user, $listaplikow) {
            $nowePodanieid = Podanie::create([
                'temat' => $request->temat,
                'tresc' => $request->tresc,
                'data' => now()->format('Y-m-d H:i:s'),
                'autor' => $user->idUser,
                'status' => 'Wysłano',
                'odpowiedz' => null
            ]);

            foreach ($listaplikow as $plik) {
                $sciezka = $plik->store('podania', 'public');
                $typ = $plik->getMimeType();
                $size = $plik->getSize();
                $data = now()->format('Y-m-d H:i:s');

                Plik::create([
                    'nazwa' => $sciezka,
                    'typ' => $typ,
                    'rozmiar' => $size,
                    'dataTworzenia' => $data,
                    'Podanie_idPodanie' => $nowePodanieid->idPodanie
                ]);
            }
        });

        return redirect('/student/edziekanat');
    }

    public function zlozpodanie()
    {
        return Inertia::render('Student/Podanieform');
    }

    public function podanieinfo(Request $request, $podanie)
    {
        $user = $request->user();
        $szczegolypodania = Podanie::where('idPodanie', $podanie)
            ->where('autor', $user->idUser)->firstOrFail();
        $pliki = Plik::where('Podanie_idPodanie', $podanie)->get()->toArray();
        $listaplikow = [];

        foreach ($pliki as $plik) {
            if (Storage::disk('public')->exists($plik['nazwa'])) {
                $listaplikow[] = $plik;
            }
        }

        $dane = ['szczegoly' => $szczegolypodania, 'listaplikow' => $listaplikow];

        if ($request->expectsJson()) {
            return response()->json($dane);
        }

        return Inertia::render('Student/Podanieinfo', $dane);
    }

    public function edziekanat(Request $request)
    {
        $user = $request->user();
        $podania = Podanie::where('autor', $user->idUser)->orderBy('data', 'desc')->get();

        if ($request->expectsJson()) {
            return response()->json(['podania' => $podania]);
        }

        return Inertia::render('Student/EDziekanat', ['podania' => $podania]);
    }

    public function konsultacje(Request $request)
    {
        $user = $request->user();
        $datadzisziejsza = now()->toDateString();
        $rezerwowanekonsultacje = Rezerwacja::select(
            'prowadzacy.TytulNaukowy',
            'user.name',
            'user.surname',
            'sala.numerSali',
            'budynek.nazwa',
            'rezerwacja.*'
        )
            ->join('sala', function ($join) {
                $join->on('rezerwacja.Sala_idSala', '=', 'sala.idSala')
                    ->on('rezerwacja.Sala_Budynek_idBudynek', '=', 'sala.Budynek_idBudynek');
            })
            ->join('budynek', 'rezerwacja.Sala_Budynek_idBudynek', '=', 'budynek.idBudynek')
            ->join('prowadzacy', 'rezerwacja.Prowadzacy_idProwadzacy', '=', 'prowadzacy.idProwadzacy')
            ->leftJoin('user', 'prowadzacy.User_idUser', '=', 'user.idUser')
            ->where('rezerwacja.typWydarzenia', 'Konsultacje')
            ->where('rezerwacja.data', '>=', $datadzisziejsza)
            ->whereIn('rezerwacja.statusRezerwacji', ['Zaakceptowana', 'Zatwierdzona'])
            ->get()->toArray();

        if ($request->expectsJson()) {
            return response()->json(['konsultacje' => $rezerwowanekonsultacje]);
        }

        return Inertia::render('Student/Konsultacje', ['konsultacje' => $rezerwowanekonsultacje]);
    }

    public function finanse(Request $request)
    {
        $user = $request->user();
        $student = Student::where('User_idUser', $user->idUser)->firstOrFail();
        $platnosci = Platnosc::select('idPlatnosc', 'kwota', 'termin', 'data', 'tytul', 'czyOplacone')
            ->where('Student_idStudent', $student->idStudent)
            ->orderBy('data', 'desc')->get()->values()->toArray();
        $kontodozaplaty = $student->kontoDoZaplaty;
        $wszystkiekwoty = Platnosc::where('Student_idStudent', $student->idStudent)->where('czyOplacone', 0);
        $suma = $wszystkiekwoty->sum('kwota');
        $najblizszytermin = Platnosc::select('termin')
            ->where('Student_idStudent', $student->idStudent)->where('czyOplacone', 0)
            ->orderBy('termin', 'asc')->first();

        if ($request->expectsJson()) {
            $zaleglosci = Platnosc::select('idPlatnosc', 'kwota', 'termin', 'data', 'tytul', 'czyOplacone')
                ->where('Student_idStudent', $student->idStudent)->where('czyOplacone', 0)
                ->get()->values()->toArray();
            $oplacone = Platnosc::select('idPlatnosc', 'kwota', 'termin', 'data', 'tytul', 'czyOplacone')
                ->where('Student_idStudent', $student->idStudent)->where('czyOplacone', 1)
                ->get()->values()->toArray();

            return response()->json([
                'kontodozaplaty' => $kontodozaplaty,
                'zaleglosci' => $zaleglosci,
                'oplacone' => $oplacone,
                'suma' => $suma,
                'najblizszytermin' => $najblizszytermin?->termin ? substr($najblizszytermin->termin, 0, 16) : null
            ]);
        }

        return Inertia::render('Student/MojeFinanse', [
            'kontodozaplaty' => $kontodozaplaty,
            'platnosci' => $platnosci,
            'suma' => $suma,
            'najblizszytermin' => $najblizszytermin?->termin ? substr($najblizszytermin->termin, 0, 16) : null
        ]);
    }
}
