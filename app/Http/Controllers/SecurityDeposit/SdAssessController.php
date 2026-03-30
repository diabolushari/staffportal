<?php

namespace App\Http\Controllers\SecurityDeposit;

use App\Http\Controllers\Controller;
use App\Http\Requests\SecurityDeposit\SdRecalculationFormRequest;
use App\Services\SecurityDeposit\SdRecalculationService;
use Illuminate\Http\RedirectResponse;

class SdAssessController extends Controller
{
    public function __construct(
        private readonly SdRecalculationService $sdRecalculationService
    ) {}

    public function __invoke(SdRecalculationFormRequest $request): RedirectResponse
    {
        $response = $this->sdRecalculationService->recalculateSd($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with(['error' => 'Failed to recalculate SD']);
        }

        if ($request->billingGroupId) {
            return redirect()->route('consumer-sd.group.show', $request->billingGroupId);
        }

        if ($request->redirect == 'individual') {
            return redirect()->route('consumer-sd');
        }

        return redirect()->route('consumer-sd.group');
    }
}
