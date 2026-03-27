<?php

namespace App\Http\Controllers;

use App\Events\MessageRead;
use App\Models\Conversation;
use App\Models\UserMatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function show(Request $request, int $matchId): JsonResponse
    {
        $match = $this->resolveAuthorizedMatch($request, $matchId);

        if ($match === null) {
            return response()->json([
                'message' => 'Akses percakapan ditolak.',
            ], 403);
        }

        $conversation = Conversation::query()->firstOrCreate([
            'match_id' => $match->id,
        ]);

        $messages = $conversation->messages()
            ->with('sender:id,name,avatar')
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'conversation_id' => $conversation->id,
            'match_id' => $match->id,
            'messages' => $messages,
        ]);
    }

    public function markRead(Request $request, int $matchId): JsonResponse
    {
        $user = $request->user();
        $match = $this->resolveAuthorizedMatch($request, $matchId);

        if ($match === null) {
            return response()->json([
                'message' => 'Akses percakapan ditolak.',
            ], 403);
        }

        $conversation = Conversation::query()->firstOrCreate([
            'match_id' => $match->id,
        ]);

        $readAt = now();
        $unreadIncomingQuery = $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at');

        $lastReadMessageId = (clone $unreadIncomingQuery)->max('id');
        $readCount = 0;

        if ($lastReadMessageId !== null) {
            $readCount = $unreadIncomingQuery->update([
                'read_at' => $readAt,
            ]);

            broadcast(new MessageRead(
                conversationId: $conversation->id,
                reader: $user,
                readAt: $readAt,
                lastReadMessageId: (int) $lastReadMessageId
            ))->toOthers();
        }

        return response()->json([
            'conversation_id' => $conversation->id,
            'read_count' => $readCount,
            'read_at' => $readCount > 0 ? $readAt->toISOString() : null,
            'last_read_message_id' => $lastReadMessageId !== null ? (int) $lastReadMessageId : null,
        ]);
    }

    private function resolveAuthorizedMatch(Request $request, int $matchId): ?UserMatch
    {
        $user = $request->user();

        return UserMatch::query()
            ->whereKey($matchId)
            ->where(function ($query) use ($user): void {
                $query
                    ->where('startup_id', $user->id)
                    ->orWhere('talent_id', $user->id);
            })
            ->first();
    }
}
