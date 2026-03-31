<?php

namespace App\Http\Controllers\MeterTransformer;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterTransformerRelService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateMeterTransformerAssignmentStatusController extends Controller
{
    public function __invoke(Request $request, MeterTransformerRelService $meterTransformerRelService): RedirectResponse
    {
        $request->validate([
            'status_id' => 'required',
            'faulty_date' => 'nullable|date',
            'ctpt_version_id' => 'required',
        ]);

        $response = $meterTransformerRelService->updateRelationStatus($request->all());

        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', $response->error ?? 'Something went wrong');
        }

        return redirect()->back()->with('message', 'Meter Transformer status updated Successfully');
    }
}
