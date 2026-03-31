<?php

namespace App\Http\Requests\BillingGroup;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BillingGroupFormRequest extends Data
{
    public function __construct(
        public ?int $versionId,
        public ?int $billingGroupId,
        #[Max(255)]
        public string $name,
        public string $description,
    ) {}
}