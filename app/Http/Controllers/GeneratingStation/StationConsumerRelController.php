<?php

namespace App\Http\Controllers\GeneratingStation;

use App\Http\Controllers\Controller;
use App\Http\Requests\GeneratingStation\StationConsumerRelFormRequest;
use App\Services\Connection\ConnectionService;
use App\Services\GeneratingStation\StationConsumerRelService;
use App\Services\GeneratingStation\GeneratingStationService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StationConsumerRelController extends Controller
{
    public function __construct(
        private readonly StationConsumerRelService $stationConsumerRelService,
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService,
        private readonly GeneratingStationService $generatingStationService,
    ) {}

    /**
     * List station consumers
     */
    public function index(Request $request): Response
    {
        $stationId = $request->input('station_id');
        $connectionId = $request->input('connection_id');

        $response = $this->stationConsumerRelService->listConsumerStations($connectionId);

        $consumerTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station Consumer Type', 'Consumer Type')
            ->data;

        return Inertia::render('GeneratingStation/StationConsumerRelIndex', [
            'relations' => $response->data ?? [],
            'stationId' => $stationId,
            'consumerTypes' => $consumerTypes,
        ]);
    }

    /**
     * Show create form
     */
    public function create(Request $request): Response
    {
        $stationId = $request->input('stationId');
        $stationConnectionId = $request->input('stationConnectionId');
        $openSheet = $request->input('openSheet', false);
        $stationConnection = $this->connectionService->getConnection($stationConnectionId)->data;

        $consumerTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station Consumer Type', 'Consumer Type')
            ->data;

        $stations = $this->generatingStationService
            ->listGeneratingStations()
            ->data;

        return Inertia::render(
            'GeneratingStation/StationConsumerRelCreate',
            [
                'stationId' => $stationId,
                'connection' => $stationConnection,
                'consumerTypes' => $consumerTypes,
                'stations' => $stations,
                'openSheet' => $openSheet ? true : false,
            ]
        );
    }

    /**
     * Store new station consumer relation
     */
    public function store(StationConsumerRelFormRequest $request): RedirectResponse
    {
        $response = $this->stationConsumerRelService->create($request);

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()
            ->route('connection.station-consumer-rels', $request->consumerConnectionId)
            ->with('message', 'Station consumer relation created successfully');
    }

    /**
     * Update priority order
     */
    public function update(Request $request, int $relId): RedirectResponse
    {
        $response = $this->stationConsumerRelService->updatePriority(
            $relId,
            $request->station_connection_id,
            $request->consumer_priority_order ?? null,
            $request->station_priority_order ?? null,
            $request->effective_start ?? null,
            $request->effective_end ?? null
        );

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->back()
            ->with('message', 'Priority updated successfully');
    }



    /**
     * Deactivate relation
     */
   public function destroy(Request $request, int $relId): RedirectResponse
    {
        $response = $this->stationConsumerRelService->deactivate(
            $relId,
            $request->effective_end
        );

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Failed to deactivate',
            ]);
        }

        return redirect()->back()
            ->with('message', 'Station consumer relation deactivated successfully.');
    }
}
