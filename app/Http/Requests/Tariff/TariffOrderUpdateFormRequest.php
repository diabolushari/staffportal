<?php

namespace App\Http\Requests\Tariff;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class TariffOrderUpdateFormRequest extends Data
{
    public function __construct(
        public int $tariffOrderId,
        #[Max(255)]
        public string $orderDescriptor,
        public ?UploadedFile $referenceDocument,
        public string $publishedDate,
        public string $effectiveStart,
        public ?string $effectiveEnd,
        public ?string $referenceDocumentName,
    ) {}
}
