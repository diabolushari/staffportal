<?php

namespace App\Http\Controllers\SecurityDeposit;

use App\Http\Controllers\Controller;
use App\Http\Requests\SecurityDeposit\SdDemandFormRequest;
use App\Services\Billing\ChargeHeadDefinitionService;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use App\Services\SecurityDeposit\SdDemandsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class SdDemandsController extends Controller
{
    public function __construct(
        private readonly SdDemandsService $sdDemandService,
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ChargeHeadDefinitionService $chargeHeadDefinitionService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {

        $connectionId = $request->input('connection_id') ?? null;
        $calculationBasicId = $request->input('calculation_basic_id') ?? null;
        $demandTypeId = $request->input('demand_type_id') ?? null;
        $totalSdAmount = $request->input('total_sd_amount') ?? null;
        $response = $this->sdDemandService->listPaginatedSdDemands($connectionId, $calculationBasicId, $demandTypeId, $totalSdAmount);

        $paginated = null;

        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['sd_demands'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        $demandTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'SD Demand Type')->data;
        $calculationBasics = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'SD Calculation Basic')->data;

        return Inertia::render('SecurityDeposit/SdDemands/SdDemandIndex', [
            'sdDemands' => $paginated,
            'oldConnection' => $connectionId ? $this->connectionService->getConnection($connectionId)->data : null,
            'oldCalculationBasicId' => $calculationBasicId,
            'oldDemandTypeId' => $demandTypeId,
            'oldTotalSdAmount' => $totalSdAmount,
            'demandTypes' => $demandTypes,
            'calculationBasics' => $calculationBasics,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $connectionId = $request->input('connectionId');

        $connection = $this->connectionService->getConnection($connectionId)->data;

        $demandTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'SD Demand Type')->data;
        $calculationBasics = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'SD Calculation Basic')->data;
        $sdRegisterTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'SD Register Type')->data;
        $occupancyTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'SD Occupancy Type')->data;
        $chargeHeadDefinitions = $this->chargeHeadDefinitionService->listChargeHeadByCategory('Security Deposit')->data;

        return Inertia::render(
            'SecurityDeposit/SdDemands/SdDemandCreate',
            [
                'demandTypes' => $demandTypes,
                'calculationBasics' => $calculationBasics,
                'connection' => $connection,
                'sdRegisterTypes' => $sdRegisterTypes,
                'occupancyTypes' => $occupancyTypes,
                'chargeHeadDefinitions' => $chargeHeadDefinitions,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SdDemandFormRequest $request): RedirectResponse
    {
        $response = $this->sdDemandService->createDemandWithRegister($request);

        $connectionId = $request->connectionId;

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connection.sd-demands', $connectionId)
            ->with('message', 'Security deposit demand created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $sdDemand = $this->sdDemandService->getSdDemand($id);

        $demandTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'Demand Type')->data;
        $calculationBasics = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'Calculation Basic')->data;
        $statuses = $this->parameterValueService->getParameterValues(null, null, null, 'Connection', 'SD Status')->data;

        return Inertia::render('SecurityDeposit/SdDemands/SdDemandCreate', [
            'sdDemand' => $sdDemand->data,
            'demandTypes' => $demandTypes,
            'calculationBasics' => $calculationBasics,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SdDemandFormRequest $request, string $id): RedirectResponse
    {
        $sdDemand = $this->sdDemandService->update($request, $id);

        if ($sdDemand->hasValidationError() || $sdDemand->statusCode !== 0) {
            return $sdDemand->error ?? redirect()->back()->withErrors([
                'message' => $sdDemand->statusDetails ?? 'Unknown error',
            ]);
        }

        $connectionId = $request->connectionId;

        return redirect()->route('connection.sd-demands', $connectionId)
            ->with('message', 'Security deposit demand updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {

        $connectionId = $this->sdDemandService->getSdDemand($id)?->data?->connection_id;
        $response = $this->sdDemandService->deleteSdDemand($id);

        if (! $response->success) {
            return redirect()->back()->with(
                'error',
                $response->error ?? 'Failed to delete security deposit demand.'
            );
        }

        return redirect()
            ->route('connection.sd-demands', $connectionId)
            ->with('message', 'Security deposit demand deleted successfully.');
    }
}
