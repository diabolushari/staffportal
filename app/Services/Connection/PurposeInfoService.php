<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\PurposeInfoConverter;
use App\Http\Requests\Connections\PurposeInfoFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Proto\Connections\PurposeInfoServiceClient;
use Grpc\ChannelCredentials;
use Proto\Connections\DeletePurposeInfoRequest;
use Proto\Connections\GetPurposeInfoRequest;
use Proto\Connections\GetTariffWihtPurposeAndDateRequest;
use Proto\Connections\GetTariffWithPurposeAndDateRequest;
use Proto\Connections\ListPurposeInfoPaginatedRequest;
use Proto\Connections\ListPurposeInfoRequest;

class PurposeInfoService
{

    private PurposeInfoServiceClient $client;

    public function __construct()
    {
        $this->client = new PurposeInfoServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getAllPurposeInfo()
    {
        $grpcRequest = new ListPurposeInfoRequest();
        [$response, $status] = $this->client->listPurposeInfo($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $purposeInfoList = $response->getAllPurposeInfo();
        $purposeInfoArray = [];
        foreach ($purposeInfoList as $purposeInfo) {
            $purposeInfoArray[] = PurposeInfoConverter::toArray($purposeInfo);
        }

        return GrpcServiceResponse::success($purposeInfoArray, $response, $status->code, $status->details);
    }

    public function listPaginatedPurposeInfo(
        ?int $page = 1,
        ?int $pageSize = 10,
        ?string $search = null,
        ?string $orderBy = null,
        ?string $orderDirection = 'asc',
        ?int $purposeId = null,
        ?int $tariffId = null,
        ?string $fromDate = null,
        ?string $toDate = null,
    ) {
        $grpcRequest = new ListPurposeInfoPaginatedRequest();

        if ($page) {
            $grpcRequest->setPageNumber($page);
        }
        if ($pageSize) {
            $grpcRequest->setPageSize($pageSize);
        }
        if ($search) {
            $grpcRequest->setSearch($search);
        }
        if ($orderBy) {
            $grpcRequest->setSortBy($orderBy);
        }
        if ($orderDirection) {
            $grpcRequest->setSortDirection($orderDirection);
        }
        if ($purposeId) {
            $grpcRequest->setPurposeId($purposeId);
        }
        if ($tariffId) {
            $grpcRequest->setTariffId($tariffId);
        }
        if ($fromDate) {
            $grpcRequest->setFromDate($fromDate);
        }
        if ($toDate) {
            $grpcRequest->setToDate($toDate);
        }


        [$response, $status] = $this->client->listPurposeInfoPaginated($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $purposeInfoList = $response->getPurposeInfos();
        $purposeInfoArray = [];
        foreach ($purposeInfoList as $purposeInfo) {
            $purposeInfoArray[] = PurposeInfoConverter::toArray($purposeInfo);
        }

        $data = [
            'purposeInfo' => $purposeInfoArray,
            'total' => $response->getTotalCount(),
            'page' => $response->getPageNumber(),
            'pageSize' => $response->getPageSize(),
            'totalPages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($data, $response, $status->code, $status->details);
    }

    public function createPurposeInfo(PurposeInfoFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = PurposeInfoConverter::toProto($request);
        [$response, $status] = $this->client->createPurposeInfo($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(PurposeInfoConverter::toArray($response), $response, $status->code, $status->details);
    }

    public function createPurposeInfoWithMultiplePurpose(PurposeInfoFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = PurposeInfoConverter::multiplePurposeFormToProto($request);
        [$response, $status] = $this->client->CreateMultiplePurposesForTariff($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $purposeInfoList = $response->getPurposeInfos();
        $purposeInfoArray = [];
        foreach ($purposeInfoList as $purposeInfo) {
            $purposeInfoArray[] = PurposeInfoConverter::toArray($purposeInfo);
        }

        return GrpcServiceResponse::success($purposeInfoArray, $response, $status->code, $status->details);
    }

    public function getPurposeInfoById(int $id): GrpcServiceResponse
    {
        $grpcRequest = new GetPurposeInfoRequest();
        $grpcRequest->setId($id);
        [$response, $status] = $this->client->getPurposeInfo($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(PurposeInfoConverter::toArray($response->getPurposeInfo()), $response, $status->code, $status->details);
    }

    public function updatePurposeInfo(PurposeInfoFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = PurposeInfoConverter::toProto($request);
        [$response, $status] = $this->client->updatePurposeInfo($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(PurposeInfoConverter::toArray($response), $response, $status->code, $status->details);
    }

    public function deletePurposeInfo(int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeletePurposeInfoRequest();
        $grpcRequest->setId($id);
        [$response, $status] = $this->client->deletePurposeInfo($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    public function getTariffWithPurposeAndDate(?int $purposeId, ?string $date): GrpcServiceResponse
    {
        $grpcRequest = new GetTariffWithPurposeAndDateRequest();
        if ($purposeId) {
            $grpcRequest->setPurposeId($purposeId);
        }
        if ($date) {
            $grpcRequest->setDate($date);
        }
        [$response, $status] = $this->client->getTariffWithPurposeAndDate($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $purposeInfoList = $response->getPurposeInfos();
        $purposeInfoArray = [];
        foreach ($purposeInfoList as $purposeInfo) {
            $purposeInfoArray[] = PurposeInfoConverter::toArray($purposeInfo);
        }

        return GrpcServiceResponse::success($purposeInfoArray, $response, $status->code, $status->details);
    }
}
