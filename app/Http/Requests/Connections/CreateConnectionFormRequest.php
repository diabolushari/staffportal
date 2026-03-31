<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class CreateConnectionFormRequest extends Data
{
    public function __construct(
        public int $connectionTypeId,
        public int $connectionStatusId,
        public string $connectedDate,
        public string $applicationNo,
        public int $serviceOfficeCode,
        public int $adminOfficeCode,
        public int $voltageTypeId,
        public float $contractDemandKwVal,
        public int $tariffTypeId,
        public int $primaryPurposeId,
        public int $connectionCategoryId,
        public int $connectionSubcategoryId,
        public int $billingProcessId,
        public int $billingSideId,
        public ?int $openAccessTypeId,
        public int $meteringTypeId,
        public int $phaseTypeId,
        public ?string $consumerLegacyCode,
        public float $powerLoadKwVal,
        public float $lightLoadKwVal,
        public bool $otherconsFlag,
        public ?string $remarks,
        public bool $powerIntensive,
        public bool $excessDemand,
        #[Min(1)]
        public int $noOfMainMeters,
        public array $indicators,
        public array $generationTypes,
        public ?array $otherPurposes,


    ) {}
}
