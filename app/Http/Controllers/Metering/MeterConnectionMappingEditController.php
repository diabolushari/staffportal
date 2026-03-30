<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;
use Inertia\Response;

class MeterConnectionMappingEditController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly MeterConnectionMappingService $meterConnectionMappingService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ConnectionService $connectionService
    ) {}

    public function __invoke(int $relId): Response
    {
        $relation = $this->meterConnectionMappingService->getMeterConnectionMapping($relId);
        $connection = null;
        if ($relation->data != null) {
            $connection = $this->connectionService->getConnection($relation->data['connection_id']);
        }
        $meters = $this->meterService->listMeters();
        $useCategory = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Use Category');
        $meterStatus = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Status');
        $changeReason = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Change Reason');
        $meterProfiles = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Meter Profile');
        $timezoneTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Timezone Type');

        return Inertia::render('Connections/ConnectMeterForm', [
            'relation' => $relation->data,
            'meters' => $meters->data,
            'useCategory' => $useCategory->data,
            'meterStatus' => $meterStatus->data,
            'changeReason' => $changeReason->data,
            'meterProfiles' => $meterProfiles->data,
            'timezoneTypes' => $timezoneTypes->data,
            'connection_id' => $connection->data['connection_id'] ?? null,
            'connection' => $connection->data ?? null,
        ]);
    }
}
