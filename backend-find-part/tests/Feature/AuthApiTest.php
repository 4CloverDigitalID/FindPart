<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('registers and logs in a user with startup role', function (): void {
    $registerResponse = $this->postJson('/api/register', [
        'name' => 'Startup A',
        'email' => 'startupa@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'startup',
    ]);

    $registerResponse
        ->assertCreated()
        ->assertJsonStructure([
            'user' => ['id', 'email', 'role'],
            'token',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'startupa@example.com',
        'role' => 'startup',
    ]);

    $loginResponse = $this->postJson('/api/login', [
        'email' => 'startupa@example.com',
        'password' => 'password123',
    ]);

    $loginResponse
        ->assertOk()
        ->assertJsonStructure([
            'user' => ['id', 'email', 'role'],
            'token',
        ]);
});

it('returns authenticated user and can logout', function (): void {
    $user = User::factory()->startup()->create();
    $token = $user->createToken('test')->plainTextToken;

    $meResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/me');

    $meResponse
        ->assertOk()
        ->assertJsonFragment(['id' => $user->id]);

    $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/logout');

    $logoutResponse->assertOk();

    Sanctum::actingAs($user);

    $this->getJson('/api/me')->assertOk();
});
