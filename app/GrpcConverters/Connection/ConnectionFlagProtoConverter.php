<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Services\utils\DateTimeConverter;
use Illuminate\Support\Facades\Auth;
use Proto\Connections\ConnectionFlagFormRequest;
use Proto\Connections\ConnectionFlagMessage;

class ConnectionFlagProtoConverter
{
    public static function convertToArray(ConnectionFlagMessage $flag): array
    {
        return [
            'id' => $flag->getId(),
            'connection_id' => $flag->getConnectionId(),
            'flag_id' => $flag->getFlagId(),
            'flag' => ParameterValueProtoConvertor::convertToArray($flag->getFlag()),
            'effective_start' => $flag->getEffectiveStart() ? DateTimeConverter::convertTimestampToString($flag->getEffectiveStart()) : null,
            'effective_end' => $flag->getEffectiveEnd() ? DateTimeConverter::convertTimestampToString($flag->getEffectiveEnd()) : null,
            'is_current' => $flag->getIsCurrent(),
            'created_by' => $flag->getCreatedBy(),
            'updated_by' => $flag->getUpdatedBy(),
        ];
    }

    public static function convertToFormRequest(array $flag): ConnectionFlagFormRequest
    {
        $formRequest = new ConnectionFlagFormRequest();

        $formRequest->setConnectionId($flag['connection_id']);
        $formRequest->setFlagId($flag['flag_id']);
        $formRequest->setValue($flag['value']);
        $user = Auth::user();
        if ($user) {
            $formRequest->setCreatedBy($user->id);
        }
        return $formRequest;
    }
}
