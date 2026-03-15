<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\StartupProfile;
use App\Models\Swipe;
use App\Models\TalentProfile;
use App\Models\User;
use App\Models\UserMatch;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::findOrCreate('startup', 'web');
        Role::findOrCreate('talent', 'web');

        $startup = User::factory()->startup()->create([
            'name' => 'Startup Demo',
            'email' => 'startup@example.com',
            'is_verified' => true,
        ]);
        $startup->assignRole('startup');

        $talent = User::factory()->talent()->create([
            'name' => 'Talent Demo',
            'email' => 'talent@example.com',
            'is_verified' => true,
        ]);
        $talent->assignRole('talent');

        StartupProfile::factory()->create([
            'user_id' => $startup->id,
            'company_name' => 'Demo Startup Nusantara',
            'industry' => 'SaaS',
            'stage' => 'mvp',
            'location' => 'Jakarta',
            'needs' => ['CTO', 'UI/UX Designer'],
        ]);

        TalentProfile::factory()->create([
            'user_id' => $talent->id,
            'role_title' => 'Fullstack Developer',
            'skills' => ['React', 'Laravel', 'MySQL'],
            'work_type' => 'remote',
        ]);

        $moreStartups = User::factory(5)->startup()->create();
        $moreTalents = User::factory(8)->talent()->create();

        $moreStartups->each(function (User $user): void {
            $user->assignRole('startup');
            StartupProfile::factory()->create(['user_id' => $user->id]);
        });

        $moreTalents->each(function (User $user): void {
            $user->assignRole('talent');
            TalentProfile::factory()->create(['user_id' => $user->id]);
        });

        Swipe::query()->create([
            'swiper_id' => $startup->id,
            'swiped_id' => $talent->id,
            'direction' => 'right',
        ]);
        Swipe::query()->create([
            'swiper_id' => $talent->id,
            'swiped_id' => $startup->id,
            'direction' => 'right',
        ]);

        $match = UserMatch::query()->create([
            'startup_id' => $startup->id,
            'talent_id' => $talent->id,
            'status' => 'active',
            'matched_at' => now(),
        ]);

        $conversation = Conversation::query()->create([
            'match_id' => $match->id,
        ]);

        Message::query()->create([
            'conversation_id' => $conversation->id,
            'sender_id' => $startup->id,
            'body' => 'Halo, apakah kamu tertarik bergabung sebagai co-founder tech?',
        ]);

        Message::query()->create([
            'conversation_id' => $conversation->id,
            'sender_id' => $talent->id,
            'body' => 'Tentu, saya tertarik. Kita bisa jadwalkan call minggu ini.',
        ]);
    }
}
