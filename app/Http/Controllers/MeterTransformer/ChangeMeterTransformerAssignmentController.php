<?php

namespace App\Http\Controllers\MeterTransformer;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterTransformerRelService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ChangeMeterTransformerAssignmentController extends Controller
{
    public function __invoke(Request $request, MeterTransformerRelService $meterTransformerRelService): RedirectResponse
    {
        $request->validate([
            'change_reason_id' => 'required',
            'ctpt_change_date' => 'required',
            'ctpt_version_id' => 'required',
        ]);

        $response = $meterTransformerRelService->updateChangeReason($request->all(), $request->ctpt_version_id);

        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', $response->error ?? 'Something went wrong');
        }

        return redirect()->back()->with('message', 'Meter Transformer Assignment Changed Successfully');
    }
}
