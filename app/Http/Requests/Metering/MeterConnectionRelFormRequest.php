<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterConnectionRelFormRequest extends Data
{
    public function __construct(
        // Identifier for updates, can be added by the controller/route
        public ?int $relId,

        // Fields from the form, matching the protobuf request
        public int $meterId,
        public int $connectionId,
        public int $meterUseCategory,
        public int $meterProfileId,
        public int $timezoneTypeId,
        public int $meterStatusId,
        public ?int $sortPriority,
        public bool $isMeterReadingMandatory,
        public string $energiseDate,
        public ?string $meterMf,
        #[DataCollectionOf(MeterTransformerForm::class)]
        public ?DataCollection $meterTransformers = null

    ) {}
}
