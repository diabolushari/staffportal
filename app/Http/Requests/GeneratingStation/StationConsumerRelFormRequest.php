<?php

namespace App\Http\Requests\GeneratingStation;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class StationConsumerRelFormRequest extends Data
{
    public function __construct(
        public int $stationId,
        public int $stationConnectionId,
        public int $consumerConnectionId,
        public ?int $consumerTypeId,
        public int $stationPriorityOrder,
        public string $effectiveStart,
        public ?string $effectiveEnd,
    ) {}
}