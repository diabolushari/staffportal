<?php

use App\Http\Requests\Metering\MeterReadingForm;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Metering\MeterReadingService;
use App\Services\Parameters\ParameterValueService;
use Tests\TestCase;

use function Pest\Laravel\mock;

uses(TestCase::class);

function makeMeterReadingForm(?bool $isBillable): MeterReadingForm
{
    return new MeterReadingForm(
        connectionId: 101,
        anomalyId: 5,
        meteringDate: '2026-03-22',
        readingStartDate: '2026-03-01',
        readingEndDate: '2026-03-31',
        remarks: 'Test reading',
        readingsByMeter: [
            [
                'meter_id' => 10,
                'parameters' => [
                    [
                        'meter_parameter_id' => 20,
                        'readings' => [
                            [
                                'timezone_id' => 30,
                                'values' => [
                                    'initial' => '10',
                                    'final' => '15',
                                    'diff' => '5',
                                    'value' => 5,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        meterHealth: [
            [
                'meter_id' => 10,
                'meter_serial' => 'MTR-10',
                'meter_health_id' => 1,
                'ctpts' => [],
            ],
        ],
        multipleReading: null,
        interimReasonId: null,
        isInterimReading: false,
        meters: null,
        isBillable: $isBillable,
    );
}

it('sets is billable on create meter reading requests when provided', function () {
    /** @var ParameterValueService&\Mockery\MockInterface $parameterValueService */
    $parameterValueService = mock(ParameterValueService::class);
    /** @var MeteringParameterProfileService&\Mockery\MockInterface $meteringParameterProfileService */
    $meteringParameterProfileService = mock(MeteringParameterProfileService::class);

    $service = new MeterReadingService(
        $parameterValueService,
        $meteringParameterProfileService,
    );

    $request = makeMeterReadingForm(false);
    $protoRequest = $service->toProto($request);

    expect($protoRequest->hasIsBillable())->toBeTrue()
        ->and($protoRequest->getIsBillable())->toBeFalse();
});

it('omits is billable on create meter reading requests when not provided', function () {
    /** @var ParameterValueService&\Mockery\MockInterface $parameterValueService */
    $parameterValueService = mock(ParameterValueService::class);
    /** @var MeteringParameterProfileService&\Mockery\MockInterface $meteringParameterProfileService */
    $meteringParameterProfileService = mock(MeteringParameterProfileService::class);

    $service = new MeterReadingService(
        $parameterValueService,
        $meteringParameterProfileService,
    );

    $request = makeMeterReadingForm(null);
    $protoRequest = $service->toProto($request);

    expect($protoRequest->hasIsBillable())->toBeFalse();
});
