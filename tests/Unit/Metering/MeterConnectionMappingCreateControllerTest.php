<?php

use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Tests\TestCase;

use function Pest\Laravel\get;
use function Pest\Laravel\mock;
use function Pest\Laravel\withoutMiddleware;

uses(TestCase::class);

it('requests connection scoped meter mappings in create page', function () {
    withoutMiddleware();

    $connectionId = 123;

    mock(MeterService::class, function ($mock) {
        $mock->shouldReceive('listMeters')
            ->once()
            ->andReturn(GrpcServiceResponse::success([
                ['meter_id' => 1],
                ['meter_id' => 2],
            ]));
    });

    mock(ConnectionService::class, function ($mock) use ($connectionId) {
        $mock->shouldReceive('getConnection')
            ->once()
            ->with($connectionId)
            ->andReturn(GrpcServiceResponse::success(['connection_id' => $connectionId]));
    });

    mock(MeterConnectionMappingService::class, function ($mock) use ($connectionId) {
        $mock->shouldReceive('listMeterConnectionMappings')
            ->once()
            ->with($connectionId)
            ->andReturn(GrpcServiceResponse::success([
                ['meter_id' => 1],
            ]));
    });

    mock(MeterTransformerService::class, function ($mock) {
        $mock->shouldReceive('listUnassignedTransformers')
            ->once()
            ->andReturn(GrpcServiceResponse::success([]));
    });

    mock(ParameterValueService::class, function ($mock) {
        $mock->shouldReceive('getParameterValues')
            ->andReturn(GrpcServiceResponse::success([]));
    });

    $response = get(route('connection.meter.create', $connectionId));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Connections/ConnectMeterForm')
        ->where('connection_id', $connectionId)
        ->has('meters', 1)
        ->where('meters.0.meter_id', 2));
});
