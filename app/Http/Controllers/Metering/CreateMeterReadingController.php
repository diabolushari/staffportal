<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterReadingService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreateMeterReadingController extends Controller
{
    public function __construct(
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterService,
        private readonly MeterReadingService $meterReadingService,
        private readonly MeterConnectionMappingService $meterConnectionMappingService,
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

        $interimReasons = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter Reading',
            'Interim Reasons',
        );

        $ctHealthTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'CTPT',
            'CT-Health Type',
        );

        $anomalyTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter',
            'Anomalies',
        );

        $connection = $this->connectionService->getConnection($connectionId);
        $timeZoneNames = [];

        $latestMeterReading = $this->meterReadingService->latestMeterReading($connectionId);
        $latestMeterReadingGroupByMeter = $this->meterReadingService->latestMeterReadingGroupByMeter($connectionId);
        $allMeterMappings = $this->meterConnectionMappingService->listMeterConnectionMappings($connectionId);

        return Inertia::render('MeterReading/MeterReadingCreatePage', [
            'connectionWithConsumer' => [
                'connection' => $connection->data,
                'consumer' => $connection->data['consumer_profiles'][0] ?? null,
            ],
            'meterHealthTypes' => $meterHealthTypes->data,
            'anomalyTypes' => $anomalyTypes->data,
            'timeZoneNames' => $timeZoneNames,
            'metersWithTimezonesAndProfiles' => [],
            'latestMeterReading' => $latestMeterReading->data,
            'ctHealthTypes' => $ctHealthTypes->data,
            'editMode' => false,
            'interimReasons' => $interimReasons->data,
            'latestMeterReadingGroupByMeter' => $latestMeterReadingGroupByMeter->data,
            'meterConnectionMappings' => $allMeterMappings->data,
        ]);
    }
}
