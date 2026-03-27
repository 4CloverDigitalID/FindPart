<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Requests\SendMessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\UserMatch;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function store(SendMessageRequest $request): JsonResponse
    {
        $user = $request->user();
        $match = UserMatch::query()
            ->whereKey($request->integer('match_id'))
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

        $message = Message::query()->create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $request->string('body')->trim()->toString(),
        ]);

        $message->load('sender:id,name,avatar');

        broadcast(new MessageSent($message))->toOthers();

        $response = $message->toArray();
        $response['match_id'] = $match->id;

        return response()->json($response, 201);
    }
}
