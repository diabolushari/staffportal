<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\Consumers\GeoRegionMessage;

class GeoRegionProtoConverter
{
    public function __construct() {}

    public static function toArray(GeoRegionMessage $geoRegion): array
    {
        return [
            'id' => $geoRegion->getRegionId(),
            'name' => $geoRegion->getRegionName(),
            'type_id' => $geoRegion->getRegionTypeId(),
            'type' => ParameterValueProtoConvertor::convertToArray($geoRegion->getRegionType()),
            'classification_id' => $geoRegion->getRegionClassificationId(),
            'classification' => ParameterValueProtoConvertor::convertToArray($geoRegion->getRegionClassification()),
            'parent_id' => $geoRegion->getParentRegionId(),
            'created_at' => $geoRegion->getCreatedAt(),
            'updated_at' => $geoRegion->getUpdatedAt(),
            'created_by' => $geoRegion->getCreatedBy(),
            'updated_by' => $geoRegion->getUpdatedBy(),
        ];
    }
}
