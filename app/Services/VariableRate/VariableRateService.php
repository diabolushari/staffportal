<?php

declare(strict_types=1);

namespace App\Services\VariableRate;

use App\GrpcConverters\variablerate\VariableRateConverter;
use App\Http\Requests\VariableRate\VariableRateFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Variablerate\CreateVariableRateRequest;
use Proto\Variablerate\DeleteVariableRateRequest;
use Proto\Variablerate\UpdateVariableRateRequest;
use Proto\Variablerate\VariableRatePaginatedListRequest;
use Proto\Variablerate\VariableRateServiceClient;

class VariableRateService
{
    private VariableRateServiceClient $client;

    public function __construct()
    {
        $this->client = new VariableRateServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createVariableRate(VariableRateFormRequest $request): GrpcServiceResponse
    {
        $variableRateProto = VariableRateConverter::convertToProto($request);
        $variableRateRequest = new CreateVariableRateRequest();
        if ($variableRateProto !== null) {
            $variableRateRequest->setVariableRate($variableRateProto);
        }
        [$response, $status] = $this->client->CreateVariableRate($variableRateRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            VariableRateConverter::convertToArray($response->getVariableRate() ?? null),
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateVariableRate(VariableRateFormRequest $request): GrpcServiceResponse
    {
        $variableRateProto = VariableRateConverter::convertToProto($request);
        $variableRateRequest = new UpdateVariableRateRequest();
        if ($variableRateProto !== null) {
            $variableRateRequest->setVariableRate($variableRateProto);
        }
        [$response, $status] = $this->client->UpdateVariableRate($variableRateRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            VariableRateConverter::convertToArray($response->getVariableRate() ?? null),
            $response,
            $status->code,
            $status->details
        );
    }

    public function listPaginatedVariableRates(?int $pageNumber = 1, ?int $pageSize = 10, ?string $search = null, ?string $sortBy = 'id', ?string $sortOrder = 'asc', ?int $variableNameId = null): GrpcServiceResponse
    {
        $variableRateRequest = new VariableRatePaginatedListRequest();
        if ($pageNumber !== null) {
            $variableRateRequest->setPageNumber($pageNumber);
        }
        if ($pageSize !== null) {
            $variableRateRequest->setPageSize($pageSize);
        }
        if ($search !== null) {
            $variableRateRequest->setSearch($search);
        }
        if ($sortBy !== null) {
            $variableRateRequest->setSortBy($sortBy);
        }
        if ($sortOrder !== null) {
            $variableRateRequest->setSortDirection($sortOrder);
        }
        if ($variableNameId !== null) {
            $variableRateRequest->setVariableNameId($variableNameId);
        }
        [$response, $status] = $this->client->ListVariableRatesPaginated($variableRateRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $variableRateArray = [];
        foreach ($response->getVariableRates() as $variableRate) {
            $variableRateArray[] = VariableRateConverter::convertToArray($variableRate);
        }
        $data = [
            'variable_rates' => $variableRateArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success(
            $data,
            $response,
            $status->code,
            $status->details
        );
    }

    public function deleteVariableRate(int $id): GrpcServiceResponse
    {
        $variableRateRequest = new DeleteVariableRateRequest();
        $variableRateRequest->setId($id);
        [$response, $status] = $this->client->DeleteVariableRate($variableRateRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            null,
            $response,
            $status->code,
            $status->details
        );
    }
}
