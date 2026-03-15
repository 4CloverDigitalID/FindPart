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
        Schema::create('startup_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('company_name');
            $table->string('tagline')->nullable();
            $table->text('pitch_description');
            $table->string('pitch_deck_url')->nullable();
            $table->enum('stage', ['idea', 'mvp', 'growth', 'scaling']);
            $table->string('industry');
            $table->json('needs')->nullable();
            $table->string('location');
            $table->string('website')->nullable();
            $table->unsignedInteger('team_size')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('startup_profiles');
    }
};
