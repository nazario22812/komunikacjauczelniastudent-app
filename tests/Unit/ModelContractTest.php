<?php

namespace Tests\Unit;

use App\Models\Kurs;
use App\Models\Podanie;
use App\Models\Student;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class ModelContractTest extends TestCase
{
    public function test_custom_table_names_and_primary_keys_are_mapped_correctly(): void
    {
        $expected = [
            User::class => ['user', 'idUser'],
            Student::class => ['student', 'idStudent'],
            Kurs::class => ['kurs', 'idkurs'],
            Podanie::class => ['podanie', 'idPodanie'],
        ];
        foreach ($expected as $class => [$table, $primaryKey]) {
            $model = new $class;
            $this->assertSame($table, $model->getTable(), $class);
            $this->assertSame($primaryKey, $model->getKeyName(), $class);
            $this->assertFalse($model->usesTimestamps(), $class);
        }
    }

    public function test_user_model_exposes_expected_profile_fields(): void
    {
        $fillable = (new User)->getFillable();
        foreach (['name', 'surname', 'email', 'password', 'numerTelefonu', 'kontoBankowe', 'DataUrodzenia', 'photo'] as $field) {
            $this->assertContains($field, $fillable);
        }
        $this->assertContains('password', (new User)->getHidden());
    }

    public function test_course_and_petition_fields_are_mass_assignable(): void
    {
        foreach (['nazwa', 'kod', 'Semester'] as $field) {
            $this->assertContains($field, (new Kurs)->getFillable());
        }
        foreach (['temat', 'tresc', 'autor', 'status', 'odpowiedz'] as $field) {
            $this->assertContains($field, (new Podanie)->getFillable());
        }
    }
}
