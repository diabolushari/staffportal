<?php

namespace App\Services\Billing;

use App\GrpcConverters\Billing\ChargeHeadDefinitionConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use App\Services\utils\StructConverter;
use Grpc\ChannelCredentials;
use Proto\Billing\ChargeHeadMessage;
use Proto\Billing\ChargeHeadPaginatedListRequest;
use Proto\Billing\ChargeHeadServiceClient;

class ChargeHeadService
{
    private ChargeHeadServiceClient $client;

    public function __construct(
        private readonly ChargeHeadDefinitionConverter $chargeHeadDefinitionConverter
    ) {
        $this->client = new ChargeHeadServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedChargeHeads(
        ?int $pageNumber = 1,
        ?int $pageSize = 10,
        ?string $sortBy = 'id',
        ?string $sortDirection = 'asc',
        ?int $billingRuleId = null,
        ?int $nameId = null
    ): GrpcServiceResponse {
        $request = new ChargeHeadPaginatedListRequest;

        if ($pageNumber) {
            $request->setPageNumber($pageNumber);
        }
        if ($pageSize) {
            $request->setPageSize($pageSize);
        }
        if ($sortBy) {
            $request->setSortBy($sortBy);
        }
        if ($sortDirection) {
            $request->setSortDirection($sortDirection);
        }
        if ($billingRuleId) {
            $request->setBillingRuleId($billingRuleId);
        }
        if ($nameId) {
            $request->setNameId($nameId);
        }

        [$response, $status] = $this->client->ListChargeHeadsPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $chargeHeads = [];
        foreach ($response->getChargeHeads() as $chargeHead) {
            $chargeHeads[] = $this->chargeHeadMessageToArray($chargeHead);
        }
        $data = [
            'charge_heads' => $chargeHeads,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($data, $response, $status->code, $status->details);
    }

    public function chargeHeadMessageToArray(ChargeHeadMessage $message)
    {
        $chargeHeadDefinitions = [];
        foreach ($message->getChargeHeadDefinitions() as $chargeHeadDefinition) {
            $chargeHeadDefinitions[] = $this->chargeHeadDefinitionConverter->convertToArray($chargeHeadDefinition);
        }

        return [
            'id' => $message->getId(),
            'billing_rule_id' => $message->getBillingRuleId(),
            'charge_head_definition_id' => $message->getChargeHeadDefinitionId(),
            'charge_head_definitions' => $chargeHeadDefinitions,
            'calculations' => $message->getCalculations() ? StructConverter::convert($message->getCalculations()) : null,
            'effective_start' => $message->getEffectiveStart() ? DateTimeConverter::convertTimestampToString($message->getEffectiveStart()) : null,
            'effective_end' => $message->getEffectiveEnd() ? DateTimeConverter::convertTimestampToString($message->getEffectiveEnd()) : null,
            'created_ts' => $message->getCreatedTs() ? DateTimeConverter::convertTimestampToString($message->getCreatedTs()) : null,
            'updated_ts' => $message->getUpdatedTs() ? DateTimeConverter::convertTimestampToString($message->getUpdatedTs()) : null,
            'deleted_ts' => $message->getDeletedTs() ? DateTimeConverter::convertTimestampToString($message->getDeletedTs()) : null,
            'created_by' => $message->getCreatedBy(),
            'updated_by' => $message->getUpdatedBy(),
            'deleted_by' => $message->getDeletedBy(),
        ];
    }
}
