<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Services\BillGenerationJob\BillGeneraionJobStatusService;
use App\Services\Billing\BillExportService;
use App\Services\Billing\BillService;
use App\Services\BillingGroup\BillingGroupService;
use App\Services\Connection\ConnectionService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function __construct(
        private readonly BillService $billService,
        private readonly BillExportService $billExportService,
        private readonly BillGeneraionJobStatusService $billGeneraionJobStatusService,
        private readonly BillingGroupService $billingGroupService,
        private readonly ConnectionService $connectionService,
    ) {}


    public function index(Request $request): Response
    {
        $connectionId = $request->input('connection_id') ?? null;
        $billingGroupId = $request->input('group_id') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $response = $this->billGeneraionJobStatusService->paginatedListBillGenerationJobStatus($pageNumber, $pageSize, null, null, null, $billingGroupId, $connectionId);
        $connection = null;
        if ($connectionId) {
            $connection = $this->connectionService->getConnection($connectionId);
        }
        $billingGroup = null;
        if ($billingGroupId) {
            $billingGroup = $this->billingGroupService->getBillingGroup(null, $billingGroupId);
        }
        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['data'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }
        return Inertia::render('Bill/BillIndexPage', [
            'billGenerationJobStatuses' => $paginated,
            'filters' => [
                'connectionId' => $connectionId,
                'billingGroupId' => $billingGroupId,
                'pageNumber' => $pageNumber,
                'pageSize' => $pageSize,
                'connection' => $connection->data ?? null,
                'billingGroup' => $billingGroup->data ?? null,
            ],
        ]);
    }

    public function show(int $id): Response
    {

        $bill = $this->billService->getBill($id);
        $energyMeter = null;
        $selfGenerationMeter = null;
        $chargeHeads = $this->billExportService->getChargeHeads($bill->data['demands'][0]['charge_heads'] ?? []);
        $computedProperties = $this->billExportService->getComputedProperties($bill->data['demands'][0]['computed_properties'] ?? []);
        if (isset($bill?->data['connection_id']) && $bill->data['connection_id']) {
            $energyMeter = $this->billExportService->getEnergyConsumptionMeter($bill->data['connection_id'], $computedProperties['meter'] ?? null);
            $selfGenerationMeter = $this->billExportService->getSelfGenerationMeter($bill->data['connection_id']);
        }
        $meterReading = null;

        if (isset($bill?->data['connection_id']) && $bill->data['connection_id'] && isset($bill?->data['reading_year_month']) && $bill->data['reading_year_month']) {
            $meterReading = $this->billExportService->getMeterReading($bill->data['connection_id'], $bill->data['reading_year_month']);
        }


        $timezones = $this->billExportService->splitTimeZones($computedProperties['timezones'] ?? []);
        $selfGenerationkwhValues = $this->billExportService->filterReadingByParameter($meterReading, 'kwh', $selfGenerationMeter['meter']['meter_id'] ?? null, $timezones);
        $kvaValues = $this->billExportService->filterReadingByParameter($meterReading, 'kva', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $kvahValues = $this->billExportService->filterReadingByParameter($meterReading, 'kvah', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $kwhValues = $this->billExportService->filterReadingByParameter($meterReading, 'kwh', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $lagValues = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lag', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $leadValues = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lead', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $averageAndTotalKva = $this->billExportService->getAverageAndTotalKva($kvaValues);
        $averageAndTotalKwh = $this->billExportService->getAverageAndTotalKwh($kwhValues);
        $demand = $this->billExportService->calculateDemand($kvaValues, $bill?->data['connection']['contract_demand_kva_val'] ?? 0);
        $totalDemandChargeRows = $this->billExportService->getTotolDemandChargeRows($computedProperties, $kvaValues, $timezones);
        $totalEnergyChargeRows = $this->billExportService->getTotalEnergyChargeRows($computedProperties, $kwhValues, $timezones);
        $billNumber = $this->billExportService->generateBillNumber($bill->data);
        $billWithNumber = null;
        if ($bill->data) {
            $billWithNumber = $bill->data;
            $billWithNumber['bill_number'] = $billNumber;
        };
        $otherCharges = $this->billExportService->configure_other_charges($chargeHeads, $computedProperties);

        return Inertia::render('Bill/BillShowPage', [

            'meter' => $energyMeter,
            'meterReading' => $meterReading,
            'kvaValues' => $kvaValues,
            'kvahValues' => $kvahValues,
            'kwhValues' => $kwhValues,
            'lagValues' => $lagValues,
            'leadValues' => $leadValues,
            'chargeHeads' => $chargeHeads,
            'computedProperties' => $computedProperties,
            'connection' => $bill->data['connection'] ?? null,
            'consumer' => $bill->data['connection']['consumer_profiles'][0] ?? null,
            'averageAndTotalKva' => $averageAndTotalKva,
            'averageAndTotalKwh' => $averageAndTotalKwh,
            'demand' => $demand,
            'totalDemandCharge' => $totalDemandChargeRows,
            'totalEnergyCharge' => $totalEnergyChargeRows,
            'selfGenerationkwhValues' => $selfGenerationkwhValues,
            'bill' => $billWithNumber,
            'timeZones' => $timezones,
            'otherCharges' => $otherCharges,
        ]);
    }
}
