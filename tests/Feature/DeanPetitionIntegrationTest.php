<?php

namespace Tests\Feature;

use App\Models\Komunikat;
use App\Models\Podanie;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;

class DeanPetitionIntegrationTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function deanLogin(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_DEAN_USER_ID');
        if (!$user->isPracownikDziekanatu()) {
            $this->markTestSkipped('Użytkownik MOJA_TEST_DEAN_USER_ID nie jest pracownikiem dziekanatu.');
        }
        $this->actingAs($user);
    }

    private function newPetition(): Podanie
    {
        $author = $this->fixtureUser('MOJA_TEST_STUDENT_USER_ID');
        return Podanie::create([
            'temat' => 'Podanie testowe '.bin2hex(random_bytes(3)),
            'tresc' => 'Tekst podania w izolowanej bazie testowej.',
            'data' => now()->format('Y-m-d H:i:s'),
            'autor' => $author->idUser,
            'status' => 'Wysłano',
            'odpowiedz' => null,
        ]);
    }

    public function test_dean_accepts_petition_and_notifies_author(): void
    {
        $this->deanLogin();
        $petition = $this->newPetition();

        $this->from('/dziekanat/podania')
            ->post("/dziekanat/szczegolypodania/{$petition->idPodanie}", [
                'selected_status' => 'Przyjęto',
                'odpowiedz' => 'Pozytywna decyzja w teście.',
            ])->assertSessionHasNoErrors()
              ->assertSessionHas('status', 'Decyzja została zapisana.');

        $this->assertSame('Przyjęto', $petition->fresh()->status);
        $this->assertSame('Pozytywna decyzja w teście.', $petition->fresh()->odpowiedz);

        $notification = Komunikat::where('temat', 'Decyzja w sprawie podania')
            ->orderBy('idKomunikat', 'desc')->firstOrFail();
        $this->assertTrue($notification->user()->where('user.idUser', $petition->autor)->exists());
    }

    public function test_dean_rejects_petition(): void
    {
        $this->deanLogin();
        $petition = $this->newPetition();

        $this->post("/dziekanat/szczegolypodania/{$petition->idPodanie}", [
            'selected_status' => 'Odrzucono',
            'odpowiedz' => 'Negatywna decyzja testowa.',
        ])->assertSessionHasNoErrors();

        $this->assertSame('Odrzucono', $petition->fresh()->status);
    }

    public function test_dean_cannot_set_unsupported_status(): void
    {
        $this->deanLogin();
        $petition = $this->newPetition();

        $this->post("/dziekanat/szczegolypodania/{$petition->idPodanie}", [
            'selected_status' => 'Nieznany',
            'odpowiedz' => 'Tekst',
        ])->assertSessionHasErrors(['selected_status']);

        $this->assertSame('Wysłano', $petition->fresh()->status);
    }
}
