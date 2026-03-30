<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ConnectionPartiesMappingFormRequest extends Data
{
    public function __construct(
        public ?int $versionId,
        public int $partyId,
        public int $connectionId,
        public int $partyRelationTypeId,
        public string $effectiveStart,
        public ?string $effectiveEnd,

    ) {}
}
