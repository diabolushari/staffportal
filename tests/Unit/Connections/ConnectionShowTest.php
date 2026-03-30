<?php

use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Tests\TestCase;

use function Pest\Laravel\get;
use function Pest\Laravel\mock;
use function Pest\Laravel\withoutMiddleware;

uses(TestCase::class);

it('passes primary purposes to the show page', function () {
    withoutMiddleware();

    $connectionId = 123;
    $connectionData = [
        'connection_id' => $connectionId,
        'consumer_number' => 1002003004,
        'primary_purpose' => ['parameter_value' => 'Domestic'],
        'other_purposes' => [10, 20],
    ];

    mock(ConnectionService::class, function ($mock) use ($connectionData) {
        $mock->shouldReceive('getConnection')
            ->once()
            ->andReturn(GrpcServiceResponse::success($connectionData));
    });

    mock(ParameterValueService::class, function ($mock) {
        $mock->shouldReceive('getParameterValues')
            ->andReturnUsing(function (...$args) {
                $parameterName = $args[4] ?? null;

                if ($parameterName === 'Primary Purpose') {
                    return GrpcServiceResponse::success([
                        ['id' => 10, 'parameter_value' => 'Purpose A'],
                        ['id' => 20, 'parameter_value' => 'Purpose B'],
                    ]);
                }

                return GrpcServiceResponse::success([]);
            });
    });

    mock(ConsumerService::class, function ($mock) {
        $mock->shouldReceive('getConsumer')
            ->once()
            ->andReturn(GrpcServiceResponse::success(['consumer' => [], 'contact' => []]));
    });

    $response = get(route('connections.show', $connectionId));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Connections/ConnectionsShow')
        ->has('primaryPurposes', 2)
        ->where('connection.other_purposes', [10, 20]));
});
