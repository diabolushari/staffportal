<?php

namespace App\Services\Metering;

use App\GrpcConverters\Metering\MeterTransformerRelProtoConvertor;
use App\Http\Requests\Metering\MeterTransformerRelFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Google\Protobuf\GPBEmpty;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Auth;
use Proto\Metering\GetMeterTransformerRelByCtptIdRequest;
use Proto\Metering\GetMeterTransformerRelByMeterIdRequest;
use Proto\Metering\ListAssignedToMetersRequest;
use Proto\Metering\MeterTransformerRelCreateRequest;
use Proto\Metering\MeterTransformerRelIdRequest;
use Proto\Metering\MeterTransformerRelServiceClient;
use Proto\Metering\MeterTransformerRelUpdateChangeReasonRequest;
use Proto\Metering\MeterTransformerRelUpdateRequest;
use Proto\Metering\MeterTransformerRelUpdateStatusRequest;

class MeterTransformerRelService
{
    private MeterTransformerRelServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterTransformerRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    private function toProtoTimestamp(?string $date): ?Timestamp
    {
        if (empty($date)) {
            return null;
        }

        $ts = new Timestamp;
        $dt = Carbon::parse($date);
        $ts->fromDateTime($dt);

        return $ts;
    }

    public function listRelations(): GrpcServiceResponse
    {
        $request = new GPBEmpty;
        [$response, $status] = $this->client->ListMeterTransformerRels($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relsArray = [];
        foreach ($response->getRels() as $rel) {
            $relsArray[] = MeterTransformerRelProtoConvertor::relProtoToArray($rel);
        }

        return GrpcServiceResponse::success($relsArray, $response, $status->code, $status->details);
    }

    public function createRelation(MeterTransformerRelFormRequest $data): GrpcServiceResponse
    {
        $request = new MeterTransformerRelCreateRequest;
        $request->setCtptId($data->ctptId);
        $request->setMeterId($data->meterId);
        if ($data->faultyDate) {
            $request->setFaultyDate($this->toProtoTimestamp($data->faultyDate));
        }
        if ($data->ctptEnergiseDate) {
            $request->setCtptEnergiseDate($this->toProtoTimestamp($data->ctptEnergiseDate));
        }
        if ($data->ctptChangeDate) {
            $request->setCtptChangeDate($this->toProtoTimestamp($data->ctptChangeDate));
        }
        if ($data->statusId) {
            $request->setStatusId($data->statusId);
        }
        if ($data->changeReasonId) {
            $request->setChangeReasonId($data->changeReasonId);
        }
        $request->setCreatedBy(1);
        [$response, $status] = $this->client->CreateMeterTransformerRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerRelProtoConvertor::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getRelation(int $id): GrpcServiceResponse
    {
        $request = new MeterTransformerRelIdRequest;
        $request->setVersionId($id);

        [$response, $status] = $this->client->GetMeterTransformerRelById($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerRelProtoConvertor::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getRelByMeterId(int $meterId): GrpcServiceResponse
    {
        $request = new GetMeterTransformerRelByMeterIdRequest;
        $request->setMeterId($meterId);

        [$response, $status] = $this->client->GetMeterTransformerRelByMeterId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, $response, false),
                $response,
                $status->code,
                $status->details
            );
        }
        $relations = [];
        foreach ($response->getRelations() as $rel) {
            $relations[] = MeterTransformerRelProtoConvertor::relProtoToArray($rel);
        }

        return GrpcServiceResponse::success(
            $relations,
            $response,
            $status->code,
            $status->details
        );
    }

    public function getRelByCtptId(int $ctptId): GrpcServiceResponse
    {
        $request = new GetMeterTransformerRelByCtptIdRequest;
        $request->setCtptId($ctptId);

        [$response, $status] = $this->client->GetMeterTransformerRelByCtptId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerRelProtoConvertor::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    /**
     * Get CTPTs assigned to multiple meters
     *
     * @param  array<int>  $meterIds
     */
    public function listAssignedToMeters(array $meterIds): GrpcServiceResponse
    {
        $request = new ListAssignedToMetersRequest;
        foreach ($meterIds as $meterId) {
            $request->getMeterIds()[] = $meterId;
        }

        [$response, $status] = $this->client->ListAssignedToMeters($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, $response, false),
                $response,
                $status->code,
                $status->details
            );
        }

        $relations = [];
        foreach ($response->getRels() as $rel) {
            $relations[] = MeterTransformerRelProtoConvertor::relProtoToArray($rel);
        }

        return GrpcServiceResponse::success(
            $relations,
            $response,
            $status->code,
            $status->details
        );
    }

    /**
     * Update a meter transformer relation
     *
     * @param  array<string, mixed>  $data
     * @param  int  $id
     */
    public function updateChangeReason(array $data, $id): GrpcServiceResponse
    {
        $request = new MeterTransformerRelUpdateChangeReasonRequest;
        $request->setVersionId($id);
        $request->setChangeReasonId($data['change_reason_id']);
        $ctptChangeDate = DateTimeConverter::convertStringToTimestamp($data['ctpt_change_date']);
        if ($ctptChangeDate) {
            $request->setCtptChangeDate($ctptChangeDate);
        }
        $user = Auth::user();
        if ($user) {
            $request->setUpdatedBy($user->id);
        }

        [$response, $status] = $this->client->UpdateMeterTransformerRelChangeReason($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerRelProtoConvertor::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateRelation(array $data, $id): GrpcServiceResponse
    {
        $request = new MeterTransformerRelUpdateRequest;
        $request->setVersionId($id);

        $request->setCtptId($data['ctpt_id']);
        $request->setMeterId($data['meter_id']);

        if (! empty($data['faulty_date'])) {
            $request->setFaultyDate($this->toProtoTimestamp($data['faulty_date']));
        }
        if (! empty($data['ctpt_energise_date'])) {
            $request->setCtptEnergiseDate($this->toProtoTimestamp($data['ctpt_energise_date']));
        }
        if (! empty($data['ctpt_change_date'])) {
            $request->setCtptChangeDate($this->toProtoTimestamp($data['ctpt_change_date']));
        }
        if (! empty($data['status_id'])) {
            if (! empty($data['status_id'])) {
                $request->setStatusId($data['status_id']);
            }
            if (! empty($data['change_reason_id'])) {
                $request->setChangeReasonId($data['change_reason_id']);
            }
        }
        if (! empty($data['change_reason_id'])) {
            $request->setChangeReasonId($data['change_reason_id']);
        }

        $request->setUpdatedBy($data['updated_by'] ?? auth()->id());

        [$response, $status] = $this->client->UpdateMeterTransformerRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerRelProtoConvertor::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function deleteRelation(int $id): GrpcServiceResponse
    {
        $request = new MeterTransformerRelIdRequest;
        $request->setVersionId($id);

        [$response, $status] = $this->client->DeleteMeterTransformerRel($request)->wait();
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

    public function updateRelationStatus(array $data): GrpcServiceResponse
    {
        $request = new MeterTransformerRelUpdateStatusRequest;
        $request->setVersionId($data['ctpt_version_id']);
        $request->setStatusId($data['status_id']);
        $request->setFaultyDate(DateTimeConverter::convertStringToTimestamp($data['faulty_date']));

        [$response, $status] = $this->client->UpdateMeterTransformerRelStatus($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerRelProtoConvertor::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }
}
