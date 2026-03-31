<?php

namespace App\Http\Requests\Parameters;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ParameterDefinitionFormRequest extends Data
{
    public function __construct(
        public string $parameterName,
        public ?string $attribute1Name,
        public ?string $attribute2Name,
        public ?string $attribute3Name,
        public ?string $attribute4Name,
        public ?string $attribute5Name,
        public bool $isEffectiveDateDriven,
        public int $domainId,
    ) {}
}
