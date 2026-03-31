<?php

namespace App\Services\Consumers;

use App\Http\Requests\Consumers\GeoRegionFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Struct;
use Grpc\ChannelCredentials;
use Proto\Consumers\GeoRegionListRequest;
use Proto\Consumers\GeoRegionMessage;
use Proto\Consumers\GeoRegionServiceClient;

class GeoRegionsService
{
    private GeoRegionServiceClient $client;

    public function __construct()
    {
        $this->client = new GeoRegionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createGeoRegion(GeoRegionFormRequest $request): GrpcServiceResponse
    {
        $proto = new GeoRegionMessage;
        $proto->setRegionId($request->regionId);
        $proto->setRegionName($request->regionName);
        $proto->setRegionClassification($request->regionClassificationId);
        $proto->setRegionTypeId($request->regionTypeId);
        $proto->setParentRegionId($request->parentRegionId ?? 0);
        $proto->setRegionAttributes(new Struct);

        [$response, $status] = $this->client->CreateGeoRegion($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::geoRegionProtoToArray($response->getRegion()), $response, $status->code, $status->details);
    }

    public function getGeoRegions(?string $regionClassification = null, ?string $regionType = null): GrpcServiceResponse
    {
        $request = new GeoRegionListRequest;
        if ($regionClassification !== null) {
            $request->setRegionClassification($regionClassification);
        }
        if ($regionType !== null) {
            $request->setRegionType($regionType);
        }
        [$response, $status] = $this->client->ListGeoRegions($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $geoRegionsArray = [];
        foreach ($response->getRegions() as $region) {
            $geoRegionsArray[] = self::geoRegionProtoToArray($region);
        }

        return GrpcServiceResponse::success($geoRegionsArray, $response, $status->code, $status->details);
    }

    /**
     * @return array<string, mixed>
     */
    private static function geoRegionProtoToArray(GeoRegionMessage $region): array
    {
        return [
            'region_id' => $region->getRegionId(),
            'region_name' => $region->getRegionName(),
            'region_classification' => $region->getRegionClassification(),
            'region_type_id' => $region->getRegionTypeId(),
            'parent_region_id' => $region->getParentRegionId(),
            'region_attributes' => $region->getRegionAttributes()?->getFields() ?? [],
        ];
    }
}
