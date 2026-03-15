<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\UserMatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Conversation>
 */
class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'match_id' => UserMatch::factory(),
        ];
    }
}
