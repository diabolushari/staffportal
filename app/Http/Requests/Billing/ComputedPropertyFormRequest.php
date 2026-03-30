<?php

namespace App\Http\Requests\Billing;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ComputedPropertyFormRequest extends Data
{
    public function __construct(
        public ?int $computedPropertyId,
        public int $billingRuleId,
        public string $name,
        public string $effectiveStart,
        public ?string $effectiveEnd,
        public array $calculations
    ) {}
}
