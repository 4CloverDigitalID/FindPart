<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\UserMatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function show(Request $request, int $matchId): JsonResponse
    {
        $user = $request->user();

        $match = UserMatch::query()
            ->whereKey($matchId)
            ->where(function ($query) use ($user): void {
                $query
                    ->where('startup_id', $user->id)
                    ->orWhere('talent_id', $user->id);
            })
            ->first();

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
}
