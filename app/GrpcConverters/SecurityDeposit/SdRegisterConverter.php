<?php

namespace App\GrpcConverters\SecurityDeposit;

use App\GrpcConverters\Billing\ChargeHeadDefinitionConverter;
use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\Consumers\SdRegisterMessage;

class SdRegisterConverter
{
    /**
     * Convert SdRegisterMessage proto to array.
     */
    public static function convertToArray(?SdRegisterMessage $sdRegister): ?array
    {
        if ($sdRegister === null) {
            return null;
        }

        return [
            'sd_register_id' => $sdRegister->hasSdRegisterId() ? $sdRegister->getSdRegisterId() : null,
            'sd_demand_id' => $sdRegister->getSdDemandId(),
            'connection_id' => $sdRegister->getConnectionId(),
            'sd_type_id' => $sdRegister->getSdTypeId(),
            'occupancy_type_id' => $sdRegister->getOccupancyTypeId(),
            'period_from' => $sdRegister->getPeriodFrom(),
            'period_to' => $sdRegister->getPeriodTo(),
            'generated_date' => $sdRegister->getGeneratedDate(),
            'sd_amount' => $sdRegister->getSdAmount(),
            'rate_or_basis' => $sdRegister->getRateOrBasis(),
            'bg_expiry_date' => $sdRegister->hasBgExpiryDate() ? $sdRegister->getBgExpiryDate() : null,
            'bg_renewal_due_date' => $sdRegister->hasBgRenewalDueDate() ? $sdRegister->getBgRenewalDueDate() : null,
            'is_fully_settled' => $sdRegister->getIsFullySettled(),
            'settled_date' => $sdRegister->hasSettledDate() ? $sdRegister->getSettledDate() : null,
            'is_active' => $sdRegister->getIsActive(),
            'created_by' => $sdRegister->hasCreatedBy() ? $sdRegister->getCreatedBy() : null,
            'updated_by' => $sdRegister->hasUpdatedBy() ? $sdRegister->getUpdatedBy() : null,
            'sd_type' => $sdRegister->hasSdType() ?
                         ChargeHeadDefinitionConverter::convertToArray($sdRegister->getSdType()) : null,
            'occupancy_type' => $sdRegister->hasOccupancyType() ?
                         ParameterValueProtoConvertor::convertToArray($sdRegister->getOccupancyType()) : null,
            'sd_demand' => $sdRegister->hasSdDemand() ?
                         SdDemandConverter::convertToArray($sdRegister->getSdDemand()) : null,

        ];
    }
}
