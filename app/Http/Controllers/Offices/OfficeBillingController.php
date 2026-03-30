<?php

namespace App\Http\Controllers\Offices;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Consumers\OfficeService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class OfficeBillingController extends Controller
{
    public function __construct(
        private readonly OfficeService $officeService,
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    public function __invoke(int $officeCode, Request $request): Response
    {
        $primaryPurpose = $request->input('primary_purpose') ?? null;
        $consumerType = $request->input('consumer_type') ?? null;
        $consumerNumber = $request->input('consumer_number') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $office = $this->officeService->getOffice(null, $officeCode);
        $primaryPurposes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Primary Purpose'
        );
        $consumerTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Type'
        );

        $connections = $this->connectionService->listPaginatedConnections(
            $pageNumber,
            $pageSize,
            $consumerNumber,
            $officeCode,
            $primaryPurpose,
            $consumerType,

        );
        $paginated = null;
        if (! empty($connections->data)) {
            $paginated = new LengthAwarePaginator(
                $connections->data['connections'],
                $connections->data['total_count'],
                $connections->data['page_size'],
                $connections->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('Offices/OfficeBillingIndex', [
            'office' => $office->data,
            'primary_purposes' => $primaryPurposes->data,
            'consumer_types' => $consumerTypes->data,
            'connections' => $paginated,
            'filters' => [
                'primary_purpose' => $primaryPurpose,
                'consumer_type' => $consumerType,
                'consumer_number' => $consumerNumber,
            ],
        ]);
    }
}
