<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartupProfileRequest extends FormRequest
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
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'pitch_description' => ['required', 'string'],
            'pitch_deck_url' => ['nullable', 'string', 'max:2048'],
            'stage' => ['required', 'in:idea,mvp,growth,scaling'],
            'industry' => ['required', 'string', 'max:255'],
            'needs' => ['nullable', 'array'],
            'needs.*' => ['string', 'max:120'],
            'location' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'team_size' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
