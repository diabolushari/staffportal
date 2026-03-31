<?php

declare(strict_types=1);

namespace App\GrpcConverters\variablerate;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\VariableRate\VariableRateFormRequest;
use Proto\Variablerate\VariableRateFormMessage;
use Proto\Variablerate\VariableRateMessage;

class VariableRateConverter
{


    /**
     * Convert VariableRateMessage proto to array.
     *
     * @return array{
     *     id: int|string,
     *     variable_name_id: int,
     *     rate: float,
     *     effective_start: string,
     *     effective_end: string,
     *     created_ts: string,
     *     updated_ts: string,
     *     deleted_ts: string,
     *     created_by: int,
     *     updated_by: int,
     *     deleted_by: int,
     *     is_active: bool
     * }|null
     */
    public static function convertToArray(?VariableRateMessage $variableRate): ?array
    {
        if ($variableRate === null) {
            return null;
        }
        $variableName = $variableRate->getVariableName();
        if ($variableName != null) {
            $variableName = ParameterValueProtoConvertor::convertToArray($variableName);
        }
        return [
            'id' => $variableRate->getId(),
            'variable_name_id' => $variableRate->getVariableNameId(),
            'rate' => $variableRate->getRate(),
            'effective_start' => $variableRate->getEffectiveStart(),
            'effective_end' => $variableRate->getEffectiveEnd(),
            'created_ts' => $variableRate->getCreatedTs(),
            'updated_ts' => $variableRate->getUpdatedTs(),
            'deleted_ts' => $variableRate->getDeletedTs(),
            'created_by' => $variableRate->getCreatedBy(),
            'updated_by' => $variableRate->getUpdatedBy(),
            'deleted_by' => $variableRate->getDeletedBy(),
            'is_active' => $variableRate->getIsActive(),
            'variable_name' => $variableName,
        ];
    }


    public static function convertToProto(?VariableRateFormRequest $variableRate): ?VariableRateFormMessage
    {
        if ($variableRate === null) {
            return null;
        }
        $variableRateProto = new VariableRateFormMessage();
        if ($variableRate->id !== null) {
            $variableRateProto->setId($variableRate->id);
        }
        $variableRateProto->setVariableNameId($variableRate->variableNameId);
        $variableRateProto->setRate($variableRate->rate);
        $variableRateProto->setEffectiveStart($variableRate->effectiveStart);
        if ($variableRate->effectiveEnd !== null) {
            $variableRateProto->setEffectiveEnd($variableRate->effectiveEnd);
        }
        return $variableRateProto;
    }
}
