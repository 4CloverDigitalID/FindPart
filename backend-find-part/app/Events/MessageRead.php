<?php

namespace App\Events;

use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageRead implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $conversationId,
        public User $reader,
        public CarbonInterface $readAt,
        public int $lastReadMessageId
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('conversation.'.$this->conversationId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'MessageRead';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'reader_id' => $this->reader->id,
            'reader' => [
                'id' => $this->reader->id,
                'name' => $this->reader->name,
                'avatar' => $this->reader->avatar,
            ],
            'read_at' => $this->readAt->toISOString(),
            'last_read_message_id' => $this->lastReadMessageId,
        ];
    }
}
