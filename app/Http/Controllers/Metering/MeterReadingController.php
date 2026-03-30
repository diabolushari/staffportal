<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterReadingForm;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterReadingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class MeterReadingController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private MeterReadingService $meterReadingService,
        private MeterConnectionMappingService $meterConnectionMappingService
    ) {}

    public function index(Request $request): Response
    {
        $consumerNumber = $request->input('search') ?? null;
        $connections = $this->connectionService->listConnections($consumerNumber, null, null)->data;

        $search = $request->input('search') ?? null;
        $connectionId = $request->input('connection_id') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;

        $meterReadings = $this->meterReadingService->listPaginatedMeterReadings(
            pageNumber: (int) $pageNumber,
            pageSize: (int) $pageSize,
            search: $search,
            connectionId: $connectionId
        );

        $paginated = null;
        if (! empty($meterReadings->data)) {
            $paginated = new LengthAwarePaginator(
                $meterReadings->data['data'],                // items for this page
                $meterReadings->data['total_count'],            // total items count
                $meterReadings->data['page_size'],              // items per page
                $meterReadings->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        return Inertia::render('MeterReading/MeterReadingIndexPage', [
            'connections' => $connections,
            'meterReadings' => $paginated,
            'filter' => [
                'consumerNumber' => $consumerNumber,
            ],
        ]);
    }

    public function store(MeterReadingForm $request): RedirectResponse
    {
        $response = $this->meterReadingService->createMeterReading($request);
        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()
                ->with([
                    'message' => 'Failed to create meter reading.',
                ]);
        }

        if ($response->statusCode != 0) {
            return redirect()->back();
        }

        return redirect()->route('connection.meter-reading', $request->connectionId)->with('message', 'Meter reading created successfully.');
    }

    public function show(int $meterReadingId, Request $request): Response
    {
        $connectionId = $request->query('connection_id');
        $connectionRel = null;
        $meterReading = $this->meterReadingService->getMeterReading($meterReadingId, (int) $request->query('meter_id'));
        if ($meterReading->data !== null) {
            $connectionRel = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($meterReading->data['connection_id'])->data;
        }
        $connection = $this->connectionService->getConnection((int) $connectionId)->data;

        return Inertia::render('MeterReading/MeterReadingShowPage', [
            'meterReading' => $meterReading->data,
            'connectionId' => $connectionId,
            'connection' => $connection,
            'meterConnectionMapping' => $connectionRel,
        ]);
    }

    public function update(MeterReadingForm $request, int $meterReadingId): RedirectResponse
    {
        $response = $this->meterReadingService->updateMeterReading($request, $meterReadingId);
        if ($response->hasValidationError()) {
            if ($response->error) {
                return $response->error;
            } else {
                return redirect()->back()->with('error', 'Failed to get connection');
            }
        }

        return redirect()->back()->with('success', 'Meter reading updated successfully');
    }
}
