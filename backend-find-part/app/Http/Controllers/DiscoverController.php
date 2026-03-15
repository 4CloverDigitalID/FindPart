<?php

namespace App\Http\Controllers;

use App\Models\Swipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiscoverController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $swipedIds = Swipe::query()
            ->where('swiper_id', $user->id)
            ->pluck('swiped_id');

        if ($user->hasRole('talent')) {
            $cards = User::query()
                ->whereHas('roles', function (Builder $query): void {
                    $query->where('name', 'startup');
                })
                ->where('id', '!=', $user->id)
                ->whereNotIn('id', $swipedIds)
                ->with('startupProfile')
                ->whereHas('startupProfile', function (Builder $query) use ($request): void {
                    if ($request->filled('industry')) {
                        $query->where('industry', $request->string('industry')->toString());
                    }

                    if ($request->filled('stage')) {
                        $query->where('stage', $request->string('stage')->toString());
                    }

                    if ($request->filled('location')) {
                        $query->where('location', 'like', '%'.$request->string('location')->toString().'%');
                    }
                })
                ->paginate(10);

            return response()->json($cards);
        }

        $skills = array_filter(explode(',', (string) $request->query('skills', '')));

        $cards = User::query()
            ->whereHas('roles', function (Builder $query): void {
                $query->where('name', 'talent');
            })
            ->where('id', '!=', $user->id)
            ->whereNotIn('id', $swipedIds)
            ->with('talentProfile')
            ->whereHas('talentProfile', function (Builder $query) use ($request, $skills): void {
                if (! empty($skills)) {
                    foreach ($skills as $skill) {
                        $query->whereJsonContains('skills', trim($skill));
                    }
                }

                if ($request->filled('work_type')) {
                    $query->where('work_type', $request->string('work_type')->toString());
                }

                if ($request->filled('experience_min')) {
                    $query->where('experience_years', '>=', (int) $request->query('experience_min'));
                }
            })
            ->paginate(10);

        return response()->json($cards);
    }
}
