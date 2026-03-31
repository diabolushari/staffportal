<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ConnectionMeterStatusFormRequest extends Data
{
    public function __construct(
        public int $relId,
        public int $statusId,
        public string $noticeDate,
        public ?string $intimationDate,

    ) {}
}
