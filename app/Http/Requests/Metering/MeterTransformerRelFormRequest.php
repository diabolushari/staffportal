<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterTransformerRelFormRequest extends Data
{
    public function __construct(
        public ?int $versionId,
        public int $ctptId,
        public int $meterId,
        public int $connectionId,
        public ?string $faultyDate,
        public string $ctptEnergiseDate,
        public ?string $ctptChangeDate,
        public ?int $statusId,
        public ?int $changeReasonId,
        public ?string $createdTs,
        public ?string $updatedTs,
        public ?int $createdBy,
        public ?int $updatedBy,
        public ?bool $isActive,
    ) {}
}
