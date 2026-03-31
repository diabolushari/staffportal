<?php

use App\GrpcConverters\Connection\MeterConnectionMappingConverter;
use App\Http\Requests\Connections\ConnectionMeterChangeReasonFormRequest;
use App\Http\Requests\Connections\ConnectionMeterStatusFormRequest;
use Google\Protobuf\Timestamp;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\Metering\UpdateMeterConnectionChangeReasonRequest;
use Proto\Metering\UpdateMeterConnectionMappingRequest;

it('builds the meter status update request with string date fields', function () {
    $request = MeterConnectionMappingConverter::arrayToUpdateMeterConnectionStatusRequest(
        new ConnectionMeterStatusFormRequest(
            relId: 18,
            statusId: 7,
            noticeDate: '2026-03-10',
            intimationDate: '2026-03-11',
        )
    );

    expect($request)->toBeInstanceOf(UpdateMeterConnectionMappingRequest::class)
        ->and($request->getRelId())->toBe(18)
        ->and($request->getMeterStatusId())->toBe(7)
        ->and($request->getNoticeDate())->toBe('2026-03-10')
        ->and($request->getIntimationDate())->toBe('2026-03-11');
});

it('builds the change reason update request with a string change date', function () {
    $request = MeterConnectionMappingConverter::arrayToUpdateMeterConnectionChangeRequest(
        new ConnectionMeterChangeReasonFormRequest(
            relId: 18,
            changeReasonId: 5,
            changeDate: '2026-03-12',
        )
    );

    expect($request)->toBeInstanceOf(UpdateMeterConnectionChangeReasonRequest::class)
        ->and($request->getRelId())->toBe(18)
        ->and($request->getChangeReason())->toBe(5)
        ->and($request->getChangeDate())->toBe('2026-03-12');
});

it('keeps string date values when converting a meter connection mapping response', function () {
    $createdTimestamp = new Timestamp;
    $createdTimestamp->fromDateTime(new \DateTime('2026-03-01 12:30:45'));

    $updatedTimestamp = new Timestamp;
    $updatedTimestamp->fromDateTime(new \DateTime('2026-03-02 08:15:00'));

    $mapping = (new MeterConnectionMappingResponse)
        ->setRelId(77)
        ->setConnectionId(501)
        ->setMeterId(11)
        ->setFaultyDate('2026-03-03')
        ->setRectificationDate('2026-03-04')
        ->setEnergiseDate('2026-03-05')
        ->setNoticeDate('2026-03-06')
        ->setIntimationDate('2026-03-07')
        ->setChangeDate('2026-03-08')
        ->setEffectiveStartTs('2026-03-01 00:00:00')
        ->setEffectiveEndTs('2026-03-31 23:59:59')
        ->setCreatedTs($createdTimestamp)
        ->setUpdatedTs($updatedTimestamp);

    $result = MeterConnectionMappingConverter::meterConnectionMappingProtoToArray($mapping);

    expect($result['faulty_date'])->toBe('2026-03-03')
        ->and($result['rectification_date'])->toBe('2026-03-04')
        ->and($result['energise_date'])->toBe('2026-03-05')
        ->and($result['notice_date'])->toBe('2026-03-06')
        ->and($result['intimation_date'])->toBe('2026-03-07')
        ->and($result['change_date'])->toBe('2026-03-08')
        ->and($result['effective_start_ts'])->toBe('2026-03-01 00:00:00')
        ->and($result['effective_end_ts'])->toBe('2026-03-31 23:59:59')
        ->and($result['created_ts'])->toBe('2026-03-01 12:30:45')
        ->and($result['updated_ts'])->toBe('2026-03-02 08:15:00');
});
