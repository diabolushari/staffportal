<?php

namespace App\GrpcConverters\MetaData;

use Proto\Parameters\ParameterDomainProto;

class ParameterDomainGrpcConverter
{
    public static function convertToArray(ParameterDomainProto $parameterDomain): array
    {
        $systemModule = $parameterDomain->getSystemModule();
        if ($systemModule == null) {
            $systemModuleArray = [];
        } else {
            $systemModuleArray = [
                'id' => $systemModule->getId(),
                'name' => $systemModule->getName(),
            ];
        }

        return [
            'id' => $parameterDomain->getId(),
            'domain_name' => $parameterDomain->getDomainName(),
            'system_module' => $systemModuleArray,
        ];
    }
}
