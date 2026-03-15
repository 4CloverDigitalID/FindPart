<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'is_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_verified' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function startupProfile(): HasOne
    {
        return $this->hasOne(StartupProfile::class);
    }

    public function talentProfile(): HasOne
    {
        return $this->hasOne(TalentProfile::class);
    }

    public function swipesMade(): HasMany
    {
        return $this->hasMany(Swipe::class, 'swiper_id');
    }

    public function swipesReceived(): HasMany
    {
        return $this->hasMany(Swipe::class, 'swiped_id');
    }

    public function startupMatches(): HasMany
    {
        return $this->hasMany(UserMatch::class, 'startup_id');
    }

    public function talentMatches(): HasMany
    {
        return $this->hasMany(UserMatch::class, 'talent_id');
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function isStartup(): bool
    {
        return $this->hasRole('startup') || $this->role === 'startup';
    }

    public function isTalent(): bool
    {
        return $this->hasRole('talent') || $this->role === 'talent';
    }
}
