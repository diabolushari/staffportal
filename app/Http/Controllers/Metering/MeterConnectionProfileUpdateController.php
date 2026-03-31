<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterConnectionMappingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MeterConnectionProfileUpdateController extends Controller
{

    public function __construct(
        protected MeterConnectionMappingService $meterConnectionMappingService,

    ) {}
    public function __invoke(Request $request, int $id): RedirectResponse
    {

        $response = $this->meterConnectionMappingService->updateMeterConnectionProfile($id, $request->meter_profile_id);
        if ($response->hasValidationError() || $response->statusCode != 0) {
            return $response->error ?? redirect()->back()->withErrors(['message' => 'Failed to update meter profile']);
        }



        return redirect()->back()->with('message', 'Meter profile updated successfully');
    }
}
