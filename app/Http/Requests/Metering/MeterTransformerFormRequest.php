<?php

namespace App\Http\Requests\Metering;

use Illuminate\Foundation\Http\FormRequest;

class MeterTransformerFormRequest extends FormRequest
{
    public function rules(): array
    {
        // Basic validation rules
        $rules = [
            'ctpt_serial' => 'required|string|max:50',
            'ownership_type_id' => 'required|integer',
            'accuracy_class_id' => 'required|integer',
            'burden_id' => 'required|integer',
            'make_id' => 'required|integer',
            'type_id' => 'required|integer',
            'ratio_primary_value' => 'nullable|string|max:20',
            'ratio_secondary_value' => 'nullable|string|max:20',
            'manufacture_date' => 'nullable|date',

        ];

        return $rules;
    }

    public function authorize(): bool
    {
        return true; // or implement your auth logic
    }
}
