<?php

namespace App\Http\Controllers\SecurityDeposit\Consumer;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class ConsumerSDController extends Controller
{
    public function __construct(
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    public function __invoke(Request $request): Response|RedirectResponse
    {

        $connectionId = $request->input('connection_id');

        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;

        $response = $this->connectionService->listConnectionWithActiveBalanceSummary(
            connectionId: $connectionId,
            group: null,
            isSettled: null,
            dateFrom: null,
            dateTo: null,
            pageNumber: $pageNumber,
            pageSize: $pageSize,
        );
        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }
        $paginated = null;

        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['connectionArray'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }
        $triggerTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'SD Trigger Type')
            ->data;

        return Inertia::render('SecurityDeposit/Consumer/ConsumerSDIndex', [
            'connections' => $paginated,
            'triggerTypes' => $triggerTypes,
        ]);
    }
}
