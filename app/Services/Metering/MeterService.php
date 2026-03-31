<?php

declare(strict_types=1);

namespace App\Services\Metering;

use App\GrpcConverters\Meter\MeterProtoConvertor;
use App\Http\Requests\Metering\MeterFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Grpc\StdClassConverter;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\DeleteMeterRequest;
use Proto\Consumers\GetMeterRequest;
use Proto\Consumers\ListMetersRequest;
use Proto\Consumers\ListUnassignedMetersRequest;
use Proto\Consumers\MeterPaginatedListRequest;
use Proto\Consumers\MeterServiceClient;

class MeterService
{
    private MeterServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeter(MeterFormRequest $data): GrpcServiceResponse
    {
        $request = MeterProtoConvertor::convertToProto($data);

        [$response, $status] = $this->client->CreateMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    public function getMeter(int $meterId): GrpcServiceResponse
    {
        $request = new GetMeterRequest;
        $request->setMeterId($meterId);

        [$response, $status] = $this->client->GetMeter($request)->wait();
        $meter = null;
        if ($response->hasMeter()) {
            $meter = $response->getMeter();
        }

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse(StdClassConverter::convertToObject($status)),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(MeterProtoConvertor::convertToArray($meter), $response, $status->code, $status->details);
    }

    public function listMeters(): GrpcServiceResponse
    {
        $request = new ListMetersRequest;
        [$response, $status] = $this->client->ListMeters($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse(StdClassConverter::convertToObject($status)),
                $response,
                $status->code,
                $status->details
            );
        }

        $metersArray = [];
        foreach ($response->getMeters() as $meter) {
            $metersArray[] = MeterProtoConvertor::convertToArray($meter);
        }

        return GrpcServiceResponse::success($metersArray, $response, $status->code, $status->details);
    }

    public function listMetersPaginated(
        int $pageNumber = 1,
        int $pageSize = 10,
        ?string $meterSerial = null,
        ?bool $smartMeterInd = null,
        ?bool $bidirectionalInd = null,
        ?int $meterTypeId = null,
        ?int $meterProfileId = null,
        ?int $meterMakeId = null,
        ?int $ownershipTypeId = null,
        ?int $programmablePtRatio = null,
        ?int $programmableCtRatio = null,
        ?string $sortBy = null,
        ?string $sortDirection = null
    ): GrpcServiceResponse {
        $request = new MeterPaginatedListRequest;
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);

        if ($meterSerial) {
            $request->setMeterSerial($meterSerial);
        }
        if ($smartMeterInd !== null) {
            $request->setSmartMeterInd($smartMeterInd);
        }
        if ($bidirectionalInd !== null) {
            $request->setBidirectionalInd($bidirectionalInd);
        }
        if ($meterTypeId !== null) {
            $request->setMeterTypeId($meterTypeId);
        }
        if ($meterMakeId) {
            $request->setMeterMakeId($meterMakeId);
        }
        if ($ownershipTypeId) {
            $request->setOwnershipTypeId($ownershipTypeId);
        }
        if ($programmableCtRatio) {
            $request->setProgrammableCtRatio($programmableCtRatio);
        }
        if ($programmablePtRatio) {
            $request->setProgrammablePtRatio($programmablePtRatio);
        }

        if ($sortBy !== null && $sortBy !== '') {
            $request->setSortBy($sortBy);
        }

        if ($sortDirection !== null && $sortDirection !== '') {
            $request->setSortDirection($sortDirection);
        }

        [$response, $status] = $this->client->ListMetersPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse(StdClassConverter::convertToObject($status)),
                $response,
                $status->code,
                $status->details
            );
        }

        $meters = array_map(
            fn ($o) => MeterProtoConvertor::convertToArray($o),
            iterator_to_array($response->getMeters())
        );

        return GrpcServiceResponse::success([
            'meters' => $meters,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ], $response, $status->code, $status->details);
    }

    public function listUnassignedMeters(int $pageNumber = 1, int $pageSize = 10, ?string $search = null): GrpcServiceResponse
    {
        $request = new ListUnassignedMetersRequest;
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);

        if ($search) {
            $request->setSearch($search);
        }

        [$response, $status] = $this->client->ListUnassignedMeters($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse(StdClassConverter::convertToObject($status)),
                $response,
                $status->code,
                $status->details
            );
        }

        $meters = array_map(
            fn ($o) => MeterProtoConvertor::convertToArray($o),
            iterator_to_array($response->getMeters())
        );
        $data = [
            'meters' => $meters,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($data, $response, $status->code, $status->details);
    }

    public function updateMeter(MeterFormRequest $data): GrpcServiceResponse
    {

        $request = MeterProtoConvertor::convertToProto($data);
        [$response, $status] = $this->client->UpdateMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    public function deleteMeter(int $meterId): GrpcServiceResponse
    {
        $request = new DeleteMeterRequest;
        $request->setMeterId($meterId);

        [$response, $status] = $this->client->DeleteMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }
}
