<?php

namespace App\Services\SecurityDeposit;

use App\GrpcConverters\SecurityDeposit\SdRegisterConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\GetSdRegisterByConnectionIdRequest;
use Proto\Consumers\GetSdRegisterByIdRequest;
use Proto\Consumers\ListSdRegistersPaginatedRequest;
use Proto\Consumers\SdRegisterServiceClient;

class SdRegisterService
{
    private SdRegisterServiceClient $client;

    public function __construct(
        private readonly SdRegisterConverter $sdRegisterConverter,
    ) {
        $this->client = new SdRegisterServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedSdRegisters(
        ?int $connectionId,
        ?int $sdTypeId,
        ?int $occupancyTypeId,
        ?string $periodFrom,
        ?string $periodTo,
        ?int $pageNumber = 1,
        ?int $pageSize = 10,
    ) {
        $request = new ListSdRegistersPaginatedRequest;

        $request->setPage($pageNumber);
        $request->setPageSize($pageSize);
        if ($connectionId !== null) {
            $request->setConnectionId($connectionId);
        }
        if ($sdTypeId !== null) {
            $request->setSdTypeId($sdTypeId);
        }
        if ($occupancyTypeId !== null) {
            $request->setOccupancyTypeId($occupancyTypeId);
        }
        if ($periodFrom !== null) {
            $request->setPeriodFrom($periodFrom);
        }
        if ($periodTo !== null) {
            $request->setPeriodTo($periodTo);
        }

        [$response, $status] = $this->client->ListSdRegistersPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $sdRegisters = $response->getItems();
        $sdRegisterArray = [];
        foreach ($sdRegisters as $sdRegister) {
            $registerData = $this->sdRegisterConverter->convertToArray($sdRegister);
            $sdRegisterArray[] = $registerData;
        }

        $paginatedData = [
            'sd_registers' => $sdRegisterArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($paginatedData, $response, $status->code, $status->details);
    }

    public function getSdRegisterById(int $sdRegisterId)
    {
        $request = new GetSdRegisterByIdRequest;
        $request->setSdRegisterId($sdRegisterId);

        [$response, $status] = $this->client->GetSdRegister($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $sdRegister = $this->sdRegisterConverter->convertToArray($response->getSdRegister());

        return GrpcServiceResponse::success($sdRegister, $response, $status->code, $status->details);
    }

    public function getSdRegisterByConnectionId(int $connectionId)
    {
        $request = new GetSdRegisterByConnectionIdRequest;
        $request->setConnectionId($connectionId);

        [$response, $status] = $this->client->GetSdRegisterByConnectionId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $sdRegisters = $response->getSdRegister();
        $sdRegisterArray = [];
        foreach ($sdRegisters as $sdRegister) {
            $registerData = $this->sdRegisterConverter->convertToArray($sdRegister);
            $sdRegisterArray[] = $registerData;
        }

        return GrpcServiceResponse::success($sdRegisterArray, $response, $status->code, $status->details);
    }
}
