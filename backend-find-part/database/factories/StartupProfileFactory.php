<?php

namespace Database\Factories;

use App\Models\StartupProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StartupProfile>
 */
class StartupProfileFactory extends Factory
{
    protected $model = StartupProfile::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->startup(),
            'company_name' => fake()->company(),
            'tagline' => fake()->sentence(6),
            'pitch_description' => fake()->paragraph(),
            'pitch_deck_url' => null,
            'stage' => fake()->randomElement(['idea', 'mvp', 'growth', 'scaling']),
            'industry' => fake()->randomElement(['Fintech', 'Edtech', 'Healthtech', 'SaaS']),
            'needs' => fake()->randomElements(['CTO', 'Designer', 'Marketing', 'Product'], fake()->numberBetween(1, 3)),
            'location' => fake()->city(),
            'website' => fake()->url(),
            'team_size' => fake()->numberBetween(1, 30),
        ];
    }
}
