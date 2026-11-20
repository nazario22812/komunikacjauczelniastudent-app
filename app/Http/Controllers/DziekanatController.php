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
use App\Models\Sala;
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
use App\Models\Grupastudenta;
use App\Models\Zajecie;
use App\Models\Prowadzacy;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DziekanatController extends Controller
{
    public function stronaGlowna()
    {
        $podania = Podanie::latest('idPodanie')->limit(3)->get();

        $rezerwacje = Rezerwacja::where(
            'statusRezerwacji',
            'Oczekująca'
        )->orderBy('data')->limit(3)->get();

        return Inertia::render(
            'PracownikDziekanatu/StronaGlowna',
            [
                'podania' => $podania,
                'rezerwacje' => $rezerwacje,
                'statystyki' => [
                    'podaniaOczekujace' => Podanie::count(),
                    'rezerwacjeOczekujace' => Rezerwacja::where(
                        'statusRezerwacji',
                        'Oczekująca'
                    )->count(),
                    'plany' => Planzajec::count(),
                ],
            ]
        );
    }

    public function planyZajec(Request $request)
    {
        $wybranyPlan = $request->input('plan_id');
        $plany = Planzajec::orderByDesc('rok')->orderBy('Semester')->get();
        $grupy = Grupastudenta::orderBy('nazwaGrupy')->get();
        $sale = Sala::orderBy('numerSali')->get();
        $prowadzacy = Prowadzacy::with('user')->get();
        $przedmioty = Przedmiot::orderBy('nazwa')->get();

        $zajecia = collect();
        if ($wybranyPlan) {
            $zajecia = Zajecie::with(['przedmiot', 'prowadzacy.user', 'rezerwacja'])
                ->where('PlanZajec_idPlanZajec', $wybranyPlan)->get();
            foreach ($zajecia as $zajecie) {
                $zajecie->rezerwacje = $zajecie->rezerwacja;
                $zajecie->prowadzacy_ids = $zajecie->prowadzacy->pluck('idProwadzacy');
                $zajecie->nazwaPrzedmiotu = $zajecie->przedmiot?->nazwa;
                $zajecie->numerSali = Sala::where('idSala', $zajecie->Sala_idSala)
                    ->where('Budynek_idBudynek', $zajecie->Sala_Budynek_idBudynek)->value('numerSali');
            }
        }

        return Inertia::render('PracownikDziekanatu/Planyzajec', compact(
            'plany',
            'grupy',
            'sale',
            'prowadzacy',
            'przedmioty',
            'wybranyPlan',
            'zajecia'
        ));
    }

    public function dodajPlanZajec(Request $request)
    {
        $dane = $this->danePlanu($request);
        Planzajec::create($dane);
        return back()->with('status', 'Plan został dodany.');
    }

    public function aktualizujPlanZajec(Request $request, $id)
    {
        $plan = Planzajec::find($id);
        if (!$plan) return back()->withErrors(['plan' => 'Nie znaleziono planu.']);
        $dane = $this->danePlanu($request);
        if (
            $plan->GrupaStudenta_idGrupaStudenta != $dane['GrupaStudenta_idGrupaStudenta'] &&
            Zajecie::where('PlanZajec_idPlanZajec', $id)->exists()
        ) {
            return back()->withErrors(['plan' => 'Nie można zmienić grupy planu z zajęciami.']);
        }
        $plan->update($dane);
        return back()->with('status', 'Plan został zaktualizowany.');
    }

    public function usunPlanZajec($id)
    {
        $plan = Planzajec::find($id);
        if (!$plan) return back()->withErrors(['plan' => 'Nie znaleziono planu.']);
        if (Zajecie::where('PlanZajec_idPlanZajec', $id)->exists()) {
            return back()->withErrors(['plan' => 'Najpierw usuń zajęcia z planu.']);
        }
        $plan->delete();
        return redirect('/dziekanat/plany-zajec')->with('status', 'Plan został usunięty.');
    }

    private function danePlanu(Request $request)
    {
        return $request->validate([
            'rok' => 'required|integer|min:2000|max:2100',
            'Semester' => 'required|integer|min:1|max:12',
            'trybStudiow' => 'required|string|max:45',
            'stopien' => 'required|integer|min:1|max:3',
            'Specjalnosc' => 'nullable|string|max:45',
            'GrupaStudenta_idGrupaStudenta' => 'required|exists:grupastudenta,idGrupaStudenta',
        ]);
    }

    private function daneZajec(Request $request, $nowe = true)
    {
        $reguly = [
            'DzienTygodnia' => 'required|in:Poniedziałek,Wtorek,Środa,Czwartek,Piątek,Sobota,Niedziela',
            'Parzystosc' => 'required|in:TygodnieAB,TygodnieA,TygodnieB',
            'TypZajec' => 'required|string|max:45',
            'LiczbaGodzin' => 'required|integer|min:1|max:24',
            'Przedmiot_idPrzedmiot' => 'required|exists:przedmiot,idPrzedmiot',
            'Prowadzacy_idProwadzacy' => 'required|exists:prowadzacy,idProwadzacy',
            'Sala_idSala' => 'required|integer',
            'Sala_Budynek_idBudynek' => 'required|integer',
            'dataOd' => 'required|date_format:Y-m-d',
            'dataDo' => 'required|date_format:Y-m-d|after_or_equal:dataOd',
            'GodzinaRozpoczecia' => 'required|date_format:H:i',
            'GodzinaZakonczenia' => 'required|date_format:H:i|after:GodzinaRozpoczecia',
        ];
        if ($nowe) {
            $reguly['plany'] = 'required|array|size:1';
            $reguly['plany.*'] = 'required|exists:planzajec,idPlanZajec';
        } else {
            $reguly['PlanZajec_idPlanZajec'] = 'required|exists:planzajec,idPlanZajec';
        }
        return $request->validate($reguly);
    }

    private function datyZajec($dane)
    {
        $dni = [
            'Poniedziałek' => 1,
            'Wtorek' => 2,
            'Środa' => 3,
            'Czwartek' => 4,
            'Piątek' => 5,
            'Sobota' => 6,
            'Niedziela' => 7
        ];
        $od = Carbon::parse($dane['dataOd'])->startOfDay();
        $do = Carbon::parse($dane['dataDo'])->startOfDay();
        if ($od->diffInDays($do) > 366) return [];
        $daty = [];
        for ($data = $od->copy(); $data->lte($do); $data->addDay()) {
            if ($data->dayOfWeekIso !== $dni[$dane['DzienTygodnia']]) continue;
            if ($dane['Parzystosc'] === 'TygodnieA' && $data->isoWeek() % 2 !== 1) continue;
            if ($dane['Parzystosc'] === 'TygodnieB' && $data->isoWeek() % 2 !== 0) continue;
            $daty[] = $data->toDateString();
        }
        return $daty;
    }

    private function kolizjaZajec($dane, $daty, $idPlanu, $pomijaneId = null)
    {
        $inne = Rezerwacja::whereIn('data', $daty)
            ->whereIn('statusRezerwacji', ['Zaakceptowana', 'Zatwierdzona'])
            ->where('GodzinaRozpoczecia', '<', $dane['GodzinaZakonczenia'])
            ->where('GodzinaZakonczenia', '>', $dane['GodzinaRozpoczecia'])
            ->when($pomijaneId, function ($q) use ($pomijaneId) {
                $q->where(function ($w) use ($pomijaneId) {
                    $w->whereNull('Zajęcie_idZajęcie')->orWhere('Zajęcie_idZajęcie', '!=', $pomijaneId);
                });
            })->get();

        foreach ($inne as $rezerwacja) {
            if (
                $rezerwacja->Sala_idSala == $dane['Sala_idSala'] &&
                $rezerwacja->Sala_Budynek_idBudynek == $dane['Sala_Budynek_idBudynek']
            ) {
                return 'Sala jest zajęta: ' . $rezerwacja->data;
            }
            if ($rezerwacja->Prowadzacy_idProwadzacy == $dane['Prowadzacy_idProwadzacy']) {
                return 'Prowadzący jest zajęty: ' . $rezerwacja->data;
            }
            if ($rezerwacja->{'Zajęcie_PlanZajec_idPlanZajec'} == $idPlanu) {
                return 'Grupa ma już zajęcia: ' . $rezerwacja->data;
            }
        }
        return null;
    }

    private function utworzRezerwacjeZajec($dane, $daty, $idZajecia, $idPlanu)
    {
        foreach ($daty as $data) {
            Rezerwacja::create([
                'data' => $data,
                'GodzinaRozpoczecia' => $dane['GodzinaRozpoczecia'],
                'GodzinaZakonczenia' => $dane['GodzinaZakonczenia'],
                'typWydarzenia' => 'Zajęcia',
                'statusRezerwacji' => 'Zaakceptowana',
                'Zajęcie_idZajęcie' => $idZajecia,
                'Zajęcie_PlanZajec_idPlanZajec' => $idPlanu,
                'Prowadzacy_idProwadzacy' => $dane['Prowadzacy_idProwadzacy'],
                'Sala_idSala' => $dane['Sala_idSala'],
                'Sala_Budynek_idBudynek' => $dane['Sala_Budynek_idBudynek'],
            ]);
        }
    }

    public function dodajZajecie(Request $request)
    {
        $dane = $this->daneZajec($request);
        $daty = $this->datyZajec($dane);
        if (!$daty) return back()->withErrors(['dataOd' => 'Brak terminów lub zakres dłuższy niż rok.']);
        $idPlanu = $dane['plany'][0];
        return DB::transaction(function () use ($dane, $daty, $idPlanu) {
            $sala = Sala::where('idSala', $dane['Sala_idSala'])
                ->where('Budynek_idBudynek', $dane['Sala_Budynek_idBudynek'])->lockForUpdate()->first();
            if (!$sala) return back()->withErrors(['Sala_idSala' => 'Nie znaleziono sali.']);
            $blad = $this->kolizjaZajec($dane, $daty, $idPlanu);
            if ($blad) return back()->withErrors(['termin' => $blad]);
            $zajecie = Zajecie::create([
                'DzienTygodnia' => $dane['DzienTygodnia'],
                'Parzystosc' => $dane['Parzystosc'],
                'TypZajec' => $dane['TypZajec'],
                'LiczbaGodzin' => $dane['LiczbaGodzin'],
                'Przedmiot_idPrzedmiot' => $dane['Przedmiot_idPrzedmiot'],
                'PlanZajec_idPlanZajec' => $idPlanu,
                'Sala_idSala' => $dane['Sala_idSala'],
                'Sala_Budynek_idBudynek' => $dane['Sala_Budynek_idBudynek'],
            ]);
            $zajecie->prowadzacy()->sync([$dane['Prowadzacy_idProwadzacy']]);
            $this->utworzRezerwacjeZajec($dane, $daty, $zajecie->idZajęcie, $idPlanu);
            return back()->with('status', 'Zajęcie zostało dodane.');
        });
    }

    public function aktualizujZajecie(Request $request, $id)
    {
        $dane = $this->daneZajec($request, false);
        $daty = $this->datyZajec($dane);
        if (!$daty) return back()->withErrors(['dataOd' => 'Brak terminów lub zakres dłuższy niż rok.']);
        $idPlanu = $dane['PlanZajec_idPlanZajec'];
        return DB::transaction(function () use ($dane, $daty, $id, $idPlanu) {
            $zajecie = Zajecie::where('idZajęcie', $id)->where('PlanZajec_idPlanZajec', $idPlanu)->first();
            if (!$zajecie) return back()->withErrors(['zajecie' => 'Nie znaleziono zajęcia.']);
            $sala = Sala::where('idSala', $dane['Sala_idSala'])
                ->where('Budynek_idBudynek', $dane['Sala_Budynek_idBudynek'])->lockForUpdate()->first();
            if (!$sala) return back()->withErrors(['Sala_idSala' => 'Nie znaleziono sali.']);
            $blad = $this->kolizjaZajec($dane, $daty, $idPlanu, $id);
            if ($blad) return back()->withErrors(['termin' => $blad]);
            $zajecie->update([
                'DzienTygodnia' => $dane['DzienTygodnia'],
                'Parzystosc' => $dane['Parzystosc'],
                'TypZajec' => $dane['TypZajec'],
                'LiczbaGodzin' => $dane['LiczbaGodzin'],
                'Przedmiot_idPrzedmiot' => $dane['Przedmiot_idPrzedmiot'],
                'Sala_idSala' => $dane['Sala_idSala'],
                'Sala_Budynek_idBudynek' => $dane['Sala_Budynek_idBudynek'],
            ]);
            $zajecie->prowadzacy()->sync([$dane['Prowadzacy_idProwadzacy']]);
            Rezerwacja::where('Zajęcie_idZajęcie', $id)->where('Zajęcie_PlanZajec_idPlanZajec', $idPlanu)->delete();
            $this->utworzRezerwacjeZajec($dane, $daty, $id, $idPlanu);
            return back()->with('status', 'Zajęcie zostało zmienione.');
        });
    }

    public function usunZajecie(Request $request, $id)
    {
        $dane = $request->validate(['PlanZajec_idPlanZajec' => 'required|exists:planzajec,idPlanZajec']);
        $idPlanu = $dane['PlanZajec_idPlanZajec'];
        return DB::transaction(function () use ($id, $idPlanu) {
            $zajecie = Zajecie::where('idZajęcie', $id)->where('PlanZajec_idPlanZajec', $idPlanu)->first();
            if (!$zajecie) return back()->withErrors(['zajecie' => 'Nie znaleziono zajęcia.']);
            Rezerwacja::where('Zajęcie_idZajęcie', $id)->where('Zajęcie_PlanZajec_idPlanZajec', $idPlanu)->delete();
            $zajecie->prowadzacy()->sync([]);
            $zajecie->delete();
            return back()->with('status', 'Zajęcie zostało usunięte.');
        });
    }


    //

    public function dodanieRezerwacji(Request $request)
    {
        $validated = $request->validate([
            'Sala_idSala' => 'required|integer',
            'Sala_Budynek_idBudynek' => 'required|integer',
            'data' => 'required|date|after_or_equal:today',
            'GodzinaRozpoczecia' => 'required|date_format:H:i',
            'GodzinaZakonczenia' => 'required|date_format:H:i|after:GodzinaRozpoczecia',
            'typWydarzenia' => 'required|string|max:45',
        ]);

        $konflikt = Rezerwacja::where(
            'Sala_idSala',
            $validated['Sala_idSala']
        )
            ->where(
                'Sala_Budynek_idBudynek',
                $validated['Sala_Budynek_idBudynek']
            )
            ->where('data', $validated['data'])
            ->where('statusRezerwacji', 'Zaakceptowana')
            ->where(
                'GodzinaRozpoczecia',
                '<',
                $validated['GodzinaZakonczenia']
            )
            ->where(
                'GodzinaZakonczenia',
                '>',
                $validated['GodzinaRozpoczecia']
            )
            ->exists();

        if ($konflikt) {
            return back()->withErrors([
                'rezerwacja' => 'Sala jest już zarezerwowana w wybranym terminie.'
            ]);
        }

        Rezerwacja::create([
            'data' => $validated['data'],
            'GodzinaRozpoczecia' => $validated['GodzinaRozpoczecia'],
            'GodzinaZakonczenia' => $validated['GodzinaZakonczenia'],
            'typWydarzenia' => $validated['typWydarzenia'],
            'statusRezerwacji' => 'Zaakceptowana',
            'Zajecie_idZajecie' => null,
            'Zajecie_PlanZajec_idPlanZajec' => null,
            'Prowadzacy_idProwadzacy' => null,
            'Sala_idSala' => $validated['Sala_idSala'],
            'Sala_Budynek_idBudynek' => $validated['Sala_Budynek_idBudynek'],
        ]);

        return back()->with(
            'status',
            'Sala została pomyślnie zarezerwowana.'
        );
    }

    public function zatwierdzenierezerwacji($id)
    {
        return DB::transaction(function () use ($id) {

            $rezerwacja = Rezerwacja::findOrFail($id);

            if ($rezerwacja->statusRezerwacji !== 'Oczekująca') {
                return back()->withErrors([
                    'rezerwacja' => 'Ta rezerwacja została już rozpatrzona.'
                ]);
            }

            $sala = Sala::where('idSala', $rezerwacja->Sala_idSala)
                ->where('Budynek_idBudynek', $rezerwacja->Sala_Budynek_idBudynek)
                ->lockForUpdate()
                ->firstOrFail();

            $konflikt = Rezerwacja::where(
                'Sala_idSala',
                $rezerwacja->Sala_idSala
            )
                ->where(
                    'Sala_Budynek_idBudynek',
                    $rezerwacja->Sala_Budynek_idBudynek
                )
                ->where('data', $rezerwacja->data)
                ->where('statusRezerwacji', 'Zaakceptowana')
                ->where('idRezerwacja', '!=', $rezerwacja->idRezerwacja)
                ->where(
                    'GodzinaRozpoczecia',
                    '<',
                    $rezerwacja->GodzinaZakonczenia
                )
                ->where(
                    'GodzinaZakonczenia',
                    '>',
                    $rezerwacja->GodzinaRozpoczecia
                )
                ->exists();

            if ($konflikt) {
                return back()->withErrors([
                    'rezerwacja' => 'Sala jest już zarezerwowana w wybranym terminie.'
                ]);
            }

            $rezerwacja->statusRezerwacji = 'Zaakceptowana';
            $rezerwacja->save();

            return back()->with(
                'status',
                'Rezerwacja została zatwierdzona.'
            );
        });
    }

    public function odrzucenierezerwacji($id)
    {
        $rezerwacja = Rezerwacja::findOrFail($id);

        if ($rezerwacja->statusRezerwacji !== 'Oczekująca') {
            return back()->withErrors([
                'rezerwacja' => 'Ta rezerwacja została już rozpatrzona.'
            ]);
        }

        $rezerwacja->statusRezerwacji = 'Odrzucona';
        $rezerwacja->save();

        return back()->with(
            'status',
            'Rezerwacja została odrzucona.'
        );
    }

    public function rezerwacje(Request $request)
    {
        $rezerwacje = Rezerwacja::with([
            'prowadzacy.user',
            'sala'
        ])
            ->where('statusRezerwacji', 'Oczekująca')
            ->whereNotNull('Prowadzacy_idProwadzacy')
            ->orderBy('data', 'asc')
            ->orderBy('GodzinaRozpoczecia', 'asc')
            ->get();

        $sale = Sala::all();

        return Inertia::render(
            'PracownikDziekanatu/Rezerwacje',
            [
                'rezerwacje' => $rezerwacje,
                'sale' => $sale,
            ]
        );
    }
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
