<?php

namespace App\Http\Requests\SystemModule;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SystemModuleFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
    ) {}
}
