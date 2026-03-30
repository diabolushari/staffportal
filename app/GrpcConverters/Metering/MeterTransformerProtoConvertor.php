<?php

declare(strict_types=1);

namespace App\GrpcConverters\Metering;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\Metering\MeterTransformerMessage;

class MeterTransformerProtoConvertor
{
    /**
     * Convert MeterTransformerMessage proto to array.
     *
     * @return array{
     *     meter_ctpt_id: int,
     *     ownership_type_id: int,
     *     accuracy_class_id: int,
     *     burden_id: int,
     *     make_id: int,
     *     type_id: int,
     *     ownership_type: array|null,
     *     accuracy_class: array|null,
     *     burden: array|null,
     *     make: array|null,
     *     type: array|null,
     *     ctpt_serial: string,
     *     ratio_primary_value: string,
     *     ratio_secondary_value: string,
     *     manufacture_date: string|null,
     *     created_ts: string|null,
     *     updated_ts: string|null,
     *     created_by: int,
     *     updated_by: int
     * }|null
     */
    public static function convertToArray(?MeterTransformerMessage $t): ?array
    {
        if ($t === null) {
            return null;
        }

        $manufactureDate = ($t->hasManufactureDate() && $t->getManufactureDate())
            ? $t->getManufactureDate()->toDateTime()->format('Y-m-d')
            : null;

        $createdTs = $t->getCreatedTs()
            ? $t->getCreatedTs()
            : null;

        $updatedTs = $t->getUpdatedTs()
            ? $t->getUpdatedTs()
            : null;

        return [
            'meter_ctpt_id' => $t->getMeterCtptId(),
            'ownership_type_id' => $t->getOwnershipTypeId(),
            'accuracy_class_id' => $t->getAccuracyClassId(),
            'burden_id' => $t->getBurdenId(),
            'make_id' => $t->getMakeId(),
            'type_id' => $t->getTypeId(),
            'is_edit' => $t->getIsEdit(),
            'ownership_type' => ParameterValueProtoConvertor::convertToArray($t->getOwnershipType()),
            'accuracy_class' => ParameterValueProtoConvertor::convertToArray($t->getAccuracyClass()),
            'burden' => ParameterValueProtoConvertor::convertToArray($t->getBurden()),
            'make' => ParameterValueProtoConvertor::convertToArray($t->getMake()),
            'type' => ParameterValueProtoConvertor::convertToArray($t->getType()),
            'ctpt_serial' => $t->getCtptSerial(),
            'ratio_primary_value' => $t->getRatioPrimaryValue(),
            'ratio_secondary_value' => $t->getRatioSecondaryValue(),
            'manufacture_date' => $manufactureDate,
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $t->getCreatedBy(),
            'updated_by' => $t->getUpdatedBy(),
        ];
    }
}
