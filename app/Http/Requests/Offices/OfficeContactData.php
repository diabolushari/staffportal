<?php

namespace App\Http\Requests\Offices;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class OfficeContactData extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public string $name,

        #[Nullable, Max(255)]
        public ?string $designation,

        #[Nullable, Max(20)]
        public ?string $phone,

        #[Nullable, Email, Max(255)]
        public ?string $email,

        #[Nullable, Max(50)]
        public ?string $employee_id,
    ) {}
}
