<?php

namespace Tests\Feature;

use App\Models\Literatura;
use App\Models\Przedmiot;
use App\Models\Sylabus;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;

class SyllabusBusinessLogicTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function deanLogin(): void
    {
        $user = $this->fixtureUser('MOJA_TEST_DEAN_USER_ID');
        if (!$user->isPracownikDziekanatu()) {
            $this->markTestSkipped('Niepoprawne konto testowe dziekanatu.');
        }
        $this->actingAs($user);
    }

    private function subjectWithoutSyllabus(): Przedmiot
    {
        $subject = Przedmiot::whereDoesntHave('sylabus')->first();
        if (!$subject) {
            $this->markTestSkipped('Do testu tworzenia potrzebny przedmiot bez sylabusa.');
        }
        return $subject;
    }

    private function payload(): array
    {
        return [
            'iloscGodzin' => 30,
            'czyEgzamin' => true,
            'opisPrzedmiotu' => 'Opis testowego przedmiotu',
            'warunkiZaliczenia' => 'Zaliczenie testowe',
        ];
    }

    public function test_dean_cannot_create_syllabus_with_negative_hours(): void
    {
        $this->deanLogin();
        $subject = $this->subjectWithoutSyllabus();
        $data = $this->payload();
        $data['iloscGodzin'] = -1;
        $this->post("/dziekanat/sylabusy/{$subject->idPrzedmiot}/dodaniesylabusa", $data)
            ->assertSessionHasErrors(['iloscGodzin']);
    }

    public function test_dean_creates_syllabus_and_prevents_duplicate(): void
    {
        $this->deanLogin();
        $subject = $this->subjectWithoutSyllabus();
        $url = "/dziekanat/sylabusy/{$subject->idPrzedmiot}/dodaniesylabusa";
        $this->post($url, $this->payload())->assertSessionHas('status');
        $this->assertSame(1, Sylabus::where('Przedmiot_idPrzedmiot', $subject->idPrzedmiot)->count());
        $this->post($url, $this->payload())->assertSessionHasErrors(['sylabus']);
        $this->assertSame(1, Sylabus::where('Przedmiot_idPrzedmiot', $subject->idPrzedmiot)->count());
    }

    public function test_dean_can_update_syllabus_and_add_and_remove_literature(): void
    {
        $this->deanLogin();
        $subject = $this->subjectWithoutSyllabus();
        $this->post("/dziekanat/sylabusy/{$subject->idPrzedmiot}/dodaniesylabusa", $this->payload())
            ->assertSessionHasNoErrors();
        $syllabus = Sylabus::where('Przedmiot_idPrzedmiot', $subject->idPrzedmiot)->firstOrFail();
        $data = $this->payload();
        $data['iloscGodzin'] = 45;
        $this->post("/dziekanat/sylabusy/{$subject->idPrzedmiot}/{$syllabus->idSylabus}/aktualizacjasylabusa", $data)
            ->assertSessionHasNoErrors();
        $this->assertSame(45, (int) $syllabus->fresh()->iloscGodzin);

        $name = 'TEST Literatura '.bin2hex(random_bytes(3));
        $base = "/dziekanat/sylabusy/{$subject->idPrzedmiot}/{$syllabus->idSylabus}";
        $this->post($base.'/dodanieliteratury', ['nazwa' => $name, 'opis' => 'Opis książki'])
            ->assertSessionHasNoErrors();
        $book = Literatura::where('nazwa', $name)->firstOrFail();
        $this->post($base."/{$book->idLiteratura}/usuniecieliteratury")
            ->assertSessionHasNoErrors();
        $this->assertNull(Literatura::find($book->idLiteratura));
    }
}
