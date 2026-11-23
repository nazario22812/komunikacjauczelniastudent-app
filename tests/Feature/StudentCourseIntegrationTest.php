<?php

namespace Tests\Feature;

use App\Models\Kurs;
use App\Models\Student;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;

class StudentCourseIntegrationTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function student(): Student
    {
        $user = $this->fixtureUser('MOJA_TEST_STUDENT_USER_ID');
        $student = Student::where('User_idUser', $user->idUser)->first();
        if (!$student) {
            $this->markTestSkipped('Fixture użytkownika nie ma wpisu w tabeli student.');
        }
        $this->actingAs($user);
        return $student;
    }

    private function compatibleCourse(Student $student): Kurs
    {
        $course = Kurs::where('Kierunek_idKierunek', $student->Kierunek_idKierunek)->first();
        if (!$course) {
            $this->markTestSkipped('Dodaj fikcyjny kurs dla kierunku testowego studenta.');
        }
        return $course;
    }

    public function test_student_can_join_course_for_own_direction(): void
    {
        $student = $this->student();
        $course = $this->compatibleCourse($student);
        // Changes, including detach, are rolled back after the test.
        $student->kurs()->detach($course->idkurs);

        $this->post("/student/mojekursy/{$course->idkurs}")
            ->assertRedirect('/student/mojekursy')
            ->assertSessionHas('status', 'Jesteś zapisany na kurs');

        $this->assertTrue($student->kurs()->where('kurs.idkurs', $course->idkurs)->exists());
    }

    public function test_second_enrolment_does_not_duplicate_membership(): void
    {
        $student = $this->student();
        $course = $this->compatibleCourse($student);
        $student->kurs()->syncWithoutDetaching([$course->idkurs]);

        $this->post("/student/mojekursy/{$course->idkurs}")
            ->assertRedirect('/student/mojekursy')
            ->assertSessionHas('status', 'Jesteś już na tym kursie');

        $this->assertSame(1, $student->kurs()->where('kurs.idkurs', $course->idkurs)->count());
    }

    public function test_student_cannot_join_course_from_another_direction(): void
    {
        $student = $this->student();
        $other = Kurs::where('Kierunek_idKierunek', '<>', $student->Kierunek_idKierunek)->first();
        if (!$other) {
            $this->markTestSkipped('Dodaj fikcyjny kurs z innego kierunku do testowej bazy.');
        }

        $this->post("/student/mojekursy/{$other->idkurs}")->assertNotFound();
    }

    public function test_student_sees_empty_my_tasks_as_json_when_no_assignments(): void
    {
        $student = $this->student();
        // Each relationship change is rolled back.
        $student->zadanie()->detach();

        $this->getJson('/student/mojezadania')
            ->assertOk()
            ->assertJson(['zadania' => []]);
    }
}
