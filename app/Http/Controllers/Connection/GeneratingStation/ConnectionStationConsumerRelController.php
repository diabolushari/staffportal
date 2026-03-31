<?php

namespace App\Http\Controllers\Connection\GeneratingStation;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\GeneratingStation\StationConsumerRelService;
use Inertia\Inertia;

class ConnectionStationConsumerRelController extends Controller
{
    public function __construct(
        private readonly StationConsumerRelService $stationConsumerRelService,
        private readonly ConnectionService $connectionService
    ) {}

    public function __invoke(int $connectionId)
    {
        $connection = $this->connectionService->getConnection($connectionId)->data;

        // $stations = $this->stationConsumerRelService
        //     ->listConsumerStations($connectionId)->data;
        $relations = $this->stationConsumerRelService
        ->listConsumerStations($connectionId)->data;

        return Inertia::render('GeneratingStation/StationConsumerRelCreate', [
            'connection' => $connection,
            'relations' => $relations,

        ]);
    }
}
