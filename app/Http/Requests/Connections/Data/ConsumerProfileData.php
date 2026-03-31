<?php

namespace App\Http\Requests\Connections\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ConsumerProfileData extends Data
{
    /**
     * @param  string[]|null  $manufacturingInfo
     * @param  string[]|null  $taxInfo
     * @param  string[]|null  $identityInfo
     * @param  string[]|null  $applicationInfo
     */
    public function __construct(
        // Required fields
        public int $consumerTypeId,
        public string $organisationName,
        public string $applicantCode,
        public bool $incomeTaxWithholdingInd,
        public bool $gstWithholdingInd,
        public bool $seasonalInd,
        public bool $licenseInd,
        public bool $openAccessInd,
        public int $createdBy,

        // Optional identification and info fields
        public ?string $consumerPan,
        public ?string $consumerTan,
        public ?string $consumerCin,
        public ?string $consumerGstin,

        public ?array $manufacturingInfo,
        public ?array $taxInfo,
        public ?array $identityInfo,
        public ?array $applicationInfo,
    ) {}
}
