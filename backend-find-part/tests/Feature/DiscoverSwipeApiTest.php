<?php

use App\Models\StartupProfile;
use App\Models\Swipe;
use App\Models\TalentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    Role::findOrCreate('startup', 'web');
    Role::findOrCreate('talent', 'web');
});

it('discovers opposite role cards and excludes swiped users', function (): void {
    $talent = User::factory()->talent()->create();
    $talent->assignRole('talent');

    $startupA = User::factory()->startup()->create(['name' => 'Startup A']);
    $startupA->assignRole('startup');
    StartupProfile::factory()->create([
        'user_id' => $startupA->id,
        'industry' => 'SaaS',
    ]);

    $startupB = User::factory()->startup()->create(['name' => 'Startup B']);
    $startupB->assignRole('startup');
    StartupProfile::factory()->create([
        'user_id' => $startupB->id,
        'industry' => 'Fintech',
    ]);

    Swipe::query()->create([
        'swiper_id' => $talent->id,
        'swiped_id' => $startupA->id,
        'direction' => 'left',
    ]);

    Sanctum::actingAs($talent);

    $response = $this->getJson('/api/discover?industry=Fintech');

    $response->assertOk();

    $ids = collect($response->json('data'))->pluck('id')->all();

    expect($ids)->toContain($startupB->id)
        ->not->toContain($startupA->id);
});

it('creates exactly one match and conversation for mutual right swipes', function (): void {
    $startup = User::factory()->startup()->create();
    $startup->assignRole('startup');
    StartupProfile::factory()->create(['user_id' => $startup->id]);

    $talent = User::factory()->talent()->create();
    $talent->assignRole('talent');
    TalentProfile::factory()->create(['user_id' => $talent->id]);

    Swipe::query()->create([
        'swiper_id' => $startup->id,
        'swiped_id' => $talent->id,
        'direction' => 'right',
    ]);

    Sanctum::actingAs($talent);

    $first = $this->postJson('/api/swipe', [
        'swiped_id' => $startup->id,
        'direction' => 'right',
    ]);

    $first->assertOk()->assertJson([
        'match' => true,
    ]);

    $this->postJson('/api/swipe', [
        'swiped_id' => $startup->id,
        'direction' => 'right',
    ])->assertOk();

    $this->assertDatabaseCount('matches', 1);
    $this->assertDatabaseCount('conversations', 1);
});
