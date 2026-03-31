<?php

namespace App\Http\Requests\SecurityDeposit;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
final class SdAttributeFormRequest extends Data
{
    public function __construct(
        public int $attributeDefinitionId,
        public ?string $attributeValue,
        public ?UploadedFile $file,
    ) {}

   
}   
