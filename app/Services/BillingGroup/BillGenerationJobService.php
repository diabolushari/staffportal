<?php

namespace App\Services\BillingGroup;

use App\GrpcConverters\Billing\BillGenerationJobConverter;
use App\GrpcConverters\BillingGroup\BillingGroupProtoConvertor;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\BillGenerationJob\BillGenerationJobMessage;
use Proto\BillGenerationJob\BillGenerationJobServiceClient;
use Proto\BillGenerationJob\GetBillGenerationJobRequest;
use Proto\BillGenerationJob\ListBillGenerationJobRequest;
use Proto\BillGenerationJob\PaginatedBillGenerationJobRequest;

class BillGenerationJobService
{
    private BillGenerationJobServiceClient $client;

    public function __construct()
    {
        $this->client = new BillGenerationJobServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listBillGenerationJobStatus(
        ?int $billingGroupId,
        ?string $readingYearMonth
    ): GrpcServiceResponse {
        $request = new ListBillGenerationJobRequest();
        if ($billingGroupId) {
            $request->setBillingGroupId($billingGroupId);
        }
        if ($readingYearMonth) {
            $request->setReadingYearMonth($readingYearMonth);
        }
        [$response, $status] = $this->client->ListBillGenerationJob($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $data = [];
        foreach ($response->getData() as $message) {
            $data[] = BillGenerationJobConverter::convertToArray($message);
        }

        return GrpcServiceResponse::success(
            $data,
            $response,
            $status->code,
            $status->details
        );
    }

    public function listPaginatedBillGenerationJob(
        ?int $pageNumber = 1,
        ?int $pageSize = 5,
        ?string $search = null,
        ?string $sortBy = null,
        ?string $sortDirection = null,
        ?int $billingGroupId = null,
        ?string $readingYearMonth = null,
    ): GrpcServiceResponse {
        $request = new PaginatedBillGenerationJobRequest();
        if ($pageNumber) {
            $request->setPageNumber($pageNumber);
        }
        if ($pageSize) {
            $request->setPageSize($pageSize);
        }
        if ($search) {
            $request->setSearch($search);
        }
        if ($sortBy) {
            $request->setSortBy($sortBy);
        }
        if ($sortDirection) {
            $request->setSortDirection($sortDirection);
        }
        if ($billingGroupId) {
            $request->setBillingGroupId($billingGroupId);
        }
        if ($readingYearMonth) {
            $request->setReadingYearMonth($readingYearMonth);
        }
        [$response, $status] = $this->client->PaginatedListBillGenerationJob($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $data = [];
        foreach ($response->getData() as $message) {
            $data[] = BillGenerationJobConverter::convertToArray($message);
        }
        $pagination = [
            'bill_generation_job_status' => $data,
            'total' => $response->getTotalCount(),
            'page' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success(
            $pagination,
            $response,
            $status->code,
            $status->details
        );
    }

    public function getBillGenerationJob(int $id): GrpcServiceResponse
    {
        $request = new GetBillGenerationJobRequest();
        $request->setId($id);
        [$response, $status] = $this->client->GetBillGenerationJob($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            BillGenerationJobConverter::convertToArray($response->getBillGenerationJob()),
            $response,
            $status->code,
            $status->details
        );
    }
}
