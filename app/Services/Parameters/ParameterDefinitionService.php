<?php

namespace App\Services\Parameters;

use App\GrpcConverters\MetaData\ParameterDomainGrpcConverter;
use App\Http\Requests\Parameters\ParameterDefinitionFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Parameters\CreateParameterDefinitionRequest;
use Proto\Parameters\DeleteParameterDefinitionRequest;
use Proto\Parameters\GetParameterDefinitionRequest;
use Proto\Parameters\ListParameterDefinitionsRequest;
use Proto\Parameters\ParameterDefinitionPaginatedListRequest;
use Proto\Parameters\ParameterDefinitionProto;
use Proto\Parameters\ParameterDefinitionServiceClient;
use Proto\Parameters\ParameterDomainProto;
use Proto\Parameters\UpdateParameterDefinitionRequest;

class ParameterDefinitionService
{
    private ParameterDefinitionServiceClient $client;

    public function __construct(
        private ParameterDomainService $parameterDomainService,
        private ParameterDomainGrpcConverter $parameterDomainGrpcConverter
    ) {
        $this->client = new ParameterDefinitionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedParameterDefinitions(int $page = 1, int $pageSize = 10, ?string $domainName = null, ?string $moduleName = null, ?string $search = null): GrpcServiceResponse
    {
        $request = new ParameterDefinitionPaginatedListRequest;
        $request->setPageNumber($page);
        $request->setPageSize($pageSize);

        if ($domainName !== null) {
            $request->setDomainName($domainName);
        }
        if ($moduleName !== null) {
            $request->setModuleName($moduleName);
        }
        if ($search !== null && $search !== '') {
            $request->setSearch($search);
        }
        [$response, $status] = $this->client->ListParameterDefinitionsPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $definitionsArray = [];
        foreach ($response->getDefinitions() as $def) {
            $domain = $def->getDomain();
            $domainArray = null;
            $systemModuleArray = null;

            if ($domain !== null) {
                $domainArray = [
                    'id' => $domain->getId(),
                    'domain_name' => $domain->getDomainName(),
                ];
                $systemModule = $domain->getSystemModule();
                if ($systemModule !== null) {
                    $systemModuleArray = [
                        'id' => $systemModule->getId(),
                        'name' => $systemModule->getName(),
                    ];
                }
            }

            $definitionsArray[] = [
                'id' => $def->getId(),
                'parameter_name' => $def->getParameterName(),
                'attribute1_name' => $def->getAttribute1Name(),
                'attribute2_name' => $def->getAttribute2Name(),
                'attribute3_name' => $def->getAttribute3Name(),
                'attribute4_name' => $def->getAttribute4Name(),
                'attribute5_name' => $def->getAttribute5Name(),
                'is_effective_date_driven' => $def->getIsEffectiveDateDriven(),
                'domain' => $domainArray,
                'domain_id' => $def->getDomainId(),
                'system_module' => $systemModuleArray,
            ];
        }
        $parameterDefinitionsData = [
            'parameter_definitions' => $definitionsArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($parameterDefinitionsData, $response, $status->code, $status->details);
    }

    public function getParameterDefinitions(int $page = 1, int $pageSize = 10, ?string $domainName = null, ?string $moduleName = null, ?string $search = null): GrpcServiceResponse
    {
        $request = new ListParameterDefinitionsRequest;
        $request->setPage($page);
        $request->setPageSize($pageSize);

        if ($domainName !== null) {
            $request->setDomainName($domainName);
        }
        if ($moduleName !== null) {
            $request->setModuleName($moduleName);
        }
        if ($search !== null && $search !== '') {
            $request->setSearch($search);
        }
        [$response, $status] = $this->client->ListParameterDefinitions($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $definitionsArray = [];
        foreach ($response->getDefinitions() as $def) {
            $domain = $def->getDomain();
            $domainArray = null;
            $systemModuleArray = null;

            if ($domain !== null) {
                $domainArray = [
                    'id' => $domain->getId(),
                    'domain_name' => $domain->getDomainName(),
                ];
                $systemModule = $domain->getSystemModule();
                if ($systemModule !== null) {
                    $systemModuleArray = [
                        'id' => $systemModule->getId(),
                        'name' => $systemModule->getName(),
                    ];
                }
            }

            $definitionsArray[] = [
                'id' => $def->getId(),
                'parameter_name' => $def->getParameterName(),
                'attribute1_name' => $def->getAttribute1Name(),
                'attribute2_name' => $def->getAttribute2Name(),
                'attribute3_name' => $def->getAttribute3Name(),
                'attribute4_name' => $def->getAttribute4Name(),
                'attribute5_name' => $def->getAttribute5Name(),
                'is_effective_date_driven' => $def->getIsEffectiveDateDriven(),
                'domain' => $domainArray,
                'domain_id' => $def->getDomainId(),
                'system_module' => $systemModuleArray,
            ];
        }

        return GrpcServiceResponse::success($definitionsArray, $response, $status->code, $status->details);
    }

    public function getParameterDefinition(string|int|null $id = null, ?string $domainName = null, ?string $parameterName = null, ?string $systemModuleName = null): GrpcServiceResponse
    {
        $request = new GetParameterDefinitionRequest;
        if ($id !== null) {
            $request->setId($id);
        }
        if ($domainName !== null) {
            $request->setDomainName($domainName);
        }
        if ($parameterName !== null) {
            $request->setParameterName($parameterName);
        }
        if ($systemModuleName !== null) {
            $request->setSystemModuleName($systemModuleName);
        }

        [$response, $status] = $this->client->GetParameterDefinition($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $definitionResponse = $response->getDefinition();

        if ($definitionResponse === null) {
            return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
        }
        $domain = $definitionResponse->getDomain();
        $domainArray = null;
        if ($domain !== null) {
            $domainArray = $this->parameterDomainGrpcConverter->convertToArray($domain);
        }

        $definition = [
            'id' => $definitionResponse->getId(),
            'parameter_name' => $definitionResponse->getParameterName(),
            'attribute1_name' => $definitionResponse->getAttribute1Name(),
            'attribute2_name' => $definitionResponse->getAttribute2Name(),
            'attribute3_name' => $definitionResponse->getAttribute3Name(),
            'attribute4_name' => $definitionResponse->getAttribute4Name(),
            'attribute5_name' => $definitionResponse->getAttribute5Name(),
            'is_effective_date_driven' => $definitionResponse->getIsEffectiveDateDriven(),
            'domain' => $domainArray,
            'domain_id' => $definitionResponse->getDomainId(),
        ];

        return GrpcServiceResponse::success($definition, $response, $status->code, $status->details);
    }

    public function createParameterDefinition(ParameterDefinitionFormRequest $request): GrpcServiceResponse
    {
        $proto = new ParameterDefinitionProto;
        $proto->setParameterName($request->parameterName ?? '');
        $proto->setAttribute1Name($request->attribute1Name ?? '');
        $proto->setAttribute2Name($request->attribute2Name ?? '');
        $proto->setAttribute3Name($request->attribute3Name ?? '');
        $proto->setAttribute4Name($request->attribute4Name ?? '');
        $proto->setAttribute5Name($request->attribute5Name ?? '');
        $proto->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $proto->setDomainId($request->domainId);

        $grpcRequest = new CreateParameterDefinitionRequest;
        $grpcRequest->setDefinition($proto);

        [$response, $status] = $this->client->CreateParameterDefinition($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $parameterDefinitionArray = [
            'id' => $response->getId(),
            'parameter_name' => $response->getParameterName(),
            'attribute1_name' => $response->getAttribute1Name(),
            'attribute2_name' => $response->getAttribute2Name(),
            'attribute3_name' => $response->getAttribute3Name(),
            'attribute4_name' => $response->getAttribute4Name(),
            'attribute5_name' => $response->getAttribute5Name(),
            'domain' => $response->getDomain(),
            'is_effective_date_driven' => $response->getIsEffectiveDateDriven(),
            'domain_id' => $response->getDomainId(),
        ];

        return GrpcServiceResponse::success($parameterDefinitionArray, $response, $status->code, $status->details);
    }

    public function updateParameterDefinition(
        ParameterDefinitionFormRequest $request,
        string|int $id,
    ): GrpcServiceResponse {
        $proto = new ParameterDefinitionProto;
        $domainProto = new ParameterDomainProto;
        $parameterDomain = $this->parameterDomainService->getParameterDomain($request->domainId);
        $proto->setId($id);
        $proto->setParameterName($request->parameterName);
        $proto->setAttribute1Name($request->attribute1Name ?? '');
        $proto->setAttribute2Name($request->attribute2Name ?? '');
        $proto->setAttribute3Name($request->attribute3Name ?? '');
        $proto->setAttribute4Name($request->attribute4Name ?? '');
        $proto->setAttribute5Name($request->attribute5Name ?? '');
        $proto->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $proto->setDomainId($request->domainId);

        $grpcRequest = new UpdateParameterDefinitionRequest;
        $grpcRequest->setDefinition($proto);

        [$response, $status] = $this->client->UpdateParameterDefinition($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $parameterDefinitionArray = [
            'id' => $response->getId(),
            'parameter_name' => $response->getParameterName(),
            'attribute1_name' => $response->getAttribute1Name(),
            'attribute2_name' => $response->getAttribute2Name(),
            'attribute3_name' => $response->getAttribute3Name(),
            'attribute4_name' => $response->getAttribute4Name(),
            'attribute5_name' => $response->getAttribute5Name(),
            'is_effective_date_driven' => $response->getIsEffectiveDateDriven(),
            'domain_id' => $response->getDomainId(),
        ];

        return GrpcServiceResponse::success($parameterDefinitionArray, $response, $status->code, $status->details);
    }

    public function deleteParameterDefinition(string|int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeleteParameterDefinitionRequest;
        $grpcRequest->setId($id);

        [$response, $status] = $this->client->DeleteParameterDefinition($grpcRequest)->wait();

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
}
