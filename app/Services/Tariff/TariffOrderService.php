<?php

namespace App\Services\Tariff;

use App\Http\Requests\Tariff\TariffOrderFormRequest;
use App\Http\Requests\Tariff\TariffOrderUpdateFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Auth;
use Proto\Tariff\CreateTariffOrderRequest;
use Proto\Tariff\DeleteTariffOrderRequest;
use Proto\Tariff\DownloadTariffOrderRequest;
use Proto\Tariff\DownloadTariffOrderResponse;
use Proto\Tariff\GetTariffOrderRequest;
use Proto\Tariff\TariffOrderFormMessage;
use Proto\Tariff\TariffOrderListRequest;
use Proto\Tariff\TariffOrderMessage;
use Proto\Tariff\TariffOrderServiceClient;
use Proto\Tariff\TariffOrderUpdateRequest;

class TariffOrderService
{
    private TariffOrderServiceClient $client;

    public function __construct()
    {
        $this->client = new TariffOrderServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /** List tariff orders */
    public function listTariffOrders(?int $pageNumber = 1, ?int $pageSize = 10, ?string $orderBy = null, ?string $orderDirection = null, ?string $orderDescriptor = null): GrpcServiceResponse
    {
        $request = new TariffOrderListRequest;
        $request->setPageNumber($pageNumber ?? 1);
        $request->setPageSize($pageSize ?? 10);
        if ($orderBy) {
            $request->setSortBy($orderBy);
        }
        if ($orderDirection) {
            $request->setSortDirection($orderDirection);
        }
        if ($orderDescriptor) {
            $request->setOrderDescriptor($orderDescriptor);
        }

        [$response, $status] = $this->client->listTariffOrders($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $orders = array_map(fn (TariffOrderMessage $o) => $this->tariffMessageToArray($o), iterator_to_array($response->getOrders()));

        return GrpcServiceResponse::success([
            'tariff_orders' => $orders,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ], $response, $status->code, $status->details);
    }

    /** Create tariff order */
    public function createTariffOrder(TariffOrderFormRequest $data): GrpcServiceResponse
    {
        $formMessage = $this->tariffFormRequestToTarrifFormMessage($data);
        $request = new CreateTariffOrderRequest;
        $request->setOrder($formMessage);

        [$response, $status] = $this->client->createTariffOrder($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->tariffMessageToArray($response), $response, $status->code, $status->details);
    }

    public function getTariffOrder(int $id): GrpcServiceResponse
    {
        $request = new GetTariffOrderRequest;
        $request->setTariffOrderId($id);

        [$response, $status] = $this->client->getTariffOrder($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->tariffMessageToArray($response), $response, $status->code, $status->details);
    }

    public function updateTariffOrder(TariffOrderUpdateFormRequest $data): GrpcServiceResponse
    {
        $formMessage = $this->tariffUpdateFormRequestToGrpcUpdateRequest($data);
        [$response, $status] = $this->client->updateTariffOrder($formMessage)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->tariffMessageToArray($response), $response, $status->code, $status->details);
    }

    public function deleteTariffOrder(int $id): GrpcServiceResponse
    {
        $request = new DeleteTariffOrderRequest;
        $request->setTariffOrderId($id);
        $userId = Auth::id();
        if ($userId) {
            $request->setDeletedBy(intval($userId));
        }

        [$response, $status] = $this->client->deleteTariffOrder($request)->wait();
        if ($status->code === 1) {
            return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
        }
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

    /** Download tariff order file */
    public function downloadTariffOrder(int $id): GrpcServiceResponse
    {
        $request = new DownloadTariffOrderRequest;
        $request->setTariffOrderId($id);

        [$response, $status] = $this->client->downloadTariffOrder($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $file = $this->byteToTariffOrderFile($response);

        return GrpcServiceResponse::success($file, $response, $status->code, $status->details);
    }

    /** Convert form request to gRPC message */
    public function tariffFormRequestToTarrifFormMessage(TariffOrderFormRequest $data): TariffOrderFormMessage
    {
        $msg = new TariffOrderFormMessage;

        $msg->setOrderDescriptor($data->orderDescriptor);

        $bytes = file_get_contents($data->referenceDocument->getPathname());
        if ($bytes !== false) {
            $msg->setReferenceDocument($bytes);
        }
        $msg->setReferenceDocumentName($data->referenceDocumentName);

        $msg->setPublishedDate($data->publishedDate);
        $msg->setEffectiveStart($data->effectiveStart);
        if ($data->effectiveEnd) {
            $msg->setEffectiveEnd($data->effectiveEnd);
        }

        return $msg;
    }

    public function tariffUpdateFormRequestToGrpcUpdateRequest(TariffOrderUpdateFormRequest $data): TariffOrderUpdateRequest
    {
        $msg = new TariffOrderUpdateRequest;
        $msg->setTariffOrderId($data->tariffOrderId);
        $msg->setOrderDescriptor($data->orderDescriptor);

        if ($data->referenceDocument) {
            $bytes = file_get_contents($data->referenceDocument->getPathname());
            if ($bytes !== false) {
                $msg->setReferenceDocument($bytes);
            }
            $msg->setReferenceDocumentName($data->referenceDocumentName ?? '');
        }

        $msg->setPublishedDate($data->publishedDate);
        $msg->setEffectiveStart($data->effectiveStart);
        if ($data->effectiveEnd) {
            $msg->setEffectiveEnd($data->effectiveEnd);
        }

        return $msg;
    }

    /**
     * @return array<string, int|string>
     */
    public function tariffMessageToArray(TariffOrderMessage $msg): array
    {
        return [
            'tariff_order_id' => $msg->getTariffOrderId(),
            'order_descriptor' => $msg->getOrderDescriptor(),
            'reference_document' => $msg->getReferenceDocument(),
            'published_date' => $msg->getPublishedDate(),
            'effective_start' => $msg->getEffectiveStart(),
            'effective_end' => $msg->getEffectiveEnd(),
            'created_ts' => $msg->getCreatedTs(),
            'updated_ts' => $msg->getUpdatedTs(),
            'created_by' => $msg->getCreatedBy(),
            'updated_by' => $msg->getUpdatedBy(),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function byteToTariffOrderFile(DownloadTariffOrderResponse $grpcResponse): array
    {
        $fileData = $grpcResponse->getFileData();

        if (is_object($fileData) && method_exists($fileData, '__toString')) {
            $contents = $fileData->__toString();
        } else {
            $contents = $fileData;
        }

        return [
            'file_name' => $grpcResponse->getFileName(),
            'contents' => $contents,
        ];
    }
}
