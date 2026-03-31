<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionGenerationProtoConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Connections\ConnectionGenerationTypeServiceClient;
use Proto\Connections\CreateConnectionGenerationTypeRequest;
use Proto\Connections\UpdateConnectionGenerationTypeRequest;
use Proto\Connections\GetConnectionGenerationTypeRequest;
use Proto\Connections\ListConnectionGenerationTypesByConnectionRequest;

class ConnectionGenerationTypeService
{
    private ConnectionGenerationTypeServiceClient $client;

    public function __construct()
    {
        $this->client = new ConnectionGenerationTypeServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listByConnection(int $connectionId): GrpcServiceResponse
    {
        $request = new ListConnectionGenerationTypesByConnectionRequest();
        $request->setConnectionId($connectionId);

        [$response, $status] =
            $this->client->ListConnectionGenerationTypesByConnection($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $items = [];
        foreach ($response->getItems() as $item) {
            $items[] = ConnectionGenerationProtoConverter::convertToArray($item);
        }

        return GrpcServiceResponse::success($items, $response, $status->code, $status->details);
    }

    public function get(int $id): GrpcServiceResponse
    {
        $request = new GetConnectionGenerationTypeRequest();
        $request->setId($id);

        [$response, $status] =
            $this->client->GetConnectionGenerationType($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            ConnectionGenerationProtoConverter::convertToArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    public function create(int $connectionId, int $generationTypeId, ?int $generationSubtypeId): GrpcServiceResponse
    {
        $request = new CreateConnectionGenerationTypeRequest();
        $request->setConnectionId($connectionId);
        $request->setGenerationTypeId($generationTypeId);

        if ($generationSubtypeId !== null) {
            $request->setGenerationSubtypeId($generationSubtypeId);
        }

        [$response, $status] =
            $this->client->CreateConnectionGenerationType($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            ConnectionGenerationProtoConverter::convertToArray($response->getGenerationType()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function update(int $connectionId, array $data): GrpcServiceResponse
    {
        $request = new UpdateConnectionGenerationTypeRequest();
        $request->setConnectionId($connectionId);
        if (!empty($data)) {
            foreach ($data as $generationType) {

                $generationPayload = [
                    'connection_id' => $request->connectionId ?? 0,
                    'generation_type_id' => $generationType['id'],
                    'generation_sub_type_id' => $generationType['generation_sub_type_id'] ??  null,
                    'value' => $generationType['value'],
                    'label' => $generationType['label'],
                ];

                $request->getGenerationTypes()[] =
                    ConnectionGenerationProtoConverter::convertToFormRequest(
                        $generationPayload
                    );
            }
        }

        [$response, $status] =
            $this->client->UpdateConnectionGenerationType($request)->wait();

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
