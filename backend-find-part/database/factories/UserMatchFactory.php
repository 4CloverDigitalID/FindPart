<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserMatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserMatch>
 */
class UserMatchFactory extends Factory
{
    protected $model = UserMatch::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'startup_id' => User::factory()->startup(),
            'talent_id' => User::factory()->talent(),
            'status' => 'active',
            'matched_at' => now(),
        ];
    }
}
