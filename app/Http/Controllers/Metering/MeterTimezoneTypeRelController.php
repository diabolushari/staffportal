<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterTimezoneTypeRelService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MeterTimezoneTypeRelController extends Controller
{
    protected MeterTimezoneTypeRelService $meterTimezoneTypeRelService;

    public function __construct(MeterTimezoneTypeRelService $meterTimezoneTypeRelService)
    {
        $this->meterTimezoneTypeRelService = $meterTimezoneTypeRelService;
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->all();
        $data['created_by'] = auth()->id();

        $response = $this->meterTimezoneTypeRelService->createMeterTimezoneTypeRel($data);

        if ($response->hasValidationError()) {
            return back()->withErrors(['grpc_error' => $response->error->message ?? 'Something went wrong']);
        }

        return redirect()->back()->with('success', 'Timezone type relation created successfully.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->all();
        $data['rel_id'] = $id;
        $data['updated_by'] = auth()->id();

        $response = $this->meterTimezoneTypeRelService->updateMeterTimezoneTypeRel($data);

        if ($response->hasValidationError()) {
            return back()->withErrors(['grpc_error' => $response->error->message ?? 'Something went wrong']);
        }

        return redirect()->back()->with('success', 'Timezone type relation updated successfully.');
    }
}
