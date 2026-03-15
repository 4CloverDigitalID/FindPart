<?php

namespace App\Events;

use App\Models\UserMatch;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MatchCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public UserMatch $match)
    {
        $this->match->loadMissing([
            'startup:id,name,avatar',
            'talent:id,name,avatar',
        ]);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('users.'.$this->match->startup_id),
            new PrivateChannel('users.'.$this->match->talent_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'MatchCreated';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->match->id,
            'startup' => $this->match->startup,
            'talent' => $this->match->talent,
            'matched_at' => optional($this->match->matched_at)->toISOString(),
            'status' => $this->match->status,
        ];
    }
}
