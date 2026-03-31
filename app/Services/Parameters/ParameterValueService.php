<?php

namespace App\Services\Parameters;

use App\GrpcConverters\MetaData\ParameterDefinitionGrpcConverter;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Parameters\ParameterValueFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Parameters\CreateParameterValueRequest;
use Proto\Parameters\DeleteParameterValueRequest;
use Proto\Parameters\GetParameterValueRequest;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValuePaginatedListRequest;
use Proto\Parameters\ParameterValueProto;
use Proto\Parameters\ParameterValueServiceClient;
use Proto\Parameters\UpdateParameterValueRequest;

class ParameterValueService
{
    private ParameterValueServiceClient $client;

    public function __construct()
    {
        $this->client = new ParameterValueServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getParameterValues(
        ?int $page,
        ?int $pageSize,
        ?string $search,
        ?string $domainName,
        ?string $parameterName,
        ?string $attributeName = null,
        ?string $attributeValue = null
    ): GrpcServiceResponse {
        $request = new ListParameterValuesRequest;
        $request->setPage($page ?? 1);
        $request->setPageSize($pageSize ?? 10);

        $request->setDomainName($domainName ?? '');
        $request->setParameterName($parameterName ?? '');
        $request->setAttributeName($attributeName ?? '');
        $request->setAttributeValue($attributeValue ?? '');
        $request->setSearch($search ?? '');

        [$response, $status] = $this->client->listParameterValues($request)->wait();

        if ($status->code !== 0) {
            $errorResponse = GrpcErrorService::handleErrorResponse($status);

            return GrpcServiceResponse::error(
                $errorResponse,
                $response,
                $status->code,
                $status->details,
                []
            );
        }

        $parameterValues = $response?->getValues();
        $parameterValuesArray = [];

        if ($parameterValues != null) {
            foreach ($parameterValues as $parameterValue) {

                $definition = $parameterValue->getDefinition();
                $definitionArray = [
                    'id' => $definition?->getId() ?? null,
                    'parameter_name' => $definition?->getParameterName() ?? null,
                ];
                $domain = $definition?->getDomain();

                if ($domain != null) {
                    $domainArray = [
                        'id' => $domain->getId(),
                        'domain_name' => $domain->getDomainName(),
                    ];

                    $system = $domain->getSystemModule();

                    if ($system != null) {
                        $systemArray = [
                            'id' => $system->getId(),
                            'name' => $system->getName(),
                        ];
                    }
                }

                $parameterValuesArray[] = [
                    'id' => $parameterValue->getId(),
                    'parameter_value' => $parameterValue->getParameterValue(),
                    'parameter_code' => $parameterValue->getParameterCode(),
                    'attribute1_value' => $parameterValue->getAttribute1Value(),
                    'attribute2_value' => $parameterValue->getAttribute2Value(),
                    'attribute3_value' => $parameterValue->getAttribute3Value(),
                    'attribute4_value' => $parameterValue->getAttribute4Value(),
                    'attribute5_value' => $parameterValue->getAttribute5Value(),
                    'is_active' => $parameterValue->getIsActive(),
                    'sort_priority' => $parameterValue->getSortPriority(),
                    'notes' => $parameterValue->getNotes(),
                    'definition' => $definitionArray,
                    'domain' => $domainArray ?? null,
                    'system_module' => $systemArray ?? null,
                ];
            }
        }

        return GrpcServiceResponse::success($parameterValuesArray, $response, $status->code, $status->details);
    }

    public function listParameterValuePaginated(
        int $pageNumber = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?string $domainName = null,
        ?string $parameterName = null,
        ?string $sortBy = null,
        ?string $sortDirection = null,
        ?string $attributeName = null,
        ?string $attributeValue = null,

    ): GrpcServiceResponse {
        $request = new ParameterValuePaginatedListRequest;
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);
        $request->setSortBy($sortBy ?? '');
        $request->setSortDirection($sortDirection ?? '');
        $request->setSearch($search ?? '');
        $request->setAttributeName($attributeName ?? '');
        $request->setAttributeValue($attributeValue ?? '');
        $request->setDomainName($domainName ?? '');
        $request->setParameterName($parameterName ?? '');
        [$response, $status] = $this->client->ListParameterValuesPaginated($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $parameterValuesArray = [];
        foreach ($response->getValues() as $parameterValue) {
            $parameterValuesArray[] = self::toArray($parameterValue);
        }
        $parameterValuesData = [
            'parameter_values' => $parameterValuesArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($parameterValuesData, $response, $status->code, $status->details);
    }

    public function createParameterValue(ParameterValueFormRequest $request): GrpcServiceResponse
    {
        $proto = new ParameterValueProto;
        $proto->setParameterCode($request->parameterCode);
        $proto->setParameterValue($request->parameterValue);
        $proto->setDefinitionId($request->definitionId);
        $proto->setParentId($request->parentId ?? 0);
        $proto->setAttribute1Value($request->attribute1Value ?? '');
        $proto->setAttribute2Value($request->attribute2Value ?? '');
        $proto->setAttribute3Value($request->attribute3Value ?? '');
        $proto->setAttribute4Value($request->attribute4Value ?? '');
        $proto->setAttribute5Value($request->attribute5Value ?? '');
        $proto->setEffectiveStartDate($request->effectiveStartDate ?? date('Y-m-d'));
        $proto->setEffectiveEndDate($request->effectiveEndDate ?? '');
        $proto->setIsActive($request->isActive ?? true);
        $proto->setSortPriority($request->sortPriority ?? 0);
        $proto->setNotes($request->notes ?? '');

        $grpcRequest = new CreateParameterValueRequest;
        $grpcRequest->setValue($proto);

        [$response, $status] = $this->client->CreateParameterValue($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($status->code !== 0) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }
        $definition = [
            'id' => $response->getDefinition()->getId(),
            'parameter_name' => $response->getDefinition()->getParameterName(),
        ];
        $parameterValueArray = [
            'id' => $response->getId(),
            'parameter_value' => $response->getParameterValue(),
            'parameter_value_code' => $response->getParameterCode(),
            'attribute1_value' => $response->getAttribute1Value(),
            'attribute2_value' => $response->getAttribute2Value(),
            'attribute3_value' => $response->getAttribute3Value(),
            'attribute4_value' => $response->getAttribute4Value(),
            'attribute5_value' => $response->getAttribute5Value(),
            'is_active' => $response->getIsActive(),
            'sort_priority' => $response->getSortPriority(),
            'notes' => $response->getNotes(),
            'definition' => $definition,
        ];

        return GrpcServiceResponse::success($parameterValueArray, $response, $status->code, $status->details);
    }

    public function updateParameterValue(ParameterValueFormRequest $formRequest, int $id): GrpcServiceResponse
    {
        $proto = new ParameterValueProto;
        $proto->setId($id);
        $proto->setParameterCode($formRequest->parameterCode);
        $proto->setParameterValue($formRequest->parameterValue);
        $proto->setDefinitionId($formRequest->definitionId);
        $proto->setParentId($formRequest->parentId ?? 0);
        $proto->setAttribute1Value($formRequest->attribute1Value ?? '');
        $proto->setAttribute2Value($formRequest->attribute2Value ?? '');
        $proto->setAttribute3Value($formRequest->attribute3Value ?? '');
        $proto->setAttribute4Value($formRequest->attribute4Value ?? '');
        $proto->setAttribute5Value($formRequest->attribute5Value ?? '');
        $proto->setEffectiveStartDate($formRequest->effectiveStartDate ?? date('Y-m-d'));
        $proto->setEffectiveEndDate($formRequest->effectiveEndDate ?? '');
        $proto->setIsActive($formRequest->isActive ?? true);
        $proto->setSortPriority($formRequest->sortPriority ?? 0);
        $proto->setNotes($formRequest->notes ?? '');

        $grpcRequest = new UpdateParameterValueRequest;
        $grpcRequest->setValue($proto);

        [$response, $status] = $this->client->updateParameterValue($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $parameterValueArray = [
            'id' => $response->getId(),
            'parameter_value' => $response->getParameterValue(),
            'parameter_value_code' => $response->getParameterCode(),
            'attribute1_value' => $response->getAttribute1Value(),
            'attribute2_value' => $response->getAttribute2Value(),
            'attribute3_value' => $response->getAttribute3Value(),
            'attribute4_value' => $response->getAttribute4Value(),
            'attribute5_value' => $response->getAttribute5Value(),
            'is_active' => $response->getIsActive(),
            'sort_priority' => $response->getSortPriority(),
            'notes' => $response->getNotes(),
        ];

        return GrpcServiceResponse::success($parameterValueArray, $response, $status->code, $status->details);
    }

    public function getParameterValue(?int $id = null, ?string $parameterValue = null): GrpcServiceResponse
    {
        $request = new GetParameterValueRequest;
        if ($id) {
            $request->setId((int) $id);
        }
        if ($parameterValue) {
            $request->setParameterValue($parameterValue);
        }

        [$response, $status] = $this->client->getParameterValue($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $parameterValueArray = ParameterValueProtoConvertor::convertToArray($response);

        return GrpcServiceResponse::success($parameterValueArray, $response, $status->code, $status->details);
    }

    public function deleteParameterValue(int|string $id): GrpcServiceResponse
    {
        $request = new DeleteParameterValueRequest;
        $request->setId((int) $id);

        [$response, $status] = $this->client->deleteParameterValue($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(?ParameterValueProto $value): array
    {
        if ($value === null) {
            return [];
        }
        $definition = $value->getDefinition();
        if ($definition != null) {
            $definition = ParameterDefinitionGrpcConverter::convertToArray($definition);
        }

        return [
            'id' => $value->getId(),
            'parameter_value' => $value->getParameterValue(),
            'parameter_code' => $value->getParameterCode(),
            'attribute1_value' => $value->getAttribute1Value(),
            'attribute2_value' => $value->getAttribute2Value(),
            'attribute3_value' => $value->getAttribute3Value(),
            'attribute4_value' => $value->getAttribute4Value(),
            'attribute5_value' => $value->getAttribute5Value(),
            'is_active' => $value->getIsActive(),
            'sort_priority' => $value->getSortPriority(),
            'notes' => $value->getNotes(),
            'definition' => $definition,
            'effective_start_date' => $value->getEffectiveStartDate(),
            'effective_end_date' => $value->getEffectiveEndDate(),
        ];
    }
}
