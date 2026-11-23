<?php

namespace Tests\Feature;

use App\Models\User;
use App\Http\Middleware\Role;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

/**
 * These tests keep the web/session middleware enabled so validation errors are
 * flashed to the session. Only role checking is bypassed; role access is
 * covered separately. No valid requests are submitted, so no DB writes occur.
 */
class InputValidationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware([Role::class]);
        $this->actingAs(new User);
    }

    public function test_avatar_is_required(): void
    {
        $this->post('/mojedane/avatar', [])->assertSessionHasErrors(['avatar']);
    }

    public function test_avatar_rejects_non_image_files(): void
    {
        $this->post('/mojedane/avatar', [
            'avatar' => UploadedFile::fake()->create('unsafe.txt', 8, 'text/plain'),
        ])->assertSessionHasErrors(['avatar']);
    }

    public function test_avatar_rejects_files_over_two_megabytes(): void
    {
        $this->post('/mojedane/avatar', [
            'avatar' => UploadedFile::fake()->image('big.jpg')->size(2049),
        ])->assertSessionHasErrors(['avatar']);
    }

    public function test_petition_requires_subject_and_body(): void
    {
        $this->post('/student/zlozpodanie', [])->assertSessionHasErrors(['temat', 'tresc']);
    }

    public function test_petition_rejects_subject_longer_than_255(): void
    {
        $this->post('/student/zlozpodanie', [
            'temat' => str_repeat('x', 256), 'tresc' => 'Poprawna treść',
        ])->assertSessionHasErrors(['temat']);
    }

    public function test_assignment_requires_at_least_one_file(): void
    {
        $this->post('/student/kurs/wyslijzadanie/1', [])->assertSessionHasErrors(['pliks']);
    }

    public function test_survey_requires_valid_url(): void
    {
        $this->post('/dziekanat/ankiety', [
            'temat' => 'Ankieta', 'opis' => 'Badanie', 'link' => 'niewlasciwy-url',
        ])->assertSessionHasErrors(['link']);
    }

    public function test_survey_requires_subject(): void
    {
        $this->post('/dziekanat/ankiety', [
            'opis' => 'Badanie', 'link' => 'https://example.com',
        ])->assertSessionHasErrors(['temat']);
    }

    public function test_announcement_requires_subject_and_body(): void
    {
        $this->post('/dziekanat/ogloszenia', [])->assertSessionHasErrors(['temat', 'tresc']);
    }

    public function test_petition_decision_rejects_unknown_status(): void
    {
        $this->post('/dziekanat/szczegolypodania/1', [
            'selected_status' => 'Nieznany', 'odpowiedz' => 'Odpowiedz',
        ])->assertSessionHasErrors(['selected_status']);
    }

    public function test_petition_decision_requires_response(): void
    {
        $this->post('/dziekanat/szczegolypodania/1', [
            'selected_status' => 'Przyjęto',
        ])->assertSessionHasErrors(['odpowiedz']);
    }

    public function test_new_password_requires_confirmation(): void
    {
        $this->post('/ustawienia/haslo', [
            'new_password' => 'new-password-123',
            'new_password_confirmation' => 'incorrect-password',
        ])->assertSessionHasErrors(['new_password']);
    }
}
