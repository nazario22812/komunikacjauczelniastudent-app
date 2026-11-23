<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'surname' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password123'),
            'numerTelefonu' => fake()->unique()->numerify('#########'),
            'kontoBankowe' => fake()->numerify(str_repeat('#', 26)),
            'DataUrodzenia' => fake()->date('Y-m-d', '2006-12-31'),
            'Ustawienia' => null,
            'photo' => null,
        ];
    }

}
