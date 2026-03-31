<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\Office\OfficeProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\GrpcConverters\SecurityDeposit\SdBalanceSummaryConverter;
use App\GrpcConverters\SecurityDeposit\SdRegisterConverter;
use App\Services\Connection\ConsumerService;
use App\Services\Metering\MeterReadingService;
use Proto\Connections\ConnectionBillingGroupMessage;
use Proto\Connections\ConnectionMessage;

class ConnectionProtoConverter
{
    /**
     * Convert ConnectionMessage proto to array.
     *
     * @return array{
     *    version_id: int,
     *    connection_id: int,
     *    connection_type_id: int,
     *    consumer_number: int | string,
     *    connection_status_id: int,
     *    connected_date: string,
     *    service_office_code: int,
     *    admin_office_code: int,
     *    voltage_id: int,
     *    contract_demand_kva_val: float,
     *    tariff_id: int,
     *    primary_purpose_id: int,
     *    connection_category_id: int,
     *    connection_subcategory_id: int,
     *    billing_process_id: int,
     *    billing_side_id: int,
     *    phase_type_id: int,
     *    solar_indicator: bool|null,
     *    open_access_type_id: int,
     *    metering_type_id: int,
     *    renewable_type_id: int,
     *    multi_source_indicator: bool|null,
     *    live_indicator: bool|null,
     *    is_current: bool|null,
     *    consumer_legacy_code: string|null,
     *    power_load_kw_val: float,
     *    light_load_kw_val: float,
     *    connected_load_kw_val: float,
     *    othercons_flag: bool,
     *    cpp_flag: bool,
     *    connection_attribs: array|null,
     *    purposes_info: array|null,
     *    connected_load_info: array|null,
     *    multi_source_info: array|null,
     *    effective_start: string|null,
     *    effective_end: string|null,
     *    created_at: string|null,
     *    updated_at: string|null,
     *    created_by: int|null,
     *    updated_by: int|null,
     *    consumer_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    connection_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    connection_status: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    open_access_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    metering_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    renewable_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    phase_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    voltage: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    connection_category: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    connection_subcategory: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    primary_purpose: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    billing_process: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *    tariff: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     * service_office: array{
     *     office_id: int,
     *    office_name: string,
     *    office_code: int,
     *    office_description: string,
     *    office_type_id: int|string,
     *    location_id: int,
     *    office_address_id: int,
     *    effective_start: string|null,
     *    effective_end: string|null,
     *    is_current: bool,
     *    created_at: string|null,
     *    updated_at: string|null,
     *    created_by: int|null,
     *    updated_by: int|null,
     *    contact_folio: array<string, mixed>|null,
     *    office_type: array{
     *        id: int|string,
     *        parameter_value: string,
     *        parameter_code: string,
     *        attribute1_value: string,
     *        attribute2_value: string,
     *        attribute3_value: string,
     *        attribute4_value: string,
     *        attribute5_value: string,
     *        is_active: bool,
     *        sort_priority: int,
     *        notes: string
     *    }|null
     * }|null,
     *
     * admin_office: array{
     *     office_id: int,
     *    office_name: string,
     *    office_code: int,
     *    office_description: string,
     *    office_type_id: int|string,
     *    location_id: int,
     *    office_address_id: int,
     *    effective_start: string|null,
     *    effective_end: string|null,
     *    is_current: bool,
     *    created_at: string|null,
     *    updated_at: string|null,
     *    created_by: int|null,
     *    updated_by: int|null,
     *    contact_folio: array<string, mixed>|null,
     *    office_type: array{
     *        id: int|string,
     *        parameter_value: string,
     *        parameter_code: string,
     *        attribute1_value: string,
     *        attribute2_value: string,
     *        attribute3_value: string,
     *        attribute4_value: string,
     *        attribute5_value: string,
     *        is_active: bool,
     *        sort_priority: int,
     *        notes: string
     *    }|null
     * }|null
     * }|null
     */
    public static function convertToArray(?ConnectionMessage $connection): ?array
    {
        if ($connection === null) {
            return null;
        }

        $consumerProfiles = $connection->getConsumerProfile();
        $consumerProfilesArray = [];
        $converter = app(ConsumerService::class);
        foreach ($consumerProfiles as $consumerProfile) {
            $consumerProfileArray = $converter->transformConsumerToArray($consumerProfile);
            $consumerProfilesArray[] = $consumerProfileArray;
        }
        $connectionFlags = $connection->getConnectionFlags();
        $connectionFlagsArrays = [];
        foreach ($connectionFlags as $connectionFlag) {
            $connectionFlagArray = ConnectionFlagProtoConverter::convertToArray($connectionFlag);
            $connectionFlagsArrays[] = $connectionFlagArray;
        }
        $connectionGeneration = $connection->getConnectionGenerationTypes();
        $connectionGenerationArrays = [];
        foreach ($connectionGeneration as $connectionGeneration) {
            $connectionGenerationArray = ConnectionGenerationProtoConverter::convertToArray($connectionGeneration);
            $connectionGenerationArrays[] = $connectionGenerationArray;
        }
        $greenEnergyArrays = [];
        foreach ($connection->getGreenEnergy() as $greenEnergy) {
            $greenEnergyArray = ConnectionGreenEnergyConverter::convertToArray($greenEnergy);
            $greenEnergyArrays[] = $greenEnergyArray;
        }
        $meterreadingConverter = app(MeterReadingService::class);
        $latestMeterReading = $connection->getLatestMeterReading();
        $latestMeterReadingArray = null;
        if ($latestMeterReading !== null) {
            $latestMeterReadingArray = $meterreadingConverter->toArray($latestMeterReading);
        }

        $previousMeterReading = $connection->getPreviousReading();
        $previousMeterReadingArray = null;
        if ($previousMeterReading !== null) {
            $previousMeterReadingArray = $meterreadingConverter->toArray($previousMeterReading);
        }

        $otherPurposes = [];
        foreach ($connection->getOtherPurposes() as $purposeId) {
            $otherPurposes[] = (int) $purposeId;
        }
        $SdBalanceSummary = [];
        foreach ($connection->getSdBalanceSummary() as $sdBalanceSummary) {
            $sdBalanceSummaryArray = SdBalanceSummaryConverter::convertToArray($sdBalanceSummary);
            $SdBalanceSummary[] = $sdBalanceSummaryArray;
        }

        return [
            'version_id' => $connection->getVersionId(),
            'connection_id' => $connection->getConnectionId(),
            'consumer_legacy_code' => $connection->getConsumerLegacyCode(),
            'connection_type_id' => $connection->getConnectionTypeId(),
            'application_no' => $connection->getApplicationNo(),
            'consumer_number' => $connection->getConsumerNum(),
            'connection_status_id' => $connection->getConnectionStatusId(),
            'connected_date' => $connection->getConnectedDate(),
            'service_office_code' => $connection->getServiceOfficeCode(),
            'admin_office_code' => $connection->getAdminOfficeCode(),
            'voltage_id' => $connection->getVoltageId(),
            'tariff_id' => $connection->getTariffId(),
            'primary_purpose_id' => $connection->getPrimaryPurposeId(),
            'connection_category_id' => $connection->getConnectionCategoryId(),
            'connection_subcategory_id' => $connection->getConnectionSubcategoryId(),
            'billing_process_id' => $connection->getBillingProcessId(),
            'billing_side_id' => $connection->getBillingSideId(),
            'phase_type_id' => $connection->getPhaseTypeId(),
            'open_access_type_id' => $connection->getOpenAccessTypeId(),
            'metering_type_id' => $connection->getMeteringTypeId(),
            'is_current' => $connection->getIsCurrent(),
            'power_load_kw_val' => $connection->getPowerLoadKwVal(),
            'light_load_kw_val' => $connection->getLightLoadKwVal(),
            'connected_load_kw_val' => $connection->getConnectedLoadKwVal(),
            'othercons_flag' => $connection->getOtherconsFlag(),
            'remarks' => $connection->getRemarks(),
            'other_purposes' => $otherPurposes,
            'connection_attribs' => $connection->getConnectionAttribs() ? json_decode($connection->getConnectionAttribs()->serializeToJsonString(), true) : null,
            'purposes_info' => $connection->getPurposesInfo() ? json_decode($connection->getPurposesInfo()->serializeToJsonString(), true) : null,
            'connected_load_info' => $connection->getConnectedLoadInfo() ? json_decode($connection->getConnectedLoadInfo()->serializeToJsonString(), true) : null,
            'multi_source_info' => $connection->getMultiSourceInfo() ? json_decode($connection->getMultiSourceInfo()->serializeToJsonString(), true) : null,
            'consumer_type' => ParameterValueProtoConvertor::convertToArray($connection->getConsumerType()),
            'connection_type' => ParameterValueProtoConvertor::convertToArray($connection->getConnectionType()),
            'connection_status' => ParameterValueProtoConvertor::convertToArray($connection->getConnectionStatus()),
            'open_access_type' => ParameterValueProtoConvertor::convertToArray($connection->getOpenAccessType()),
            'metering_type' => ParameterValueProtoConvertor::convertToArray($connection->getMeteringType()),
            'phase_type' => ParameterValueProtoConvertor::convertToArray($connection->getPhaseType()),
            'voltage' => ParameterValueProtoConvertor::convertToArray($connection->getVoltage()),
            'connection_category' => ParameterValueProtoConvertor::convertToArray($connection->getConnectionCategory()),
            'connection_subcategory' => ParameterValueProtoConvertor::convertToArray($connection->getConnectionSubcategory()),
            'primary_purpose' => ParameterValueProtoConvertor::convertToArray($connection->getPrimaryPurpose()),
            'billing_process' => ParameterValueProtoConvertor::convertToArray($connection->getBillingProcess()),
            'billing_side' => ParameterValueProtoConvertor::convertToArray($connection->getBillingSide()),
            'tariff' => ParameterValueProtoConvertor::convertToArray($connection->getTariff()),
            'service_office' => $connection->getServiceOffice() ? OfficeProtoConvertor::convertToArray($connection->getServiceOffice()) : null,
            'admin_office' => $connection->getAdminOffice() ? OfficeProtoConvertor::convertToArray($connection->getAdminOffice()) : null,
            'contract_demand_kva_val' => $connection->getContractDemandKvaVal(),
            'created_at' => $connection->getCreatedAt() ? $connection->getCreatedAt()->toDateTime()->format('Y-m-d H:i:s') : null,
            'updated_at' => $connection->getUpdatedAt() ? $connection->getUpdatedAt()->toDateTime()->format('Y-m-d H:i:s') : null,
            'created_by' => $connection->getCreatedBy() ? $connection->getCreatedBy() : null,
            'updated_by' => $connection->getUpdatedBy() ? $connection->getUpdatedBy() : null,
            'effective_start' => $connection->getEffectiveStart() ? $connection->getEffectiveStart()->toDateTime()->format('Y-m-d') : null,
            'effective_end' => $connection->getEffectiveEnd() ? $connection->getEffectiveEnd()->toDateTime()->format('Y-m-d') : null,
            'consumer_profiles' => $consumerProfilesArray,
            'latest_meter_reading' => $latestMeterReadingArray,
            'connection_flags' => $connectionFlagsArrays,
            'connection_generation_types' => $connectionGenerationArrays,
            'no_of_main_meters' => $connection->getNoOfMainMeters(),
            'previous_reading' => $previousMeterReadingArray,
            'green_energy' => $greenEnergyArrays,
            'alternate_tariff' => $connection->hasAlternateTariff() ? ParameterValueProtoConvertor::convertToArray($connection->getAlternateTariff()) : null,
            'sd_balance_summary' => $SdBalanceSummary,
            'latest_sd_register' => $connection->hasLatestSdRegister() ? SdRegisterConverter::convertToArray($connection->getLatestSdRegister()) : null,
            'billing_group' => $connection->hasBillingGroup() ? self::billingGroupConverterForConnection($connection->getBillingGroup()) : null,
        ];
    }

    public static function billingGroupConverterForConnection(ConnectionBillingGroupMessage $connectionBillingGroupMessage)
    {
        return [
            'billing_group_id' => $connectionBillingGroupMessage->getBillingGroupId(),
            'name' => $connectionBillingGroupMessage->getName(),
            'version_id' => $connectionBillingGroupMessage->getVersionId(),
            'description' => $connectionBillingGroupMessage->hasDescription() ? $connectionBillingGroupMessage->getDescription() : null,
            'effective_end' => $connectionBillingGroupMessage->hasEffectiveEnd() ? $connectionBillingGroupMessage->getEffectiveEnd() : null,
            'is_active' => $connectionBillingGroupMessage->getIsActive(),
            'created_by' => $connectionBillingGroupMessage->hasCreatedBy() ? $connectionBillingGroupMessage->getCreatedBy() : null,
            'updated_by' => $connectionBillingGroupMessage->hasUpdatedBy() ? $connectionBillingGroupMessage->getUpdatedBy() : null,
        ];
    }
}
