<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'match_id' => ['required', 'integer', 'exists:matches,id'],
            'body' => ['required', 'string', 'max:2000'],
        ];
    }
}
