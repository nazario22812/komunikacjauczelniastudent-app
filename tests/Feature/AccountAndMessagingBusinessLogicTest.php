<?php

namespace Tests\Feature;

use App\Models\Komunikat;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;

class AccountAndMessagingBusinessLogicTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    public function test_theme_setting_accepts_light_and_dark(): void
    {
        $this->actingAs($this->fixtureUser('MOJA_TEST_STUDENT_USER_ID'));
        foreach (['light', 'dark'] as $theme) {
            $this->post('/ustawienia/theme', ['theme' => $theme])->assertRedirect();
            $this->assertSame($theme, session('theme'));
        }
    }

    public function test_unknown_theme_falls_back_to_dark(): void
    {
        $this->actingAs($this->fixtureUser('MOJA_TEST_STUDENT_USER_ID'));
        $this->post('/ustawienia/theme', ['theme' => 'unknown'])->assertRedirect();
        $this->assertSame('dark', session('theme'));
    }

    public function test_wrong_current_password_does_not_change_password(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_STUDENT_USER_ID');
        $this->actingAs($user);
        $before = $user->password;
        $this->post('/ustawienia/haslo', [
            'current_password' => 'incorrect-current-password',
            'new_password' => 'SomeNewPassword123!',
            'new_password_confirmation' => 'SomeNewPassword123!',
        ])->assertSessionHasErrors(['current_password']);
        $this->assertSame($before, $user->fresh()->password);
    }

    public function test_short_new_password_does_not_change_password(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_STUDENT_USER_ID');
        $this->actingAs($user);
        $before = $user->password;
        // Current password cannot be reconstructed from a fixture hash; validation
        // must fail on the too-short new password regardless.
        $this->post('/ustawienia/haslo', [
            'current_password' => 'unknown',
            'new_password' => '123',
            'new_password_confirmation' => '123',
        ])->assertSessionHasErrors(['new_password']);
        $this->assertSame($before, $user->fresh()->password);
    }

    public function test_teacher_message_to_specific_student_creates_association(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_TEACHER_USER_ID');
        if (!$user->isProwadzacy()) {
            $this->markTestSkipped('MOJA_TEST_TEACHER_USER_ID nie jest prowadzącym.');
        }
        $student = Student::whereNotNull('index')->first();
        if (!$student) {
            $this->markTestSkipped('Brak studenta z indeksem w bazie testowej.');
        }
        $this->actingAs($user);
        $subject = 'TEST Komunikat '.bin2hex(random_bytes(5));
        $this->post('/prowadzacy/komunikaty', [
            'tytul' => $subject,
            'tresc' => 'Treść wiadomości testowej',
            'target_type' => 'student',
            'target_id' => $student->index,
        ])->assertSessionHas('status');
        $notice = Komunikat::where('temat', $subject)->firstOrFail();
        $this->assertTrue($notice->user()->where('user.idUser', $student->User_idUser)->exists());
    }

    /** Regression target: a failed recipient lookup should not create an orphan notification. */
    #[\PHPUnit\Framework\Attributes\Group('business-regression')]
    public function test_unknown_student_message_does_not_create_orphan_notice(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_TEACHER_USER_ID');
        if (!$user->isProwadzacy()) {
            $this->markTestSkipped('MOJA_TEST_TEACHER_USER_ID nie jest prowadzącym.');
        }
        $this->actingAs($user);
        $subject = 'TEST Nieistniejący odbiorca '.bin2hex(random_bytes(5));
        $this->post('/prowadzacy/komunikaty', [
            'tytul' => $subject,
            'tresc' => 'Treść testu',
            'target_type' => 'student',
            'target_id' => 'index-that-does-not-exist-XYZ',
        ])->assertSessionHas('error', 'Nie znaleziono studenta');
        $this->assertFalse(Komunikat::where('temat', $subject)->exists(),
            'BŁĄD LOGIKI: zapisano komunikat mimo nieistniejącego odbiorcy.');
    }
}
