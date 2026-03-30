<?php

namespace App\GrpcConverters\MetaData;

use Proto\Parameters\ParameterDefinitionProto;

class ParameterDefinitionGrpcConverter
{
    public static function convertToArray(?ParameterDefinitionProto $parameterDefinition): ?array
    {
        if ($parameterDefinition == null) {
            return null;
        }
        $domain = $parameterDefinition->getDomain();
        if ($domain != null) {
            $domain = ParameterDomainGrpcConverter::convertToArray($domain);
        }

        return [
            'id' => $parameterDefinition->getId(),
            'parameter_name' => $parameterDefinition->getParameterName(),
            'attribute1_name' => $parameterDefinition->getAttribute1Name(),
            'attribute2_name' => $parameterDefinition->getAttribute2Name(),
            'attribute3_name' => $parameterDefinition->getAttribute3Name(),
            'attribute4_name' => $parameterDefinition->getAttribute4Name(),
            'attribute5_name' => $parameterDefinition->getAttribute5Name(),
            'is_effective_date_driven' => $parameterDefinition->getIsEffectiveDateDriven(),
            'domain' => $domain,
            'domain_id' => $parameterDefinition->getDomainId(),
        ];
    }
}
