<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\CreateMeterTimezoneTypeRelRequest;
use Proto\Consumers\GetActiveMeterTimezoneTypeRelByMeterIdRequest;
use Proto\Consumers\GetActiveMeterTimezoneTypeRelRequest;
use Proto\Consumers\GetMeterTimezoneTypeRelByVersionIdRequest;
use Proto\Consumers\MeterTimezoneTypeRel;
use Proto\Consumers\MeterTimezoneTypeRelServiceClient;
use Proto\Consumers\UpdateMeterTimezoneTypeRelRequest;

class MeterTimezoneTypeRelService
{
    private $client;

    public function __construct()
    {
        $this->client = new MeterTimezoneTypeRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeterTimezoneTypeRel(array $data): GrpcServiceResponse
    {
        $request = new CreateMeterTimezoneTypeRelRequest;
        if (isset($data['rel_id'])) {
            $request->setRelId($data['rel_id']);
        }
        $request->setMeterId($data['meter_id']);
        $request->setTimezoneTypeId($data['timezone_type_id']);
        if (isset($data['created_by'])) {
            $request->setCreatedBy($data['created_by']);
        }

        [$response, $status] = $this->client->CreateMeterTimezoneTypeRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::meterTimezoneTypeRelProtoToArray($response->getMeterTimezoneTypeRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateMeterTimezoneTypeRel(array $data): GrpcServiceResponse
    {
        $request = new UpdateMeterTimezoneTypeRelRequest;
        $request->setRelId($data['rel_id']);
        $request->setMeterId($data['meter_id']);
        $request->setTimezoneTypeId($data['timezone_type_id']);
        if (isset($data['updated_by'])) {
            $request->setUpdatedBy($data['updated_by']);
        }

        [$response, $status] = $this->client->UpdateMeterTimezoneTypeRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::meterTimezoneTypeRelProtoToArray($response->getMeterTimezoneTypeRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getMeterTimezoneTypeRelByVersionId(int $versionId): GrpcServiceResponse
    {
        $request = new GetMeterTimezoneTypeRelByVersionIdRequest;
        $request->setVersionId($versionId);

        [$response, $status] = $this->client->GetMeterTimezoneTypeRelByVersionId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::meterTimezoneTypeRelProtoToArray($response->getMeterTimezoneTypeRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getActiveMeterTimezoneTypeRel(int $relId): GrpcServiceResponse
    {
        $request = new GetActiveMeterTimezoneTypeRelRequest;
        $request->setRelId($relId);

        [$response, $status] = $this->client->GetActiveMeterTimezoneTypeRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::meterTimezoneTypeRelProtoToArray($response->getMeterTimezoneTypeRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getActiveMeterTimezoneTypeRelByMeterId(int $meterId): GrpcServiceResponse
    {
        $request = new GetActiveMeterTimezoneTypeRelByMeterIdRequest;
        $request->setMeterId($meterId);

        [$response, $status] = $this->client->GetActiveMeterTimezoneTypeRelByMeterId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::meterTimezoneTypeRelProtoToArray($response->getMeterTimezoneTypeRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public static function meterTimezoneTypeRelProtoToArray(MeterTimezoneTypeRel $rel): array
    {
        $effectiveStartTs = $rel->getEffectiveStartTs()
            ? $rel->getEffectiveStartTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $effectiveEndTs = $rel->getEffectiveEndTs()
            ? $rel->getEffectiveEndTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $createdTs = $rel->getCreatedTs()
            ? $rel->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $updatedTs = $rel->getUpdatedTs()
            ? $rel->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        return [
            'version_id' => $rel->getVersionId(),
            'rel_id' => $rel->getRelId(),
            'meter_id' => $rel->getMeterId(),
            'timezone_type' => self::transformParameterValueToArray($rel->getTimezoneType()),
            'effective_start_ts' => $effectiveStartTs,
            'effective_end_ts' => $effectiveEndTs,
            'is_active' => $rel->getIsActive(),
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
        ];
    }

    private static function transformParameterValueToArray($parameterValue): ?array
    {
        if ($parameterValue === null) {
            return null;
        }

        // The structure is assumed based on usage in the provided controller context
        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
        ];
    }
}
