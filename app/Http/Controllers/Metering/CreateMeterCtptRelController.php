<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CreateMeterCtptRelController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly MeterTransformerService $meterTransformerService,
        private readonly ParameterValueService $parameterValueService,
    ) {}

    public function __invoke(Request $request, int $meterId): InertiaResponse|RedirectResponse
    {
        $ctpts = $this->meterTransformerService->listTransformersWithNoRelation();
        $meters = $this->meterService->listMeters();

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(
                1,
                100,
                null,
                'CTPT',
                'Status'
            )->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(
                1,
                100,
                null,
                'CTPT',
                'Change Reason'
            )->data,
        ];

        $meter = $this->meterService->getMeterById($meterId);

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'ctpts' => $ctpts->data,
            'meters' => $meters->data,
            'selectedMeter' => [
                'meter_id' => $meter->data['id'],
                'meter_serial' => $meter->data['serial_number'] ?? null,
            ],
            ...$parameterRequests,
        ]);
    }
}
