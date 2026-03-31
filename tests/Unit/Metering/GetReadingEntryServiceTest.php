<?php

use App\Services\Metering\GetReadingEntryService;
use App\Services\Metering\MeterReadingValueService;
use Proto\Consumers\MeterResponse;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\MeterReading\GetReadingEntryDataResponse;
use Proto\MeterReading\MeterReadingValueGroupMessage;
use Proto\MeterReading\ReadingValueMessage;
use Tests\TestCase;

use function Pest\Laravel\mock;

uses(TestCase::class);

it('includes the current meter connection mapping without changing reading entry value keys', function () {
    $meterReadingValueService = mock(MeterReadingValueService::class);
    $meterReadingValueService->shouldReceive('valueMessageToArray')
        ->once()
        ->andReturn([
            'id' => 1001,
            'meter_id' => 11,
            'initial' => 12.5,
            'final' => 18.5,
            'diff' => 6.0,
            'value' => 6.0,
        ]);

    $service = new GetReadingEntryService($meterReadingValueService);

    $valueGroup = new MeterReadingValueGroupMessage;
    $valueGroup->setMeter(
        (new MeterResponse)
            ->setMeterId(11)
            ->setMeterSerial('MTR-11')
    );
    $valueGroup->setValues([
        (new ReadingValueMessage)
            ->setMeterReadingValuesId(1001)
            ->setMeterId(11),
    ]);
    $valueGroup->setCurrentMeterConnectionMapping(
        (new MeterConnectionMappingResponse)
            ->setRelId(55)
            ->setConnectionId(501)
            ->setMeterId(11)
            ->setIsCurrent(true)
    );
    $valueGroup->setIsFirstReading(true);

    $response = new GetReadingEntryDataResponse;
    $response->setMeterReadingValueGroups([$valueGroup]);

    $result = $service->convertToMeterReadingData($response);
    $convertedValueGroup = $result['meter_reading_value_groups'][0];

    expect($convertedValueGroup['meter']['meter_id'])->toBe(11)
        ->and($convertedValueGroup['current_meter_connection_mapping']['rel_id'])->toBe(55)
        ->and($convertedValueGroup['current_meter_connection_mapping']['is_current'])->toBeTrue()
        ->and($convertedValueGroup['is_first_reading'])->toBeTrue()
        ->and($convertedValueGroup['values'])->toHaveCount(1)
        ->and($convertedValueGroup['values'][0]['initial'])->toBe(12.5)
        ->and(array_key_exists('initial_reading', $convertedValueGroup['values'][0]))->toBeFalse();
});
