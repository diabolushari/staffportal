<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\GrpcConverters\Metering\MeterTransformerRelProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\MeteringTimezone\MeteringTimezoneService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Connections\ConnectionPeriodDetailsServiceClient;
use Proto\Connections\GetConnectionPeriodDetailsRequest;
use Proto\Connections\GetConnectionPeriodDetailsResponse;
use Proto\Connections\MeterPeriodDetails;
use Proto\Connections\ProfileHistoryItem;
use Proto\Connections\TimezoneHistoryItem;

class ConnectionPeriodDetailsService
{
    private ConnectionPeriodDetailsServiceClient $client;

    public function __construct()
    {
        $this->client = new ConnectionPeriodDetailsServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * @param  array<int|string>  $meterIds
     */
    public function getConnectionPeriodDetails(
        int $connectionId,
        array $meterIds = [],
        ?string $startDate = null,
        ?string $endDate = null,
    ): GrpcServiceResponse {
        $request = new GetConnectionPeriodDetailsRequest;
        $request->setConnectionId($connectionId);

        if ($meterIds !== []) {
            $request->setMeterIds($meterIds);
        }

        if ($startDate !== null) {
            $request->setStartDate($startDate);
        }

        if ($endDate !== null) {
            $request->setEndDate($endDate);
        }

        /**
         * @var GetConnectionPeriodDetailsResponse|null $response
         */
        [$response, $status] = $this->client->GetConnectionPeriodDetails($request)->wait();

        if ($status->code !== 0 || $response === null) {
            $validationErrors = [];
            if (GrpcErrorService::isValidationError($status->code)) {
                $validationErrors = GrpcErrorService::convertToValidationError($status);
            }

            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details,
                null,
                $validationErrors,
            );
        }

        return GrpcServiceResponse::success(
            $this->toArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(GetConnectionPeriodDetailsResponse $response): array
    {
        $connections = [];
        foreach ($response->getConnections() as $connection) {
            $connections[] = ConnectionProtoConverter::convertToArray($connection);
        }

        $meters = [];
        foreach ($response->getMeters() as $meter) {
            $meters[] = $this->meterPeriodDetailsToArray($meter);
        }

        return [
            'connections' => $connections,
            'meters' => $meters,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function meterPeriodDetailsToArray(MeterPeriodDetails $meter): array
    {
        $profiles = [];
        foreach ($meter->getProfiles() as $profile) {
            $profiles[] = $this->profileHistoryToArray($profile);
        }

        $timezones = [];
        foreach ($meter->getTimezones() as $timezone) {
            $timezones[] = $this->timezoneHistoryToArray($timezone);
        }

        $transformerRelations = [];
        foreach ($meter->getTransformerRelations() as $transformerRelation) {
            $transformerRelations[] = MeterTransformerRelProtoConvertor::relProtoToArray($transformerRelation);
        }

        return [
            'meter_id' => $meter->getMeterId(),
            'profiles' => $profiles,
            'timezones' => $timezones,
            'transformer_relations' => $transformerRelations,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function profileHistoryToArray(ProfileHistoryItem $profileHistoryItem): array
    {
        $profileParameters = [];
        foreach ($profileHistoryItem->getProfileParameters() as $profileParameter) {
            $profileParameters[] = MeteringParameterProfileService::toArray($profileParameter);
        }

        return [
            'profile' => ParameterValueProtoConvertor::convertToArray($profileHistoryItem->getProfile()),
            'profile_parameters' => $profileParameters,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function timezoneHistoryToArray(TimezoneHistoryItem $timezoneHistoryItem): array
    {
        $meteringTimezones = [];
        foreach ($timezoneHistoryItem->getMeteringTimezones() as $meteringTimezone) {
            $meteringTimezones[] = MeteringTimezoneService::timezoneProtoToArray($meteringTimezone);
        }

        return [
            'timezone_type' => ParameterValueProtoConvertor::convertToArray($timezoneHistoryItem->getTimezoneType()),
            'metering_timezones' => $meteringTimezones,
        ];
    }
}
