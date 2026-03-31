<?php

namespace App\GrpcConverters\Billing;

use App\Services\utils\StructConverter;
use Proto\Billing\DemandMessage;

class DemandProtoConverter
{
    public static function convertToArray(DemandMessage $demand): array
    {
        $computedProperties = $demand->getComputedProperties();
        if ($computedProperties != null) {
            $list = [];
            foreach ($computedProperties as $computedProperty) {
                $list[] = StructConverter::convert($computedProperty);
            }
            $computedProperties = $list;
        }

        $chargeHeads = $demand->getChargeHeads();
        if ($chargeHeads != null) {
            $list = [];
            foreach ($chargeHeads as $chargeHead) {
                $list[] = StructConverter::convert($chargeHead);
            }
            $chargeHeads = $list;
        }

        $demandDetails = $demand->getDemandDetails();
        if ($demandDetails != null) {
            $list = [];
            foreach ($demandDetails as $detail) {
                $list[] = DemandDetailProtoConverter::convertToArray($detail);
            }
            $demandDetails = $list;
        }

        return [
            'id' => $demand->getId(),
            'bill_id' => $demand->getBillId(),
            'computed_properties' => $computedProperties,
            'charge_heads' => $chargeHeads,
            'created_ts' => $demand->getCreatedTs(),
            'updated_ts' => $demand->getUpdatedTs(),
            'deleted_ts' => $demand->getDeletedTs(),
            'created_by' => $demand->getCreatedBy(),
            'updated_by' => $demand->getUpdatedBy(),
            'deleted_by' => $demand->getDeletedBy(),
            'demand_details' => $demandDetails,
        ];
    }
}
