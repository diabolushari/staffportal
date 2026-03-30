<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ConsumerFormRequest extends Data
{
    public function __construct(
        public ?int $addressId,
        public int $connectionId,
        public int $consumerTypeId,
        public ?string $organizationName,
        public int $consumerOwnershipTypeId,
        public ?string $consumerPan,
        public ?string $consumerTan,
        public ?string $consumerGstin,
        public ?string $virtualAccountNumber,
        public ?string $contactPerson,
        public string $consumerName,
        public ?int $departmentNameId,
        public string $addressLine1,
        public ?string $addressLine2,
        public string $cityTownVillage,
        public int $pincode,
        public int $districtId,
        public int $stateId,
        #[Required(), Rule('email')]
        public string $primaryEmail,
        #[Required, Rule('regex:/^(\\+91|91)?[6-9][0-9]{9}$/')]
        public string $primaryPhone,
        /** @var string[]|null */
        public ?array $otherAddresses,
        public ?array $contactFolio,
        public ?string $consumerCin,
        public ?array $indicators,


    ) {}
}
