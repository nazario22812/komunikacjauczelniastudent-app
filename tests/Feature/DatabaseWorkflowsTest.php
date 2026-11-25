<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Run ONLY with MOJA_INTEGRATION=1 and a separate MariaDB database named *_test.
 * Import the complete production SCHEMA, not production user data, before running.
 * Uses transactions so inserted records are rolled back on the same connection.
 */
class DatabaseWorkflowsTest extends TestCase
{
    private bool $transactionStarted = false;

    protected function setUp(): void
    {
        parent::setUp();

        if (getenv('MOJA_INTEGRATION') !== '1') {
            $this->markTestSkipped('Set MOJA_INTEGRATION=1 after configuring an isolated *_test MariaDB.');
        }
        if (DB::getDefaultConnection() !== 'mysql') {
            $this->markTestSkipped('This suite requires a separate MySQL/MariaDB test connection.');
        }
        $database = DB::connection()->getDatabaseName();
        if (!$database || !str_ends_with($database, '_test')) {
            $this->markTestSkipped('Refusing to run: database name must end with _test.');
        }
        DB::beginTransaction();
        $this->transactionStarted = true;
    }

    protected function tearDown(): void
    {
        if ($this->transactionStarted) {
            DB::rollBack();
        }
        parent::tearDown();
    }

    private function createTestUser(): User
    {
        $user = new User;
        $user->forceFill([
            'name' => 'Jan',
            'surname' => 'Testowy',
            'email' => 'test-' . bin2hex(random_bytes(6)) . '@example.test',
            'password' => Hash::make('old-password-123'),
            'numerTelefonu' => fake()->unique()->numerify('#########'),            
            'kontoBankowe' => '12345678901234567890123456',
            'DataUrodzenia' => '2000-01-01',
            'photo' => '',
        ]);
        $user->save();
        return $user;
    }

    public function test_avatar_upload_persists_base64_image(): void
    {
        $user = $this->createTestUser();
        $this->actingAs($user);
        $image = UploadedFile::fake()->image('test.png', 64, 64);

        $this->post('/mojedane/avatar', ['avatar' => $image])
            ->assertSessionHasNoErrors()
            ->assertSessionHas('status');

        $encoded = $user->fresh()->photo;
        $this->assertNotEmpty($encoded);
        $this->assertNotFalse(base64_decode($encoded, true));
        $this->assertSame('image/png', getimagesizefromstring(base64_decode($encoded))['mime']);
    }

    public function test_password_change_updates_persisted_password_hash(): void
    {
        $user = $this->createTestUser();
        $this->actingAs($user);

        $this->post('/ustawienia/haslo', [
            'current_password' => 'old-password-123',
            'new_password' => 'new-password-456',
            'new_password_confirmation' => 'new-password-456',
        ])->assertSessionHasNoErrors()->assertSessionHas('status');

        $this->assertTrue(Hash::check('new-password-456', $user->fresh()->password));
    }

    public function test_student_petition_post_creates_record(): void
    {
        $user = $this->createTestUser();
        $this->withoutMiddleware();
        $this->actingAs($user);

        $this->post('/student/zlozpodanie', [
            'temat' => 'Prosba o dokument',
            'tresc' => 'Test integracyjny podania',
        ])->assertRedirect('/student/edziekanat');

        $this->assertDatabaseHas('podanie', [
            'autor' => $user->idUser,
            'temat' => 'Prosba o dokument',
            'status' => 'Wysłano',
        ]);
    }

    public function test_dean_office_can_create_survey_record(): void
    {
        $this->withoutMiddleware();
        $this->post('/dziekanat/ankiety', [
            'temat' => 'Ankieta testowa',
            'opis' => 'Ocena zajec',
            'link' => 'https://example.com/survey',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('ankieta', ['temat' => 'Ankieta testowa']);
    }

    public function test_dean_office_can_create_announcement_record(): void
    {
        $this->withoutMiddleware();
        $this->post('/dziekanat/ogloszenia', [
            'temat' => 'Komunikat testowy',
            'tresc' => 'Test integracyjny',
            'czy_godziny' => false,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('komunikat', [
            'temat' => 'Komunikat testowy',
            'czyOgloszenie' => 1,
        ]);
    }
}
