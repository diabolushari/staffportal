<?php

namespace App\Services\Metering;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\GrpcConverters\Connection\MeterConnectionMappingConverter;
use App\GrpcConverters\Meter\MeterProtoConvertor;
use App\GrpcConverters\Metering\MeterReadingConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Grpc\ChannelCredentials;
use Proto\MeterReading\GetReadingEntryDataRequest;
use Proto\MeterReading\GetReadingEntryDataResponse;
use Proto\MeterReading\ReadingEntryDataServiceClient;

class GetReadingEntryService
{
    private ReadingEntryDataServiceClient $client;

    public function __construct(
        private MeterReadingValueService $meterReadingValueService
    ) {
        $this->client = new ReadingEntryDataServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getReadingEntryData(
        int $connectionId,
        ?string $readingStartDate = null,
        ?string $readingEndDate = null
    ): GrpcServiceResponse {
        $protoRequest = new GetReadingEntryDataRequest;
        $protoRequest->setConnectionId($connectionId);
        if ($readingStartDate) {
            $protoRequest->setReadingStartDate($readingStartDate);
        }
        if ($readingEndDate) {
            $protoRequest->setReadingEndDate($readingEndDate);
        }
        [$response, $status] = $this->client->GetReadingEntryData($protoRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterReadingsArray = [];

        $meterReadingsArray = $this->convertToMeterReadingData($response);

        return GrpcServiceResponse::success($meterReadingsArray, $response, $status->code, $status->details);
    }

    public function convertToMeterReadingData(GetReadingEntryDataResponse $response): array
    {
        $connections = $response->getConnection();
        $connectionsArray = [];
        foreach ($connections as $connection) {
            $connectionArray = ConnectionProtoConverter::convertToArray($connection);
            $connectionsArray[] = $connectionArray;
        }
        $meterReadingValueGroups = $response->getMeterReadingValueGroups();
        $meterReadingValueGroupsArray = [];
        foreach ($meterReadingValueGroups as $meterReadingValueGroup) {
            $values = [];
            foreach ($meterReadingValueGroup->getValues() as $value) {
                $values[] = $this->meterReadingValueService->valueMessageToArray($value);
            }

            $currentMeterConnectionMapping = $meterReadingValueGroup->getCurrentMeterConnectionMapping();
            $meterReadingValueGroupsArray[] = [
                'values' => $values,
                'meter' => MeterProtoConvertor::convertToArray($meterReadingValueGroup->getMeter()),
                'reading' => MeterReadingConverter::toArray($meterReadingValueGroup->getReading()),
                'current_meter_connection_mapping' => $currentMeterConnectionMapping !== null
                    ? MeterConnectionMappingConverter::meterConnectionMappingProtoToArray($currentMeterConnectionMapping)
                    : null,
                'is_first_reading' => $meterReadingValueGroup->getIsFirstReading(),
            ];
        }
        $meterConnectionMappings = $response->getMeterConnectionMappings();
        $meterConnectionMappingsArray = [];
        foreach ($meterConnectionMappings as $meterConnectionMapping) {
            $meterConnectionMappingsArray[] = MeterConnectionMappingConverter::meterConnectionMappingProtoToArray($meterConnectionMapping);
        }

        return [
            'connections' => $connectionsArray,
            'meter_reading_value_groups' => $meterReadingValueGroupsArray,
            'meter_connection_mappings' => $meterConnectionMappingsArray,
        ];
    }

    public function getUniqueMeters($meterConnectionMappings)
    {
        $groupedMeters = [];

        // Step 1: Group by meter_id
        foreach ($meterConnectionMappings as $mapping) {
            $groupedMeters[$mapping['meter_id']][] = $mapping;
        }

        $result = [];

        // Step 2: Process each meter group
        foreach ($groupedMeters as $meterId => $records) {

            // If only one record exists → return it
            if (count($records) === 1) {
                $result[] = $records[0];

                continue;
            }

            // Filter records where effective_end is NOT null
            $nonNullEndRecords = array_filter($records, function ($record) {
                return ! is_null($record['effective_end_ts']);
            });

            // If we have valid end dates
            if (! empty($nonNullEndRecords)) {

                usort($nonNullEndRecords, function ($a, $b) {
                    return Carbon::parse($a['effective_end_ts'])
                        ->lt(Carbon::parse($b['effective_end_ts'])) ? -1 : 1;
                });

                // Smallest effective_end
                $result[] = $nonNullEndRecords[0];
            }
        }

        return $result;
    }
}
