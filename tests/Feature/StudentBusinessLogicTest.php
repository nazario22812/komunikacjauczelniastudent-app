<?php

namespace Tests\Feature;

use App\Models\Kurs;
use App\Models\Podanie;
use App\Models\Student;
use App\Models\Zadanie;
use Tests\Feature\Concerns\UsesIsolatedMojaDatabase;
use Tests\TestCase;

/** Business rules exercised through the real HTTP entry points and test MySQL. */
class StudentBusinessLogicTest extends TestCase
{
    use UsesIsolatedMojaDatabase;

    private function loginAsStudent(): Student
    {
        $user = $this->fixtureUser('MOJA_TEST_STUDENT_USER_ID');
        $student = Student::where('User_idUser', $user->idUser)->first();
        if (!$student) {
            $this->markTestSkipped('Brak rekordu student dla MOJA_TEST_STUDENT_USER_ID.');
        }
        $this->actingAs($user);
        return $student;
    }

    public function test_student_cannot_read_petition_created_by_other_user(): void
    {
        $student = $this->loginAsStudent();
        $other = $this->fixtureUser('MOJA_TEST_DEAN_USER_ID');
        if ((int) $other->idUser === (int) $student->User_idUser) {
            $this->markTestSkipped('ID studenta i dziekanatu muszą być różne.');
        }
        $petition = Podanie::create([
            'temat' => 'Kontrola prywatności '.bin2hex(random_bytes(5)),
            'tresc' => 'Dokument innego użytkownika.',
            'data' => now()->format('Y-m-d H:i:s'),
            'autor' => $other->idUser,
            'status' => 'Wysłano',
            'odpowiedz' => null,
        ]);
        $this->get("/student/edziekanat/{$petition->idPodanie}")->assertNotFound();
    }

    public function test_student_can_read_own_petition_as_json(): void
    {
        $student = $this->loginAsStudent();
        $petition = Podanie::create([
            'temat' => 'Własne podanie '.bin2hex(random_bytes(5)),
            'tresc' => 'Treść podania.',
            'data' => now()->format('Y-m-d H:i:s'),
            'autor' => $student->User_idUser,
            'status' => 'Wysłano',
            'odpowiedz' => null,
        ]);
        $this->getJson("/student/edziekanat/{$petition->idPodanie}")
            ->assertOk()->assertJsonPath('szczegoly.autor', $student->User_idUser);
    }

    public function test_petition_requires_subject_and_content_without_inserting_record(): void
    {
        $student = $this->loginAsStudent();
        $before = Podanie::where('autor', $student->User_idUser)->count();
        $this->post('/student/zlozpodanie', ['temat' => '', 'tresc' => ''])
            ->assertSessionHasErrors(['temat', 'tresc']);
        $this->assertSame($before, Podanie::where('autor', $student->User_idUser)->count());
    }

    public function test_nonexistent_course_cannot_be_joined(): void
    {
        $this->loginAsStudent();
        $missingId = (int) Kurs::max('idkurs') + 100000;
        $this->post("/student/mojekursy/{$missingId}")->assertNotFound();
    }

    public function test_unenrolled_student_cannot_open_another_course_using_check_route(): void
    {
        $student = $this->loginAsStudent();
        $course = Kurs::whereDoesntHave('student', function ($query) use ($student) {
            $query->where('student.idStudent', $student->idStudent);
        })->first();
        if (!$course) {
            $this->markTestSkipped('Brak kursu, na który student nie jest zapisany.');
        }
        $this->post("/student/checkkurs/{$course->idkurs}")
            ->assertRedirect('/student/mojekursy')
            ->assertSessionHas('status', 'Nie jesteś zapisany na ten kurs');
    }

    public function test_student_cannot_submit_files_to_unassigned_task(): void
    {
        $student = $this->loginAsStudent();
        $task = Zadanie::whereDoesntHave('student', function ($query) use ($student) {
            $query->where('student.idStudent', $student->idStudent);
        })->first();
        if (!$task) {
            $this->markTestSkipped('Brak nieprzypisanego zadania w testowej bazie.');
        }
        $this->post("/student/kurs/wyslijzadanie/{$task->idZadanie}", [
            'pliks' => [\Illuminate\Http\UploadedFile::fake()->create('test.txt', 2, 'text/plain')],
        ])->assertNotFound();
    }
}
