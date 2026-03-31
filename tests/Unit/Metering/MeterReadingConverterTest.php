<?php

use App\GrpcConverters\Metering\MeterReadingConverter;
use Proto\Consumers\MeterResponse;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\MeterReading\MeterReadingMessage;
use Proto\MeterReading\MeterReadingValueGroupMessage;
use Proto\MeterReading\ReadingValueMessage;

it('includes the current meter connection mapping when converting a meter reading value group', function () {
    $valueGroup = new MeterReadingValueGroupMessage;
    $valueGroup->setMeter(
        (new MeterResponse)
            ->setMeterId(11)
            ->setMeterSerial('MTR-11')
    );
    $valueGroup->setReading(
        (new MeterReadingMessage)
            ->setMeterReadingId(101)
            ->setConnectionId(501)
    );
    $valueGroup->setValues([
        (new ReadingValueMessage)
            ->setMeterReadingValuesId(1001)
            ->setMeterId(11)
            ->setParameterId(9)
            ->setTimezoneId(7),
    ]);
    $valueGroup->setCurrentMeterConnectionMapping(
        (new MeterConnectionMappingResponse)
            ->setRelId(77)
            ->setConnectionId(501)
            ->setMeterId(11)
            ->setIsCurrent(true)
    );
    $valueGroup->setIsFirstReading(true);

    $result = MeterReadingConverter::meterReadingValueGroupToArray($valueGroup);

    expect($result['meter']['meter_id'])->toBe(11)
        ->and($result['reading']['id'])->toBe(101)
        ->and($result['values'])->toHaveCount(1)
        ->and($result['current_meter_connection_mapping'])->not->toBeNull()
        ->and($result['current_meter_connection_mapping']['rel_id'])->toBe(77)
        ->and($result['current_meter_connection_mapping']['is_current'])->toBeTrue()
        ->and($result['is_first_reading'])->toBeTrue();
});

it('returns a null meter connection mapping when the proto field is not set', function () {
    $valueGroup = new MeterReadingValueGroupMessage;
    $valueGroup->setMeter(
        (new MeterResponse)
            ->setMeterId(11)
            ->setMeterSerial('MTR-11')
    );

    $result = MeterReadingConverter::meterReadingValueGroupToArray($valueGroup);

    expect($result['current_meter_connection_mapping'])->toBeNull()
        ->and($result['is_first_reading'])->toBeFalse();
});

it('includes is billable when the proto field is set', function () {
    $reading = (new MeterReadingMessage)
        ->setMeterReadingId(101)
        ->setConnectionId(501)
        ->setIsBillable(true);

    $result = MeterReadingConverter::toArray($reading);

    expect($result['is_billable'])->toBeTrue();
});
