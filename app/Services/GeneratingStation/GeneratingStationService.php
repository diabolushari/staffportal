<?php

namespace App\Services\GeneratingStation;

use App\GrpcConverters\GeneratingStation\GeneratingStationConverter;
use App\Http\Requests\GeneratingStation\GeneratingStationFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\GeneratingStation\CreateGeneratingStationRequest;
use Proto\GeneratingStation\ListGeneratingStationRequest;
use Proto\GeneratingStation\ListGeneratingStationPaginatedRequest;
use Proto\GeneratingStation\GetGeneratingStationRequest;
use Proto\GeneratingStation\GeneratingStationMessage;
use Proto\GeneratingStation\GeneratingStationAttributeRequest;
use Proto\GeneratingStation\ListStationTransactionsRequest;
use Proto\Connections\AddressMessage;
use Proto\GeneratingStation\GeneratingStationServiceClient;

class GeneratingStationService
{
    private GeneratingStationServiceClient $client;

    public function __construct(
        private GeneratingStationAttributeService $attributeService
    ) {
        $this->client = new GeneratingStationServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedGeneratingStations(
        ?int $page = 1,
        ?int $pageSize = 10,
        array $filters = []
    ): GrpcServiceResponse {

        $req = new ListGeneratingStationPaginatedRequest();

        if ($page !== null) {
            $req->setPage($page);
        }

        if ($pageSize !== null) {
            $req->setPageSize($pageSize);
        }

        if (!empty($filters['station_name'])) {
            $req->setStationName($filters['station_name']);
        }

        if (!empty($filters['consumer_number'])) {
            $req->setConsumerNumber($filters['consumer_number']);
        }

        if (!empty($filters['generation_type_id'])) {
            $req->setGenerationTypeId((int)$filters['generation_type_id']);
        }

        if (!empty($filters['voltage_category_id'])) {
            $req->setVoltageCategoryId((int)$filters['voltage_category_id']);
        }

        if (!empty($filters['plant_type_id'])) {
            $req->setPlantTypeId((int)$filters['plant_type_id']);
        }

        if (!empty($filters['generation_status_id'])) {
            $req->setGenerationStatusId((int)$filters['generation_status_id']);
        }

        if (!empty($filters['date_from'])) {
            $req->setDateFrom($filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $req->setDateTo($filters['date_to']);
        }


        [$response, $status] =
            $this->client->ListGeneratingStationPaginated($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $stations = [];

        foreach ($response->getItems() as $station) {
            $stations[] = GeneratingStationConverter::convertToArray($station);
        }

        $data = [
            'items' => $stations,
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

    public function listGeneratingStations(?string $search = null): GrpcServiceResponse
    {
        $req = new ListGeneratingStationRequest();

        if ($search !== null) {
            $req->setSearch($search);
        }

        [$response, $status] =
            $this->client->ListGeneratingStation($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $stations = [];

        foreach ($response->getItems() as $station) {
            $stations[] = GeneratingStationConverter::convertToArray($station);
        }

        return GrpcServiceResponse::success(
            $stations,
            $response,
            $status->code,
            $status->details
        );
    }

    public function create(GeneratingStationFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new CreateGeneratingStationRequest();

        $grpcRequest->setStation(
            $this->toGeneratingStation($request)
        );

        $grpcRequest->setAddress(
            $this->toAddress($request)
        );


        if ($request->attributeData) {

            $processedAttributes = $this->attributeService
                ->processGeneratingStationAttributes($request);

            $protoAttributes = [];

            foreach ($processedAttributes as $attr) {

                $attributeProto = new GeneratingStationAttributeRequest();

                $attributeProto->setAttributeDefinitionId(
                    $attr['attribute_definition_id']
                );

                $attributeProto->setAttributeValue(
                    $attr['attribute_value']
                );

                $protoAttributes[] = $attributeProto;
            }

            $grpcRequest->setAttributes($protoAttributes);
        }

        [$response, $status] =
            $this->client->CreateGeneratingStation($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            [],
            $response,
            $status->code,
            $status->details
        );
    }

    public function getGeneratingStation(int $id): GrpcServiceResponse
    {
        $request = new GetGeneratingStationRequest();
        $request->setStationId($id);

        [$response, $status] = $this->client->GetGeneratingStation($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $station = $response->getStation();
        return GrpcServiceResponse::success(
            GeneratingStationConverter::convertToArray($station),
            $response,
            $status->code,
            $status->details
        );
    }

   public function listStationTransactions(int $stationId, array $filters = []): GrpcServiceResponse
    {
        $req = new ListStationTransactionsRequest();
        $req->setStationId($stationId);

          if (!empty($filters['transaction_type_id'])) {
            $req->setTransactionTypeId((int)$filters['transaction_type_id']);
        }

        if (!empty($filters['consumer_number'])) {
            $req->setConsumerNumber($filters['consumer_number']);
        }

        if (!empty($filters['date_from'])) {
            $req->setDateFrom($filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $req->setDateTo($filters['date_to']);
        }


        [$response, $status] =
            $this->client->ListStationTransactions($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $transactions = [];

        foreach ($response->getItems() as $txn) {

            $timezone = $txn->getTimezone();
            $sourceTimezone = $txn->getSourceTimezone();
            $txnType = $txn->getTxnType();
            $consumerConnection = $txn->getConsumerConnection();
            $transactions[] = [
                'txn_id' => $txn->getTxnId(),
                'txn_group_ref' => $txn->getTxnGroupRef(),
                'txn_seq' => $txn->getTxnSeq(),
                'bill_year_month' => $txn->getBillYearMonth(),
                'conversion_factor' => $txn->getConversionFactor(),
                'pre_conversion_units' => $txn->getPreConversionUnits(),

                'txn_units' => $txn->getTxnUnits(),
                'unit_balance' => $txn->getUnitBalance(),

                'txn_date' => $txn->getTxnDate(),
                'txn_ts' => $txn->getTxnTs(),
                'txn_direction' => $txn->getTxnDirection(),
                'consumer_connection' => $consumerConnection ? [
                    'consumer_number' => $consumerConnection->getConsumerNum()
                ] : null,

                'timezone' => $timezone ? [
                    'id' => $timezone->getId(),
                    'parameter_value' => $timezone->getParameterValue(),
                    'parameter_code' => $timezone->getParameterCode(),
                ] : null,
                 'source_timezone' => $sourceTimezone ? [
                    'id' => $sourceTimezone->getId(),
                    'parameter_value' => $sourceTimezone->getParameterValue(),
                    'parameter_code' => $sourceTimezone->getParameterCode(),
                ] : null,


                'txn_type' => $txnType ? [
                    'id' => $txnType->getId(),
                    'parameter_value' => $txnType->getParameterValue(),
                    'parameter_code' => $txnType->getParameterCode(),
                ] : null,
            ];
        }

        return GrpcServiceResponse::success(
            $transactions,
            $response,
            $status->code,
            $status->details
        );
    }

    private function toGeneratingStation(
        GeneratingStationFormRequest $request
    ): GeneratingStationMessage {

        $msg = new GeneratingStationMessage();

        if (!is_null($request->connectionId)) { 
            $msg->setConnectionId((int) $request->connectionId);
        }
        $msg->setStationName($request->stationName);
        $msg->setGenerationStatusId($request->generationStatusId);
        $msg->setInstalledCapacity($request->installedCapacity);

        $msg->setGenerationTypeId($request->generationTypeId);
        $msg->setVoltageCategoryId($request->voltageCategoryId);
        $msg->setPlantTypeId($request->plantTypeId);

        $msg->setCommissioningDate($request->commissioningDate);

        return $msg;
    }

    private function toAddress(
        GeneratingStationFormRequest $request
    ): AddressMessage {

        $address = new AddressMessage();

        $address->setAddressLine1($request->addressLine1);
        $address->setAddressLine2($request->addressLine2 ?? '');
        $address->setCityTownVillage($request->cityTownVillage);
        $address->setPincode($request->pincode);
        $address->setDistrictId($request->districtId);
        $address->setStateId($request->stateId);

        return $address;
    }
}
