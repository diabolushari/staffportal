<?php

namespace App\Services\Metering;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\MeterProfileParameter\MeterProfileParameterFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Log;
use Proto\MeteringProfile\DeleteMeteringProfileParameterRequest;
use Proto\MeteringProfile\GetMeteringProfileParameterRequest;

H:
i:

use Proto\MeteringProfile\ListMeteringProfileParametersPaginatedRequest;
use Proto\MeteringProfile\ListMeteringProfileParametersRequest;
use Proto\MeteringProfile\MeteringProfileParameterFormRequest;
use Proto\MeteringProfile\MeteringProfileParameterMessage;
use Proto\MeteringProfile\MeteringProfileParameterServiceClient;
use Proto\MeteringProfile\PaginatedListMeteringProfileParametersGroupByProfileRequest;
use Proto\MeteringProfile\PaginatedListMeteringProfileParametersGroupByProfileResponse;
use Proto\MeteringProfile\ProfilesByGroupMessage;

class MeteringParameterProfileService
{
    private MeteringProfileParameterServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService
    ) {
        $this->client = new MeteringProfileParameterServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listMeteringProfileParameterGroupByMeterProfile(
        int $pageNumber = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?string $sortBy = null,
        ?string $sortDirection = null,
    ): GrpcServiceResponse {
        $request = new PaginatedListMeteringProfileParametersGroupByProfileRequest();
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);

        if ($search !== null) {
            $request->setSearch($search);
        }

        if ($sortBy !== null) {
            $request->setSortBy($sortBy);
        }

        if ($sortDirection !== null) {
            $request->setSortDirection($sortDirection);
        }

        [$response, $status] =
            $this->client
            ->PaginatedListMeteringProfileParametersGroupByProfile($request)
            ->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $groupedProfiles = [];
        foreach ($response->getProfiles() as $profileGroup) {
            $groupedProfiles[] =
                $this->meterProfileParameterGroupByProfileToArray($profileGroup);
        }

        $data = [
            'metering_parameter_profiles' => $groupedProfiles,
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


    public function listPaginatedMeteringProfileParameters(
        int $pageNumber = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?string $sortBy = null,
        ?string $sortDirection = null,

    ): GrpcServiceResponse {
        $request = new ListMeteringProfileParametersPaginatedRequest();
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);

        if ($sortBy !== null) {
            $request->setSortBy($sortBy);
        }

        if ($search !== null) {
            $request->setSearch($search);
        }


        [$response, $status] = $this->client->ListMeteringProfileParametersPaginated($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $meteringParameterProfilesArray = [];
        foreach ($response->getProfiles() as $detail) {
            $meteringParameterProfilesArray[] = self::toArray($detail);
        }
        $meteringParameterProfilesData = [
            'metering_parameter_profiles' => $meteringParameterProfilesArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($meteringParameterProfilesData, $response, $status->code, $status->details);
    }

    public function listMeteringProfileParameters(int $page = 1, int $pageSize = 10, ?string $search = null, ?int $profileId = null): GrpcServiceResponse
    {
        $protoRequest = new ListMeteringProfileParametersRequest;
        if ($page) {
            $protoRequest->setPage($page);
        }
        if ($pageSize) {
            $protoRequest->setPageSize($pageSize);
        }
        if ($search) {
            $protoRequest->setSearch($search);
        }
        if ($profileId) {
            $protoRequest->setProfileId($profileId);
        }
        [$response, $status] = $this->client->ListMeteringProfileParameters($protoRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meteringParameterProfilesArray = [];
        foreach ($response->getProfiles() as $detail) {
            $detail = $this->toArray($detail);
            $meteringParameterProfilesArray[] = $detail;
        }

        return GrpcServiceResponse::success($meteringParameterProfilesArray, $response, $status->code, $status->details);
    }

    public function createMeterProfileParameter(MeterProfileParameterFormRequest $meterProfileParameterFormRequest): GrpcServiceResponse
    {
        $request = new MeteringProfileParameterFormRequest();


        $request->setProfileId($meterProfileParameterFormRequest->profileId);
        $request->setName($meterProfileParameterFormRequest->name);
        $request->setDisplayName($meterProfileParameterFormRequest->displayName);
        $request->setIsExport($meterProfileParameterFormRequest->isExport);
        $request->setIsCumulative($meterProfileParameterFormRequest->isCumulative);


        [$response, $status] = $this->client->CreateMeteringProfileParameter($request)->wait();

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

    public function getMeterProfileParameter(int $id): GrpcServiceResponse
    {
        $request = new GetMeteringProfileParameterRequest();
        $request->setId($id);

        [$response, $status] = $this->client->GetMeteringProfileParameter($request)->wait();


        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::toArray($response->getProfile()), $response, $status->code, $status->details);
    }

    public function updateMeterProfileParameter(MeterProfileParameterFormRequest $meterProfileParameterFormRequest, int $id): GrpcServiceResponse
    {
        $request = new MeteringProfileParameterFormRequest();


        $request->setProfileId($meterProfileParameterFormRequest->profileId);
        $request->setName($meterProfileParameterFormRequest->name);
        $request->setDisplayName($meterProfileParameterFormRequest->displayName);
        $request->setIsExport($meterProfileParameterFormRequest->isExport);
        $request->setIsCumulative($meterProfileParameterFormRequest->isCumulative);
        $request->setMeterParameterId($id);



        [$response, $status] = $this->client->UpdateMeteringProfileParameter($request)->wait();


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

    public function deleteMeterProfileParameter(int $id): GrpcServiceResponse
    {
        $request = new DeleteMeteringProfileParameterRequest();
        $request->setId($id);

        [$response, $status] = $this->client->DeleteMeteringProfileParameter($request)->wait();

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



    /**
     * @return array<string, mixed>
     */
    public static function toArray(?MeteringProfileParameterMessage $detail): ?array
    {
        if ($detail === null) {
            return null;
        }

        return [
            'id' => $detail->getProfileId(),
            'meter_parameter_id' => $detail->getMeterParameterId(),
            'name' => $detail->getName(),
            'display_name' => $detail->getDisplayName(),
            'is_export' => $detail->getIsExport(),
            'profile_id' => $detail->getProfileId(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'is_cumulative' => $detail->getIsCumulative(),
            'profile' => ParameterValueProtoConvertor::convertToArray($detail->getProfile()),
        ];
    }


    /**
     * @return array<string, mixed>
     */
    public function meterProfileParameterGroupByProfileToArray(
        ProfilesByGroupMessage $group
    ): array {
        $profile = $group->getParameterValue();

        $parameters = [];
        foreach ($group->getProfiles() as $parameter) {
            $parameters[] = [
                'version_id' => $parameter->getVersionId(),
                'profile_id' => $parameter->getProfileId(),
                'name' => $parameter->getName(),
                'display_name' => $parameter->getDisplayName(),
                'is_export' => $parameter->getIsExport(),
                'is_cumulative' => $parameter->getIsCumulative(),
                'is_active' => $parameter->getIsActive(),
                'meter_parameter_id' => $parameter->getMeterParameterId(),
                'created_by' => $parameter->getCreatedBy(),
                'updated_by' => $parameter->getUpdatedBy(),
                'effective_start_date' => $parameter->getEffectiveStartDate()
                    ? $parameter->getEffectiveStartDate()->toDateTime()->format('Y-m-d H:i:s')
                    : null,
                'effective_end_date' => $parameter->getEffectiveEndDate()
                    ? $parameter->getEffectiveEndDate()->toDateTime()->format('Y-m-d H:i:s')
                    : null,
            ];
        }

        return [
            'profile' => $this->parameterValueService->toArray($profile),
            'parameters' => $parameters,
        ];
    }
}
