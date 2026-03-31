<?php

namespace App\Http\Requests\Calendar;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class CalendarUpdateFormRequest extends Data
{
    public function __construct(
        public bool $isHoliday,
        public bool $isWeekend,
        public ?string $remarks,
    ) {}
}
