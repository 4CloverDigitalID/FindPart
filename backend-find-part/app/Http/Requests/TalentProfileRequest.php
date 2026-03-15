<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TalentProfileRequest extends FormRequest
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
            'bio' => ['required', 'string'],
            'skills' => ['required', 'array', 'min:1'],
            'skills.*' => ['string', 'max:120'],
            'experience_years' => ['required', 'integer', 'min:0', 'max:50'],
            'role_title' => ['required', 'string', 'max:255'],
            'preferred_industries' => ['nullable', 'array'],
            'preferred_industries.*' => ['string', 'max:120'],
            'work_type' => ['required', 'in:remote,onsite,hybrid'],
            'availability' => ['required', 'in:immediately,1month,3months'],
            'resume_url' => ['nullable', 'string', 'max:2048'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
        ];
    }
}
