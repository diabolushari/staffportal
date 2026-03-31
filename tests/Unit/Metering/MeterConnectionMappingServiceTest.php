<?php

use App\Http\Requests\Connections\ConnectionMeterStatusFormRequest;
use App\Services\Metering\MeterConnectionMappingService;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\Metering\MeterConnectionMappingServiceClient;
use Proto\Metering\UpdateMeterConnectionMappingRequest;

afterEach(function () {
    \Mockery::close();
});

function makeMeterConnectionMappingService(MeterConnectionMappingServiceClient $client): MeterConnectionMappingService
{
    $reflection = new \ReflectionClass(MeterConnectionMappingService::class);
    $service = $reflection->newInstanceWithoutConstructor();
    $clientProperty = $reflection->getProperty('client');
    $clientProperty->setAccessible(true);
    $clientProperty->setValue($service, $client);

    return $service;
}

function makeGrpcStatus(int $code = 0, string $details = 'OK'): \stdClass
{
    $status = new \stdClass;
    $status->code = $code;
    $status->details = $details;
    $status->metadata = [];

    return $status;
}

it('uses the merged update mapping rpc when updating meter status', function () {
    $response = (new MeterConnectionMappingResponse)
        ->setRelId(18)
        ->setNoticeDate('2026-03-10')
        ->setIntimationDate('2026-03-11');

    $call = \Mockery::mock();
    $call->shouldReceive('wait')
        ->once()
        ->andReturn([$response, makeGrpcStatus()]);

    $client = \Mockery::mock(MeterConnectionMappingServiceClient::class);
    $client->shouldReceive('UpdateMeterConnectionMapping')
        ->once()
        ->withArgs(function (UpdateMeterConnectionMappingRequest $request): bool {
            return $request->getRelId() === 18
                && $request->getMeterStatusId() === 7
                && $request->getNoticeDate() === '2026-03-10'
                && $request->getIntimationDate() === '2026-03-11';
        })
        ->andReturn($call);

    $service = makeMeterConnectionMappingService($client);

    $result = $service->updateMeterConnectionStatus(
        new ConnectionMeterStatusFormRequest(
            relId: 18,
            statusId: 7,
            noticeDate: '2026-03-10',
            intimationDate: '2026-03-11',
        )
    );

    expect($result->statusCode)->toBe(0)
        ->and($result->data['rel_id'])->toBe(18)
        ->and($result->data['notice_date'])->toBe('2026-03-10')
        ->and($result->data['intimation_date'])->toBe('2026-03-11');
});

it('uses the merged update mapping rpc when updating meter profile', function () {
    $response = (new MeterConnectionMappingResponse)
        ->setRelId(18)
        ->setProfileId(22);

    $call = \Mockery::mock();
    $call->shouldReceive('wait')
        ->once()
        ->andReturn([$response, makeGrpcStatus()]);

    $client = \Mockery::mock(MeterConnectionMappingServiceClient::class);
    $client->shouldReceive('UpdateMeterConnectionMapping')
        ->once()
        ->withArgs(function (UpdateMeterConnectionMappingRequest $request): bool {
            return $request->getRelId() === 18
                && $request->getProfileId() === 22;
        })
        ->andReturn($call);

    $service = makeMeterConnectionMappingService($client);

    $result = $service->updateMeterConnectionProfile(18, 22);

    expect($result->statusCode)->toBe(0)
        ->and($result->data['rel_id'])->toBe(18);
});
