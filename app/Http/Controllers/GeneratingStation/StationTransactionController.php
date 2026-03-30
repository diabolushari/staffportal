<?php

namespace App\Http\Controllers\GeneratingStation;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\GeneratingStation\GeneratingStationService;
use App\Services\Parameters\ParameterValueService;

class StationTransactionController extends Controller
{
     public function __construct(
        private GeneratingStationService $service,
        private readonly ParameterValueService $parameterValueService,
    ) {}

    public function index(Request $request, $stationId)
    {
        $filters = [
            'transaction_type_id' => $request->input('transaction_type_id'),
            'consumer_number' => $request->input('consumer_number'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
        ];
        $transactionTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Station Unit TXN Type')
            ->data;
        $transactions =
            $this->service->listStationTransactions($stationId, $filters);
             $station = $this->service->getGeneratingStation($stationId);

       return Inertia::render(
        'GeneratingStation/StationTransactionPage',
            [
                'transactions' => $transactions->data,
                'station' => $station->data,
                 'stationId' => $stationId,
                'filters' => $filters,
                'transactionTypes' => $transactionTypes,

            ]
);
    }
}
