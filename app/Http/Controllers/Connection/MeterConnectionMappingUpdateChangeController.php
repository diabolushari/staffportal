<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\ConnectionMeterChangeReasonFormRequest;
use App\Services\Metering\MeterConnectionMappingService;
use Illuminate\Http\RedirectResponse;

class MeterConnectionMappingUpdateChangeController extends Controller
{
    public function __construct(private readonly MeterConnectionMappingService $meterConnectionMappingService) {}

    public function __invoke(ConnectionMeterChangeReasonFormRequest $request): RedirectResponse
    {
        $response = $this->meterConnectionMappingService->updateMeterConnectionChangeReason($request);
        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', $response->error ?? 'Something went wrong');
        }

        return redirect()->back()->with('message', 'Meter change updated successfully');
    }
}
