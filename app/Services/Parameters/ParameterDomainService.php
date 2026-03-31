<?php

namespace App\Services\Parameters;

use App\Http\Requests\Parameters\ParameterDomainFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Parameters\CreateParameterDomainRequest;
use Proto\Parameters\DeleteParameterDomainRequest;
use Proto\Parameters\GetParameterDomainRequest;
use Proto\Parameters\ListParameterDomainsRequest;
use Proto\Parameters\ParameterDomainPaginatedListRequest;
use Proto\Parameters\ParameterDomainProto;
use Proto\Parameters\ParameterDomainServiceClient;
use Proto\Parameters\UpdateParameterDomainRequest;

class ParameterDomainService
{
    private ParameterDomainServiceClient $client;

    public function __construct()
    {
        $this->client = new ParameterDomainServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedParameterDomains(?int $page, ?int $pageSize, ?string $search, ?int $moduleId): GrpcServiceResponse
    {
        $request = new ParameterDomainPaginatedListRequest();
        $request->setPageNumber($page ?? 1);
        $request->setPageSize($pageSize ?? 10);

        if ($search !== null) {
            $request->setSearch($search);
        }

        if ($moduleId !== null && $moduleId > 0) {
            $request->setModuleId($moduleId);
        }

        [$response, $status] = $this->client->ParameterDomainPaginatedList($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $domains = $response?->getDomains();
        $domainsArray = [];

        if ($domains) {
            foreach ($domains as $domain) {
                $systemModule = $domain->getSystemModule();
                $systemModuleArray = null;
                if ($systemModule) {
                    $systemModuleArray = [
                        'id' => $systemModule->getId(),
                        'name' => $systemModule->getName(),
                    ];
                }
                $domainsArray[] = [
                    'id' => $domain->getId(),
                    'domain_name' => $domain->getDomainName(),
                    'description' => $domain->getDescription(),
                    'domain_code' => $domain->getDomainCode(),
                    'managed_by_module' => $domain->getManagedByModule(),
                    'system_module' => $systemModuleArray,
                ];
            }
        }

        $parameterDomainsData = [
            'parameter_domains' => $domainsArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($parameterDomainsData, $response, $status->code, $status->details);
    }

    /**
     * Get paginated list of parameter domains
     */
    public function getParameterDomains(?int $page, ?int $pageSize, ?string $search, ?int $moduleId): GrpcServiceResponse
    {
        $request = new ListParameterDomainsRequest;
        $request->setPage($page ?? 1);
        $request->setPageSize($pageSize ?? 10);

        if ($search !== null) {
            $request->setSearch($search);
        }

        if ($moduleId !== null && $moduleId > 0) {
            $request->setModuleId($moduleId);
        }

        [$response, $status] = $this->client->ListParameterDomains($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $domains = $response?->getDomains();
        $domainsArray = [];

        if ($domains) {
            foreach ($domains as $domain) {
                $systemModule = $domain->getSystemModule();
                $systemModuleArray = null;
                if ($systemModule) {
                    $systemModuleArray = [
                        'id' => $systemModule->getId(),
                        'name' => $systemModule->getName(),
                    ];
                }
                $domainsArray[] = [
                    'id' => $domain->getId(),
                    'domain_name' => $domain->getDomainName(),
                    'description' => $domain->getDescription(),
                    'domain_code' => $domain->getDomainCode(),
                    'managed_by_module' => $domain->getManagedByModule(),
                    'system_module' => $systemModuleArray,
                ];
            }
        }

        return GrpcServiceResponse::success($domainsArray, $response, $status->code, $status->details);
    }

    /**
     * Get a specific parameter domain by ID
     */
    public function getParameterDomain(string|int $id): GrpcServiceResponse
    {
        $request = new GetParameterDomainRequest;
        $request->setId($id);

        [$response, $status] = $this->client->GetParameterDomain($request)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $domain = $response;
        $systemModule = $domain?->getSystemModule();
        $systemModuleArray = null;
        if ($systemModule) {
            $systemModuleArray = [
                'id' => $systemModule->getId(),
                'name' => $systemModule->getName(),
            ];
        }
        $domainArray = [
            'id' => $domain->getId(),
            'domain_name' => $domain->getDomainName(),
            'description' => $domain->getDescription(),
            'domain_code' => $domain->getDomainCode(),
            'managed_by_module' => $domain->getManagedByModule(),
            'system_module' => $systemModuleArray,
        ];

        return GrpcServiceResponse::success($domainArray, $response, $status->code, $status->details);
    }

    /**
     * Create a new parameter domain
     */
    public function createParameterDomain(ParameterDomainFormRequest $request): GrpcServiceResponse
    {
        $domainProto = new ParameterDomainProto;
        $domainProto->setDomainName($request->domainName);
        $domainProto->setDescription($request->description);
        $domainProto->setDomainCode($request->domainCode);
        $domainProto->setManagedByModule($request->managedByModule);

        $grpcRequest = new CreateParameterDomainRequest;
        $grpcRequest->setDomain($domainProto);

        [$response, $status] = $this->client->CreateParameterDomain($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $domainArray = [
            'id' => $response?->getId(),
            'domain_name' => $response?->getDomainName(),
            'description' => $response?->getDescription(),
            'domain_code' => $response?->getDomainCode(),
            'managed_by_module' => $response?->getManagedByModule(),
        ];

        return GrpcServiceResponse::success($domainArray, $response, $status->code, $status->details);
    }

    /**
     * Update an existing parameter domain
     */
    public function updateParameterDomain(ParameterDomainFormRequest $request, string|int $id): GrpcServiceResponse
    {
        $domainProto = new ParameterDomainProto;
        $domainProto->setId($id);
        $domainProto->setDomainName($request->domainName);
        $domainProto->setDescription($request->description);
        $domainProto->setDomainCode($request->domainCode);
        $domainProto->setManagedByModule($request->managedByModule);

        $grpcRequest = new UpdateParameterDomainRequest;
        $grpcRequest->setDomain($domainProto);

        [$response, $status] = $this->client->UpdateParameterDomain($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $domainArray = [
            'id' => $response?->getId(),
            'domain_name' => $response?->getDomainName(),
            'description' => $response?->getDescription(),
            'domain_code' => $response?->getDomainCode(),
            'managed_by_module' => $response?->getManagedByModule(),
        ];

        return GrpcServiceResponse::success($domainArray, $response, $status->code, $status->details);
    }

    /**
     * Delete a parameter domain
     */
    public function deleteParameterDomain(string|int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeleteParameterDomainRequest;
        $grpcRequest->setId($id);

        [$response, $status] = $this->client->DeleteParameterDomain($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        // Delete returns Empty; no payload data
        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }
}
