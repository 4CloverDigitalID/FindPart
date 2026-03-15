<?php

namespace App\Http\Controllers;

use App\Http\Requests\StartupProfileRequest;
use App\Models\StartupProfile;
use Illuminate\Http\JsonResponse;

class StartupProfileController extends Controller
{
    public function store(StartupProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->hasRole('startup')) {
            return response()->json([
                'message' => 'Hanya akun startup yang dapat mengakses fitur ini.',
            ], 403);
        }

        $profile = StartupProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            $request->validated()
        );

        return response()->json($profile->fresh());
    }
}
