<?php

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\UserMatch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    Role::findOrCreate('startup', 'web');
    Role::findOrCreate('talent', 'web');
});

it('blocks non members from conversation and message endpoints', function (): void {
    $startup = User::factory()->startup()->create();
    $startup->assignRole('startup');

    $talent = User::factory()->talent()->create();
    $talent->assignRole('talent');

    $outsider = User::factory()->talent()->create();
    $outsider->assignRole('talent');

    $match = UserMatch::factory()->create([
        'startup_id' => $startup->id,
        'talent_id' => $talent->id,
    ]);

    Conversation::factory()->create(['match_id' => $match->id]);

    Sanctum::actingAs($outsider);

    $this->getJson('/api/conversations/'.$match->id)->assertStatus(403);
    $this->postJson('/api/messages', [
        'match_id' => $match->id,
        'body' => 'Halo',
    ])->assertStatus(403);
});

it('dispatches message event when member sends a message', function (): void {
    Event::fake([MessageSent::class]);

    $startup = User::factory()->startup()->create();
    $startup->assignRole('startup');

    $talent = User::factory()->talent()->create();
    $talent->assignRole('talent');

    $match = UserMatch::factory()->create([
        'startup_id' => $startup->id,
        'talent_id' => $talent->id,
    ]);

    Conversation::factory()->create(['match_id' => $match->id]);

    Sanctum::actingAs($startup);

    $response = $this->postJson('/api/messages', [
        'match_id' => $match->id,
        'body' => 'Halo dari startup',
    ]);

    $response->assertCreated()->assertJsonFragment([
        'body' => 'Halo dari startup',
    ]);

    expect(Message::query()->count())->toBe(1);

    Event::assertDispatched(MessageSent::class);
});
