<?php

namespace App\Services\Grpc;

use stdClass;

class StdClassConverter
{
    /**
     * Convert stdClass to object
     *
     * @param  stdClass  $status
     * @return object{code: int, details?: string}
     */
    public static function convertToObject(stdClass $status)
    {
        $statusObj = (object) [
            'code' => (int) $status->code,
            'details' => $status->details ?? null,
        ];
        return $statusObj;
    }
}
