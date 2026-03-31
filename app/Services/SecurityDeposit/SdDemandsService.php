<?php

namespace App\Services\SecurityDeposit;

use App\GrpcConverters\SecurityDeposit\SdCollectionAttributeConverter;
use App\GrpcConverters\SecurityDeposit\SdCollectionConverter;
use App\GrpcConverters\SecurityDeposit\SdDemandConverter;
use App\GrpcConverters\SecurityDeposit\SdDemandStatusConverter;
use App\Http\Requests\SecurityDeposit\SdDemandFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\DeleteSdDemandRequest;
use Proto\Consumers\GetSdDemandRequest;
use Proto\Consumers\ListSdDemandsPaginatedRequest;
use Proto\Consumers\SdDemandServiceClient;
use Proto\Consumers\UpdateSdDemandRequest;

class SdDemandsService
{
    private SdDemandServiceClient $client;

    public function __construct(
        private readonly SdDemandConverter $sdDemandConverter,
        private readonly SdCollectionConverter $sdCollectionConverter,
        private readonly SdCollectionAttributeConverter $sdAttributeConverter,
        private readonly SdDemandStatusConverter $sdDemandStatusConverter
    ) {
        $this->client = new SdDemandServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedSdDemands(?int $connectionId, ?int $calculationBasicId, ?int $demandTypeId, ?string $totalSdAmount)
    {
        $request = new ListSdDemandsPaginatedRequest;
        if ($connectionId != null) {
            $request->setConnectionId($connectionId);
        }
        if ($calculationBasicId != null) {
            $request->setCalculationBasicId($calculationBasicId);
        }
        if ($demandTypeId != null) {
            $request->setDemandTypeId($demandTypeId);
        }
        if ($totalSdAmount != null) {
            $request->setTotalSdAmount($totalSdAmount);
        }

        [$response, $status] = $this->client->ListSdDemandsPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $sdDemands = $response->getItems();
        $sdDemandArray = [];
        foreach ($sdDemands as $sdDemand) {
            $demandData = $this->sdDemandConverter->convertToArray($sdDemand);
            $sdDemandStatus = $sdDemand->getLatestStatus();
            $sdDemandStatusArray = $this->sdDemandStatusConverter->convertToArray($sdDemandStatus);
            $demandData['latestStatus'] = $sdDemandStatusArray;
            $collectionsArray = [];
            foreach ($sdDemand->getCollections() as $collection) {
                $collectionData = $this->sdCollectionConverter
                    ->convertToArray($collection);

                $attributesArray = [];

                foreach ($collection->getSdAttribute() as $attribute) {
                    $attributesArray[] = $this->sdAttributeConverter
                        ->sdAttributeToArray($attribute);
                }

                if (! empty($attributesArray)) {
                    $collectionData['sd_attributes'] = $attributesArray;
                }

                $collectionsArray[] = $collectionData;
            }
            $demandData['collections'] = $collectionsArray;
            $sdDemandArray[] = $demandData;
        }

        $paginatedData = [
            'sd_demands' => $sdDemandArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($paginatedData, $response, $status->code, $status->details);
    }

    public function createDemandWithRegister(SdDemandFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = $this->sdDemandConverter->grpcToDemandRegisterCreateRequest($request);

        [$response, $status] =
            $this->client->CreateSdDemandWithRegister($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $sdDemandArray = $this->sdDemandConverter->convertToArray($response);

        return GrpcServiceResponse::success(
            $sdDemandArray,
            $response,
            $status->code,
            $status->details
        );
    }

    public function update(SdDemandFormRequest $request, int $id): GrpcServiceResponse
    {
        $sdDemand = $this->sdDemandConverter->formToGrpcMessage($request, $id);

        $grpcRequest = new UpdateSdDemandRequest;
        $grpcRequest->setSdDemand($sdDemand);

        [$response, $status] =
            $this->client->UpdateSdDemand($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $sdDemandArray = $this->sdDemandConverter->convertToArray($response->getSdDemand());

        return GrpcServiceResponse::success(
            $sdDemandArray,
            $response,
            $status->code,
            $status->details
        );
    }

    public function deleteSdDemand(int $id)
    {
        $grpcRequest = new DeleteSdDemandRequest;
        $grpcRequest->setSdDemandId($id);

        [$response, $status] = $this->client->DeleteSdDemand($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([
            'success' => $response->getSuccess(),
        ]);
    }

    public function getSdDemand(int $id)
    {

        $request = new GetSdDemandRequest;
        $request->setSdDemandId($id);
        [$response, $status] = $this->client->GetSdDemand($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $sdDemand = $response->getSdDemand();
        $sdDemandArray = $this->sdDemandConverter->convertToArray($sdDemand);

        return GrpcServiceResponse::success($sdDemandArray, $response, $status->code, $status->details);
    }
}
