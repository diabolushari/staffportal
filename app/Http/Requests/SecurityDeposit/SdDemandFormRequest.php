<?php

namespace App\Http\Requests\SecurityDeposit;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SdDemandFormRequest extends Data
{
    public function __construct(
        public int $connectionId,
        public int $demandTypeId,
        public ?int $calculationBasicId,
        public float $totalSdAmount,
        public string $applicableFrom,
        public ?string $applicableTo,
        public bool $isActive,
        public int $chargeHeadDefinitionId,
    ) {}
}
