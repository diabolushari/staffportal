<?php

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\Services\Connection\ConsumerService;
use App\Services\Metering\MeterReadingService;
use Proto\Connections\ConnectionMessage;
use Tests\TestCase;

use function Pest\Laravel\mock;

uses(TestCase::class);

it('converts other purposes to an array of ids', function () {
    $consumerService = mock(ConsumerService::class);
    $consumerService->shouldReceive('transformConsumerToArray')->andReturn([]);
    app()->instance(ConsumerService::class, $consumerService);

    $meterReadingService = mock(MeterReadingService::class);
    $meterReadingService->shouldReceive('toArray')->andReturn([]);
    app()->instance(MeterReadingService::class, $meterReadingService);

    $connection = new ConnectionMessage;
    $connection->setOtherPurposes([10, 20]);

    $result = ConnectionProtoConverter::convertToArray($connection);

    expect($result['other_purposes'])->toBe([10, 20]);
});
