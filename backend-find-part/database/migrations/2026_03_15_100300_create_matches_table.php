<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('startup_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('talent_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['pending', 'active', 'declined', 'offer_sent', 'accepted'])->default('active');
            $table->timestamp('matched_at')->nullable();
            $table->timestamps();

            $table->unique(['startup_id', 'talent_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
