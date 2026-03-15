<?php

namespace App\Http\Controllers;

use App\Http\Requests\TalentProfileRequest;
use App\Models\TalentProfile;
use Illuminate\Http\JsonResponse;

class TalentProfileController extends Controller
{
    public function store(TalentProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->hasRole('talent')) {
            return response()->json([
                'message' => 'Hanya akun talent yang dapat mengakses fitur ini.',
            ], 403);
        }

        $profile = TalentProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            $request->validated()
        );

        return response()->json($profile->fresh());
    }
}
