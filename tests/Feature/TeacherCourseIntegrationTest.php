<?php

namespace Tests\Feature;

use App\Models\Kurs;
use App\Models\Prowadzacy;
use App\Models\Zadanie;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;

class TeacherCourseIntegrationTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function teacher(): Prowadzacy
    {
        $user = $this->fixtureUser('MOJA_TEST_TEACHER_USER_ID');
        $teacher = Prowadzacy::where('User_idUser', $user->idUser)->first();
        if (!$teacher) {
            $this->markTestSkipped('Fixture użytkownika nie jest prowadzącym.');
        }
        $this->actingAs($user);
        return $teacher;
    }

    private function sampleCourse(Prowadzacy $teacher): Kurs
    {
        $course = Kurs::where('Prowadzacy_idProwadzacy', $teacher->idProwadzacy)->first();
        if (!$course) {
            $this->markTestSkipped('Dodaj przykładowy kurs prowadzony przez testowego nauczyciela.');
        }
        return $course;
    }

    public function test_teacher_can_create_course(): void
    {
        $teacher = $this->teacher();
        $sample = $this->sampleCourse($teacher);
        $name = 'TEST '.substr(bin2hex(random_bytes(6)), 0, 12);

        $this->from('/prowadzacy/tworzeniekursu')
            ->post('/prowadzacy/tworzeniekursu', [
                'nazwa' => $name,
                'kod' => strtoupper(bin2hex(random_bytes(3))),
                'semester' => $sample->Semester,
                'przedmiot' => $sample->Przedmiot_idPrzedmiot,
                'kierunek' => $sample->Kierunek_idKierunek,
            ])->assertRedirect('/prowadzacy/tworzeniekursu')
              ->assertSessionHas('status');

        $this->assertDatabaseHas('kurs', [
            'nazwa' => $name,
            'Prowadzacy_idProwadzacy' => $teacher->idProwadzacy,
        ]);
    }

    public function test_teacher_cannot_create_duplicate_course(): void
    {
        $teacher = $this->teacher();
        $course = $this->sampleCourse($teacher);

        $this->from('/prowadzacy/tworzeniekursu')
            ->post('/prowadzacy/tworzeniekursu', [
                'nazwa' => $course->nazwa,
                'kod' => $course->kod,
                'semester' => $course->Semester,
                'przedmiot' => $course->Przedmiot_idPrzedmiot,
                'kierunek' => $course->Kierunek_idKierunek,
            ])->assertSessionHas('error', 'Taki kurs już istnieje');
    }

    public function test_teacher_can_add_assignment_to_course(): void
    {
        $teacher = $this->teacher();
        $course = $this->sampleCourse($teacher);
        $name = 'Test '.bin2hex(random_bytes(5));

        $this->from('/prowadzacy/mojekursy')
            ->post("/prowadzacy/dodajzadanie/{$course->idkurs}", [
                'nazwaZadania' => $name,
                'opis' => 'Zadanie utworzone przez test integracyjny',
                'termin' => now()->addWeek()->format('Y-m-d H:i:s'),
                'czyNaOcene' => 1,
            ])->assertSessionHas('status', 'Zadanie zostało dodane');

        $this->assertDatabaseHas('zadanie', [
            'nazwaZadania' => $name,
            'kurs_idkurs' => $course->idkurs,
        ]);
        $assignment = Zadanie::where('nazwaZadania', $name)->firstOrFail();
        $this->assertSame($course->idkurs, $assignment->kurs_idkurs);
    }
}
