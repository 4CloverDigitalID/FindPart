<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadAvatarRequest;
use App\Http\Requests\UploadPitchDeckRequest;
use App\Http\Requests\UploadResumeRequest;
use App\Models\StartupProfile;
use App\Models\TalentProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function avatar(UploadAvatarRequest $request): JsonResponse
    {
        $path = $request->file('file')->store('avatars', 'public');

        $request->user()->forceFill([
            'avatar' => $path,
        ])->save();

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }

    public function pitchDeck(UploadPitchDeckRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->hasRole('startup')) {
            return response()->json([
                'message' => 'Hanya startup yang dapat upload pitch deck.',
            ], 403);
        }

        $path = $request->file('file')->store('pitch-decks', 'public');

        $profile = StartupProfile::query()->firstOrCreate([
            'user_id' => $user->id,
        ], [
            'company_name' => 'Startup '.$user->name,
            'pitch_description' => 'Lengkapi profil startup Anda.',
            'stage' => 'idea',
            'industry' => 'General',
            'location' => 'Indonesia',
        ]);

        $profile->update([
            'pitch_deck_url' => $path,
        ]);

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }

    public function resume(UploadResumeRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->hasRole('talent')) {
            return response()->json([
                'message' => 'Hanya talent yang dapat upload resume.',
            ], 403);
        }

        $path = $request->file('file')->store('resumes', 'public');

        $profile = TalentProfile::query()->firstOrCreate([
            'user_id' => $user->id,
        ], [
            'bio' => 'Lengkapi profil talent Anda.',
            'skills' => ['Generalist'],
            'experience_years' => 0,
            'role_title' => 'Talent',
            'work_type' => 'remote',
            'availability' => 'immediately',
        ]);

        $profile->update([
            'resume_url' => $path,
        ]);

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
