<?php

namespace App\Services\SecurityDeposit;

use App\Http\Requests\SecurityDeposit\SdRecalculationFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\SecurityDeposit\SdRecalculateServiceClient;
use Proto\SecurityDeposit\SdRecalculateWithMultipleConnectionsRequest;

class SdRecalculationService
{
    private SdRecalculateServiceClient $client;

    public function __construct()
    {
        $this->client = new SdRecalculateServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function recalculateSd(SdRecalculationFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new SdRecalculateWithMultipleConnectionsRequest;
        $grpcRequest->setConnectionIds($request->connectionIds);
        $grpcRequest->setStartDate($request->startDate);
        $grpcRequest->setEndDate($request->endDate);
        if ($request->triggerTypeId != null) {
            $grpcRequest->setTriggerTypeId($request->triggerTypeId);
        }

        [$response, $status] = $this->client
            ->RecalculateSdWithMultipleConnections($grpcRequest)
            ->wait();

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
}
