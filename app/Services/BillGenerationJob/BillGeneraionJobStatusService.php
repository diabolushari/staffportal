<?php

namespace App\Services\BillGenerationJob;

use App\GrpcConverters\Billing\BillGenerationJobStatusConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\BillGenerationJob\BillGenerationJobStatusServiceClient;
use Proto\BillGenerationJob\PaginatedBillGenerationJobStatusRequest;

class BillGeneraionJobStatusService
{


    private BillGenerationJobStatusServiceClient $client;

    public function __construct()
    {
        $this->client = new BillGenerationJobStatusServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function paginatedListBillGenerationJobStatus(
        ?int $pageNumber = 1,
        ?int $pageSize = 10,
        ?string $search = null,
        ?string $sortBy = null,
        ?string $sortDirection = null,
        ?string $billingGroupId = null,
        ?int $connectionId = null
    ): GrpcServiceResponse {
        $proto = new PaginatedBillGenerationJobStatusRequest();
        if ($pageNumber) {
            $proto->setPageNumber($pageNumber);
        }
        if ($pageSize) {
            $proto->setPageSize($pageSize);
        }
        if ($search) {
            $proto->setSearch($search);
        }
        if ($sortBy) {
            $proto->setSortBy($sortBy);
        }
        if ($sortDirection) {
            $proto->setSortDirection($sortDirection);
        }
        if ($billingGroupId) {
            $proto->setBillingGroupId($billingGroupId);
        }
        if ($connectionId) {
            $proto->setConnectionId($connectionId);
        }

        [$response, $status] = $this->client->PaginatedListBillGenerationJobStatus($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $billGenerationJobStatuses = [];
        foreach ($response->getData() as $billGenerationJobStatus) {
            $billGenerationJobStatuses[] = BillGenerationJobStatusConverter::convertToArray($billGenerationJobStatus);
        }
        $data = [
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
            'data' => $billGenerationJobStatuses,
        ];

        return GrpcServiceResponse::success($data, $response, $status->code, $status->details);
    }
}
