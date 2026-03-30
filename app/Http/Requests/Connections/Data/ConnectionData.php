<?php

namespace App\Http\Requests\Connections\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ConnectionData extends Data
{
    /**
     * @param  string[]|null  $connectionAttribs
     * @param  string[]|null  $purposesInfo
     * @param  string[]|null  $connectedLoadInfo
     * @param  string[]|null  $multiSourceInfo
     */
    public function __construct(
        // Required fields for creating a connection
        public int $connectionTypeId,
        public int $consumerNum,
        public int $connectionStatusId,
        public string $connectedDate,
        public int $serviceOfficeCode,
        public int $adminOfficeCode,
        public int $voltageId,
        public float $contractDemandKvaVal,
        public float $connectedLoadKwVal,
        public int $tariffId,
        public int $primaryPurposeId,
        public int $connectionCategoryId,
        public int $connectionSubcategoryId,
        public int $billingProcessId,
        public bool $solarIndicator,
        public int $openAccessTypeId,
        public int $meteringTypeId,
        public int $renewableTypeId,
        public bool $multiSourceIndicator,
        public bool $liveIndicator,
        public int $createdBy,

        // Optional Struct fields, passed as arrays
        public ?array $connectionAttribs,
        public ?array $purposesInfo,
        public ?array $connectedLoadInfo,
        public ?array $multiSourceInfo,
    ) {}
}
