<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterTransformerForm extends Data
{
    public function __construct(
        public ?int $versionId,
        public int $ctptId,
        public int $statusId,
        public ?int $changeReasonId,
        public ?string $faultyDate,
        public ?string $ctptEnergiseDate,
        public ?string $ctptChangeDate,
    ) {}
}
