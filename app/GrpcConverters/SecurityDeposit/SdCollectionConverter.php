<?php

namespace App\GrpcConverters\SecurityDeposit;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\SecurityDeposit\SdAttributeResponse;
use Proto\SecurityDeposit\SdCollectionMessage;

class SdCollectionConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertTOArray(?SdCollectionMessage $sdCollection): ?array
    {
        if ($sdCollection === null) {
            return null;
        }

        // TODO REVERSAL DATE

        $sdAttribute = $sdCollection->getSdAttribute();
        $sdAttributeArray = [];
        foreach ($sdAttribute as $attribute) {
            $sdAttributeArray[] = self::attributeConvertToArray($attribute);
        }

        return [
            'sd_collection_id' => $sdCollection->getSdCollectionId(),
            'sd_demand_id' => $sdCollection->getSdDemandId(),
            'collection_date' => $sdCollection->getCollectionDate(),
            'payment_mode_id' => $sdCollection->getPaymentModeId(),
            'collection_amount' => $sdCollection->getCollectionAmount(),
            'receipt_number' => $sdCollection->hasReceiptNumber() ? $sdCollection->getReceiptNumber() : null,
            'collected_at' => $sdCollection->hasCollectedAt() ? $sdCollection->getCollectedAt() : null,
            'collected_by' => $sdCollection->hasCollectedBy() ? $sdCollection->getCollectedBy() : null,
            'transaction_ref' => $sdCollection->hasTransactionRef() ? $sdCollection->getTransactionRef() : null,
            'remarks' => $sdCollection->hasRemarks() ? $sdCollection->getRemarks() : null,
            'status_id' => $sdCollection->getStatusId(),
            'is_active' => $sdCollection->getIsActive(),
            'reversal_reason' => $sdCollection->hasReversalReason() ? $sdCollection->getReversalReason() : null,
            'reversal_date' => $sdCollection->hasReversalDate() ? $sdCollection->getReversalDate() : null,
            'reversed_by' => $sdCollection->hasReversedBy() ? $sdCollection->getReversedBy() : null,
            'payment_mode' => $sdCollection->hasPaymentMode() ?
                ParameterValueProtoConvertor::convertToArray($sdCollection->getPaymentMode()) :
                null,
            'status' => $sdCollection->hasStatus() ?
                ParameterValueProtoConvertor::convertToArray($sdCollection->getStatus()) :
                null,
            'sd_attributes' => $sdAttributeArray,
        ];
    }

    public static function attributeConvertToArray(?SdAttributeResponse $attribute): ?array
    {
        if ($attribute === null) {
            return null;
        }

        return [
            'attribute_id' => $attribute->getAttributeId(),
            'sd_collection_id' => $attribute->getSdCollectionId(),
            'attribute_definition_id' => $attribute->getAttributeDefinitionId(),
            'attribute_value' => $attribute->getAttributeValue(),
            'mime_type' => $attribute->hasMimeType() ? $attribute->getMimeType() : null,
            'created_by' => $attribute->hasCreatedBy() ? $attribute->getCreatedBy() : null,
            'updated_by' => $attribute->hasUpdatedBy() ? $attribute->getUpdatedBy() : null,
            'attribute_definition' => $attribute->hasAttributeDefinition() ?
                          ParameterValueProtoConvertor::convertToArray($attribute->getAttributeDefinition()) :
                          null,
        ];
    }
}
