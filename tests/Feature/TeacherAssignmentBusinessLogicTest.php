<?php

namespace Tests\Feature;

use App\Models\Kurs;
use App\Models\Ocena;
use App\Models\Prowadzacy;
use App\Models\Student;
use App\Models\Zadanie;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Group;

class TeacherAssignmentBusinessLogicTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function loginAsTeacher(): Prowadzacy
    {
        $user = $this->fixtureUser('MOJA_TEST_TEACHER_USER_ID');
        $teacher = Prowadzacy::where('User_idUser', $user->idUser)->first();
        if (!$teacher) {
            $this->markTestSkipped('MOJA_TEST_TEACHER_USER_ID nie ma rekordu w prowadzacy.');
        }
        $this->actingAs($user);
        return $teacher;
    }

    private function courseOwnedBy(Prowadzacy $teacher): Kurs
    {
        $course = Kurs::where('Prowadzacy_idProwadzacy', $teacher->idProwadzacy)->first();
        if (!$course) {
            $this->markTestSkipped('Brak kursu przypisanego testowemu prowadzącemu.');
        }
        return $course;
    }

    private function makeTask(Kurs $course): Zadanie
    {
        return Zadanie::create([
            'nazwaZadania' => 'TEST '.bin2hex(random_bytes(5)),
            'tresc' => 'Treść zadania testowego',
            'TerminOddania' => now()->addWeek()->format('Y-m-d H:i:s'),
            'CzyNaOcene' => 1,
            'kurs_idkurs' => $course->idkurs,
        ]);
    }

    public function test_teacher_deletes_own_task(): void
    {
        $teacher = $this->loginAsTeacher();
        $course = $this->courseOwnedBy($teacher);
        $task = $this->makeTask($course);
        $this->post("/prowadzacy/usunzadanie/{$course->idkurs}/{$task->idZadanie}")
            ->assertSessionHas('status', 'Zadanie zostało usunięte');
        $this->assertNull(Zadanie::find($task->idZadanie));
    }

    public function test_teacher_cannot_delete_task_using_wrong_course_id(): void
    {
        $teacher = $this->loginAsTeacher();
        $course = $this->courseOwnedBy($teacher);
        $task = $this->makeTask($course);
        $otherId = (int) Kurs::max('idkurs') + 100000;
        $this->post("/prowadzacy/usunzadanie/{$otherId}/{$task->idZadanie}")
            ->assertSessionHas('error', 'Nie znaleziono zadania');
        $this->assertNotNull(Zadanie::find($task->idZadanie));
    }

    public function test_deleting_nonexistent_assignment_reports_error(): void
    {
        $teacher = $this->loginAsTeacher();
        $course = $this->courseOwnedBy($teacher);
        $missingId = (int) Zadanie::max('idZadanie') + 100000;
        $this->post("/prowadzacy/usunzadanie/{$course->idkurs}/{$missingId}")
            ->assertSessionHas('error', 'Nie znaleziono zadania');
    }

    /** Regression checks
     * Regression target: teacher must not alter a course owned by another teacher.
     * CURRENT CODE may fail this test.
     */
    #[Group('business-regression')]
    public function test_teacher_cannot_remove_student_from_another_teachers_course(): void
    {
        $teacher = $this->loginAsTeacher();
        $otherCourse = Kurs::where('Prowadzacy_idProwadzacy', '<>', $teacher->idProwadzacy)->first();
        if (!$otherCourse) {
            $this->markTestSkipped('Brak kursu prowadzonego przez innego nauczyciela.');
        }
        $student = Student::first();
        if (!$student) {
            $this->markTestSkipped('Brak studenta w bazie testowej.');
        }
        $otherCourse->student()->syncWithoutDetaching([$student->idStudent]);
        $this->post("/prowadzacy/usunstudentazkursu/{$student->idStudent}/{$otherCourse->idkurs}");
        $this->assertTrue($otherCourse->student()
            ->where('student.idStudent', $student->idStudent)->exists(),
            'BŁĄD AUTORYZACJI: prowadzący usunął studenta z cudzego kursu.');
    }

    /** Regression checks
     * Regression target: grading the same assignment twice should update the grade,
     * not create two grades for the same student and assignment.
     * CURRENT CODE may fail this test.
     */
    #[Group('business-regression')]
    public function test_regrading_same_assignment_does_not_duplicate_grade(): void
    {
        $teacher = $this->loginAsTeacher();
        $course = $this->courseOwnedBy($teacher);
        $student = Student::where('Kierunek_idKierunek', $course->Kierunek_idKierunek)->first();
        if (!$student) {
            $this->markTestSkipped('Brak studenta na kierunku kursu.');
        }
        $task = $this->makeTask($course);
        $student->zadanie()->syncWithoutDetaching([$task->idZadanie => [
            'status' => 'Niewysłane'
        ]]);
        $url = "/prowadzacy/ocenieniezadania/{$task->idZadanie}/{$student->idStudent}";
        $this->post($url.'/4')->assertRedirect();
        $this->post($url.'/5')->assertRedirect();
        $grades = Ocena::where('Zadanie_idZadanie', $task->idZadanie)
            ->where('idStudent', $student->idStudent);
        $this->assertSame(1, $grades->count(), 'BŁĄD LOGIKI: ponowna ocena utworzyła duplikat.');
        $this->assertEquals(5, $grades->first()->skalaOceny);
    }
}
