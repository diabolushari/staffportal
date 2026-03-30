<?php

namespace App\Services\Offices;

use App\Http\Requests\Offices\OfficeHierarchyForm;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Offices\CreateOfficeHierarchyRelRequest;
use Proto\Offices\DeleteOfficeHierarchyRelRequest;
use Proto\Offices\OfficeHierarchyRelServiceClient;
use Proto\Offices\UpdateOfficeHierarchyRelRequest;

class OfficeHierarchyRelService
{
    private OfficeHierarchyRelServiceClient $client;

    public function __construct()
    {
        $this->client = new OfficeHierarchyRelServiceClient(
            config('app.consumer_service_grpc_host'),
            [
                'credentials' => ChannelCredentials::createInsecure(),
            ]
        );
    }

    public function createOfficeHierarchyRel(OfficeHierarchyForm $request): GrpcServiceResponse
    {
        $grpcRequest = new CreateOfficeHierarchyRelRequest;
        $grpcRequest->setParentOfficeCode($request->parentOfficeCode);
        $grpcRequest->setChildOfficeCode($request->officeCode);
        $grpcRequest->setHierarchyCode($request->hierarchyCode);

        [$response, $status] = $this->client->createOfficeHierarchyRel($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $relation = [];

        return GrpcServiceResponse::success($relation, $response, $status->code, $status->details);
    }

    public function updateOfficeHierarchyRel(OfficeHierarchyForm $request, int $hierarchyRelHistId): GrpcServiceResponse
    {
        $grpcRequest = new UpdateOfficeHierarchyRelRequest;
        $grpcRequest->setHierarchyRelHistId($hierarchyRelHistId);
        $grpcRequest->setParentOfficeCode($request->parentOfficeCode);
        $grpcRequest->setChildOfficeCode($request->officeCode);
        $grpcRequest->setHierarchyCode($request->hierarchyCode);

        [$response, $status] = $this->client->updateOfficeHierarchyRel($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $relation = [];

        return GrpcServiceResponse::success($relation, $response, $status->code, $status->details);
    }

    public function deleteOfficeHierarchyRel(int $hierarchyRelHistId): GrpcServiceResponse
    {
        $grpcRequest = new DeleteOfficeHierarchyRelRequest;
        $grpcRequest->setHierarchyRelHistId($hierarchyRelHistId);

        [$response, $status] = $this->client->deleteOfficeHierarchyRel($grpcRequest)->wait();

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
