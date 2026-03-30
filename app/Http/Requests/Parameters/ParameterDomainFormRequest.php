<?php

namespace App\Http\Requests\Parameters;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ParameterDomainFormRequest extends Data
{
    public function __construct(
        public string $domainName,
        public string $description,
        public string $domainCode,
        public int $managedByModule,

    ) {}
}
