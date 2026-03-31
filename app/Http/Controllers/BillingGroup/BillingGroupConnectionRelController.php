<?php

namespace App\Http\Controllers\BillingGroup;

use App\Http\Requests\BillingGroup\BillingGroupConnectionRelFormRequest;
use App\Services\BillingGroup\BillingGroupConnectionRelService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BillingGroupConnectionRelController
{
    public function __construct(private BillingGroupConnectionRelService $billingGroupConnectionRelService) {}

    public function index(): Response
    {
        return Inertia::render('BillingGroupConnectionRel/BillingGroupConnectionRelIndexPage');
    }

    public function create(): Response
    {
        return Inertia::render('BillingGroupConnectionRel/BillingGroupConnectionRelCreatePage');
    }

    public function store(BillingGroupConnectionRelFormRequest $request): RedirectResponse
    {
        $response = $this->billingGroupConnectionRelService->createBillingGroupConnectionRel($request);

        if ($response->statusCode !== 0) {
            return redirect()->back()->with('error', $response->statusDetails);
        }

        return redirect()->back()->with('message', 'Connection added to Billing Group');
    }

    public function destroy(int $versionId): RedirectResponse
    {
        $this->billingGroupConnectionRelService->deleteBillingGroupConnectionRel($versionId);

        return back()->with('message', 'Connection removed from Billing Group');
    }
}
