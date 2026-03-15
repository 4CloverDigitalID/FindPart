<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'startup_id',
        'talent_id',
        'status',
        'matched_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'matched_at' => 'datetime',
        ];
    }

    public function startup(): BelongsTo
    {
        return $this->belongsTo(User::class, 'startup_id');
    }

    public function talent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'talent_id');
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class, 'match_id');
    }
}
