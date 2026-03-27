<?php

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:sanctum']]);

/**
 * Shared membership check for private and presence conversation channels.
 */
$canAccessConversation = static function (User $user, int $conversationId): bool {
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
};

Broadcast::channel('users.{userId}', function (User $user, int $userId): bool {
    return $user->id === $userId;
});

Broadcast::channel('conversation.{conversationId}', function (User $user, int $conversationId) use ($canAccessConversation): bool {
    return $canAccessConversation($user, $conversationId);
});

Broadcast::channel('conversation.presence.{conversationId}', function (User $user, int $conversationId) use ($canAccessConversation): array|bool {
    if (! $canAccessConversation($user, $conversationId)) {
        return false;
    }

    return [
        'id' => $user->id,
        'name' => $user->name,
        'avatar' => $user->avatar,
    ];
});
