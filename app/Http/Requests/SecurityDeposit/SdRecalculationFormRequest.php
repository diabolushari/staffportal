<?php

namespace App\Http\Requests\SecurityDeposit;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SdRecalculationFormRequest extends Data
{
    public function __construct(
        public array $connectionIds,
        public string $startDate,
        public string $endDate,
        public ?int $triggerTypeId,
        public ?int $billingGroupId,
        public string $redirect,
    ) {}
}
