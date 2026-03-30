<?php

namespace App\Services\SecurityDeposit;

use App\GrpcConverters\SecurityDeposit\SdBalanceSummaryConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\SdBalanceSummaryListByConnectionIdRequest;
use Proto\Consumers\SdBalanceSummaryServiceClient;

class SdBalanceSummaryService
{
    private SdBalanceSummaryServiceClient $client;

    public function __construct(
        private readonly SdBalanceSummaryConverter $sdBalanceSummaryConverter,
    ) {
        $this->client = new SdBalanceSummaryServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getbalanceSummaryByConnectionId(int $connectionId)
    {

        $request = new SdBalanceSummaryListByConnectionIdRequest;
        $request->setConnectionId($connectionId);
        [$response, $status] = $this->client->GetSdBalanceSummaryByConnectionId($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $sdBalanceSummary = $response->getSdBalanceSummary();
        $sdBalanceSummaryArray = $this->sdBalanceSummaryConverter->convertToArray($sdBalanceSummary);

        return GrpcServiceResponse::success($sdBalanceSummaryArray, $response, $status->code, $status->details);
    }
}
