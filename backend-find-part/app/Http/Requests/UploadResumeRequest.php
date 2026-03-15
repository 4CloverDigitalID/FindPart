<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadResumeRequest extends FormRequest
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
            'file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ];
    }
}
