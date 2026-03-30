<?php

namespace App\Http\Requests\SecurityDeposit;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SdCollectionFormRequest extends Data
{
    public function __construct(

        public int $sdDemandId,
        public int $connectionId,
        public int $sdRegisterId,
        public string $collectionDate,
        public int $paymentModeId,
        public string $collectionAmount,
        public bool $isActive,
        public ?string $receiptNumber,
        public ?string $collectedAt,
        public ?string $collectedBy,
        public ?string $reversalReason,
        public ?string $reversedDate,
        public ?string $reversedBy,
        public ?string $transactionRef,
        public ?string $remarks,
        public int $statusId,
        /** @var DataCollection<AttributeFormRequest> */
        public ?array $attributeData,
    ) {}
}
