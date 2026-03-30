<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class PurposeInfoFormRequest extends Data
{
    public function __construct(
        public ?int $id,
        public ?int $purposeId,
        public int $tariffId,
        public bool $isNonDps,
        public string $effectiveStart,
        public ?string $effectiveEnd,
        public ?array $mulitplePurposes,
    ) {}
}
