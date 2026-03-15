<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function show(int $id): JsonResponse
    {
        $user = User::query()
            ->with(['startupProfile', 'talentProfile'])
            ->find($id);

        if ($user === null) {
            return response()->json([
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        return response()->json($user);
    }
}
