<?php

namespace App\Http\Controllers;

use App\Events\MatchCreated;
use App\Http\Requests\SwipeRequest;
use App\Models\Conversation;
use App\Models\Swipe;
use App\Models\User;
use App\Models\UserMatch;
use Illuminate\Http\JsonResponse;

class SwipeController extends Controller
{
    public function store(SwipeRequest $request): JsonResponse
    {
        $swiper = $request->user();
        $swipedUser = User::query()->findOrFail($request->integer('swiped_id'));

        if ($swiper->id === $swipedUser->id) {
            return response()->json([
                'message' => 'Tidak bisa swipe diri sendiri.',
            ], 422);
        }

        if (($swiper->isStartup() && $swipedUser->isStartup()) || ($swiper->isTalent() && $swipedUser->isTalent())) {
            return response()->json([
                'message' => 'Swipe hanya bisa antar role startup dan talent.',
            ], 422);
        }

        Swipe::query()->updateOrCreate(
            [
                'swiper_id' => $swiper->id,
                'swiped_id' => $swipedUser->id,
            ],
            [
                'direction' => $request->string('direction')->toString(),
            ]
        );

        $isMatch = false;
        $matchId = null;

        if ($request->string('direction')->toString() === 'right') {
            $mutualSwipe = Swipe::query()
                ->where('swiper_id', $swipedUser->id)
                ->where('swiped_id', $swiper->id)
                ->where('direction', 'right')
                ->exists();

            if ($mutualSwipe) {
                $startupId = $swiper->isStartup() ? $swiper->id : $swipedUser->id;
                $talentId = $swiper->isTalent() ? $swiper->id : $swipedUser->id;

                $match = UserMatch::query()->firstOrCreate(
                    [
                        'startup_id' => $startupId,
                        'talent_id' => $talentId,
                    ],
                    [
                        'status' => 'active',
                        'matched_at' => now(),
                    ]
                );

                Conversation::query()->firstOrCreate(['match_id' => $match->id]);

                if ($match->wasRecentlyCreated) {
                    broadcast(new MatchCreated($match))->toOthers();
                }

                $isMatch = true;
                $matchId = $match->id;
            }
        }

        return response()->json([
            'match' => $isMatch,
            'match_id' => $matchId,
        ]);
    }
}
