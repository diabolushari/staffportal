<?php

namespace App\Http\Requests\VariableRate;


use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class VariableRateFormRequest extends Data
{
    public function __construct(
        public ?int $id,
        public int $variableNameId,
        public float $rate,
        public string $effectiveStart,
        public ?string $effectiveEnd,
    ) {}
}
