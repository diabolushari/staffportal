<?php

namespace App\GrpcConverters\BillingGroup;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\Services\Connection\ConsumerService;
use Proto\BillingGroupConnectionRel\BillingGroupConnectionRelMessage;

class BillingGroupConnectionRelConverter
{
    public static function convert(BillingGroupConnectionRelMessage $message): array
    {
        $consumerService = app(ConsumerService::class);
        $connection = $message->hasConnection() ? ConnectionProtoConverter::convertToArray($message->getConnection()) : null;
        $consumer = $message->getConsumer() ? $consumerService->transformConsumerToArray($message->getConsumer()) : null;
        return [
            'version_id' => $message->getVersionId(),
            'billing_group_id' => $message->getBillingGroupId(),
            'connection_id' => $message->getConnectionId(),
            'effective_start' => $message->getEffectiveStart(),
            'effective_end' => $message->getEffectiveEnd(),
            'is_active' => $message->getIsActive(),
            'created_by' => $message->getCreatedBy(),
            'updated_by' => $message->getUpdatedBy(),
            'deleted_ts' => $message->getDeletedTs(),
            'deleted_by' => $message->getDeletedBy(),
            'connection' => $connection,
            'consumer' => $consumer,
        ];
    }
}