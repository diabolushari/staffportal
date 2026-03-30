<?php

namespace App\Http\Requests\Tariff;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class TariffConfigFormRequest extends Data
{
    public function __construct(
        public ?int $tariffConfigId,
        public int $tariffOrderId,
        public int $connectionTariff,
        public int $consumptionLowerLimit,
        public ?int $consumptionUpperLimit,
        public float $demandChargeKva,
        public float $energyChargeKwh,
        public string $effectiveStart,
        public string $effectiveEnd,
    ) {}
}
