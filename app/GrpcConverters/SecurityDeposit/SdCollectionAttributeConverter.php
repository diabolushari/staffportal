<?php

namespace App\GrpcConverters\SecurityDeposit;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\SecurityDeposit\SdAttributeResponse;
use Proto\SecurityDeposit\SdCollectionAttributeMessage;

class SdCollectionAttributeConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertTOArray(?SdCollectionAttributeMessage $sdCollectionAttribute): ?array
    {
        if ($sdCollectionAttribute === null) {
            return null;
        }

        return [
            'attribute_id' => $sdCollectionAttribute->getAttributeId(),
            'sd_collection_id' => $sdCollectionAttribute->getSdCollectionId(),
            'attribute_definition_id' => $sdCollectionAttribute->getAttributeDefinitionId(),
            'attribute_value' => $sdCollectionAttribute->getAttributeValue(),
            'is_verified' => $sdCollectionAttribute->getIsVerified(),
            'verified_by' => $sdCollectionAttribute->hasVerifiedBy() ? $sdCollectionAttribute->getVerifiedBy() : null,
            'verified_date' => $sdCollectionAttribute->hasVerifiedDate() ? $sdCollectionAttribute->getVerifiedDate() : null,
            'expiry_date' => $sdCollectionAttribute->hasExpiryDate() ? $sdCollectionAttribute->getExpiryDate() : null,
            'document_path' => $sdCollectionAttribute->hasDocumentPath() ? $sdCollectionAttribute->getDocumentPath() : null,

        ];
    }

    public static function sdAttributeToArray(?SdAttributeResponse $sdAttribute): ?array
    {
        if ($sdAttribute === null) {
            return null;
        }

        return [
            'attribute_id' => $sdAttribute->getAttributeId(),
            'sd_collection_id' => $sdAttribute->getSdCollectionId(),
            'attribute_definition_id' => $sdAttribute->getAttributeDefinitionId(),
            'attribute_value' => $sdAttribute->getAttributeValue(),
            'mime_type' => $sdAttribute->getMimeType(),
            'updated_by' => $sdAttribute->getUpdatedBy() ? $sdAttribute->getUpdatedBy() : null,
            'attribute_definition' => $sdAttribute->hasAttributeDefinition() ?
                ParameterValueProtoConvertor::convertToArray($sdAttribute->getAttributeDefinition()) :
                null,
        ];
    }
}
