<?php

namespace App\Http\Controllers\BillingGroup;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillService;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingGroupBillController extends Controller
{
    public function __construct(
        private readonly BillService $billService,
        private readonly BillingGroupService $billingGroupService
    ) {}

    public function __invoke(Request $request, int $billingGroupId): Response
    {
        $billingGroup = $this->billingGroupService->getBillingGroup($billingGroupId);
        $response = $this->billService->listBills();
        return Inertia::render('BillingGroup/BillingGroupBillPage', [
            'bills' => $response->data ?? [],
            'billing_group' => $billingGroup->data ?? [],
        ]);
    }
}
