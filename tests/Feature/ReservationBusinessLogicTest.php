<?php

namespace Tests\Feature;

use App\Models\Prowadzacy;
use App\Models\Rezerwacja;
use App\Models\Sala;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Group;

class ReservationBusinessLogicTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private const DATE = '2098-06-15';

    private function room(): Sala
    {
        $room = Sala::first();
        if (!$room) {
            $this->markTestSkipped('Brak sali w testowej bazie danych.');
        }
        return $room;
    }

    private function loginAsDean(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_DEAN_USER_ID');
        if (!$user->isPracownikDziekanatu()) {
            $this->markTestSkipped('MOJA_TEST_DEAN_USER_ID nie jest pracownikiem dziekanatu.');
        }
        $this->actingAs($user);
    }

    private function loginAsTeacher(): Prowadzacy
    {
        $user = $this->fixtureUser('MOJA_TEST_TEACHER_USER_ID');
        $teacher = Prowadzacy::where('User_idUser', $user->idUser)->first();
        if (!$teacher) {
            $this->markTestSkipped('MOJA_TEST_TEACHER_USER_ID nie ma wpisu w prowadzacy.');
        }
        $this->actingAs($user);
        return $teacher;
    }

    private function booking(Sala $room, string $from, string $to, string $status = 'Zaakceptowana', ?int $teacherId = null): Rezerwacja
    {
        return Rezerwacja::create([
            'data' => self::DATE,
            'GodzinaRozpoczecia' => $from,
            'GodzinaZakonczenia' => $to,
            'typWydarzenia' => 'TEST',
            'statusRezerwacji' => $status,
            'Zajęcie_idZajęcie' => null,
            'Zajęcie_PlanZajec_idPlanZajec' => null,
            'Prowadzacy_idProwadzacy' => $teacherId,
            'Sala_idSala' => $room->idSala,
            'Sala_Budynek_idBudynek' => $room->Budynek_idBudynek,
        ]);
    }

    private function postDeanBooking(Sala $room, string $from, string $to)
    {
        return $this->post('/dziekanat/rezerwacje/dodanie', [
            'Sala_idSala' => $room->idSala,
            'Sala_Budynek_idBudynek' => $room->Budynek_idBudynek,
            'data' => self::DATE,
            'GodzinaRozpoczecia' => $from,
            'GodzinaZakonczenia' => $to,
            'typWydarzenia' => 'Egzamin',
        ]);
    }

    public function test_dean_cannot_book_room_with_partially_overlapping_accepted_reservation(): void
    {
        $this->loginAsDean();
        $room = $this->room();
        $this->booking($room, '10:00', '12:00');
        $count = Rezerwacja::where('data', self::DATE)
            ->where('Sala_idSala', $room->idSala)->count();
        $this->postDeanBooking($room, '11:00', '13:00')->assertSessionHasErrors(['rezerwacja']);
        $this->assertSame($count, Rezerwacja::where('data', self::DATE)
            ->where('Sala_idSala', $room->idSala)->count());
    }

    public function test_dean_accepts_reservation_immediately_after_existing_time_slot(): void
    {
        $this->loginAsDean();
        $room = $this->room();
        $this->booking($room, '10:00', '12:00');
        $this->postDeanBooking($room, '12:00', '13:00')
            ->assertSessionHasNoErrors()->assertSessionHas('status');
        $this->assertTrue(Rezerwacja::where('data', self::DATE)
            ->where('Sala_idSala', $room->idSala)
            ->where('GodzinaRozpoczecia', '12:00:00')
            ->where('statusRezerwacji', 'Zaakceptowana')->exists());
    }

    public function test_dean_rejects_reversed_reservation_hours(): void
    {
        $this->loginAsDean();
        $room = $this->room();
        $this->postDeanBooking($room, '14:00', '12:00')
            ->assertSessionHasErrors(['GodzinaZakonczenia']);
    }

    public function test_dean_approves_pending_booking(): void
    {
        $this->loginAsDean();
        $room = $this->room();
        $booking = $this->booking($room, '06:00', '07:00', 'Oczekująca');
        $this->post("/dziekanat/rezerwacje/{$booking->idRezerwacja}/zatwierdzenie")
            ->assertSessionHasNoErrors();
        $this->assertSame('Zaakceptowana', $booking->fresh()->statusRezerwacji);
    }

    public function test_dean_cannot_approve_pending_booking_when_room_is_taken(): void
    {
        $this->loginAsDean();
        $room = $this->room();
        $this->booking($room, '10:00', '12:00', 'Zaakceptowana');
        $pending = $this->booking($room, '11:00', '13:00', 'Oczekująca');
        $this->post("/dziekanat/rezerwacje/{$pending->idRezerwacja}/zatwierdzenie")
            ->assertSessionHasErrors(['rezerwacja']);
        $this->assertSame('Oczekująca', $pending->fresh()->statusRezerwacji);
    }

    public function test_dean_rejects_pending_booking_and_cannot_reject_twice(): void
    {
        $this->loginAsDean();
        $room = $this->room();
        $booking = $this->booking($room, '06:00', '07:00', 'Oczekująca');
        $url = "/dziekanat/rezerwacje/{$booking->idRezerwacja}/odrzucenie";
        $this->post($url)->assertSessionHasNoErrors();
        $this->assertSame('Odrzucona', $booking->fresh()->statusRezerwacji);
        $this->post($url)->assertSessionHasErrors(['rezerwacja']);
    }

    /** Regression checks
     * Regression target: a teacher must reject ANY overlapping intervals, not only identical ones.
     * CURRENT CODE may fail this test.
     */
    #[Group('business-regression')]
    public function test_teacher_cannot_book_partially_overlapping_room(): void
    {
        $teacher = $this->loginAsTeacher();
        $room = $this->room();
        $this->booking($room, '10:00', '12:00', 'Zaakceptowana');
        $this->post('/prowadzacy/tworzenierezerwacji', [
            'data' => self::DATE,
            'godpocz' => '11:00', 'godkon' => '13:00',
            'typ' => 'Spotkanie',
            'sala' => $room->idSala, 'budynek' => $room->Budynek_idBudynek,
            'zajecie' => null,
        ])->assertSessionHas('error');
        $this->assertFalse(Rezerwacja::where('data', self::DATE)
            ->where('Sala_idSala', $room->idSala)
            ->where('Prowadzacy_idProwadzacy', $teacher->idProwadzacy)
            ->where('GodzinaRozpoczecia', '11:00:00')->exists());
    }
}
