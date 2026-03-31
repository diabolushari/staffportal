<?php

namespace App\Http\Requests\Consumers;

use Spatie\LaravelData\Data;

class GeoRegionFormRequest extends Data
{
    public function __construct(
        public int $regionId,
        public string $regionName,
        public int $regionClassificationId,
        public int $regionTypeId,
        public ?int $parentRegionId,
        public ?array $regionAttributes,
    ) {}
}
