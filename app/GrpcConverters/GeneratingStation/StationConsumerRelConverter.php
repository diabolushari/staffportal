<?php

namespace App\GrpcConverters\GeneratingStation;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\GrpcConverters\GeneratingStation\GeneratingStationConverter;
use App\Http\Requests\GeneratingStation\StationConsumerRelFormRequest;
use Proto\GeneratingStation\StationConsumerRelMessage;
use Proto\GeneratingStation\CreateStationConsumerRelRequest;
use Proto\GeneratingStation\UpdateStationConsumerRelPriorityRequest;
use Proto\GeneratingStation\DeactivateStationConsumerRelRequest;
class StationConsumerRelConverter
{
    /**
     * Convert StationConsumerRelMessage proto to array
     */
    public static function convertToArray(?StationConsumerRelMessage $rel): ?array
    {
        if ($rel === null) {
            return null;
        }

        return [
            'version_id' => $rel->hasVersionId() ? $rel->getVersionId() : null,
            'rel_id' => $rel->hasRelId() ? $rel->getRelId() : null,

            'station_id' => $rel->getStationId(),
            'station_connection_id' => $rel->getStationConnectionId(),
            'consumer_connection_id' => $rel->getConsumerConnectionId(),

            'consumer_type_id' => $rel->getConsumerTypeId(),

            'consumer_priority_order' => $rel->getConsumerPriorityOrder(),
            'station_priority_order' => $rel->getStationPriorityOrder(),

            'effective_start' => $rel->getEffectiveStart(),
            'effective_end' => $rel->hasEffectiveEnd() ? $rel->getEffectiveEnd() : null,

            'is_current' => $rel->getIsCurrent(),

            'created_by' => $rel->hasCreatedBy() ? $rel->getCreatedBy() : null,
            'updated_by' => $rel->hasUpdatedBy() ? $rel->getUpdatedBy() : null,
            'deleted_by' => $rel->hasDeletedBy() ? $rel->getDeletedBy() : null,

            'station' => $rel->hasStation()
                ? GeneratingStationConverter::convertToArray($rel->getStation())
                : null,

            'station_connection' => $rel->hasStationConnection()
                ? ConnectionProtoConverter::convertToArray($rel->getStationConnection())
                : null,

            'consumer_connection' => $rel->hasConsumerConnection()
                ? ConnectionProtoConverter::convertToArray($rel->getConsumerConnection())
                : null,

            'consumer_type' => $rel->hasConsumerType()
                ? ParameterValueProtoConvertor::convertToArray($rel->getConsumerType())
                : null,
        ];
    }

    /**
     * Convert form request to CreateStationConsumerRelRequest
     */
    public function formToCreateGrpcRequest(
        StationConsumerRelFormRequest $request
    ): CreateStationConsumerRelRequest {

        $msg = new CreateStationConsumerRelRequest();

        $msg->setStationId($request->stationId);
        $msg->setStationConnectionId($request->stationConnectionId);
        $msg->setConsumerConnectionId($request->consumerConnectionId);

        $msg->setStationPriorityOrder($request->stationPriorityOrder);
       

       $msg->setEffectiveStart($request->effectiveStart);

        if ($request->effectiveEnd != null) {
            $msg->setEffectiveEnd($request->effectiveEnd);
        }

        return $msg;
    }

    /**
     * Convert update priority request
     */
    public function toUpdatePriorityRequest(
        int $relId,
        int $stationConnectionId,
        int $consumerPriorityOrder,
        int $stationPriorityOrder
    ): UpdateStationConsumerRelPriorityRequest {

        $msg = new UpdateStationConsumerRelPriorityRequest();

        $msg->setRelId($relId);
        $msg->setStationConnectionId($stationConnectionId);
        $msg->setConsumerPriorityOrder($consumerPriorityOrder);
        $msg->setStationPriorityOrder($stationPriorityOrder);

        return $msg;
    }

    /**
     * Convert deactivate request
     */
    public function toDeactivateRequest(int $relId): DeactivateStationConsumerRelRequest
    {
        $msg = new DeactivateStationConsumerRelRequest();

        $msg->setRelId($relId);

        return $msg;
    }
}