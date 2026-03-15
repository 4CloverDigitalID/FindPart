<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    Role::findOrCreate('startup', 'web');
    Role::findOrCreate('talent', 'web');
    Storage::fake('public');
});

it('uploads avatar for authenticated user', function (): void {
    $user = User::factory()->startup()->create();
    $user->assignRole('startup');

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/uploads/avatar', [
        'file' => UploadedFile::fake()->image('avatar.jpg'),
    ]);

    $response->assertCreated()->assertJsonStructure(['path', 'url']);

    Storage::disk('public')->assertExists($response->json('path'));
});

it('uploads pitch deck and resume based on role', function (): void {
    $startup = User::factory()->startup()->create();
    $startup->assignRole('startup');

    Sanctum::actingAs($startup);

    $pitchDeckResponse = $this->postJson('/api/uploads/pitch-deck', [
        'file' => UploadedFile::fake()->create('deck.pdf', 100, 'application/pdf'),
    ]);

    $pitchDeckResponse->assertCreated()->assertJsonStructure(['path', 'url']);

    $talent = User::factory()->talent()->create();
    $talent->assignRole('talent');

    Sanctum::actingAs($talent);

    $resumeResponse = $this->postJson('/api/uploads/resume', [
        'file' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
    ]);

    $resumeResponse->assertCreated()->assertJsonStructure(['path', 'url']);
});
