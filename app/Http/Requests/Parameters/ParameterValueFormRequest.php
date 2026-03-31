<?php

namespace App\Http\Requests\Parameters;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ParameterValueFormRequest extends Data
{
    public function __construct(
        public string $parameterCode,
        public string $parameterValue,
        public int $definitionId,
        public bool $isActive,
        public ?int $parentParameterValue,
        public ?string $attribute1Value,
        public ?string $attribute2Value,
        public ?string $attribute3Value,
        public ?string $attribute4Value,
        public ?string $attribute5Value,
        public ?string $effectiveStartDate,
        public ?string $effectiveEndDate,
        public ?int $sortPriority = 0,
        public ?string $notes = null,
    ) {}
}
