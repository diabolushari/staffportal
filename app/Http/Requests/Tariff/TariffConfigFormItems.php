<?php

namespace App\Http\Requests\Tariff;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class TariffConfigFormItems extends Data
{
    public function __construct(
        public int $connectionTariff,
        public int $consumptionLowerLimit,
        public int $consumptionUpperLimit,
        public int $demandChargeKva,
        public int $energyChargeKwh,
        public string $effectiveStart,
        public string $effectiveEnd,
    ) {}
}
