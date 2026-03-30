<?php

namespace App\Http\Controllers\BillingCycle;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillService;
use App\Services\BillingGroup\BillGenerationJobService;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class BillJobStatusController extends Controller
{
    public function __construct(

        private readonly BillGenerationJobService $billingGenerateJobService,
        private readonly BillService $billService,
        private readonly BillingGroupService $billingGroupService,
    ) {}

    public function index(Request $request): Response
    {
        $pageNumber = $request->input('page', 1);
        $pageSize = $request->input('page_size', 5);
        $search = $request->input('search', null);
        $sortBy = $request->input('sort_by', null);
        $sortDirection = $request->input('sort_direction', null);
        $billGenerationJobStatus = $this->billingGenerateJobService->listPaginatedBillGenerationJob($pageNumber, $pageSize, $search, $sortBy, $sortDirection);
        $paginatedData = [];
        if ($billGenerationJobStatus->data) {
            $paginatedData = new LengthAwarePaginator(
                $billGenerationJobStatus->data['bill_generation_job_status'],
                $billGenerationJobStatus->data['total'],
                $billGenerationJobStatus->data['page_size'],
                $billGenerationJobStatus->data['page'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('BillingCycle/BillJobStatusIndexPage', [
            'bill_generation_job_status' => $paginatedData,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function show(int $id, Request $request): Response
    {
        $response = $this->billingGenerateJobService->getBillGenerationJob($id);

        return Inertia::render('BillingCycle/BillJobStatusShowPage', [
            'data' => $response->data ?? [],
        ]);
    }
}
