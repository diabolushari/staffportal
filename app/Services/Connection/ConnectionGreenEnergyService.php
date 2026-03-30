<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionGreenEnergyConverter;
use App\Http\Requests\Connections\ConnectionGreenEnergyFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\GreenEnergy\CreateGreenEnergyRequest;
use Proto\GreenEnergy\UpdateGreenEnergyRequest;
use Proto\GreenEnergy\DeleteGreenEnergyRequest;
use Proto\GreenEnergy\GreenEnergyServiceClient;

class ConnectionGreenEnergyService
{
    private GreenEnergyServiceClient $client;

    public function __construct(private readonly ConnectionGreenEnergyConverter $connectionGreenEnergyService)
    {
        $this->client = new GreenEnergyServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function create(ConnectionGreenEnergyFormRequest $request): GrpcServiceResponse
    {
        $greenEnergy = $this->connectionGreenEnergyService->formToGrpcMessage($request);

        $grpcRequest = new CreateGreenEnergyRequest;
        $grpcRequest->setGreenEnergy($greenEnergy);

        [$response, $status] =
            $this->client->CreateGreenEnergy($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $greenEnergyArray = $this->connectionGreenEnergyService->convertToArray($response->getGreenEnergy());
       

        return GrpcServiceResponse::success(
            $greenEnergyArray,
            $response,
            $status->code,
            $status->details
        );
    }

    public function update(ConnectionGreenEnergyFormRequest $request, int $id): GrpcServiceResponse
    {
        $greenEnergy =
            $this->connectionGreenEnergyService
                ->formToGrpcUpdateMessage($request, $id);

        $grpcRequest = new UpdateGreenEnergyRequest;
        $grpcRequest->setGreenEnergy($greenEnergy);

        [$response, $status] =
            $this->client->UpdateGreenEnergy($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->connectionGreenEnergyService
                ->convertToArray($response->getGreenEnergy()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function deleteGreenEnergy(int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeleteGreenEnergyRequest();
        $grpcRequest->setId($id);

        [$response, $status] =
            $this->client->DeleteGreenEnergy($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            null,
            $response,
            $status->code,
            $status->details
        );
    }


}
