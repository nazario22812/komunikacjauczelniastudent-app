<?php

namespace App\Http\Controllers;

use App\Models\Ankieta;
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
