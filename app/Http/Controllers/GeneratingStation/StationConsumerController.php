<?php

namespace App\Http\Controllers\GeneratingStation;

use App\Http\Controllers\Controller;
use App\Services\GeneratingStation\StationConsumerRelService;
use App\Services\GeneratingStation\GeneratingStationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StationConsumerController extends Controller
{
     public function __construct(
        private readonly StationConsumerRelService $stationConsumerRelService,
        private readonly GeneratingStationService $generatingStationService
    ) {}

    /**
     * List consumers of a station
     */
    public function index(int $stationId): Response
    {
        $response = $this->stationConsumerRelService->listStationConsumers($stationId);
        $station = $this->generatingStationService
            ->getGeneratingStation($stationId)
            ->data;

        return Inertia::render('GeneratingStation/StationConsumerPage', [
            'relations' => $response->data ?? [],
            'stationId' => $stationId,
            'station' => $station,
        ]);
    }
}
