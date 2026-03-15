<?php

namespace Database\Factories;

use App\Models\Swipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Swipe>
 */
class SwipeFactory extends Factory
{
    protected $model = Swipe::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'swiper_id' => User::factory(),
            'swiped_id' => User::factory(),
            'direction' => fake()->randomElement(['left', 'right']),
        ];
    }
}
