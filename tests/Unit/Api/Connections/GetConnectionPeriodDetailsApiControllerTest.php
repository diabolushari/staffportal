<?php

use App\Services\Connection\ConnectionPeriodDetailsService;
use App\Services\utils\GrpcServiceResponse;
use Tests\TestCase;

use function Pest\Laravel\mock;
use function Pest\Laravel\postJson;
use function Pest\Laravel\withoutMiddleware;

uses(TestCase::class);

it('returns connection period details for a valid request', function () {
    withoutMiddleware();

    mock(ConnectionPeriodDetailsService::class, function ($mock): void {
        $mock->shouldReceive('getConnectionPeriodDetails')
            ->once()
            ->with(12, [101, 202], '2026-01-01', '2026-01-31')
            ->andReturn(GrpcServiceResponse::success([
                'connections' => [['id' => 12]],
                'meters' => [['meter_id' => 101]],
            ]));
    });

    $response = postJson('/api/connections/period-details', [
        'connection_id' => 12,
        'meter_ids' => [101, 202],
        'start_date' => '2026-01-01',
        'end_date' => '2026-01-31',
    ]);

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'data' => [
                'connections' => [['id' => 12]],
                'meters' => [['meter_id' => 101]],
            ],
        ]);
});

it('validates required connection id for period details route', function () {
    withoutMiddleware();

    $response = postJson('/api/connections/period-details', [
        'meter_ids' => [101],
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['connection_id']);
});

it('returns json validation errors when grpc response includes validation errors', function () {
    withoutMiddleware();

    mock(ConnectionPeriodDetailsService::class, function ($mock): void {
        $mock->shouldReceive('getConnectionPeriodDetails')
            ->once()
            ->with(12, [101], null, null)
            ->andReturn(GrpcServiceResponse::error(
                null,
                null,
                3,
                'Validation failed',
                null,
                ['meter_ids' => 'The selected meter is invalid.'],
            ));
    });

    $response = postJson('/api/connections/period-details', [
        'connection_id' => 12,
        'meter_ids' => [101],
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['meter_ids'])
        ->assertJsonPath('errors.meter_ids.0', 'The selected meter is invalid.');
});
