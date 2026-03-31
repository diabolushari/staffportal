<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ConnectionGreenEnergyFormRequest extends Data
{
    public function __construct(
        public ?int $id,
        public int $connectionId,
        public int $greenEnergyTypeId,
        public ?int $agreementAuthorityId,
        public float $percentage,
        public string $effectiveStart,
        public ?string $effectiveEnd,
        public ?string $remarks,
        public bool $isActive,
    ) {}
}
