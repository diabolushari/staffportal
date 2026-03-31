<?php

use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Consumers\OfficeService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Tests\TestCase;

use function Pest\Laravel\mock;
use function Pest\Laravel\post;
use function Pest\Laravel\withoutMiddleware;

uses(TestCase::class);

it('sends other purposes when storing a connection', function () {
    withoutMiddleware();

    $payload = [
        'connection_type_id' => 1,
        'connection_status_id' => 1,
        'connected_date' => '2024-01-01',
        'application_no' => 'APP-1001',
        'service_office_code' => 101,
        'admin_office_code' => 201,
        'voltage_type_id' => 1,
        'contract_demand_kw_val' => 10.5,
        'tariff_type_id' => 2,
        'primary_purpose_id' => 3,
        'connection_category_id' => 4,
        'connection_subcategory_id' => 5,
        'billing_process_id' => 6,
        'open_access_type_id' => null,
        'metering_type_id' => 7,
        'phase_type_id' => 1,
        'consumer_legacy_code' => 'LEG-1001',
        'power_load_kw_val' => 1.5,
        'light_load_kw_val' => 2.5,
        'othercons_flag' => false,
        'remarks' => 'Test',
        'power_intensive' => false,
        'excess_demand' => false,
        'no_of_main_meters' => 1,
        'indicators' => [
            [
                'flags' => [],
            ],
        ],
        'generation_types' => [
            [
                'id' => 1,
                'value' => false,
            ],
        ],
        'other_purposes' => [10, 20],
    ];

    $otherPurposes = $payload['other_purposes'];

    mock(ParameterValueService::class);
    mock(ConsumerService::class);
    mock(OfficeService::class);

    mock(ConnectionService::class, function ($mock) use ($otherPurposes) {
        $mock->shouldReceive('createConnection')
            ->once()
            ->withArgs(function ($request) use ($otherPurposes) {
                return $request->otherPurposes === $otherPurposes;
            })
            ->andReturn(GrpcServiceResponse::success(['connection_id' => 123]));
    });

    $response = post(route('connections.store'), $payload);

    $response->assertRedirect(route('connection.consumer', 123));
});
