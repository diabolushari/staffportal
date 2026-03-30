<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GetConnectionMeterController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private ParameterValueService $parameterValueService,
    ) {}

    public function __invoke(int $id): Response|RedirectResponse
    {
        $connectionResponse = $this->connectionService->getConnection($id);

        if ($connectionResponse->hasValidationError()) {
            return back()->withErrors(['grpc_error' => $connectionResponse->error]);
        }

        $status = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Status');
        $changeReason = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Change Reason');
        $meter_profiles = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Meter Profile');
        $ctptStatus = $this->parameterValueService->getParameterValues(null, null, null, 'CTPT', 'Status');
        $ctptChangeReason = $this->parameterValueService->getParameterValues(null, null, null, 'CTPT', 'Change Reason');

        return Inertia::render('Connections/ConnectionMeterList', [
            'connection_id' => $id,
            'connection' => $connectionResponse->data,
            'status' => $status->data,
            'change_reason' => $changeReason->data,
            'ctpt_status' => $ctptStatus->data,
            'ctpt_change_reason' => $ctptChangeReason->data,
            'meter_profiles' => $meter_profiles->data,
        ]);
    }
}
