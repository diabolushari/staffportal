<?php

namespace App\Http\Requests\Offices;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class OfficeHierarchyForm extends Data
{
    public function __construct(
        public int $parentOfficeCode,
        public int $officeCode,
        public string $hierarchyCode,
    ) {}
}
