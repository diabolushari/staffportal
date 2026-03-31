<?php

namespace App\Http\Controllers\MeterReading;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Metering\MeterReadingService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTimezoneTypeRelService;
use App\Services\MeteringTimezone\MeteringTimezoneService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetMeterReadingEditController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private ParameterValueService $parameterService,
        private ConsumerService $consumerService,
        private MeterConnectionMappingService $meterConnectionMappingService,
        private MeterTimezoneTypeRelService $meterTimezoneTypeRelService,
        private MeteringTimezoneService $meteringTimezoneService,
        private MeteringParameterProfileService $meteringParameterProfileService,
        private MeterService $meterService,
        private MeterReadingService $meterReadingService
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $meterHealthTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter',
            'Meter Health',
        );
        $ctptHealthTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter',
            'Meter CTPT Health',
        );
        $ctHealthTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'CTPT',
            'CT-Health Type',
        );
        $ptHealthTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'CTPT',
            'PT-Health Type',
        );

        $anomalyTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter',
            'Anomalies',
        );
        $connection = $this->connectionService->getConnection($connectionId);
        $consumer = $this->consumerService->getConsumer($connectionId);
        $meterConnectionRel = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($connectionId);
        $metersWithTimezonesAndProfiles = [];
        $meterTimezoneTypeRel = [];
        $timeZoneNames = [];
        $latestMeterReading = $this->meterReadingService->latestMeterReading($connectionId);
        if ($meterConnectionRel->data) {
            $meterWithTimezoneAndProfile = [];

            foreach ($meterConnectionRel->data as $meterConnectionRel) {

                $meterWithTimezoneAndProfile['meter_id'] = $meterConnectionRel['meter_id'];
                $meter = $this->meterService->getMeter($meterConnectionRel['meter_id']);
                $data = $this->meterTimezoneTypeRelService->getActiveMeterTimezoneTypeRelByMeterId($meterConnectionRel['meter_id'])->data ?? [];
                $meterWithTimezoneAndProfile['meter_timezone_type'] = $data['timezone_type']['parameter_value'];
                $meterTimezoneTypeRel[] = $data;
                if ($data) {
                    $timeZonesResponse = $this->meteringTimezoneService->listMeteringTimezones(null, $data['timezone_type']['id'])->data;
                    $timezones = [];
                    if ($timeZonesResponse) {
                        foreach ($timeZonesResponse as $timeZone) {
                            $timeZoneItem['timezone_name'] = $timeZone['timezone_name']['parameter_value'];
                            $timeZoneItem['timezone_id'] = $timeZone['timezone_name']['id'];
                            $timezones[] = $timeZoneItem;
                        }
                    }
                    $meterWithTimezoneAndProfile['timezones'] = $timezones;
                }

                $meterProfilesResponse = $this->meteringParameterProfileService->listMeteringProfileParameters(1, 10, null, $meter->data['profile_id'] ?? null)->data;
                $meterProfiles = [];
                if ($meterProfilesResponse) {
                    foreach ($meterProfilesResponse as $meterProfile) {
                        $meterProfiles[] = $meterProfile;
                    }
                }
                $meterWithTimezoneAndProfile['reading_parameters'] = $meterProfiles;

                $metersWithTimezonesAndProfiles[] = $meterWithTimezoneAndProfile;
            }
        }

        return Inertia::render('MeterReading/MeterReadingCreatePage', [
            'connectionWithConsumer' => [
                'connection' => $connection->data,
                'consumer' => $consumer->data['consumer'] ?? null,
            ],
            'meterHealthTypes' => $meterHealthTypes->data,
            'ctptHealthTypes' => $ctptHealthTypes->data,
            'anomalyTypes' => $anomalyTypes->data,
            'timeZoneNames' => $timeZoneNames,
            'metersWithTimezonesAndProfiles' => $metersWithTimezonesAndProfiles,
            'latestMeterReading' => $latestMeterReading->data,
            'ctHealthTypes' => $ctHealthTypes->data,
            'ptHealthTypes' => $ptHealthTypes->data,
            'editMode' => true,
        ]);
    }
}
