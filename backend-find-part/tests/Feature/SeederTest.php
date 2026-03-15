<?php

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\UserMatch;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates demo users and chat data via seeder', function (): void {
    $this->seed(DatabaseSeeder::class);

    $startup = User::query()->where('email', 'startup@example.com')->first();
    $talent = User::query()->where('email', 'talent@example.com')->first();

    expect($startup)->not->toBeNull();
    expect($talent)->not->toBeNull();

    expect(UserMatch::query()->count())->toBeGreaterThan(0);
    expect(Conversation::query()->count())->toBeGreaterThan(0);
    expect(Message::query()->count())->toBeGreaterThan(0);
});
