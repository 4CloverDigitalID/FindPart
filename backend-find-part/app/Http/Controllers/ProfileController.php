<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->fill($request->validated());
        $user->save();

        return response()->json(
            $user->fresh()->load(['roles', 'startupProfile', 'talentProfile'])
        );
    }
}
