<?php

namespace App\GrpcConverters\SecurityDeposit;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\Consumers\SdDemandStatusMessage;

class SdDemandStatusConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertToArray(?SdDemandStatusMessage $sdDemandStatus): ?array
    {
        if ($sdDemandStatus === null) {
            return null;
        }

        return [
            'status_log_id' => $sdDemandStatus->getStatusLogId(),
            'sd_demand_id' => $sdDemandStatus->getSdDemandId(),
            'sd_collection_id' => $sdDemandStatus->getSdCollectionId(),
            'status_id' => $sdDemandStatus->getStatusId(),
            'outstanding_amount' => $sdDemandStatus->getOutstandingAmount(),
            'is_gl_posted' => $sdDemandStatus->getIsGlPosted(),
            'gl_posted_ts' => $sdDemandStatus->hasGlPostedTs() ? $sdDemandStatus->getGlPostedTs() : null,
            'gl_posted_by' => $sdDemandStatus->hasGlPostedBy() ? $sdDemandStatus->getGlPostedBy() : null,
            'gl_reference' => $sdDemandStatus->hasGlReference() ? $sdDemandStatus->getGlReference() : null,
            'remarks' => $sdDemandStatus->hasRemarks() ? $sdDemandStatus->getRemarks() : null,
            'created_by' => $sdDemandStatus->hasCreatedBy() ? $sdDemandStatus->getCreatedBy() : null,
            'updated_by' => $sdDemandStatus->hasUpdatedBy() ? $sdDemandStatus->getUpdatedBy() : null,
            'sd_collection' => $sdDemandStatus->hasSdCollection() ? SdCollectionConverter::convertToArray($sdDemandStatus->getSdCollection()) : null,
            'status' => $sdDemandStatus->hasStatus() ? ParameterValueProtoConvertor::convertToArray($sdDemandStatus->getStatus()) : null,
        ];
    }
}
