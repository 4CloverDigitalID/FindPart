<?php

use App\Events\MessageRead;
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
    $this->postJson('/api/conversations/'.$match->id.'/read')->assertStatus(403);
    $this->postJson('/api/messages', [
        'match_id' => $match->id,
        'body' => 'Halo',
    ])->assertStatus(403);
});

it('dispatches message event with expected payload when member sends a message', function (): void {
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
        'match_id' => $match->id,
    ]);

    expect(Message::query()->count())->toBe(1);

    Event::assertDispatched(MessageSent::class, function (MessageSent $event) use ($match): bool {
        $payload = $event->broadcastWith();

        return $payload['body'] === 'Halo dari startup'
            && $payload['match_id'] === $match->id
            && isset($payload['sender_id'])
            && array_key_exists('read_at', $payload);
    });
});

it('marks incoming messages as read and dispatches MessageRead event', function (): void {
    Event::fake([MessageRead::class]);

    $startup = User::factory()->startup()->create();
    $startup->assignRole('startup');

    $talent = User::factory()->talent()->create();
    $talent->assignRole('talent');

    $match = UserMatch::factory()->create([
        'startup_id' => $startup->id,
        'talent_id' => $talent->id,
    ]);

    $conversation = Conversation::factory()->create(['match_id' => $match->id]);

    $incomingOne = Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $talent->id,
        'read_at' => null,
    ]);

    $incomingTwo = Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $talent->id,
        'read_at' => null,
    ]);

    $ownMessage = Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $startup->id,
        'read_at' => null,
    ]);

    $alreadyRead = Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $talent->id,
        'read_at' => now()->subHour(),
    ]);

    Sanctum::actingAs($startup);

    $response = $this->postJson('/api/conversations/'.$match->id.'/read');

    $response->assertOk()
        ->assertJsonPath('conversation_id', $conversation->id)
        ->assertJsonPath('read_count', 2)
        ->assertJsonPath('last_read_message_id', $incomingTwo->id);

    expect($incomingOne->fresh()->read_at)->not->toBeNull();
    expect($incomingTwo->fresh()->read_at)->not->toBeNull();
    expect($ownMessage->fresh()->read_at)->toBeNull();
    expect($alreadyRead->fresh()->read_at)->not->toBeNull();

    Event::assertDispatched(MessageRead::class, function (MessageRead $event) use ($conversation, $startup, $incomingTwo): bool {
        $payload = $event->broadcastWith();

        return $payload['conversation_id'] === $conversation->id
            && $payload['reader_id'] === $startup->id
            && $payload['last_read_message_id'] === $incomingTwo->id;
    });
});

it('does not re-mark already read messages or dispatch read event', function (): void {
    Event::fake([MessageRead::class]);

    $startup = User::factory()->startup()->create();
    $startup->assignRole('startup');

    $talent = User::factory()->talent()->create();
    $talent->assignRole('talent');

    $match = UserMatch::factory()->create([
        'startup_id' => $startup->id,
        'talent_id' => $talent->id,
    ]);

    $conversation = Conversation::factory()->create(['match_id' => $match->id]);

    Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $talent->id,
        'read_at' => now()->subMinute(),
    ]);

    Sanctum::actingAs($startup);

    $response = $this->postJson('/api/conversations/'.$match->id.'/read');

    $response->assertOk()
        ->assertJsonPath('conversation_id', $conversation->id)
        ->assertJsonPath('read_count', 0)
        ->assertJsonPath('last_read_message_id', null);

    Event::assertNotDispatched(MessageRead::class);
});
