<?php

namespace Tests\Feature;

use App\Models\Komunikat;
use App\Models\Platnosc;
use App\Models\Pracownikdziekanatu;
use App\Models\Student;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Group;

class FinanceBusinessLogicTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function student(): Student
    {
        $user = $this->fixtureUser('MOJA_TEST_STUDENT_USER_ID');
        return Student::where('User_idUser', $user->idUser)->first()
            ?? $this->markTestSkipped('Brak studenta w bazie testowej.');
    }

    private function office(): Pracownikdziekanatu
    {
        $user = $this->fixtureUser('MOJA_TEST_DEAN_USER_ID');
        $office = Pracownikdziekanatu::where('User_idUser', $user->idUser)->first();
        if (!$office) {
            $this->markTestSkipped('MOJA_TEST_DEAN_USER_ID nie jest pracownikiem dziekanatu.');
        }
        $this->actingAs($user);
        return $office;
    }

    private function payment(Student $student, Pracownikdziekanatu $office, float $amount, bool $paid = false): Platnosc
    {
        return Platnosc::create([
            'tytul' => 'TEST '.bin2hex(random_bytes(5)),
            'kwota' => $amount,
            'termin' => now()->addDays(30)->format('Y-m-d H:i:s'),
            'data' => now()->format('Y-m-d H:i:s'),
            'czyOplacone' => (int) $paid,
            'Student_idStudent' => $student->idStudent,
            'PracownikDziekanatu_idPracownikDziekanatu' => $office->idPracownikDziekanatu,
        ]);
    }

    public function test_dean_cannot_create_zero_or_negative_payment(): void
    {
        $student = $this->student();
        $this->office();
        foreach ([0, -20.5] as $amount) {
            $this->post("/dziekanat/platnosci/{$student->idStudent}/dodajPlatnosc", [
                'tytul' => 'Opłata', 'kwota' => $amount, 'termin' => now()->addWeek()->toDateString(),
            ])->assertSessionHasErrors(['kwota']);
        }
    }

    public function test_dean_cannot_create_payment_without_title(): void
    {
        $student = $this->student();
        $this->office();
        $this->post("/dziekanat/platnosci/{$student->idStudent}/dodajPlatnosc", [
            'tytul' => '', 'kwota' => 80.50, 'termin' => now()->addWeek()->toDateString(),
        ])->assertSessionHasErrors(['tytul']);
    }

    public function test_dean_creates_unpaid_payment_and_notification(): void
    {
        $student = $this->student();
        $this->office();
        $title = 'Opłata testowa '.bin2hex(random_bytes(4));
        $this->post("/dziekanat/platnosci/{$student->idStudent}/dodajPlatnosc", [
            'tytul' => $title, 'kwota' => 49.75, 'termin' => now()->addWeek()->toDateString(),
        ])->assertSessionHasNoErrors()->assertSessionHas('status');
        $payment = Platnosc::where('tytul', $title)->firstOrFail();
        $this->assertSame(0, (int) $payment->czyOplacone);
        $this->assertEqualsWithDelta(49.75, (float) $payment->kwota, 0.001);
        $this->assertSame((int) $student->idStudent, (int) $payment->Student_idStudent);
        $notice = Komunikat::where('temat', 'Nowa płatność')->orderByDesc('idKomunikat')->firstOrFail();
        $this->assertTrue($notice->user()->where('user.idUser', $student->User_idUser)->exists());
    }

    public function test_payment_status_can_be_changed_to_paid(): void
    {
        $student = $this->student();
        $office = $this->office();
        $payment = $this->payment($student, $office, 135);
        $this->post("/dziekanat/platnosci/{$student->idStudent}/{$payment->idPlatnosc}/zmienStatus", [
            'czyOplacone' => 1,
        ])->assertSessionHasNoErrors();
        $this->assertSame(1, (int) $payment->fresh()->czyOplacone);
    }

    public function test_invalid_payment_status_is_rejected(): void
    {
        $student = $this->student();
        $office = $this->office();
        $payment = $this->payment($student, $office, 135);
        $this->post("/dziekanat/platnosci/{$student->idStudent}/{$payment->idPlatnosc}/zmienStatus", [
            'czyOplacone' => 'not-a-boolean',
        ])->assertSessionHasErrors(['czyOplacone']);
        $this->assertSame(0, (int) $payment->fresh()->czyOplacone);
    }

    public function test_student_finance_endpoint_returns_own_unpaid_total(): void
    {
        $student = $this->student();
        $office = $this->office();
        // Existing fixture payments may be present; compare against the DB at request time.
        $this->payment($student, $office, 37.25);
        $this->payment($student, $office, 100.00);
        $this->payment($student, $office, 99.00, true);
        $expected = (float) Platnosc::where('Student_idStudent', $student->idStudent)
            ->where('czyOplacone', 0)->sum('kwota');
        $this->actingAs($this->fixtureUser('MOJA_TEST_STUDENT_USER_ID'));
        $response = $this->getJson('/student/mojefinanse')->assertOk();
        $this->assertEqualsWithDelta($expected, (float) $response->json('suma'), 0.001);
        $this->assertNotEmpty($response->json('zaleglosci'));
    }

    /** Regression checks
     * Regression target: URL student_id must scope the edited payment.
     * CURRENT CODE may fail this test; do not weaken the assertion.
     */
    #[Group('business-regression')]
    public function test_dean_cannot_update_payment_using_another_student_id_in_url(): void
    {
        $student = $this->student();
        $office = $this->office();
        $other = Student::where('idStudent', '!=', $student->idStudent)->first();
        if (!$other) {
            $this->markTestSkipped('Do testu regresyjnego wymagany jest drugi student.');
        }
        $payment = $this->payment($student, $office, 100);
        $this->post("/dziekanat/platnosci/{$other->idStudent}/{$payment->idPlatnosc}/zmienStatus", [
            'czyOplacone' => 1,
        ]);
        $this->assertSame(0, (int) $payment->fresh()->czyOplacone,
            'BŁĄD LOGIKI: student_id w URL nie ogranicza aktualizowanej płatności.');
    }
}
