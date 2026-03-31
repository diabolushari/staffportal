<?php

namespace App\GrpcConverters\Billing;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Services\utils\DateTimeConverter;
use Proto\Billing\DemandDetailMessage;

class DemandDetailProtoConverter
{
    public static function convertToArray(DemandDetailMessage $detail): array
    {
        return [
            'id' => $detail->getId(),
            'demand_id' => $detail->getDemandId(),
            'charge_head_id' => $detail->getChargeHeadId(),
            'amount' => $detail->getAmount(),
            'created_ts' => $detail->hasCreatedTs() ? DateTimeConverter::convertTimestampToString($detail->getCreatedTs()) : null,
            'updated_ts' => $detail->hasUpdatedTs() ? DateTimeConverter::convertTimestampToString($detail->getUpdatedTs()) : null,
            'deleted_ts' => $detail->hasDeletedTs() ? DateTimeConverter::convertTimestampToString($detail->getDeletedTs()) : null,
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'deleted_by' => $detail->getDeletedBy(),
            'charge_head' => $detail->hasChargeHead() ? ParameterValueProtoConvertor::convertToArray($detail->getChargeHead()) : null,
        ];
    }
}
