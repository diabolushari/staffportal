<?php

namespace App\Http\Requests\MeterProfileParameter;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterProfileParameterFormRequest extends Data
{
    public function __construct(
        public int $profileId,
        public string $name,
        public string $displayName,
        public bool $isCumulative,
        public bool $isExport,
    ) {}
}
