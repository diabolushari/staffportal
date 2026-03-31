<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Billing\BillingRuleRequest;
use App\Services\Billing\BillingRuleService;
use App\Services\Billing\ChargeHeadService;
use App\Services\Billing\ComputedPropertyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class BillingRuleController extends Controller
{
    public function __construct(
        public BillingRuleService $billingRuleService,
        public ComputedPropertyService $computedPropertyService,
        public ChargeHeadService $chargeHeadService
    ) {}

    public function index(Request $request): Response
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $search = $request->input('search') ?? null;
        $sortBy = $request->input('sort_by') ?? null;
        $sortDirection = $request->input('sort_direction') ?? null;
        $response = $this->billingRuleService->listBillingRulesPaginated($pageNumber, $pageSize, $search, $sortBy, $sortDirection);
        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['billing_rules'],                // items for this page
                $response->data['total_count'],            // total items count
                $response->data['page_size'],              // items per page
                $response->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        return Inertia::render('Billing/BillingRuleIndexPage', [
            'billingRules' => $paginated,
            'filters' => [
                'search' => $search ?? null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Billing/BillingRuleCreatePage');
    }

    public function store(BillingRuleRequest $request): RedirectResponse
    {
        $response = $this->billingRuleService->createBillingRule($request);
        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors(
                $response->error ? $response->error : 'Something went wrong'
            );
        }

        return redirect()->route('billing-rules.index');
    }

    public function show(Request $request, int $id): Response
    {

        $response = $this->billingRuleService->getBillingRule($id);
        $computedPropertiesResponse = $this->computedPropertyService->listPaginatedComputedProperties(
            1,
            4,
            null,
            null,
            $id,
        );
        $paginatedComputedProperties = null;
        if (! empty($computedPropertiesResponse->data)) {
            $paginatedComputedProperties = new LengthAwarePaginator(
                $computedPropertiesResponse->data['computed_properties'],
                $computedPropertiesResponse->data['total_count'],
                $computedPropertiesResponse->data['page_size'],
                $computedPropertiesResponse->data['page_number'],
                ['path' => request()->url()]
            );
        }
        $chargeHeadsResponse = $this->chargeHeadService->listPaginatedChargeHeads(
            1,
            4,
            null,
            null,
            $id,
            null
        );
        $paginatedChargeHeads = null;
        if (! empty($chargeHeadsResponse->data)) {
            $paginatedChargeHeads = new LengthAwarePaginator(
                $chargeHeadsResponse->data['charge_heads'],
                $chargeHeadsResponse->data['total_count'],
                $chargeHeadsResponse->data['page_size'],
                $chargeHeadsResponse->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('Billing/BillingRuleShowPage', [
            'billingRule' => $response->data,
            'paginatedComputedProperties' => $paginatedComputedProperties,
            'paginatedChargeHeads' => $paginatedChargeHeads,
        ]);
    }

    public function edit(int $id): Response
    {
        $response = $this->billingRuleService->getBillingRule($id);

        return Inertia::render('Billing/BillingRuleCreatePage', [
            'billingRule' => $response->data,
        ]);
    }

    public function update(BillingRuleRequest $request, int $id): RedirectResponse
    {
        $this->billingRuleService->updateBillingRule($request, $id);

        return redirect()->route('billing-rules.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->billingRuleService->deleteBillingRule($id);
        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors(
                $response->error ? $response->error : 'Something went wrong'
            );
        }

        return redirect()->route('billing-rules.index');
    }
}
