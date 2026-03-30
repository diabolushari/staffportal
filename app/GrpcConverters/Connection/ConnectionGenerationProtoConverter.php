<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Illuminate\Support\Facades\Auth;
use Proto\Connections\ConnectionGenerationFormRequest;
use Proto\Connections\ConnectionGenerationTypeMessage;

class ConnectionGenerationProtoConverter
{
    /**
     * Convert ConnectionGenerationTypeMessage proto to array.
     */
    public static function convertToArray(?ConnectionGenerationTypeMessage $generationType): ?array
    {
        if ($generationType === null) {
            return null;
        }

        return [
            'id' => $generationType->getId(),
            'connection_id' => $generationType->getConnectionId(),
            'generation_type_id' => $generationType->getGenerationTypeId(),
            'generation_sub_type_id' => $generationType->getGenerationSubTypeId(),
            'generation_type' => ParameterValueProtoConvertor::convertToArray($generationType->getGenerationType()),
            'generation_sub_type' => ParameterValueProtoConvertor::convertToArray($generationType->getGenerationSubType()),
            'effective_start' => $generationType->getEffectiveStart()
                ? $generationType->getEffectiveStart()->toDateTime()->format('Y-m-d')
                : null,
            'effective_end' => $generationType->getEffectiveEnd()
                ? $generationType->getEffectiveEnd()->toDateTime()->format('Y-m-d')
                : null,
            'is_current' => $generationType->getIsCurrent(),
            'created_by' => $generationType->getCreatedBy() ?: null,
            'updated_by' => $generationType->getUpdatedBy() ?: null,

            // Parameter value expansion
            'generation_type' => ParameterValueProtoConvertor::convertToArray(
                $generationType->getGenerationType()
            ),
        ];
    }

    public static function convertToFormRequest(array $generationType): ConnectionGenerationFormRequest
    {
        $formRequest = new ConnectionGenerationFormRequest();
        $formRequest->setValue($generationType['value']);
        $formRequest->setConnectionId($generationType['connection_id']);
        $formRequest->setGenerationTypeId($generationType['generation_type_id']);
        if (isset($generationType['generation_sub_type_id'])) {
            $formRequest->setGenerationSubTypeId($generationType['generation_sub_type_id']);
        }
        $user = Auth::user();
        if ($user) {
            $formRequest->setCreatedBy($user->id);
        }
        return $formRequest;
    }
}
