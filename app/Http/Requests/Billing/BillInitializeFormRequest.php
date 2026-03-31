<?php

namespace App\Http\Requests\Billing;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BillInitializeFormRequest extends Data
{
    public function __construct(
        public int $billingGroupId,
        public array $connectionIds,
        public string $billMonthYear,
        public string $readingMonthYear,
        public string $billDate,
    ) {}
}
