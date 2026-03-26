<?php

namespace App\Http\Controllers;

use App\Models\UserMatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = UserMatch::query()
            ->with([
                'startup:id,name,avatar,role',
                'startup.startupProfile',
                'talent:id,name,avatar,role',
                'talent.talentProfile',
                'conversation.messages',
            ])
            ->orderByDesc('matched_at');

        if ($user->isStartup()) {
            $query->where('startup_id', $user->id);
        } else {
            $query->where('talent_id', $user->id);
        }

        return response()->json($query->paginate(20));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $match = UserMatch::query()
            ->with([
                'startup:id,name,avatar,role',
                'startup.startupProfile',
                'talent:id,name,avatar,role',
                'talent.talentProfile',
                'conversation.messages.sender:id,name,avatar',
            ])
            ->whereKey($id)
            ->where(function ($query) use ($user): void {
                $query
                    ->where('startup_id', $user->id)
                    ->orWhere('talent_id', $user->id);
            })
            ->first();

        if ($match === null) {
            return response()->json([
                'message' => 'Match tidak ditemukan.',
            ], 404);
        }

        return response()->json($match);
    }
}
