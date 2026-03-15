<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SwipeRequest extends FormRequest
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
            'swiped_id' => ['required', 'integer', 'exists:users,id'],
            'direction' => ['required', 'in:left,right'],
        ];
    }
}
