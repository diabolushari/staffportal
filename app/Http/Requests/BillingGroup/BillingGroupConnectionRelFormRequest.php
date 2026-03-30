<?php

namespace App\Http\Requests\BillingGroup;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BillingGroupConnectionRelFormRequest extends Data
{
    public function __construct(
        public int $connection_id,
        public int $billing_group_id,
    ) {}
}