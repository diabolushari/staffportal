<?php

namespace App\Services\SystemModule;

use App\Http\Requests\SystemModule\SystemModuleFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Modules\CreateSystemModuleRequest;
use Proto\Modules\DeleteSystemModuleRequest;
use Proto\Modules\GetSystemModuleRequest;
use Proto\Modules\ListSystemModulesRequest;
use Proto\Modules\SystemModule;
use Proto\Modules\SystemModuleServiceClient;
use Proto\Modules\UpdateSystemModuleRequest;

class SystemModuleService
{
    private SystemModuleServiceClient $client;

    public function __construct()
    {
        $this->client = new SystemModuleServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * Get paginated list of system modules
     */
    public function getSystemModules(int $page = 1, int $pageSize = 5): GrpcServiceResponse
    {
        $request = new ListSystemModulesRequest;
        $request->setPage($page);
        $request->setPageSize($pageSize);

        [$response, $status] = $this->client->ListSystemModules($request)->wait();

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

        $systemModules = $response?->getModules();
        $systemModulesArray = [];

        if ($systemModules) {
            foreach ($systemModules as $systemModule) {
                $systemModulesArray[] = [
                    'id' => $systemModule->getId(),
                    'name' => $systemModule->getName(),
                ];
            }
        }

        return GrpcServiceResponse::success($systemModulesArray, $response, $status->code, $status->details);
    }

    public function getSystemModule(string $id): GrpcServiceResponse
    {
        $request = new GetSystemModuleRequest;
        $request->setId($id);

        [$response, $status] = $this->client->GetSystemModule($request)->wait();

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

        $systemModule = $response?->getModule();
        $systemModuleArray = [
            'id' => $systemModule->getId(),
            'name' => $systemModule->getName(),
        ];

        return GrpcServiceResponse::success($systemModuleArray, $response, $status->code, $status->details);
    }

    /**
     * Create a new system module
     */
    public function createSystemModule(SystemModuleFormRequest $request): GrpcServiceResponse
    {
        $systemModule = new SystemModule;
        $systemModule->setName($request->name);

        $grpcRequest = new CreateSystemModuleRequest;
        $grpcRequest->setModule($systemModule);

        [$response, $status] = $this->client->CreateSystemModule($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $moduleArray = [
            'id' => $response?->getId(),
            'name' => $response?->getName(),
        ];

        return GrpcServiceResponse::success($moduleArray, $response, $status->code, $status->details);
    }

    /**
     * Update an existing system module
     */
    public function updateSystemModule(SystemModuleFormRequest $request, string|int $id): GrpcServiceResponse
    {
        $systemModule = new SystemModule;
        $systemModule->setName($request->name);
        $systemModule->setId($id);

        $grpcRequest = new UpdateSystemModuleRequest;
        $grpcRequest->setModule($systemModule);

        [$response, $status] = $this->client->UpdateSystemModule($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $moduleArray = [
            'id' => $response?->getId(),
            'name' => $response?->getName(),
        ];

        return GrpcServiceResponse::success($moduleArray, $response, $status->code, $status->details);
    }

    /**
     * Delete a system module
     */
    public function deleteSystemModule(string|int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeleteSystemModuleRequest;
        $grpcRequest->setId($id);

        [$response, $status] = $this->client->DeleteSystemModule($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        // Delete returns Empty; no payload data
        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }
}
