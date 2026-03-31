<?php

namespace App\Http\Requests\Metering;

use Carbon\CarbonInterface;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterFormRequest extends Data
{
    public function __construct(
        public ?int $meterId,
        public string $meterSerial,
        public int $ownershipTypeId,
        public int $meterMakeId,
        public int $meterTypeId,
        public int $accuracyClassId,
        public int $dialingFactorId,
        public ?string $companySealNum,
        public int $digitCount,

        // Timestamps coming as strings or Carbon — Spatie will cast strings to Carbon if typed as CarbonInterface
        public ?string $manufactureDate,
        public ?string $supplyDate,

        public int $internalCtPrimary,
        public int $internalCtSecondary,
        public int $internalPtPrimary,
        public int $internalPtSecondary,

        public int $meterUnitId,
        public int $meterResetTypeId,
        public bool $smartMeterInd,
        public bool $bidirectionalInd,

        // Audit
        public ?int $createdBy,
        public ?int $updatedBy,

        // Additional fields from proto
        public int $meterPhaseId,
        public int $decimalDigitCount,
        public ?float $programmablePtRatio,
        public ?int $programmableCtRatio,
        // public float $meterMf,
        public ?int $warrantyPeriod,
        public ?int $meterConstant,
        public ?string $batchCode,

        public int $ctCount,
        public int $ptCount,

    ) {}
}
