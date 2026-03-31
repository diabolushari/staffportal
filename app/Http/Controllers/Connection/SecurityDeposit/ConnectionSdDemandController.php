<?php

namespace App\Http\Controllers\Connection\SecurityDeposit;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\SecurityDeposit\SdBalanceSummaryService;
use App\Services\SecurityDeposit\SdDemandsService;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class ConnectionSdDemandController extends Controller
{
    public function __construct(
        private readonly SdDemandsService $sdDemandService,
        private readonly ConnectionService $connectionService,
        private readonly SdBalanceSummaryService $sdBalanceSummaryService
    ) {}

    public function __invoke(int $connectionId)
    {
        $connection = $this->connectionService->getConnection($connectionId)->data;
        $balanceSummary = $this->sdBalanceSummaryService->getbalanceSummaryByConnectionId($connectionId)->data;
        $sdDemands = $this->sdDemandService->listPaginatedSdDemands($connectionId, null, null, null);

        $paginated = null;

        if (! empty($sdDemands->data)) {
            $paginated = new LengthAwarePaginator(
                $sdDemands->data['sd_demands'],
                $sdDemands->data['total_count'],
                $sdDemands->data['page_size'],
                $sdDemands->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('Connections/SecurityDeposit/ConnectionSdDemand', [
            'connection' => $connection,
            'sdDemands' => $paginated,
            'balanceSummary' => $balanceSummary,
        ]);
    }
}
