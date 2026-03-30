<?php

namespace App\Services\Metering;

use App\GrpcConverters\Connection\MeterConnectionMappingConverter;
use App\GrpcConverters\Meter\MeterProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Connections\ConnectionMeterChangeReasonFormRequest;
use App\Http\Requests\Connections\ConnectionMeterStatusFormRequest;
use App\Http\Requests\Metering\MeterConnectionRelFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use DateTime;
use DateTimeInterface;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\CreateMeterConnectionMappingRequest;
use Proto\Metering\DeleteMeterConnectionMappingRequest;
use Proto\Metering\GetMeterConnectionMappingByConnectionIdRequest;
use Proto\Metering\GetMeterConnectionMappingRequest;
use Proto\Metering\ListMeterConnectionMappingsRequest;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\Metering\MeterConnectionMappingServiceClient;
use Proto\Metering\MeterTransformerRelFormRequest;
use Proto\Metering\UpdateMeterConnectionMappingRequest;
use Proto\Parameters\ParameterValueProto;

class MeterConnectionMappingService
{
    private MeterConnectionMappingServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterConnectionMappingServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeterConnectionMapping(MeterConnectionRelFormRequest $data): GrpcServiceResponse
    {

        $request = new CreateMeterConnectionMappingRequest;
        $request->setMeterId($data->meterId);
        $request->setConnectionId($data->connectionId);
        $request->setMeterUseCategory($data->meterUseCategory);
        $request->setProfileId($data->meterProfileId);
        $request->setTimezoneTypeId($data->timezoneTypeId);
        $request->setMeterStatusId($data->meterStatusId);
        if ($data->meterMf !== null) {
            $request->setMeterMf($data->meterMf);
        }
        if (isset($data->sortPriority)) {
            $request->setSortPriority($data->sortPriority);
        }
        if ($data->energiseDate !== '') {
            $request->setEnergiseDate($data->energiseDate);
        }
        $request->setIsMeterReadingMandatory($data->isMeterReadingMandatory);

        $effectiveStartTs = new Timestamp;
        $request->setEffectiveStartTs($effectiveStartTs);

        if ($data->meterTransformers !== null) {
            foreach ($data->meterTransformers as $transformer) {

                $transformer_proto = new MeterTransformerRelFormRequest;

                $transformer_proto->setCtptId($transformer->ctptId);
                $transformer_proto->setStatusId($transformer->statusId);

                if ($transformer->changeReasonId !== null) {
                    $transformer_proto->setChangeReasonId($transformer->changeReasonId);
                }

                // faulty_date
                if ($transformer->faultyDate !== null) {
                    $faulty = new Timestamp;
                    $faulty->fromDateTime(new DateTime($transformer->faultyDate));
                    $transformer_proto->setFaultyDate($faulty);
                }

                // ctpt_energise_date
                if ($transformer->ctptEnergiseDate !== null) {
                    $dateTime = $transformer->ctptEnergiseDate instanceof DateTimeInterface
                        ? $transformer->ctptEnergiseDate
                        : new DateTime($transformer->ctptEnergiseDate);

                    $energise = new Timestamp;
                    $energise->fromDateTime($dateTime);

                    $transformer_proto->setCtptEnergiseDate($energise);
                }

                // ctpt_change_date
                if ($transformer->ctptChangeDate !== null) {
                    $change = new Timestamp;
                    $change->fromDateTime(new DateTime($transformer->ctptChangeDate));
                    $transformer_proto->setCtptChangeDate($change);
                }

                // Add to main request
                $request->getMeterTransformers()[] = $transformer_proto;
            }
        }

        [$response, $status] = $this->client->CreateMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeterConnectionMapping(int $relId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionMappingRequest;
        $request->setRelId($relId);

        [$response, $status] = $this->client->GetMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeterConnectionMappingByConnectionId(int $connectionId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionMappingByConnectionIdRequest;
        $request->setConnectionId($connectionId);

        [$response, $status] = $this->client->GetMeterConnectionMappingByConnectionId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,
            );
        }

        $items = [];
        foreach ($response->getMeterConnectionMappings() as $mapping) {
            $items[] = self::meterConnectionMappingProtoToArray($mapping);
        }

        return GrpcServiceResponse::success($items, $response, $status->code, $status->details);
    }

    public function listMeterConnectionMappings(int $connectionId): GrpcServiceResponse
    {
        $request = new ListMeterConnectionMappingsRequest;
        $request->setConnectionId($connectionId);

        [$response, $status] = $this->client->ListMeterConnectionMappings($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relsArray = [];
        foreach ($response->getMeterConnectionMappings() as $rel) {
            $relsArray[] = self::meterConnectionMappingProtoToArray($rel);
        }

        return GrpcServiceResponse::success($relsArray, $response, $status->code, $status->details);
    }

    public function updateMeterConnectionStatus(ConnectionMeterStatusFormRequest $data): GrpcServiceResponse
    {
        $request = MeterConnectionMappingConverter::arrayToUpdateMeterConnectionStatusRequest($data);

        [$response, $status] = $this->client->UpdateMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function updateMeterConnectionChangeReason(ConnectionMeterChangeReasonFormRequest $data): GrpcServiceResponse
    {
        $request = MeterConnectionMappingConverter::arrayToUpdateMeterConnectionChangeRequest($data);

        [$response, $status] = $this->client->UpdateMeterConnectionChangeReason($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function updateMeterConnectionMapping(MeterConnectionRelFormRequest $data): GrpcServiceResponse
    {
        $request = new UpdateMeterConnectionMappingRequest;
        if (isset($data->relId)) {
            $request->setRelId($data->relId);
        }
        if (isset($data->meterUseCategory)) {
            $request->setMeterUseCategory($data->meterUseCategory);
        }

        if (isset($data->meterProfileId)) {
            $request->setProfileId($data->meterProfileId);
        }

        if (isset($data->timezoneTypeId)) {
            $request->setTimezoneTypeId($data->timezoneTypeId);
        }

        if ($data->meterMf !== null) {
            $request->setMeterMf((float) $data->meterMf);
        }

        if (isset($data->meterStatusId)) {
            $request->setMeterStatusId($data->meterStatusId);
        }

        if ($data->energiseDate !== '') {
            $request->setEnergiseDate($data->energiseDate);
        }

        if (isset($data->sortPriority)) {
            $request->setSortPriority($data->sortPriority);
        }
        $request->setIsMeterReadingMandatory($data->isMeterReadingMandatory);

        /** @var MeterConnectionMappingResponse $response */
        [$response, $status] = $this->client->UpdateMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function deleteMeterConnectionMapping(int $relId): GrpcServiceResponse
    {
        $request = new DeleteMeterConnectionMappingRequest;
        $request->setRelId($relId);

        [$response, $status] = $this->client->DeleteMeterConnectionMapping($request)->wait();

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

    public function updateMeterConnectionProfile(int $relId, int $profileId): GrpcServiceResponse
    {
        $request = new UpdateMeterConnectionMappingRequest;
        $request->setRelId($relId);
        $request->setProfileId($profileId);

        [$response, $status] = $this->client->UpdateMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    /**
     * @return array<string, mixed>
     */
    public function meterConnectionMappingProtoToArray(MeterConnectionMappingResponse $rel): array
    {
        $faultyDate = $rel->hasFaultyDate() ? $rel->getFaultyDate() : null;
        $rectificationDate = $rel->hasRectificationDate() ? $rel->getRectificationDate() : null;
        $effectiveStartTs = $rel->getEffectiveStartTs() !== '' ? $rel->getEffectiveStartTs() : null;
        $effectiveEndTs = $rel->getEffectiveEndTs() !== '' ? $rel->getEffectiveEndTs() : null;
        $createdTs = $rel->getCreatedTs() ? $rel->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $updatedTs = $rel->getUpdatedTs() ? $rel->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $meter = MeterProtoConvertor::convertToArray($rel->getMeter());
        $noticeDate = $rel->hasNoticeDate() ? $rel->getNoticeDate() : null;
        $intimationDate = $rel->hasIntimationDate() ? $rel->getIntimationDate() : null;
        $changeDate = $rel->hasChangeDate() ? $rel->getChangeDate() : null;
        $meterProfile = ParameterValueProtoConvertor::convertToArray($rel->getProfile());
        $energiseDate = $rel->hasEnergiseDate() ? $rel->getEnergiseDate() : null;
        $meter = MeterProtoConvertor::convertToArray($rel->getMeter());

        $timezoneType = $meter['meter_timezone_type_rel'][0]['timezone_type'] ?? null;
        $timezoneTypeId = $timezoneType['id'] ?? null;

        return [
            'version_id' => $rel->getVersionId(),
            'rel_id' => $rel->getRelId(),
            'meter_id' => $rel->getMeterId(),
            'connection_id' => $rel->getConnectionId(),
            'meter_use_category' => self::transformParameterValueToArray($rel->getMeterUseCategory()),
            'meter_status' => self::transformParameterValueToArray($rel->getMeterStatus()),
            'faulty_date' => $faultyDate,
            'rectification_date' => $rectificationDate,
            'meter_mf' => $rel->getMeterMf(),
            'sort_priority' => $rel->getSortPriority(),
            'is_meter_reading_mandatory' => $rel->getIsMeterReadingMandatory(),
            'change_reason' => self::transformParameterValueToArray($rel->getChangeReason()),
            'effective_start_ts' => $effectiveStartTs,
            'effective_end_ts' => $effectiveEndTs,
            'is_active' => $rel->getIsActive(),
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
            'meter' => $meter,
            'notice_date' => $noticeDate,
            'intimation_date' => $intimationDate,
            'change_date' => $changeDate,
            'meter_profile' => $meterProfile,
            'energise_date' => $energiseDate,
            'timezone_type' => $timezoneType,
            'timezone_type_id' => $timezoneTypeId,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function transformParameterValueToArray(?ParameterValueProto $parameterValue): ?array
    {
        if ($parameterValue == null) {
            return null;
        }

        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
        ];
    }
}
