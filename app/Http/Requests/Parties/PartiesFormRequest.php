<?php

namespace App\Http\Requests\Parties;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class PartiesFormRequest extends Data
{
    public function __construct(
        public ?int $versionId,
        public ?int $partyId,
        public ?int $partyCode,
        public ?string $partyLegacyCode,
        public ?string $name,
        public ?int $partyTypeId,
        public ?int $statusId,
        public ?string $effectiveStart,
        public ?string $effectiveEnd,
        public ?bool $isCurrent,
        public ?int $createdBy,
        public ?int $updatedBy,
        // Contact information fields
        public ?int $mobileNumber,
        public ?int $telephoneNumber,
        public ?string $emailAddress,
        public ?string $address,
        public ?int $faxNumber,
    ) {}
}
