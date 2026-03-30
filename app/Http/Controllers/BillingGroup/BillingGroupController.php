<?php

namespace App\Http\Controllers\BillingGroup;

use App\Http\Controllers\Controller;
use App\Http\Requests\BillingGroup\BillingGroupFormRequest;
use App\Services\BillingGroup\BillGenerationJobService;
use App\Services\BillingGroup\BillingGenerateJobService;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class BillingGroupController extends Controller
{
    public function __construct(
        private readonly BillingGroupService $billingGroupService,
        private readonly BillGenerationJobService $billingGenerateJobService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $sortBy = $request->input('sort_by') ?? null;
        $sortDirection = $request->input('sort_direction') ?? null;
        $response = $this->billingGroupService->listPaginatedBillingGroups($pageNumber, $pageSize, $search, $sortBy, $sortDirection);

        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['groups'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('BillingGroup/BillingGroupIndexPage', [
            'billingGroups' => $paginated ?? [],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('BillingGroup/BillingGroupCreatePage');
    }

    public function edit(int $id): Response
    {
        $response = $this->billingGroupService->getBillingGroup(null, $id);

        return Inertia::render('BillingGroup/BillingGroupCreatePage', [
            'billingGroup' => $response->data ?? null,
        ]);
    }

    public function update(int $id, BillingGroupFormRequest $request): RedirectResponse
    {
        $response = $this->billingGroupService->updateBillingGroup($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to update billing group');
        }

        return redirect()->route('billing-groups.index')->with('message', 'Billing group updated successfully');
    }

    public function store(BillingGroupFormRequest $request): RedirectResponse
    {
        $response = $this->billingGroupService->createBillingGroup($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to create billing group');
        }

        return redirect()->route('billing-groups.index')->with('message', 'Billing group created successfully');
    }

    public function show(int $id, Request $request): Response
    {
        $search = $request->get('search');
        $response = $this->billingGroupService->getBillingGroup(null, $id);

        $billingGenerateJobServiceResponse = $this->billingGenerateJobService->listBillGenerationJobStatus($id, null);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with(['error' => 'Failed to get billing group']);
        }

        return Inertia::render('BillingGroup/BillingGroupShowPage', [
            'billingGroup' => $response->data ?? null,
            'billingGenerateJobStatus' => $billingGenerateJobServiceResponse->data ?? null,
        ]);
    }

    public function destroy(int $versionId): RedirectResponse
    {
        $deletedBy = auth()->id();
        $response = $this->billingGroupService->deleteBillingGroup($versionId, $deletedBy);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to delete billing group');
        }

        return redirect()->route('billing-groups.index');
    }
}
