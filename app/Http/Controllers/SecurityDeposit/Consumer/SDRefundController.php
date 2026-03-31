<?php

namespace App\Http\Controllers\SecurityDeposit\Consumer;

use App\Http\Controllers\Controller;
use App\Services\Billing\ChargeHeadDefinitionService;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use App\Services\SecurityDeposit\SdBalanceSummaryService;
use App\Services\SecurityDeposit\SdDemandsService;
use App\Services\SecurityDeposit\SdRegisterService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SDRefundController extends Controller
{
    public function __construct(
        private readonly SdRegisterService $sdRegisterService,
        private readonly ConnectionService $connectionService,
        private readonly SdBalanceSummaryService $sdBalanceSummaryService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ChargeHeadDefinitionService $chargeHeadDefinitionService,
        private readonly SdDemandsService $sdDemandsService,
    ) {}

    public function create(Request $request)
    {
        $connectionId = $request->input('connectionId');
        $sdDemandId = $request->input('sdDemandId');

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

        $paymentModes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'SD Payment Mode')
            ->data;
        $sdcollectionStatus = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'SD Collection Status')
            ->data;

        return Inertia::render('SecurityDeposit/SdRefunds/SdRefundCreate', [
            'sdDemand' => $sdDemand,
            'paymentModes' => $paymentModes,
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
}
