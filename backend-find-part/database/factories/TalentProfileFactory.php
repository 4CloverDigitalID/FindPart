<?php

namespace Database\Factories;

use App\Models\TalentProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TalentProfile>
 */
class TalentProfileFactory extends Factory
{
    protected $model = TalentProfile::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->talent(),
            'bio' => fake()->paragraph(),
            'skills' => fake()->randomElements(['React', 'Laravel', 'UI/UX', 'Node.js', 'Python', 'Product'], fake()->numberBetween(2, 4)),
            'experience_years' => fake()->numberBetween(0, 12),
            'role_title' => fake()->randomElement(['Fullstack Developer', 'Product Designer', 'Growth Marketer']),
            'preferred_industries' => fake()->randomElements(['Fintech', 'Edtech', 'Healthtech', 'SaaS'], fake()->numberBetween(1, 3)),
            'work_type' => fake()->randomElement(['remote', 'onsite', 'hybrid']),
            'availability' => fake()->randomElement(['immediately', '1month', '3months']),
            'resume_url' => null,
            'portfolio_url' => fake()->url(),
        ];
    }
}
