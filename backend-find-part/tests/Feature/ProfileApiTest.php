<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

it('updates authenticated user account profile', function (): void {
    $user = User::factory()->startup()->create([
        'name' => 'Nama Lama',
        'email' => 'lama@example.com',
    ]);

    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/profile', [
        'name' => 'Nama Baru',
        'email' => 'baru@example.com',
    ]);

    $response->assertOk()->assertJsonFragment([
        'name' => 'Nama Baru',
        'email' => 'baru@example.com',
    ]);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Nama Baru',
        'email' => 'baru@example.com',
    ]);
});

it('rejects duplicate email while updating account profile', function (): void {
    $firstUser = User::factory()->startup()->create([
        'email' => 'first@example.com',
    ]);
    $secondUser = User::factory()->talent()->create([
        'email' => 'second@example.com',
    ]);

    Sanctum::actingAs($firstUser);

    $this->patchJson('/api/profile', [
        'name' => $firstUser->name,
        'email' => $secondUser->email,
    ])->assertStatus(422);
});

it('upserts startup profile', function (): void {
    Role::findOrCreate('startup', 'web');

    $user = User::factory()->startup()->create();
    $user->assignRole('startup');

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/startup/profile', [
        'company_name' => 'PT Startup Maju',
        'tagline' => 'Berkembang bersama',
        'pitch_description' => 'Platform kolaborasi startup dan talent.',
        'stage' => 'mvp',
        'industry' => 'SaaS',
        'needs' => ['CTO', 'Designer'],
        'location' => 'Bandung',
        'website' => 'https://startup.test',
        'team_size' => 8,
    ]);

    $response->assertOk()->assertJsonFragment([
        'company_name' => 'PT Startup Maju',
        'industry' => 'SaaS',
    ]);

    $this->assertDatabaseHas('startup_profiles', [
        'user_id' => $user->id,
        'company_name' => 'PT Startup Maju',
    ]);
});

it('upserts talent profile', function (): void {
    Role::findOrCreate('talent', 'web');

    $user = User::factory()->talent()->create();
    $user->assignRole('talent');

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/talent/profile', [
        'bio' => 'Saya engineer fullstack.',
        'skills' => ['React', 'Laravel'],
        'experience_years' => 4,
        'role_title' => 'Fullstack Engineer',
        'preferred_industries' => ['SaaS'],
        'work_type' => 'remote',
        'availability' => 'immediately',
        'portfolio_url' => 'https://portfolio.test',
    ]);

    $response->assertOk()->assertJsonFragment([
        'role_title' => 'Fullstack Engineer',
        'work_type' => 'remote',
    ]);

    $this->assertDatabaseHas('talent_profiles', [
        'user_id' => $user->id,
        'role_title' => 'Fullstack Engineer',
    ]);
});
