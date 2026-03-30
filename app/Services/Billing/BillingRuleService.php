<?php

namespace App\Services\Billing;

use App\GrpcConverters\BillingRuleProtoConvertor;
use App\Http\Requests\Billing\BillingRuleRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\ArrayToStructConverter;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use App\Services\utils\StructConverter;
use Grpc\ChannelCredentials;
use Proto\Billing\BillingRuleFormMessage;
use Proto\Billing\BillingRuleMessage;
use Proto\Billing\BillingRulePaginatedListRequest;
use Proto\Billing\BillingRuleServiceClient;
use Proto\Billing\CreateBillingRuleRequest;
use Proto\Billing\DeleteBillingRuleRequest;
use Proto\Billing\GetBillingRuleRequest;
use Proto\Billing\JsonChargeHeadFormMessage;
use Proto\Billing\JsonComputedPropertyFormMessage;
use Proto\Billing\ListBillingRuleRequest;
use Proto\Billing\UpdateBillingRuleRequest;

class BillingRuleService
{
    private BillingRuleServiceClient $client;

    public function __construct(
        private readonly ParameterValueService $parameterValueService
    ) {
        $this->client = new BillingRuleServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createBillingRule(BillingRuleRequest $request): GrpcServiceResponse
    {
        $proto = new CreateBillingRuleRequest;
        // $request->validateJsonStructure();
        $jsonContents = $request->billingRule->get();
        $decoded = json_decode($jsonContents ?? '', true);

        $proto->setBillingRule(BillingRuleProtoConvertor::billingRuleRequestToProto($request));

        [$response, $status] = $this->client->CreateBillingRule($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $billingRule = [];
        if ($response->getBillingRule() != null) {
            $billingRule = $this->billingRuleMessageToArray($response->getBillingRule());
        }

        return GrpcServiceResponse::success($billingRule, $response, $status->code, $status->details);
    }

    public function listBillingRules(): GrpcServiceResponse
    {
        $proto = new ListBillingRuleRequest;
        [$response, $status] = $this->client->ListBillingRules($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $billingRules = [];
        foreach ($response->getBillingRules() as $billingRule) {
            $billingRules[] = $this->billingRuleMessageToArray($billingRule);
        }

        return GrpcServiceResponse::success($billingRules, $response, $status->code, $status->details);
    }

    public function listBillingRulesPaginated(
        int $pageNumber = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?string $sortBy = null,
        ?string $sortDirection = null
    ): GrpcServiceResponse {
        $proto = new BillingRulePaginatedListRequest;
        $proto->setPageNumber($pageNumber);
        $proto->setPageSize($pageSize);
        if ($search !== null) {
            $proto->setSearch($search);
        }
        if ($sortBy !== null) {
            $proto->setSortBy($sortBy);
        }
        if ($sortDirection !== null) {
            $proto->setSortDirection($sortDirection);
        }
        [$response, $status] = $this->client->ListBillingRulesPaginated($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $billingRules = [];
        foreach ($response->getBillingRules() as $billingRule) {
            $billingRules[] = $this->billingRuleMessageToArray($billingRule);
        }
        $billingRules = [
            'billing_rules' => $billingRules,
            'total_count' => $response->getTotalCount(),
            'page_size' => $response->getPageSize(),
            'page_number' => $response->getPageNumber(),
        ];

        return GrpcServiceResponse::success($billingRules, $response, $status->code, $status->details);
    }

    public function getBillingRule(int $id): GrpcServiceResponse
    {
        $proto = new GetBillingRuleRequest;
        $proto->setId($id);

        [$response, $status] = $this->client->GetBillingRule($proto)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $billingRule = [];
        if ($response->getBillingRule() != null) {
            $billingRule = $this->billingRuleMessageToArray($response->getBillingRule());
        }

        return GrpcServiceResponse::success($billingRule, $response, $status->code, $status->details);
    }

    public function updateBillingRule(BillingRuleRequest $request, int $id): GrpcServiceResponse
    {
        $proto = new UpdateBillingRuleRequest;
        $proto->setBillingRule($this->BillingRuleUpdateRequestToProto($request, $id));
        $request->validateJsonStructure();
        $jsonContents = $request->billingRule->get();
        $decoded = json_decode($jsonContents, true);

        $computedProperties = [];
        foreach ($decoded['computed_properties'] as $property) {
            $computedProperty = $this->JsonComputedPropertyFormMessageToProto($property, $request->effectiveStart, $request->effectiveEnd);
            $computedProperties[] = $computedProperty;
        }
        $chargeHeads = [];
        foreach ($decoded['charge_heads'] as $chargeHead) {
            $chargeHeads[] = $this->jsonChargeHeadToProto($chargeHead, $request->effectiveStart, $request->effectiveEnd);

        }
        $proto->setComputedProperties($computedProperties);
        $proto->setChargeHeads($chargeHeads);
        [$response, $status] = $this->client->UpdateBillingRule($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    public function deleteBillingRule(int $id): GrpcServiceResponse
    {
        $proto = new DeleteBillingRuleRequest;
        $proto->setId($id);

        [$response, $status] = $this->client->DeleteBillingRule($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    public function billingRuleUpdateRequestToProto(BillingRuleRequest $request, int $id): BillingRuleFormMessage
    {
        $billingMessage = new BillingRuleFormMessage;
        $billingMessage->setId($id);
        $billingMessage->setName($request->name);
        $jsonContents = $request->billingRule->get();
        if ($jsonContents != false) {
            $decoded = json_decode($jsonContents, true);
            $billingMessage->setRule(ArrayToStructConverter::convert($decoded));
        }
        $effectiveStart = DateTimeConverter::convertStringToTimestamp($request->effectiveStart ?? null);
        if ($effectiveStart != null) {
            $billingMessage->setEffectiveStart($effectiveStart);
        }
        $effectiveEnd = DateTimeConverter::convertStringToTimestamp($request->effectiveEnd ?? null);
        if ($effectiveEnd != null) {
            $billingMessage->setEffectiveEnd($effectiveEnd);
        }

        return $billingMessage;
    }

    /**
     * @return array<string, mixed>
     */
    public function billingRuleMessageToArray(BillingRuleMessage $billingRuleMessage): array
    {
        return [
            'id' => $billingRuleMessage->getId(),
            'name' => $billingRuleMessage->getName(),
            'rule' => $billingRuleMessage->getRule() != null ? StructConverter::convert($billingRuleMessage->getRule()) : null,
            'effective_start' => DateTimeConverter::convertTimestampToString($billingRuleMessage->getEffectiveStart()),
            'effective_end' => DateTimeConverter::convertTimestampToString($billingRuleMessage->getEffectiveEnd()),
            'created_at' => DateTimeConverter::convertTimestampToString($billingRuleMessage->getCreatedTs()),
            'updated_at' => DateTimeConverter::convertTimestampToString($billingRuleMessage->getUpdatedTs()),
            'deleted_at' => DateTimeConverter::convertTimestampToString($billingRuleMessage->getDeletedTs()),
            'created_by' => $billingRuleMessage->getCreatedBy(),
            'updated_by' => $billingRuleMessage->getUpdatedBy(),
            'deleted_by' => $billingRuleMessage->getDeletedBy(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonComputedPropertyFormMessageToProto($jsonComputedPropertyFormMessage, string $effectiveStart, ?string $effectiveEnd): JsonComputedPropertyFormMessage
    {
        $proto = new JsonComputedPropertyFormMessage;
        $proto->setName($jsonComputedPropertyFormMessage['name']);
        $proto->setCalculations(ArrayToStructConverter::convert($jsonComputedPropertyFormMessage['calculations']));
        $effectiveStart = DateTimeConverter::convertStringToTimestamp($effectiveStart);
        $effectiveEnd = DateTimeConverter::convertStringToTimestamp($effectiveEnd);
        if ($effectiveEnd != null) {
            $proto->setEffectiveEnd($effectiveEnd);
        }
        if ($effectiveStart != null) {
            $proto->setEffectiveStart($effectiveStart);
        }

        return $proto;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonChargeHeadToProto($jsonChargeHeadFormMessage, string $effectiveStart, ?string $effectiveEnd): JsonChargeHeadFormMessage
    {
        $proto = new JsonChargeHeadFormMessage;
        $parameter = $this->parameterValueService->getParameterValue(
            null,
            $jsonChargeHeadFormMessage['name']
        );

        $proto->setNameId($parameter->data['id'] ?? 0);
        $proto->setCalculations(ArrayToStructConverter::convert($jsonChargeHeadFormMessage['calculations']));
        $effectiveStart = DateTimeConverter::convertStringToTimestamp($effectiveStart);
        $effectiveEnd = DateTimeConverter::convertStringToTimestamp($effectiveEnd);
        if ($effectiveEnd != null) {
            $proto->setEffectiveEnd($effectiveEnd);
        }
        if ($effectiveStart != null) {
            $proto->setEffectiveStart($effectiveStart);
        }

        return $proto;
    }
}
