<?php

namespace App\Http\Requests\GeneratingStation;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class GeneratingStationFormRequest extends Data
{
    public function __construct(

        public ?int $connectionId,

        public string $stationName,
        public int $generationStatusId,
        public float $installedCapacity,

        public int $generationTypeId,
        public int $voltageCategoryId,
        public int $plantTypeId,

        public string $commissioningDate,

        public string $addressLine1,
        public ?string $addressLine2,
        public string $cityTownVillage,
        public int $pincode,
        public int $districtId,
        public int $stateId,

        public bool $isCurrent,

        /** @var AttributeFormRequest[] */
        public ?array $attributeData,
    ) {}
}
