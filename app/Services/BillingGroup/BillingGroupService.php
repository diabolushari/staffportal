<?php

namespace App\Services\BillingGroup;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use App\GrpcConverters\BillingGroup\BillingGroupProtoConvertor;
use Proto\BillingGroup\BillingGroupMessage;
use App\Http\Requests\BillingGroup\BillingGroupFormRequest;
use Proto\BillingGroup\BillingGroupPaginatedListRequest;
use Proto\BillingGroup\BillingGroupServiceClient;
use Proto\BillingGroup\CreateBillingGroupRequest;
use Proto\BillingGroup\UpdateBillingGroupRequest;
use Proto\BillingGroup\GetBillingGroupRequest;
use Proto\BillingGroup\DeleteBillingGroupRequest;
use Proto\BillingGroup\ListBillingGroupRequest;

class BillingGroupService
{
    private BillingGroupServiceClient $client;

    public function __construct()
    {
        $this->client = new BillingGroupServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedBillingGroups(
        ?int $page = 1,
        ?int $pageSize = 10,
        ?string $search = null,
        ?int $billingGroupId = null,
        ?string $sortBy = null,
        ?string $sortDirection = null
    ): GrpcServiceResponse {
        $req = new BillingGroupPaginatedListRequest();
        if ($page !== null) {
            $req->setPageNumber($page);
        }
        if ($pageSize !== null) {
            $req->setPageSize($pageSize);
        }
        if ($search !== null) {
            $req->setSearch($search);
        }
        if ($billingGroupId !== null) {
            $req->setBillingGroupId($billingGroupId);
        }
        if ($sortBy !== null) {
            $req->setSortBy($sortBy);
        }
        if ($sortDirection !== null) {
            $req->setSortDirection($sortDirection);
        }

        [$response, $status] = $this->client->ListBillingGroupPaginated($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $groups = [];
        foreach ($response->getGroups() as $group) {
            $groups[] = BillingGroupProtoConvertor::convertToArray($group);
        }
        $data = [
            'groups' => $groups,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($data, $response, $status->code, $status->details);
    }


    public function createBillingGroup(BillingGroupFormRequest $request): GrpcServiceResponse
    {
        $req = new CreateBillingGroupRequest;

        $req->setName($request->name);
        if (!empty($request->description)) {
            $req->setDescription($request->description);
        }
        $req->setIsActive(true);

        [$response, $status] = $this->client->CreateBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details,
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupProtoConvertor::convertToArray($response->getGroup()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateBillingGroup(BillingGroupFormRequest $input): GrpcServiceResponse
    {
        $req = new UpdateBillingGroupRequest;

        if ($input->versionId !== null) {
            $req->setVersionId($input->versionId);
        }
        if ($input->billingGroupId !== null) {
            $req->setBillingGroupId($input->billingGroupId);
        }
        $req->setName($input->name);
        if (!empty($input->description)) {
            $req->setDescription($input->description);
        }
        $req->setIsActive(true);
        [$response, $status] = $this->client->UpdateBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupProtoConvertor::convertToArray($response->getGroup()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getBillingGroup(?int $versionId = null, ?int $billingGroupId = null): GrpcServiceResponse
    {
        $req = new GetBillingGroupRequest;
        if ($versionId !== null) {
            $req->setVersionId($versionId);
        }
        if ($billingGroupId !== null) {
            $req->setBillingGroupId($billingGroupId);
        }

        [$response, $status] = $this->client->GetBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupProtoConvertor::convertToArray($response->getGroup()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function deleteBillingGroup(int $versionId, int $deletedBy): GrpcServiceResponse
    {
        $req = new DeleteBillingGroupRequest;
        $req->setVersionId($versionId);
        $req->setDeletedBy($deletedBy);

        [$response, $status] = $this->client->DeleteBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            ['success' => $response->getSuccess(), 'message' => $response->getMessage()],
            $response,
            $status->code,
            $status->details
        );
    }

    public function listBillingGroups(?string $search = null): GrpcServiceResponse
    {
        $req = new ListBillingGroupRequest;
        if ($search !== null) {
            $req->setSearch($search);
        }

        [$response, $status] = $this->client->ListBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $groups = [];
        foreach ($response->getGroups() as $group) {
            $groups[] = BillingGroupProtoConvertor::convertToArray($group);
        }

        return GrpcServiceResponse::success($groups, $response, $status->code, $status->details);
    }
}
