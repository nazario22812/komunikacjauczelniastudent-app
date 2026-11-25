<?php

namespace Tests\Feature\Concerns;

use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Only uses an explicitly opted-in isolated MySQL/MariaDB database.
 * Do not combine this trait with RefreshDatabase or DatabaseMigrations.
 */
trait UsesIsolatedMojaDatabase
{
    private bool $mojaTransactionStarted = false;

    protected function setUp(): void
    {
        parent::setUp();

        if (getenv('MOJA_INTEGRATION') !== '1') {
            $this->markTestSkipped('Wymagane MOJA_INTEGRATION=1 i osobna testowa MariaDB.');
        }

        if (config('database.default') !== 'mysql') {
            $this->markTestSkipped('Tylko MySQL/MariaDB; aktualnie: '.config('database.default'));
        }

        $database = config('database.connections.mysql.database');
        if (!is_string($database) || !preg_match('/_test$/', $database)) {
            throw new \RuntimeException('ODMOWA: nazwa bazy musi kończyć się na _test.');
        }

        DB::connection('mysql')->getPdo();
        DB::connection('mysql')->beginTransaction();
        $this->mojaTransactionStarted = true;
    }

    protected function tearDown(): void
    {
        try {
            if ($this->mojaTransactionStarted) {
                DB::connection('mysql')->rollBack();
                $this->mojaTransactionStarted = false;
            }
        } finally {
            parent::tearDown();
        }
    }

    protected function fixtureUser(string $variable): User
    {
        $id = getenv($variable);
        if ($id === false || !ctype_digit($id) || (int) $id <= 0) {
            $this->markTestSkipped("Ustaw $variable na ID fikcyjnego użytkownika w bazie *_test.");
        }

        $user = User::find((int) $id);
        if (!$user) {
            $this->markTestSkipped("Nie znaleziono $variable=$id w bazie testowej.");
        }
        return $user;
    }
}
