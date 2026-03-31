<?php

namespace App\GrpcConverters\Metering;

use App\GrpcConverters\Connection\MeterConnectionMappingConverter;
use App\GrpcConverters\Meter\MeterProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Services\Metering\MeteringParameterProfileService;
use Proto\MeterReading\MeterReadingHealthMessage;
use Proto\MeterReading\MeterReadingMessage;
use Proto\MeterReading\MeterReadingPowerFactorMessage;
use Proto\MeterReading\MeterReadingValueGroupMessage;
use Proto\MeterReading\ReadingValueMessage;

class MeterReadingConverter
{
    /**
     * @return array<string, mixed>
     */
    public static function toArray(?MeterReadingMessage $detail): ?array
    {
        if ($detail === null) {
            return null;
        }
        $values = [];
        foreach ($detail->getValues() as $value) {
            $values[] = MeterReadingConverter::meterReadingValuesToArray($value);
        }
        $powerFactors = [];
        foreach ($detail->getPowerFactors() as $powerFactor) {
            $powerFactors[] = MeterReadingConverter::toProto($powerFactor);
        }
        $healths = [];
        foreach ($detail->getHealths() as $health) {
            $healths[] = MeterReadingConverter::meterReadingHealthToArray($health);
        }

        return [
            'id' => $detail->getMeterReadingId(),
            'metering_date' => $detail->getMeteringDate(),
            'reading_start_date' => $detail->getReadingStartDate(),
            'reading_end_date' => $detail->getReadingEndDate(),
            'connection_id' => $detail->getConnectionId(),
            'single_reading' => $detail->getSingleReading(),
            'multiple_reading' => $detail->getMultipleReading(),
            'anomaly_id' => $detail->getAnomalyId(),
            'remarks' => $detail->getRemarks(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'values' => $values,
            'power_factors' => $powerFactors,
            'healths' => $healths,
            'is_interim_reading' => $detail->getMultipleReading(),
            'is_billable' => $detail->hasIsBillable() ? $detail->getIsBillable() : null,
        ];
    }

    public static function meterReadingValuesToArray(ReadingValueMessage $detail): array
    {
        return [
            'id' => $detail->getMeterReadingValuesId(),
            'meter_id' => $detail->getMeterId(),
            'parameter_id' => $detail->getParameterId(),
            'timezone_id' => $detail->getTimezoneId(),
            'initial_reading' => $detail->getInitialReading(),
            'final_reading' => $detail->getFinalReading(),
            'difference' => $detail->getDifference(),
            'meter_mf' => $detail->getMeterMf(),
            'value' => $detail->getMulValue(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'time_zone' => ParameterValueProtoConvertor::convertToArray($detail->getTimezone()),
            'meter' => MeterProtoConvertor::convertToArray($detail->getMeter()),
            'meter_profile_parameter' => MeteringParameterProfileService::toArray($detail->getParameter()),

        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function meterReadingValueGroupToArray(MeterReadingValueGroupMessage $detail): array
    {
        $values = [];
        foreach ($detail->getValues() as $value) {
            $values[] = self::meterReadingValuesToArray($value);
        }

        $currentMeterConnectionMapping = $detail->getCurrentMeterConnectionMapping();

        return [
            'meter' => MeterProtoConvertor::convertToArray($detail->getMeter()),
            'values' => $values,
            'reading' => self::toArray($detail->getReading()),
            'current_meter_connection_mapping' => $currentMeterConnectionMapping !== null
                ? MeterConnectionMappingConverter::meterConnectionMappingProtoToArray($currentMeterConnectionMapping)
                : null,
            'is_first_reading' => $detail->getIsFirstReading(),
        ];
    }

    public static function toProto(MeterReadingPowerFactorMessage $powerFactor)
    {
        return [
            'id' => $powerFactor->getId(),
            'meter_reading_id' => $powerFactor->getMeterReadingId(),
            'meter_id' => $powerFactor->getMeterId(),
            'average_power_factor' => $powerFactor->getAveragePowerFactor(),
            'created_by' => $powerFactor->getCreatedBy(),
            'updated_by' => $powerFactor->getUpdatedBy(),
            'created_ts' => $powerFactor->getCreatedTs(),
            'updated_ts' => $powerFactor->getUpdatedTs(),
        ];
    }

    public static function meterReadingHealthToArray(MeterReadingHealthMessage $detail): array
    {
        return [
            'id' => $detail->getId(),
            'meter_reading_id' => $detail->getMeterReadingId(),
            'meter_id' => $detail->getMeterId(),
            'parameter_id' => $detail->getParameterId(),
            'current_r' => $detail->getCurrentR(),
            'current_y' => $detail->getCurrentY(),
            'current_b' => $detail->getCurrentB(),
            'voltage_r' => $detail->getVoltageR(),
            'voltage_y' => $detail->getVoltageY(),
            'voltage_b' => $detail->getVoltageB(),
        ];
    }
}
