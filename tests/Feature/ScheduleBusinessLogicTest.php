<?php

namespace Tests\Feature;

use App\Models\Planzajec;
use App\Models\Przedmiot;
use App\Models\Prowadzacy;
use App\Models\Rezerwacja;
use App\Models\Sala;
use App\Models\Zajecie;
use Carbon\Carbon;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;

class ScheduleBusinessLogicTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function loginAsDean(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_DEAN_USER_ID');
        if (!$user->isPracownikDziekanatu()) {
            $this->markTestSkipped('MOJA_TEST_DEAN_USER_ID nie jest pracownikiem dziekanatu.');
        }
        $this->actingAs($user);
    }

    private function validScheduleData(string $parity = 'TygodnieAB'): array
    {
        $plan = Planzajec::first();
        $course = Przedmiot::first();
        $teacher = Prowadzacy::first();
        $room = Sala::first();
        if (!$plan || !$course || !$teacher || !$room) {
            $this->markTestSkipped('Potrzebne są istniejące rekordy: planzajec, przedmiot, prowadzacy, sala.');
        }
        $monday = Carbon::parse('2098-06-15')->startOfWeek(Carbon::MONDAY);
        return [
            'DzienTygodnia' => 'Poniedziałek',
            'Parzystosc' => $parity,
            'TypZajec' => 'Ćwiczenia',
            'LiczbaGodzin' => 1,
            'Przedmiot_idPrzedmiot' => $course->idPrzedmiot,
            'Prowadzacy_idProwadzacy' => $teacher->idProwadzacy,
            'Sala_idSala' => $room->idSala,
            'Sala_Budynek_idBudynek' => $room->Budynek_idBudynek,
            'dataOd' => $monday->toDateString(),
            'dataDo' => $monday->copy()->addWeeks(3)->toDateString(),
            'GodzinaRozpoczecia' => '04:00',
            'GodzinaZakonczenia' => '05:00',
            'plany' => [$plan->idPlanZajec],
        ];
    }

    public function test_schedule_rejects_invalid_week_parity(): void
    {
        $this->loginAsDean();
        $data = $this->validScheduleData();
        $data['Parzystosc'] = 'Złe tygodnie';
        $this->post('/dziekanat/plany-zajec/dodaj', $data)
            ->assertSessionHasErrors(['Parzystosc']);
    }

    public function test_schedule_rejects_end_time_before_start_time(): void
    {
        $this->loginAsDean();
        $data = $this->validScheduleData();
        $data['GodzinaRozpoczecia'] = '12:00';
        $data['GodzinaZakonczenia'] = '10:00';
        $this->post('/dziekanat/plany-zajec/dodaj', $data)
            ->assertSessionHasErrors(['GodzinaZakonczenia']);
    }

    public function test_schedule_rejects_ranges_longer_than_one_year(): void
    {
        $this->loginAsDean();
        $data = $this->validScheduleData();
        $data['dataDo'] = Carbon::parse($data['dataOd'])->addDays(400)->toDateString();
        $this->post('/dziekanat/plany-zajec/dodaj', $data)
            ->assertSessionHasErrors(['dataOd']);
    }

    public function test_creating_recurring_class_generates_matching_calendar_reservations(): void
    {
        $this->loginAsDean();
        $data = $this->validScheduleData('TygodnieA');
        $existing = Rezerwacja::whereBetween('data', [$data['dataOd'], $data['dataDo']])
            ->where('Sala_idSala', $data['Sala_idSala'])
            ->where('statusRezerwacji', 'Zaakceptowana')
            ->where('GodzinaRozpoczecia', '<', '05:00')
            ->where('GodzinaZakonczenia', '>', '04:00')->exists();
        if ($existing) {
            $this->markTestSkipped('Zajęty termin w danych fixture; wybierz pusty przedział w bazie _test.');
        }
        $before = Zajecie::max('idZajęcie') ?? 0;
        $this->post('/dziekanat/plany-zajec/dodaj', $data)
            ->assertSessionHasNoErrors()->assertSessionHas('status', 'Zajęcie zostało dodane.');
        $class = Zajecie::where('idZajęcie', '>', $before)->orderByDesc('idZajęcie')->firstOrFail();
        $dates = Rezerwacja::where('Zajęcie_idZajęcie', $class->idZajęcie)
            ->pluck('data')->map(fn ($d) => Carbon::parse($d)->toDateString())->all();
        $this->assertCount(2, $dates, 'W 4 poniedziałkach powinny wypaść 2 tygodnie A.');
        foreach ($dates as $date) {
            $this->assertSame(Carbon::MONDAY, Carbon::parse($date)->dayOfWeekIso);
            $this->assertSame(1, Carbon::parse($date)->isoWeek() % 2);
        }
    }
}
