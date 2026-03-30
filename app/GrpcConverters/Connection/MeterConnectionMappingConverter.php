<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\Meter\MeterProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Connections\ConnectionMeterChangeReasonFormRequest;
use App\Http\Requests\Connections\ConnectionMeterStatusFormRequest;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\Metering\UpdateMeterConnectionChangeReasonRequest;
use Proto\Metering\UpdateMeterConnectionMappingRequest;

class MeterConnectionMappingConverter
{
    public static function arrayToUpdateMeterConnectionStatusRequest(ConnectionMeterStatusFormRequest $data): UpdateMeterConnectionMappingRequest
    {
        $request = new UpdateMeterConnectionMappingRequest;
        $request->setRelId($data->relId);
        $request->setMeterStatusId($data->statusId);
        if ($data->noticeDate !== '') {
            $request->setNoticeDate($data->noticeDate);
        }
        if ($data->intimationDate !== null && $data->intimationDate !== '') {
            $request->setIntimationDate($data->intimationDate);
        }

        return $request;
    }

    public static function arrayToUpdateMeterConnectionChangeRequest(ConnectionMeterChangeReasonFormRequest $data): UpdateMeterConnectionChangeReasonRequest
    {
        $request = new UpdateMeterConnectionChangeReasonRequest;
        $request->setRelId($data->relId);
        $request->setChangeReason($data->changeReasonId);
        if ($data->changeDate !== '') {
            $request->setChangeDate($data->changeDate);
        }

        return $request;
    }

    /**
     * @return array<string, mixed>
     */
    public static function meterConnectionMappingProtoToArray(?MeterConnectionMappingResponse $rel): array
    {
        if ($rel == null) {
            return [];
        }
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
        $energiseDate = $rel->hasEnergiseDate() ? $rel->getEnergiseDate() : null;

        return [
            'version_id' => $rel->getVersionId(),
            'rel_id' => $rel->getRelId(),
            'meter_id' => $rel->getMeterId(),
            'connection_id' => $rel->getConnectionId(),
            'meter_mf' => $rel->getMeterMf(),
            'meter_profile_id' => $rel->getProfileId(),
            'meter_use_category' => ParameterValueProtoConvertor::convertToArray($rel->getMeterUseCategory()),
            'meter_status' => ParameterValueProtoConvertor::convertToArray($rel->getMeterStatus()),
            'meter_profile' => ParameterValueProtoConvertor::convertToArray($rel->getProfile()),
            'faulty_date' => $faultyDate,
            'rectification_date' => $rectificationDate,
            'sort_priority' => $rel->getSortPriority(),
            'is_meter_reading_mandatory' => $rel->getIsMeterReadingMandatory(),
            'change_reason' => ParameterValueProtoConvertor::convertToArray($rel->getChangeReason()),
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
            'energise_date' => $energiseDate,
            'is_current' => $rel->getIsCurrent(),
        ];
    }
}
