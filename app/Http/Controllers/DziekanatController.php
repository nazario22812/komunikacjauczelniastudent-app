<?php

namespace App\Http\Controllers;

use App\Models\Ankieta;
use App\Models\Pracownikdziekanatu;
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
use App\Models\Wydzial;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class DziekanatController extends Controller
{
    //


    public function dodaniesylabusa(Request $request, $przedmiot_id)
    {
        $validated = $request->validate([
            'iloscGodzin' => 'required|integer|min:0',
            'czyEgzamin' => 'required|boolean',
            'opisPrzedmiotu' => 'required|string',
            'warunkiZaliczenia' => 'required|string',
        ]);

        $przedmiot = Przedmiot::findOrFail($przedmiot_id);

        $istniejacySylabus = Sylabus::where(
            'Przedmiot_idPrzedmiot',
            $przedmiot->idPrzedmiot
        )->first();

        if ($istniejacySylabus) {
            return back()->withErrors([
                'sylabus' => 'Ten przedmiot posiada już sylabus.'
            ]);
        }

        Sylabus::create([
            'iloscGodzin' => $validated['iloscGodzin'],
            'czyEgzamin' => $validated['czyEgzamin'],
            'opisPrzedmiotu' => $validated['opisPrzedmiotu'],
            'warunkiZaliczenia' => $validated['warunkiZaliczenia'],
            'Przedmiot_idPrzedmiot' => $przedmiot->idPrzedmiot,
        ]);

        return back()->with(
            'status',
            'Sylabus został pomyślnie utworzony.'
        );
    }


    public function aktualizacjasylabusa(
        Request $request,
        $przedmiot_id,
        $sylabus_id
    ) {
        $validated = $request->validate([
            'iloscGodzin' => 'required|integer|min:0',
            'czyEgzamin' => 'required|boolean',
            'opisPrzedmiotu' => 'required|string',
            'warunkiZaliczenia' => 'required|string',
        ]);

        $sylabus = Sylabus::where(
            'idSylabus',
            $sylabus_id
        )
            ->where(
                'Przedmiot_idPrzedmiot',
                $przedmiot_id
            )
            ->firstOrFail();

        $sylabus->update([
            'iloscGodzin' => $validated['iloscGodzin'],
            'czyEgzamin' => $validated['czyEgzamin'],
            'opisPrzedmiotu' => $validated['opisPrzedmiotu'],
            'warunkiZaliczenia' => $validated['warunkiZaliczenia'],
        ]);

        return back()->with(
            'status',
            'Sylabus został pomyślnie zaktualizowany.'
        );
    }


    public function dodanieliteratury(
        Request $request,
        $przedmiot_id,
        $sylabus_id
    ) {
        $validated = $request->validate([
            'nazwa' => 'required|string|max:45',
            'opis' => 'required|string|max:1000',
        ]);

        $sylabus = Sylabus::where(
            'idSylabus',
            $sylabus_id
        )
            ->where(
                'Przedmiot_idPrzedmiot',
                $przedmiot_id
            )
            ->firstOrFail();

        Literatura::create([
            'nazwa' => $validated['nazwa'],
            'opis' => $validated['opis'],
            'Sylabus_idSylabus' => $sylabus->idSylabus,
        ]);

        return back()->with(
            'status',
            'Literatura została pomyślnie dodana.'
        );
    }


    public function usuniecieliteratury(
        Request $request,
        $przedmiot_id,
        $sylabus_id,
        $literatura_id
    ) {
        $sylabus = Sylabus::where(
            'idSylabus',
            $sylabus_id
        )
            ->where(
                'Przedmiot_idPrzedmiot',
                $przedmiot_id
            )
            ->firstOrFail();

        $literatura = Literatura::where(
            'idLiteratura',
            $literatura_id
        )
            ->where(
                'Sylabus_idSylabus',
                $sylabus->idSylabus
            )
            ->firstOrFail();

        $literatura->delete();

        return back()->with(
            'status',
            'Literatura została pomyślnie usunięta.'
        );
    }

    public function sylabusy(Request $request)
    {
        $listaprzedmiotow = Przedmiot::get()->toArray();

        $wybranyprzedmiot = $request->input('przedmiot_id');


        $sylabusy = [];

        if ($wybranyprzedmiot) {
            $sylabusy = Przedmiot::with('sylabus.literatura')
                ->where('idPrzedmiot', $wybranyprzedmiot)
                ->get()
                ->toArray();
        }

        return Inertia::render('PracownikDziekanatu/Sylabusy', [
            'listaprzedmiotow' => $listaprzedmiotow,
            'wybranyprzedmiot' => $wybranyprzedmiot,
            'sylabusy' => $sylabusy
        ]);
    }

    public function dodanieplatnosci(Request $request, $student_id)
    {
        $validated = $request->validate([
            'tytul' => 'required|string|max:45',
            'kwota' => 'required|numeric|gt:0',
            'termin' => 'required|date',
        ]);

        $student = Student::findOrFail($student_id);
        $user = $request->user();

        $pracownik = PracownikDziekanatu::where(
            'User_idUser',
            $user->idUser
        )->first();

        DB::transaction(function () use (
            $validated,
            $student,
            $pracownik
        ) {
            $platnosc = Platnosc::create([
                'tytul' => $validated['tytul'],
                'kwota' => $validated['kwota'],
                'termin' => $validated['termin'],
                'data' => now(),
                'czyOplacone' => 0,
                'Student_idStudent' => $student->idStudent,
                'PracownikDziekanatu_idPracownikDziekanatu' =>
                $pracownik->idPracownikDziekanatu,
            ]);

            $komunikat = Komunikat::create([
                'temat' => 'Nowa płatność',
                'tresc' =>
                'Wystawiono nową płatność: ' .
                    $platnosc->tytul .
                    '. Kwota: ' .
                    number_format($platnosc->kwota, 2, ',', ' ') .
                    ' PLN. Termin: ' .
                    date(
                        'd.m.Y H:i',
                        strtotime($platnosc->termin)
                    ) .
                    '.',
                'czyOgloszenie' => 0,
            ]);

            $komunikat->user()->attach($student->User_idUser);
        });

        return back()->with('status', 'Płatność została dodana, a student otrzymał powiadomienie');
    }


    public function zmianastatusuplatnosci(Request $request, $student_id, $platnosc_id)
    {
        $validated = $request->validate([
            'czyOplacone' => 'required|boolean',
        ]);

        $nowyStatus = $validated['czyOplacone'];

        $platnosc = Platnosc::where('idPlatnosc', $platnosc_id)->first();
        $platnosc->czyOplacone = $nowyStatus;
        $platnosc->save();

        return back()->with('status', 'Status płatności został zmieniony');
    }

    public function usuniecieplatnosci(Request $request, $student_id, $platnosc_id)
    {
        $znalezionaplatnosc = Platnosc::where('idPlatnosc', $platnosc_id)->first();

        if ($znalezionaplatnosc) {
            $znalezionaplatnosc->delete();
            return back()->with('status', 'Platnosc została usunięta');
        }
    }

    public function finansestudentow(Request $request)
    {

        $listastudentow = Student::with('user')->get()->toArray();

        $wybranystudent = $request->input('student_id');


        $platnosci = [];

        if ($wybranystudent) {
            $platnosci = Platnosc::where('Student_idStudent', $wybranystudent)->get()->toArray();
        }
        return Inertia::render('PracownikDziekanatu/FinanseStudentow', [
            'listastudentow' => $listastudentow,
            'wybranystudent' => $wybranystudent,
            'platnosci' => $platnosci
        ]);
    }

    public function storeAnkieta(Request $request)
    {
        $validated = $request->validate([
            'temat' => 'required|string|max:45',
            'opis' => 'required|string|max:45',
            'link' => 'required|url|max:65535',
        ]);

        Ankieta::create([
            'temat' => $validated['temat'],
            'opis' => $validated['opis'],
            'link' => $validated['link'],
        ]);
        return back()->with('status', 'Ankieta została pomyślnie opublikowana.');
    }


    public function storeOgloszenie(Request $request)
    {
        $validated = $request->validate([
            'temat' => 'required|string|max:45',
            'tresc' => 'required|string|max:200',
            'czy_godziny' => 'boolean',
            'rodzaj_godzin' => 'required_if:czy_godziny,true|nullable|in:dziekanskie,rektorskie',
            'wydzialy_ids' => 'required_if:czy_godziny,true|array',
            'wydzialy_ids.*' => 'integer|exists:wydzial,idWydzial',
            'data_godzin' => 'required_if:czy_godziny,true|nullable|date',
            'godzina_od' => 'required_if:czy_godziny,true|nullable|date_format:H:i',
            'godzina_do' => 'required_if:czy_godziny,true|nullable|date_format:H:i|after:godzina_od',
        ]);

        DB::transaction(function () use ($validated) {
            Komunikat::create([
                'temat' => $validated['temat'],
                'tresc' => $validated['tresc'],
                'czyOgloszenie' => 1,
            ]);

            if (!empty($validated['czy_godziny'])) {
                $typWydarzenia = $validated['rodzaj_godzin'] === 'rektorskie'
                    ? 'Godziny rektorskie'
                    : 'Godziny dziekańskie';

                $planyIds = Planzajec::join('grupastudenta', 'planzajec.GrupaStudenta_idGrupaStudenta', '=', 'grupastudenta.idGrupaStudenta')
                    ->whereIn('grupastudenta.Kierunek_Wydzial_idWydzial', $validated['wydzialy_ids'])
                    ->pluck('planzajec.idPlanZajec');

                if ($planyIds->isNotEmpty()) {
                    Rezerwacja::whereIn('Zajęcie_PlanZajec_idPlanZajec', $planyIds)
                        ->where('data', $validated['data_godzin'])
                        ->where('GodzinaRozpoczecia', '<', $validated['godzina_do'])
                        ->where('GodzinaZakonczenia', '>', $validated['godzina_od'])
                        ->where('typWydarzenia', 'Zajęcia')
                        ->delete();

                    foreach ($planyIds as $planId) {
                        Rezerwacja::create([
                            'data' => $validated['data_godzin'],
                            'GodzinaRozpoczecia' => $validated['godzina_od'],
                            'GodzinaZakonczenia' => $validated['godzina_do'],
                            'typWydarzenia' => $typWydarzenia,
                            'statusRezerwacji' => 'Zatwierdzona',
                            'Zajęcie_idZajęcie' => null,
                            'Zajęcie_PlanZajec_idPlanZajec' => $planId,
                            'Prowadzacy_idProwadzacy' => null,
                            'Sala_idSala' => null,
                            'Sala_Budynek_idBudynek' => null,
                        ]);
                    }
                }
            }
        });

        return back()->with('status', 'Ogłoszenie zostało pomyślnie opublikowane.');
    }

    public function ogloszenia()
    {
        $wydzialy = Wydzial::select('idWydzial', 'nazwa')->get();
        return Inertia::render('PracownikDziekanatu/OgloszeniaAnkiety', [
            'wydzialy' => $wydzialy
        ]);
    }

    public function szczegolypodaniapost(Request $request, $podanie)
    {
        $validated = $request->validate([
            'selected_status' => ['required', Rule::in(['Przyjęto', 'Odrzucono'])],
            'odpowiedz' => ['required', 'string', 'max:2000'],
        ]);

        $podanieModel = Podanie::with('user')->findOrFail($podanie);

        $podanieModel->update([
            'status' => $validated['selected_status'],
            'odpowiedz' => $validated['odpowiedz'],
        ]);

        $autor = $podanieModel->user;

        if ($autor) {
            $komunikat = Komunikat::create([
                'temat' => 'Decyzja w sprawie podania',
                'tresc' => 'Twoje podanie zostało ' . strtolower($validated['selected_status']),
                'czyOgloszenie' => 0,
            ]);

            $komunikat->user()->attach($autor->idUser);
        }

        return redirect()->back()->with('status', 'Decyzja została zapisana.');
    }
    public function szczegolypodania(Request $request, $podanie)
    {

        $szczegolypodania = Podanie::with('user')->where('idPodanie', $podanie)->first();
        $pliki = Plik::where('Podanie_idPodanie', $podanie)->get()->toArray();

        $listaplikow = [];

        foreach ($pliki as $plik) {
            if (Storage::disk('public')->exists($plik['nazwa'])) {
                array_push($listaplikow, $plik);
            }
        }
        return Inertia::render('PracownikDziekanatu/SzczegolyPodania', [
            'szczegoly' => $szczegolypodania,
            'listaplikow' => $listaplikow,
            'podanie' => $podanie
        ]);
    }
    public function podania(Request $request)
    {
        $podania = Podanie::with(['user', 'plik'])->where('status', 'Wysłano')->get()->toArray();

        return Inertia::render('PracownikDziekanatu/Podania', [
            'podania' => $podania,
        ]);
    }
}
