<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionPartiesConverter;
use App\Http\Requests\Connections\ConnectionPartiesMappingFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Proto\Consumers\CreatePartiesConnectionRelRequest;
use Proto\Consumers\DeletePartiesConnectionRelRequest;
use Proto\Consumers\ListPartiesConnectionRelRequest;
use Proto\Consumers\PartiesConnectionRelServiceClient;
use Proto\Consumers\UpdatePartiesConnectionRelRequest;

class ConnectionPartiesMappingService
{
    private PartiesConnectionRelServiceClient $client;

    public function __construct(
        private readonly ConnectionPartiesConverter $connectionPartiesConverter
    ) {
        $this->client = new PartiesConnectionRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createConnectionPartiesMapping(ConnectionPartiesMappingFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new CreatePartiesConnectionRelRequest;
        $grpcRequest->setPartyId($request->partyId);
        $grpcRequest->setConnectionId($request->connectionId);
        $grpcRequest->setPartyRelationTypeId($request->partyRelationTypeId);
        $effectiveStart = DateTimeConverter::convertStringToTimestamp($request->effectiveStart);
        $effectiveEnd = DateTimeConverter::convertStringToTimestamp($request->effectiveEnd);
        if ($effectiveStart) {
            $grpcRequest->setEffectiveStart($effectiveStart);
        }
        if ($effectiveEnd) {
            $grpcRequest->setEffectiveEnd($effectiveEnd);
        }
        $user = FacadesAuth::user();
        if ($user) {
            $grpcRequest->setCreatedBy($user->id);
        }

        [$response, $status] = $this->client->CreatePartiesConnectionRel($grpcRequest)->wait();
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

    public function listConnectionParties(int $connectionId, ?int $partyId): GrpcServiceResponse
    {
        $grpcRequest = new ListPartiesConnectionRelRequest;
        if ($partyId) {
            $grpcRequest->setPartyId($partyId);
        }
        if ($connectionId) {
            $grpcRequest->setConnectionId($connectionId);
        }
        [$response, $status] = $this->client->ListPartiesConnectionRel($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $parties = $response->getItems();
        $partiesArray = [];
        foreach ($parties as $party) {
            $partiesArray[] = $this->connectionPartiesConverter->convertToArray($party);
            $partiesArray[] = $this->connectionPartiesConverter->convertToArray($party);
        }

        return GrpcServiceResponse::success(
            $partiesArray,
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateConnectionPartiesMapping(ConnectionPartiesMappingFormRequest $request, int $id): GrpcServiceResponse
    {
        $grpcRequest = new UpdatePartiesConnectionRelRequest;
        $grpcRequest->setPartyId($request->partyId);
        $grpcRequest->setConnectionId($request->connectionId);
        if ($request->versionId) {
            $grpcRequest->setVersionId($request->versionId);
        }
        $effectiveStart = DateTimeConverter::convertStringToTimestamp($request->effectiveStart);
        if ($effectiveStart) {
            $grpcRequest->setEffectiveStart($effectiveStart);
        }
        $grpcRequest->setIsActive(true);
        $user = FacadesAuth::user();
        if ($user) {
            $grpcRequest->setUpdatedBy($user->id);
        }
        if ($request->effectiveEnd) {
            $effectiveEnd = DateTimeConverter::convertStringToTimestamp($request->effectiveEnd);
            if ($effectiveEnd) {
                $grpcRequest->setEffectiveEnd($effectiveEnd);
            }
        }
        [$response, $status] = $this->client->UpdatePartiesConnectionRel($grpcRequest)->wait();
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

    public function deleteConnectionPartiesMapping(int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeletePartiesConnectionRelRequest;
        $grpcRequest->setVersionId($id);
        [$response, $status] = $this->client->DeletePartiesConnectionRel($grpcRequest)->wait();
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
