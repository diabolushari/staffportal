<?php

namespace App\GrpcConverters\GeneratingStation;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\GeneratingStation\GeneratingStationAttributeResponse;

class GeneratingStationAttributeConverter
{
    /**
     * Convert GeneratingStationAttributeResponse proto to array.
     */
    public static function convertToArray(
        ?GeneratingStationAttributeResponse $attribute
    ): ?array {

        if ($attribute === null) {
            return null;
        }

        return [
            'attribute_id' => $attribute->getAttributeId(),
            'station_id' => $attribute->getStationId(),
            'attribute_definition_id' => $attribute->getAttributeDefinitionId(),
            'attribute_value' => $attribute->getAttributeValue(),
            'mime_type' => $attribute->hasMimeType()
                            ? $attribute->getMimeType()
                            : null,
            'created_by' => $attribute->hasCreatedBy()
                ? $attribute->getCreatedBy()
                : null,

            'updated_by' => $attribute->hasUpdatedBy()
                ? $attribute->getUpdatedBy()
                : null,

            'deleted_by' => $attribute->hasDeletedBy()
                ? $attribute->getDeletedBy()
                : null,

            'attribute_definition' => $attribute->hasAttributeDefinition()
                ? ParameterValueProtoConvertor::convertToArray(
                    $attribute->getAttributeDefinition()
                )
                : null,
        ];
    }
}