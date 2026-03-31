<?php

namespace App\Services\Tariff;

use App\Http\Requests\Tariff\TariffConfigFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Auth;
use Proto\Tariff\CreateTariffConfigRequest;
use Proto\Tariff\DeleteTariffConfigRequest;
use Proto\Tariff\GetTariffConfigRequest;
use Proto\Tariff\ListTariffConfigPaginatedRequest;
use Proto\Tariff\ListTariffConfigPaginatedResponse;
use Proto\Tariff\TariffConfigFormMessage;
use Proto\Tariff\TariffConfigMessage;
use Proto\Tariff\TariffConfigServiceClient;
use Proto\Tariff\UpdateTariffConfigRequest;

class TariffConfigService
{
    private TariffConfigServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService,
        private TariffOrderService $tariffOrderService
    ) {
        $this->client = new TariffConfigServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedTariffConfigs(
        ?int $pageNumber = 1,
     ?int $pageSize = 10,
      ?int $tariffOrderId,
       ?int $connectionTariffId): GrpcServiceResponse
    {
        $grpcRequest = new ListTariffConfigPaginatedRequest;
        if ($pageNumber) {
            $grpcRequest->setPageNumber($pageNumber);
        }
        if ($pageSize) {
            $grpcRequest->setPageSize($pageSize);
        }
        if ($tariffOrderId) {
            $grpcRequest->setTariffOrderId($tariffOrderId);
        }
        if($connectionTariffId){
            $grpcRequest->setConnectionTariffId($connectionTariffId);
        }

        [$response, $status] = $this->client->listTariffConfigPaginated($grpcRequest)->wait();


        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->convertToPaginatedArray($response), $response, $status->code, $status->details);
    }

    public function createTariffConfig(TariffConfigFormRequest $request): GrpcServiceResponse
    {

        $configs = $this->configFormToGrpcMessage($request);

        $grpcRequest = new CreateTariffConfigRequest;
        $grpcRequest->setConfig($configs);

        [$response, $status] = $this->client->createTariffConfig($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $configs = $response->getConfig();
        $config = $this->tariffConfigMessageToArray($configs);

        return GrpcServiceResponse::success($config, $response, $status->code, $status->details);
    }

    public function getTariffConfig(int $id): GrpcServiceResponse
    {
        $grpcRequest = new GetTariffConfigRequest;
        $grpcRequest->setTariffConfigId($id);

        [$response, $status] = $this->client->getTariffConfig($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->tariffConfigMessageToArray($response->getConfig()), $response, $status->code, $status->details);
    }

    public function updateTariffConfig(TariffConfigFormRequest $request, int $id): GrpcServiceResponse
    {
        $grpcRequest = new UpdateTariffConfigRequest;
        $grpcRequest->setConfig($this->configFormToGrpcMessage($request));

        [$response, $status] = $this->client->updateTariffConfig($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->tariffConfigMessageToArray($response->getConfig()), $response, $status->code, $status->details);
    }

    public function deleteTariffConfig(int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeleteTariffConfigRequest;
        $grpcRequest->setTariffConfigId($id);
        $userId = Auth::id();
        if ($userId) {
            $grpcRequest->setDeletedBy(intval($userId));
        }

        [$response, $status] = $this->client->deleteTariffConfig($grpcRequest)->wait();

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

    public function configFormToGrpcMessage(TariffConfigFormRequest $request): TariffConfigFormMessage
    {
        $msg = new TariffConfigFormMessage;
        if ($request->tariffConfigId) {
            $msg->setTariffConfigId($request->tariffConfigId);
        }
        $msg->setTariffOrderId($request->tariffOrderId);
        $msg->setConnectionTariffId($request->connectionTariff);
        $msg->setConsumptionLowerLimit($request->consumptionLowerLimit);
        if ($request->consumptionUpperLimit !== null) {
            $msg->setConsumptionUpperLimit($request->consumptionUpperLimit);
        }
        $msg->setDemandChargeKva($request->demandChargeKva);
        $msg->setEnergyChargeKwh($request->energyChargeKwh);
        $msg->setEffectiveStart($request->effectiveStart);
        $msg->setEffectiveEnd($request->effectiveEnd);

        return $msg;
    }

    /**
     * @return array<string, mixed>
     */
    public function tariffConfigMessageToArray(TariffConfigMessage $msg): array
    {

        return [
            'tariff_config_id' => $msg->getTariffConfigId(),
            'tariff_order_id' => $msg->getTariffOrderId(),
            'connection_tariff' => $this->parameterValueService->toArray($msg->getConnectionTariff()),
            'consumption_lower_limit' => $msg->getConsumptionLowerLimit() ?? null,
            'consumption_upper_limit' => $msg->hasConsumptionUpperLimit() ? $msg->getConsumptionUpperLimit() : null,
            'demand_charge_kva' => $msg->getDemandChargeKva() ?? null,
            'energy_charge_kwh' => $msg->getEnergyChargeKwh() ?? null,
            'tariff_order' => $msg->getTariffOrder() ? $this->tariffOrderService->tariffMessageToArray($msg->getTariffOrder()) : null,
            'effective_start' => $msg->getEffectiveStart(),
            'effective_end' => $msg->getEffectiveEnd(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function convertToPaginatedArray(ListTariffConfigPaginatedResponse $response): array
    {
        $configs = $response->getConfigs();
        $array = [];
        foreach ($configs as $item) {
            $array[] = $this->tariffConfigMessageToArray($item);
        }


        return [
            'tariff_configs' => $array,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];
    }
}
