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
        Schema::create('talent_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('bio');
            $table->json('skills')->nullable();
            $table->unsignedInteger('experience_years')->default(0);
            $table->string('role_title');
            $table->json('preferred_industries')->nullable();
            $table->enum('work_type', ['remote', 'onsite', 'hybrid']);
            $table->enum('availability', ['immediately', '1month', '3months']);
            $table->string('resume_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('talent_profiles');
    }
};
