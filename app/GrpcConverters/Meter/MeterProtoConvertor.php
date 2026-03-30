<?php

declare(strict_types=1);

namespace App\GrpcConverters\Meter;

use App\GrpcConverters\Metering\MeterTransformerProtoConvertor;
use App\GrpcConverters\Metering\MeterTransformerRelProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Metering\MeterFormRequest;
use App\Services\Metering\MeterTimezoneTypeRelService;
use Proto\Consumers\MeterFormRequest as ConsumersMeterFormRequest;
use Proto\Consumers\MeterResponse;

class MeterProtoConvertor
{
    /**
     * Convert MeterResponse proto to array.
     *
     * @return array{
     *     meter_id: int,
     *     meter_serial: string,
     *     profile_id: int|string,
     *     profile: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     ownership_type_id: int|string,
     *     ownership_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_profile_id: int|string,
     *     meter_profile: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_make_id: int|string,
     *     meter_make: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_type_id: int|string,
     *     meter_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_category_id: int|string,
     *     meter_category: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     accuracy_class_id: int|string,
     *     accuracy_class: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     dialing_factor_id: int|string,
     *     dialing_factor: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     company_seal_num: string,
     *     digit_count: int,
     *     manufacture_date: string|null,
     *     supply_date: string|null,
     *     meter_unit_id: int|string,
     *     meter_unit: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_reset_type_id: int|string,
     *     meter_reset_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     smart_meter_ind: bool,
     *     bidirectional_ind: bool,
     *     meter_phase_id: int|string,
     *     meter_phase: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     decimal_digit_count: int,
     *     programmable_pt_ratio: float,
     *     programmable_ct_ratio: int,
     *     warranty_period: int|null,
     *     meter_constant: int|null,
     *     batch_code: string|null,
     *     internal_ct_primary: int,
     *     internal_ct_secondary: int,
     *     internal_pt_primary: int,
     *     internal_pt_secondary: int,
     *     pt_count: int,
     *     ct_count: int,
     *     created_ts: string|null,
     *     updated_ts: string|null,
     *     created_by: int,
     *     updated_by: int
     * }|null
     */
    public static function convertToArray(?MeterResponse $meter): ?array
    {
        if ($meter === null) {
            return null;
        }
        $transformers = [];
        foreach ($meter->getTransformers() as $transformer) {
            $transformers[] = MeterTransformerRelProtoConvertor::convertToArray($transformer);
        }
        $meterTimezoneTypeRels = [];
        foreach ($meter->getMeterTimezoneTypeRel() as $meterTimezoneTypeRel) {
            $meterTimezoneTypeRels[] = MeterTimezoneTypeRelService::meterTimezoneTypeRelProtoToArray($meterTimezoneTypeRel);
        }

        return [
            'meter_id' => $meter->getMeterId(),
            'meter_serial' => $meter->getMeterSerial(),
            'ownership_type_id' => $meter->getOwnershipTypeId(),
            'ownership_type' => ParameterValueProtoConvertor::convertToArray($meter->getOwnershipType()),
            'meter_make_id' => $meter->getMeterMakeId(),
            'meter_make' => ParameterValueProtoConvertor::convertToArray($meter->getMeterMake()),
            'meter_type_id' => $meter->getMeterTypeId(),
            'meter_type' => ParameterValueProtoConvertor::convertToArray($meter->getMeterType()),
            'meter_category_id' => $meter->getMeterCategoryId(),
            'meter_category' => ParameterValueProtoConvertor::convertToArray($meter->getMeterCategory()),
            'accuracy_class_id' => $meter->getAccuracyClassId(),
            'accuracy_class' => ParameterValueProtoConvertor::convertToArray($meter->getAccuracyClass()),
            'dialing_factor_id' => $meter->getDialingFactorId(),
            'dialing_factor' => ParameterValueProtoConvertor::convertToArray($meter->getDialingFactor()),
            'company_seal_num' => $meter->getCompanySealNum(),
            'digit_count' => $meter->getDigitCount(),
            'manufacture_date' => $meter->getManufactureDate(),
            'supply_date' => $meter->getSupplyDate(),
            'meter_unit_id' => $meter->getMeterUnitId(),
            'meter_unit' => ParameterValueProtoConvertor::convertToArray($meter->getMeterUnit()),
            'meter_reset_type_id' => $meter->getMeterResetTypeId(),
            'meter_reset_type' => ParameterValueProtoConvertor::convertToArray($meter->getMeterResetType()),
            'smart_meter_ind' => $meter->getSmartMeterInd(),
            'bidirectional_ind' => $meter->getBidirectionalInd(),
            'meter_phase_id' => $meter->getMeterPhaseId(),
            'meter_phase' => ParameterValueProtoConvertor::convertToArray($meter->getMeterPhase()),
            'decimal_digit_count' => $meter->getDecimalDigitCount(),
            'programmable_pt_ratio' => $meter->getProgrammablePtRatio(),
            'programmable_ct_ratio' => $meter->getProgrammableCtRatio(),
            'warranty_period' => $meter->getWarrantyPeriod(),
            'meter_constant' => $meter->getMeterConstant(),
            'batch_code' => $meter->getBatchCode(),
            'internal_ct_primary' => $meter->getInternalCtPrimary(),
            'internal_ct_secondary' => $meter->getInternalCtSecondary(),
            'internal_pt_primary' => $meter->getInternalPtPrimary(),
            'internal_pt_secondary' => $meter->getInternalPtSecondary(),
            'ct_count' => $meter->getCtCount(),
            'pt_count' => $meter->getPtCount(),
            'created_ts' => $meter->getCreatedTs(),
            'updated_ts' => $meter->getUpdatedTs(),
            'created_by' => $meter->getCreatedBy(),
            'updated_by' => $meter->getUpdatedBy(),
            'transformers' => $transformers,
            'has_meter_reading' => $meter->getHasMeterReading(),
            'meter_timezone_type_rel' => $meterTimezoneTypeRels,
        ];
    }

    public static function convertToProto(MeterFormRequest $meter): ConsumersMeterFormRequest
    {

        $meterProto = new ConsumersMeterFormRequest();
        if ($meter->meterId) {
            $meterProto->setMeterId($meter->meterId);
        }
        $meterProto->setMeterSerial($meter->meterSerial);
        $meterProto->setOwnershipTypeId($meter->ownershipTypeId);
        $meterProto->setMeterMakeId($meter->meterMakeId);
        $meterProto->setMeterTypeId($meter->meterTypeId);
        $meterProto->setAccuracyClassId($meter->accuracyClassId);
        $meterProto->setDialingFactorId($meter->dialingFactorId);
        if ($meter->companySealNum) {
            $meterProto->setCompanySealNum($meter->companySealNum);
        }
        $meterProto->setDigitCount($meter->digitCount);
        if ($meter->manufactureDate) {
            $meterProto->setManufactureDate($meter->manufactureDate);
        }
        if ($meter->supplyDate) {
            $meterProto->setSupplyDate($meter->supplyDate);
        }
        $meterProto->setMeterUnitId($meter->meterUnitId);
        $meterProto->setMeterResetTypeId($meter->meterResetTypeId);
        $meterProto->setSmartMeterInd($meter->smartMeterInd);
        $meterProto->setBidirectionalInd($meter->bidirectionalInd);
        $meterProto->setMeterPhaseId($meter->meterPhaseId);
        $meterProto->setDecimalDigitCount($meter->decimalDigitCount);
        if ($meter->programmablePtRatio) {
            $meterProto->setProgrammablePtRatio($meter->programmablePtRatio);
        }
        if ($meter->programmableCtRatio) {
            $meterProto->setProgrammableCtRatio($meter->programmableCtRatio);
        }
        if ($meter->warrantyPeriod) {
            $meterProto->setWarrantyPeriod($meter->warrantyPeriod);
        }
        if ($meter->meterConstant) {
            $meterProto->setMeterConstant($meter->meterConstant);
        }
        if ($meter->batchCode) {
            $meterProto->setBatchCode($meter->batchCode);
        }
        $meterProto->setInternalCtPrimary($meter->internalCtPrimary);
        $meterProto->setInternalCtSecondary($meter->internalCtSecondary);
        $meterProto->setInternalPtPrimary($meter->internalPtPrimary);
        $meterProto->setInternalPtSecondary($meter->internalPtSecondary);
        $meterProto->setCtCount($meter->ctCount);
        $meterProto->setPtCount($meter->ptCount);
        if ($meter->createdBy) {
            $meterProto->setCreatedBy($meter->createdBy);
        }
        if ($meter->updatedBy) {
            $meterProto->setUpdatedBy($meter->updatedBy);
        }
        return $meterProto;
    }
}
