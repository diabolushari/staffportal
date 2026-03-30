<?php

declare(strict_types=1);

namespace App\Services\MeteringTimezone;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\CreateMeteringTimezoneRequest;
use Proto\Metering\DeleteMeteringTimezoneRequest;
use Proto\Metering\GetMeteringTimezoneRequest;
use Proto\Metering\GetMeteringTimezonesByPricingTypeRequest;
use Proto\Metering\GetTimezoneGroupByTimezoneTypeRequest;
use Proto\Metering\ListMeteringTimezonesRequest;
use Proto\Metering\ListTimezoneGroupByMeteringTypeRequest;
use Proto\Metering\MeteringTimezoneResponse;
use Proto\Metering\MeteringTimezoneServiceClient;
use Proto\Metering\TimezoneGroup;
use Proto\Metering\UpdateMeteringTimezoneRequest;

class MeteringTimezoneService
{
    private MeteringTimezoneServiceClient $client;

    public function __construct()
    {
        $this->client = new MeteringTimezoneServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeteringTimezone(array $data): GrpcServiceResponse
    {
        $request = new CreateMeteringTimezoneRequest;

        if (array_key_exists('metering_timezone_id', $data)) {
            $request->setMeteringTimezoneId($data['metering_timezone_id']);
        }
        $request->setTimezoneTypeId($data['timezone_type_id'] ?? 0);
        $request->setTimezoneNameId($data['timezone_name_id'] ?? 0);
        $request->setFromHrs($data['from_hrs'] ?? 0);
        $request->setFromMins($data['from_mins'] ?? 0);
        $request->setToHrs($data['to_hrs'] ?? 0);
        $request->setToMins($data['to_mins'] ?? 0);

        if (! empty($data['effective_start_ts']) && ($ts = self::toTimestamp($data['effective_start_ts']))) {
            $request->setEffectiveStartTs($ts);
        }
        if (! empty($data['effective_end_ts']) && ($ts = self::toTimestamp($data['effective_end_ts']))) {
            $request->setEffectiveEndTs($ts);
        }
        if (array_key_exists('is_active', $data)) {
            $request->setIsActive((bool) $data['is_active']);
        }
        $request->setCreatedBy($data['created_by'] ?? 0);

        [$response, $status] = $this->client->CreateMeteringTimezone($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::timezoneProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeteringTimezone(int $id): GrpcServiceResponse
    {
        $request = new GetMeteringTimezoneRequest;
        $request->setMeteringTimezoneId($id);

        [$response, $status] = $this->client->GetMeteringTimezone($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::timezoneProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeteringTimezonesByPricingType(int $pricingTypeId): GrpcServiceResponse
    {
        $request = new GetMeteringTimezonesByPricingTypeRequest;
        $request->setPricingTypeId($pricingTypeId);

        [$response, $status] = $this->client->GetMeteringTimezonesByPricingType($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $timezonesArray = [];
        foreach ($response->getMeteringTimezones() as $tz) {
            $timezonesArray[] = self::timezoneProtoToArray($tz);
        }

        return GrpcServiceResponse::success($timezonesArray, $response, $status->code, $status->details);
    }

    public function listTimezoneGroupByMeteringType(?int $profileId = null, ?string $search = null): GrpcServiceResponse
    {
        $request = new ListTimezoneGroupByMeteringTypeRequest;
        if ($profileId) {
            $request->setProfileId($profileId);
        }
        if ($search) {
            $request->setSearch($search);
        }

        [$response, $status] = $this->client->ListTimezoneGroupByMeteringType($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $timezonesArray = [];
        foreach ($response->getTimezoneGroups() as $tz) {
            $timezonesArray[] = self::timezoneByGroupBymessageToArray($tz);
        }

        return GrpcServiceResponse::success($timezonesArray, $response, $status->code, $status->details);
    }

    public function getTimezoneGroupByTimezoneType(int $timezoneTypeId): GrpcServiceResponse
    {
        $request = new GetTimezoneGroupByTimezoneTypeRequest;
        $request->setTimezoneTypeId($timezoneTypeId);

        [$response, $status] = $this->client->GetTimezoneGroupByTimezoneType($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::timezoneByGroupBymessageToArray($response->getTimezoneGroup()), $response, $status->code, $status->details);
    }

    public function listMeteringTimezones(
        ?int $pricingTypeId = 0,
        ?int $timezoneTypeId = 0,
        ?int $timezoneNameId = 0
    ): GrpcServiceResponse {
        $request = new ListMeteringTimezonesRequest;
        if ($timezoneTypeId) {
            $request->setTimezoneTypeId($timezoneTypeId);
        }
        if ($timezoneNameId) {
            $request->setTimezoneNameId($timezoneNameId);
        }

        [$response, $status] = $this->client->ListMeteringTimezones($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $timezonesArray = [];
        foreach ($response->getMeteringTimezones() as $tz) {
            $timezonesArray[] = self::timezoneProtoToArray($tz);
        }

        return GrpcServiceResponse::success($timezonesArray, $response, $status->code, $status->details);
    }

    public function updateMeteringTimezone(array $data): GrpcServiceResponse
    {
        if (empty($data['metering_timezone_id'])) {
            return GrpcServiceResponse::error(['metering_timezone_id' => ['metering_timezone_id is required']], null, 3, 'INVALID_ARGUMENT');
        }

        $request = new UpdateMeteringTimezoneRequest;
        $request->setMeteringTimezoneId($data['metering_timezone_id']);
        $request->setTimezoneTypeId($data['timezone_type_id'] ?? 0);
        $request->setTimezoneNameId($data['timezone_name_id'] ?? 0);
        $request->setFromHrs($data['from_hrs'] ?? 0);
        $request->setFromMins($data['from_mins'] ?? 0);
        $request->setToHrs($data['to_hrs'] ?? 0);
        $request->setToMins($data['to_mins'] ?? 0);

        if (! empty($data['effective_start_ts']) && ($ts = self::toTimestamp($data['effective_start_ts']))) {
            $request->setEffectiveStartTs($ts);
        }
        if (! empty($data['effective_end_ts']) && ($ts = self::toTimestamp($data['effective_end_ts']))) {
            $request->setEffectiveEndTs($ts);
        }
        if (array_key_exists('is_active', $data)) {
            $request->setIsActive((bool) $data['is_active']);
        }
        if (array_key_exists('updated_by', $data)) {
            $request->setUpdatedBy($data['updated_by']);
        }

        [$response, $status] = $this->client->UpdateMeteringTimezone($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::timezoneProtoToArray($response), $response, $status->code, $status->details);
    }

    public function timezoneByGroupBymessageToArray(TimezoneGroup $timezoneGroup): array
    {
        // Convert RepeatedField to normal PHP array (preserves object type)
        $meteringTimezones = iterator_to_array($timezoneGroup->getMeteringTimezones());

        return [
            'timezone_type' => ParameterValueProtoConvertor::convertToArray($timezoneGroup->getTimezoneType()),
            'metering_timezones' => array_map(
                fn (MeteringTimezoneResponse $tz) => self::timezoneProtoToArray($tz),
                $meteringTimezones
            ),
        ];
    }

    public function deleteMeteringTimezone(int $id): GrpcServiceResponse
    {
        $request = new DeleteMeteringTimezoneRequest;
        $request->setMeteringTimezoneId($id);

        [$response, $status] = $this->client->DeleteMeteringTimezone($request)->wait();

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

    /**
     * Convert MeteringTimezoneResponse proto to associative array
     */
    public static function timezoneProtoToArray(MeteringTimezoneResponse $tz): array
    {
        return [
            'version_id' => $tz->getVersionId(),
            'metering_timezone_id' => $tz->getMeteringTimezoneId(),
            'timezone_type' => ParameterValueProtoConvertor::convertToArray($tz->getTimezoneType()),
            'timezone_name' => ParameterValueProtoConvertor::convertToArray($tz->getTimezoneName()),
            'timezone_name_id' => $tz->getTimezoneNameId(),
            'from_hrs' => $tz->getFromHrs(),
            'from_mins' => $tz->getFromMins(),
            'to_hrs' => $tz->getToHrs(),
            'to_mins' => $tz->getToMins(),
            'effective_start_ts' => $tz->getEffectiveStartTs()?->toDateTime()->format('Y-m-d H:i:s'),
            'effective_end_ts' => $tz->hasEffectiveEndTs() ? DateTimeConverter::convertTimestampToString($tz->getEffectiveEndTs()) : null,
            'is_active' => $tz->hasIsActive() ? $tz->getIsActive() : null,
            'created_ts' => $tz->getCreatedTs()?->toDateTime()->format('Y-m-d H:i:s'),
            'updated_ts' => $tz->hasUpdatedTs() ? DateTimeConverter::convertTimestampToString($tz->getUpdatedTs()) : null,
            'created_by' => $tz->getCreatedBy(),
            'updated_by' => $tz->hasUpdatedBy() ? $tz->getUpdatedBy() : null,
        ];
    }

    private static function toTimestamp(\DateTimeInterface|string|int $value): ?Timestamp
    {
        try {
            if ($value instanceof \DateTimeInterface) {
                $dt = $value;
            } elseif (is_int($value)) {
                $dt = (new \DateTimeImmutable('@'.$value))->setTimezone(new \DateTimeZone('UTC'));
            } else {
                $dt = new \DateTimeImmutable($value);
            }

            $ts = new Timestamp;
            $ts->fromDateTime($dt);

            return $ts;
        } catch (\Throwable) {
            return null;
        }
    }
}
