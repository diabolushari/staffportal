<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionFlagProtoConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Connections\ConnectionFlagServiceClient;
use Proto\Connections\CreateConnectionFlagRequest;
use Proto\Connections\UpdateConnectionFlagRequest;
use Proto\Connections\GetConnectionFlagRequest;
use Proto\Connections\ListConnectionFlagsByConnectionRequest;
use Proto\Connections\ConnectionFlagMessage;


class ConnectionFlagService
{
    private ConnectionFlagServiceClient $client;

    public function __construct(
        private readonly ParameterValueService $parameterValueService
    ) {
        $this->client = new ConnectionFlagServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    private function toArray(?ConnectionFlagMessage $flag): ?array
    {
        if ($flag === null) {
            return null;
        }

        return [
            'id' => $flag->getId(),
            'connection_id' => $flag->getConnectionId(),
            'flag_id' => $flag->getFlagId(),

            'effective_start' => $flag->getEffectiveStart()
                ? $flag->getEffectiveStart()->toDateTime()->format('Y-m-d')
                : null,

            'effective_end' => $flag->getEffectiveEnd()
                ? $flag->getEffectiveEnd()->toDateTime()->format('Y-m-d')
                : null,

            'is_current' => $flag->getIsCurrent(),

            'created_at' => $flag->getCreatedTs()
                ? $flag->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s')
                : null,

            'updated_at' => $flag->getUpdatedTs()
                ? $flag->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s')
                : null,

            'deleted_at' => $flag->getDeletedTs()
                ? $flag->getDeletedTs()->toDateTime()->format('Y-m-d H:i:s')
                : null,

            'created_by' => $flag->getCreatedBy() ?: null,
            'updated_by' => $flag->getUpdatedBy() ?: null,
            'deleted_by' => $flag->getDeletedBy() ?: null,


            'flag' => $flag->getFlag()
                ? $this->parameterValueService->toArray($flag->getFlag())
                : null,
        ];
    }

    public function create(int $connectionId, int $flagId): GrpcServiceResponse
    {
        $request = new CreateConnectionFlagRequest();
        $request->setConnectionId($connectionId);
        $request->setFlagId($flagId);


        [$response, $status] = $this->client->CreateConnectionFlag($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->toArray($response->getFlag()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function update(int $connectionId, array $flagGroups): GrpcServiceResponse
    {
        $request = new UpdateConnectionFlagRequest();
        $request->setConnectionId($connectionId);
        if (!empty($flagGroups)) {
            foreach ($flagGroups as $group) {

                if (empty($group['flags'])) {
                    continue;
                }

                foreach ($group['flags'] as $flag) {

                    $flagPayload = [
                        'connection_id' => $connectionId,
                        'flag_id' => $flag['id'],
                        'value' => $flag['value'],
                        'label' => $flag['label'],
                    ];

                    $request->getFlags()[] =
                        ConnectionFlagProtoConverter::convertToFormRequest($flagPayload);
                }
            }
        }


        [$response, $status] = $this->client->UpdateConnectionFlag($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->toArray($response->getFlag()),
            $response,
            $status->code,
            $status->details
        );
    }


    public function get(int $id): GrpcServiceResponse
    {
        $request = new GetConnectionFlagRequest();
        $request->setId($id);

        [$response, $status] = $this->client->GetConnectionFlag($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->toArray($response),
            $response,
            $status->code,
            $status->details
        );
    }


    public function listByConnection(?int $connectionId = null): GrpcServiceResponse
    {
        $request = new ListConnectionFlagsByConnectionRequest();
        if ($connectionId !== null) {
            $request->setConnectionId($connectionId);
        }

        [$response, $status] =
            $this->client->ListConnectionFlagsByConnection($request)->wait();

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
            $items[] = $this->toArray($item);
        }

        return GrpcServiceResponse::success(
            $items,
            $response,
            $status->code,
            $status->details
        );
    }
}
