<?php

namespace App\Services\BillingGroup;

use App\GrpcConverters\BillingGroup\BillingGroupConnectionRelConverter;
use App\Http\Requests\BillingGroup\BillingGroupConnectionRelFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\BillingGroupConnectionRel\BillingGroupConnectionRelServiceClient;
use Proto\BillingGroupConnectionRel\CreateBillingGroupConnectionRelRequest;
use Proto\BillingGroupConnectionRel\DeleteBillingGroupConnectionRelRequest;
use Proto\BillingGroupConnectionRel\GetBillingGroupConnectionRelRequest;

class BillingGroupConnectionRelService
{
    private BillingGroupConnectionRelServiceClient $client;

    public function __construct()
    {
        $this->client = new BillingGroupConnectionRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createBillingGroupConnectionRel(BillingGroupConnectionRelFormRequest $request): GrpcServiceResponse
    {
        $req = new CreateBillingGroupConnectionRelRequest;

        $req->setConnectionId($request->connection_id);
        $req->setBillingGroupId($request->billing_group_id);

        [$response, $status] = $this->client->CreateBillingGroupConnectionRel($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupConnectionRelConverter::convert($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getBillingGroupConnectionRel(int $billingGroupId): GrpcServiceResponse
    {
        $req = new GetBillingGroupConnectionRelRequest;
        $req->setBillingGroupId($billingGroupId);

        [$response, $status] = $this->client
            ->GetBillingGroupConnectionRel($req)
            ->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupConnectionRelConverter::convert($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function deleteBillingGroupConnectionRel(int $versionId): GrpcServiceResponse
    {
        $req = new DeleteBillingGroupConnectionRelRequest;
        $req->setVersionId($versionId);

        [$response, $status] = $this->client
            ->DeleteBillingGroupConnectionRel($req)
            ->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            [],
            $response,
            $status->code,
            $status->details
        );
    }
}
