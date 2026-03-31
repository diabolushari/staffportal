<?php

namespace App\Http\Requests\Billing;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BillingRuleRequest extends Data
{
    public function __construct(
        public ?int $billingRuleId,
        public string $name,
        public string $effectiveStart,
        public ?string $effectiveEnd,
        public UploadedFile $billingRule,
    ) {}

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'effective_start' => ['required', 'date'],
            'billing_rule' => ['required', 'file', 'mimes:json'],
        ];
    }

    /**
     * Validate JSON structure inside the uploaded file.
     */
    public function validateJsonStructure(): void
    {
        $json = json_decode($this->billingRule->get() ?? '', true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw ValidationException::withMessages([
                'billing_rule' => 'Invalid JSON format in uploaded file.',
            ]);
        }

        // Required top-level keys
        $requiredKeys = ['computed_properties', 'charge_heads'];

        foreach ($requiredKeys as $key) {
            if (! array_key_exists($key, $json)) {
                throw ValidationException::withMessages([
                    'billing_rule' => "Missing required key '{$key}' in JSON file.",
                ]);
            }

            if (! is_array($json[$key])) {
                throw ValidationException::withMessages([
                    'billing_rule' => "The '{$key}' must be an array in the JSON file.",
                ]);
            }
        }
    }
}
