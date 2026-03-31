<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;
use Inertia\Response;

class MeterTransfomerCreateController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ConnectionService $connectionService
    ) {}

    public function __invoke(int $connectionId, int $meterId): Response
    {
        $meter = $this->meterService->getMeter($meterId);
        $connection = $this->connectionService->getConnection($connectionId);

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Status')->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Change Reason')->data,
        ];

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'meter' => $meter->data,
            'connection' => $connection->data,
            'transformerTypes' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Type')->data,
            ...$parameterRequests,
        ]);
    }
}
