<?php

namespace App\Services\GeneratingStation;

use App\GrpcConverters\GeneratingStation\StationConsumerRelConverter;
use App\Http\Requests\GeneratingStation\StationConsumerRelFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\GeneratingStation\CreateStationConsumerRelRequest;
use Proto\GeneratingStation\DeactivateStationConsumerRelRequest;
use Proto\GeneratingStation\GetStationConsumerRelRequest;
use Proto\GeneratingStation\ListStationConsumersRequest;
use Proto\GeneratingStation\ListConsumerStationsRequest;
use Proto\GeneratingStation\StationConsumerRelServiceClient;
use Proto\GeneratingStation\UpdateStationConsumerRelPriorityRequest;

class StationConsumerRelService
{
    private StationConsumerRelServiceClient $client;

    public function __construct(
        private readonly StationConsumerRelConverter $stationConsumerRelConverter
    ) {
        $this->client = new StationConsumerRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listStationConsumers(int $stationId): GrpcServiceResponse
    {
        $request = new ListStationConsumersRequest();
        $request->setStationId($stationId);

        [$response, $status] = $this->client->ListStationConsumers($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relations = [];
        foreach ($response->getItems() as $item) {
            $relations[] = $this->stationConsumerRelConverter->convertToArray($item);
        }

        return GrpcServiceResponse::success(
            $relations,
            $response,
            $status->code,
            $status->details
        );
    }

    public function listConsumerStations(int $consumerConnectionId): GrpcServiceResponse
    {
        $request = new ListConsumerStationsRequest();
        $request->setConsumerConnectionId($consumerConnectionId);

        [$response, $status] = $this->client->ListConsumerStations($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relations = [];
        foreach ($response->getItems() as $item) {
            $relations[] = $this->stationConsumerRelConverter->convertToArray($item);
        }

        return GrpcServiceResponse::success(
            $relations,
            $response,
            $status->code,
            $status->details
        );
    }

    public function create(StationConsumerRelFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = $this->stationConsumerRelConverter
            ->formToCreateGrpcRequest($request);

        [$response, $status] =
            $this->client->CreateStationConsumerRel($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relation = $this->stationConsumerRelConverter
            ->convertToArray($response->getRelation());

        return GrpcServiceResponse::success(
            $relation,
            $response,
            $status->code,
            $status->details
        );
    }

      public function updatePriority(
        int $relId,
        int $stationConnectionId,
        ?int $consumerPriorityOrder,
        ?int $stationPriorityOrder,
        ?string $effectiveStart,
        ?string $effectiveEnd
    ): GrpcServiceResponse {

        $grpcRequest = new UpdateStationConsumerRelPriorityRequest();
        $grpcRequest->setRelId($relId);
        $grpcRequest->setStationConnectionId($stationConnectionId);
        if ($consumerPriorityOrder !== null) {
            $grpcRequest->setConsumerPriorityOrder($consumerPriorityOrder);
        }
        if ($stationPriorityOrder !== null) {
            $grpcRequest->setStationPriorityOrder($stationPriorityOrder);
        }
        if ($effectiveStart !== null) {
            $grpcRequest->setEffectiveStart($effectiveStart);
        }
        if ($effectiveEnd !== null) {
            $grpcRequest->setEffectiveEnd($effectiveEnd);
        }

        [$response, $status] =
            $this->client->UpdateStationConsumerRelPriority($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relation = $this->stationConsumerRelConverter
            ->convertToArray($response->getRelation());

        return GrpcServiceResponse::success(
            $relation,
            $response,
            $status->code,
            $status->details
        );
    }


    public function deactivate(int $relId, string $effectiveEnd): GrpcServiceResponse
    {
        $grpcRequest = new DeactivateStationConsumerRelRequest();

        $grpcRequest->setRelId($relId);
        $grpcRequest->setEffectiveEnd($effectiveEnd);

        [$response, $status] =
            $this->client->DeactivateStationConsumerRel($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([
            'success' => $response->getSuccess(),
        ]);
    }

    public function getStationConsumerRel(int $relId): GrpcServiceResponse
    {
        $request = new GetStationConsumerRelRequest();
        $request->setRelId($relId);

        [$response, $status] =
            $this->client->GetStationConsumerRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relation = $this->stationConsumerRelConverter
            ->convertToArray($response->getRelation());

        return GrpcServiceResponse::success(
            $relation,
            $response,
            $status->code,
            $status->details
        );
    }
}