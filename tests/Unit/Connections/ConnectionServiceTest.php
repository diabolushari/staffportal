<?php

namespace Tests\Unit\Connections;

use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use Proto\Connections\ConnectionServiceClient;
use Tests\TestCase;

class ConnectionServiceTest extends TestCase
{
    public function test_list_connections()
    {
        $mockGrpcClient = \Mockery::mock(ConnectionServiceClient::class);
        $mockCall = \Mockery::mock();
        $mockMeterMappingService = \Mockery::mock(MeterConnectionMappingService::class);

        $mockResponse = new \Proto\Connections\ListConnectionsResponse;
        $status = new \stdClass;
        $status->code = 0;
        $status->details = 'OK';
        $status->metadata = [];

        $mockCall->shouldReceive('wait')
            ->once()
            ->andReturn([$mockResponse, $status]);

        $mockGrpcClient->shouldReceive('ListConnections')
            ->once()
            ->andReturn($mockCall);

        $service = new ConnectionService($mockMeterMappingService);
        $reflection = new \ReflectionClass($service);
        $property = $reflection->getProperty('client');
        $property->setAccessible(true);
        $property->setValue($service, $mockGrpcClient);

        $result = $service->listConnections(null, null, null);
        $this->assertNotNull($result);
    }
}
