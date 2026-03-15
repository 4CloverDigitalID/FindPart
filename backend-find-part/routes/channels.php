<?php

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Broadcast::channel('users.{userId}', function (User $user, int $userId): bool {
    return $user->id === $userId;
});

Broadcast::channel('conversation.{conversationId}', function (User $user, int $conversationId): bool {
    return Conversation::query()
        ->whereKey($conversationId)
        ->whereHas('match', function ($query) use ($user): void {
            $query->where(function ($matchQuery) use ($user): void {
                $matchQuery
                    ->where('startup_id', $user->id)
                    ->orWhere('talent_id', $user->id);
            });
        })
        ->exists();
});
