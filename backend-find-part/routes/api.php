<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DiscoverController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StartupProfileController;
use App\Http\Controllers\SwipeController;
use App\Http\Controllers\TalentProfileController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/profile', [ProfileController::class, 'update']);

    Route::post('/startup/profile', [StartupProfileController::class, 'store']);
    Route::post('/talent/profile', [TalentProfileController::class, 'store']);

    Route::get('/discover', [DiscoverController::class, 'index']);
    Route::post('/swipe', [SwipeController::class, 'store']);

    Route::get('/matches', [MatchController::class, 'index']);
    Route::get('/matches/{id}', [MatchController::class, 'show']);

    Route::get('/conversations/{matchId}', [ConversationController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store']);

    Route::post('/uploads/avatar', [UploadController::class, 'avatar']);
    Route::post('/uploads/pitch-deck', [UploadController::class, 'pitchDeck']);
    Route::post('/uploads/resume', [UploadController::class, 'resume']);
});

Route::get('/users/{id}', [UserController::class, 'show']);
