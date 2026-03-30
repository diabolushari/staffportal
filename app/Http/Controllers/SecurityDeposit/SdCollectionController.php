<?php

namespace App\Http\Controllers\SecurityDeposit;

use App\Http\Controllers\Controller;
use App\Http\Requests\SecurityDeposit\SdCollectionFormRequest;
use App\Services\Billing\ChargeHeadDefinitionService;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use App\Services\SecurityDeposit\SdBalanceSummaryService;
use App\Services\SecurityDeposit\SdCollectionService;
use App\Services\SecurityDeposit\SdDemandsService;
use App\Services\SecurityDeposit\SdRegisterService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SdCollectionController extends Controller
{
    public function __construct(
        private readonly SdCollectionService $sdCollectionService,
        private readonly SdDemandsService $sdDemandsService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ConnectionService $connectionService,
        private readonly SdRegisterService $sdRegisterService,
        private readonly SdBalanceSummaryService $sdBalanceSummaryService,
        private readonly ChargeHeadDefinitionService $chargeHeadDefinitionService,
    ) {}

    /**
     * List collections for a SD Demand
     */

    /**
     * Show create form
     */
    public function create(Request $request): Response
    {
        $sdDemandId = $request->input('sdDemandId');

        $connectionId = $request->input('connectionId');

        $sdRegister = $this->sdRegisterService->getSdRegisterByConnectionId($connectionId)->data;
        $connection = $this->connectionService->getConnection($connectionId)->data;
        $balanceSummary = $this->sdBalanceSummaryService->getbalanceSummaryByConnectionId($connectionId)->data;
        $occupancyTypes = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'SD Occupancy Type'
        )->data;
        $sdTypes = $this->chargeHeadDefinitionService->listChargeHeadByCategory('Security Deposit')->data;
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        $sdDemand = $this->sdDemandsService->getSdDemand($sdDemandId)->data;

        $paymmentModes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'SD Payment Mode')
            ->data;
        $sdcollectionStatus = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'SD Collection Status')
            ->data;

        return Inertia::render('SecurityDeposit/SdCollections/SdCollectionCreate', [
            'sdDemand' => $sdDemand,
            'paymentModes' => $paymmentModes,
            'collectionStatus' => $sdcollectionStatus,
            'connection' => $connection,
            'sdRegister' => $sdRegister,
            'balanceSummary' => $balanceSummary,
            'occupancyTypes' => $occupancyTypes,
            'sdTypes' => $sdTypes,
            'page' => $page,
            'pageSize' => $pageSize,
        ]);
    }

    /**
     * Store new collection
     */
    public function store(SdCollectionFormRequest $request): RedirectResponse
    {

        $response = $this->sdCollectionService->create($request);

        $connectionId = $request->connectionId;
        $registerId = $request->sdRegisterId;

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()
            ->route('sd-register.show', $connectionId)
            ->with('message', 'Collection added successfully');
    }
}
