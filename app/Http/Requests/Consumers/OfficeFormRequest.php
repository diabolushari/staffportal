<?php

namespace App\Http\Requests\Consumers;

use App\Http\Requests\Offices\ParentOfficeForm;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class OfficeFormRequest extends Data
{
    public function __construct(
        public string $officeName,
        public int $officeCode,
        public string $officeDescription,
        public int $officeTypeId,
        #[DataCollectionOf(ParentOfficeForm::class)]
        public ?DataCollection $parentOffices,
    ) {}
}
