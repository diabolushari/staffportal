<?php

namespace App\GrpcConverters\Billing;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\Billing\ChargeHeadDefinitionMessage;

class ChargeHeadDefinitionConverter
{
    /**
     * @return array<string, mixed>
     */
    public static function convertToArray(ChargeHeadDefinitionMessage $definition): array
    {
        return [
            'version_id' => $definition->getVersionId(),
            'charge_head_definition_id' => $definition->getChargeHeadDefinitionId(),
            'charge_head_code' => $definition->getChargeHeadCode(),
            'name' => $definition->getName(),
            'description' => $definition->getDescription(),
            'category_id' => $definition->getCategoryId(),
            'status_id' => $definition->getStatusId(),
            'default_priority' => $definition->getDefaultPriority(),
            'is_interest_bearing' => $definition->hasIsInterestBearing() ? $definition->getIsInterestBearing() : null,
            'interest_calculation_method' => $definition->hasInterestCalculationMethod() ? $definition->getInterestCalculationMethod() : null,
            'gl_code' => $definition->hasGlCode() ? $definition->getGlCode() : null,
            'sop_mapping' => $definition->hasSopMapping() ? $definition->getSopMapping() : null,
            'effective_from' => $definition->hasEffectiveFrom() ? $definition->getEffectiveFrom() : null,
            'effective_to' => $definition->hasEffectiveTo() ? $definition->getEffectiveTo() : null,
            'is_active' => $definition->hasIsActive() ? $definition->getIsActive() : null,
            'created_ts' => $definition->hasCreatedTs() ? $definition->getCreatedTs() : null,
            'updated_ts' => $definition->hasUpdatedTs() ? $definition->getUpdatedTs() : null,
            'created_by' => $definition->hasCreatedBy() ? $definition->getCreatedBy() : null,
            'updated_by' => $definition->hasUpdatedBy() ? $definition->getUpdatedBy() : null,
            'deleted_ts' => $definition->hasDeletedTs() ? $definition->getDeletedTs() : null,
            'deleted_by' => $definition->hasDeletedBy() ? $definition->getDeletedBy() : null,
            'category' => $definition->hasCategory() ? ParameterValueProtoConvertor::convertToArray($definition->getCategory()) : null,
            'status' => $definition->hasStatus() ? ParameterValueProtoConvertor::convertToArray($definition->getStatus()) : null,
        ];
    }
}
