<?php

namespace App\Http\Requests\Offices;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class UpdateOfficeContactsData extends Data
{
    /**
     * @param  DataCollection<int, OfficeContactData>  $contacts
     */
    public function __construct(
        #[Required]
        public int $office_code,
        #[DataCollectionOf(OfficeContactData::class)]
        public DataCollection $contacts,
        public ?int $updated_by = null,
    ) {}
}
