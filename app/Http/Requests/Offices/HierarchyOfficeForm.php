<?php

namespace App\Http\Requests\Offices;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class HierarchyOfficeForm extends Data
{
    public function __construct(
        public string $hierarchyCode,
        public string $hierarchyName,
        public string $hierarchyDescription,
    ) {}
}
