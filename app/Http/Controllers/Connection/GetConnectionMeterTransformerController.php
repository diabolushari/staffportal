<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetConnectionMeterTransformerController extends Controller
{
    public function __construct(
        private readonly MeterTransformerRelService $meterTransformerRelService,
        private readonly MeterTransformerService $meterTransformerService,
        private readonly MeterConnectionMappingService $meterConnectionMappingService,
        private readonly ConnectionService $connectionService,
    ) {}

    public function __invoke(int $id, Request $request): Response|RedirectResponse
    {
        $connectionResponse = $this->connectionService->getConnection($id);
        $meterConnectionRelResponse = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($id);
        $meterConnectionRels = $meterConnectionRelResponse->data;
        $meterTransformers = [];
        if (! empty($meterConnectionRels)) {
            foreach ($meterConnectionRels as $meterConnectionRel) {
                $meterTransformer = [
                    'meter' => $meterConnectionRel['meter'],
                ];
                $relResponse = $this->meterTransformerRelService->getRelByMeterId($meterConnectionRel['meter_id']);
                $transformers = [];

                if ($relResponse->hasValidationError() == false) {
                    $ctpts = $relResponse->data ?? [];
                    foreach ($ctpts as $ctpt) {
                        $transformer['transformer'] = $this->meterTransformerService->getTransformer($ctpt['ctpt_id'])->data;
                        $transformer['version_id'] = $ctpt['version_id'];
                        $transformers[] = $transformer;
                    }
                }
                $meterTransformer['transformers'] = $transformers;
                $meterTransformers[] = $meterTransformer;
            }
        }

        return Inertia::render('Connections/MeterTransformerTab', [
            'connection' => $connectionResponse->data,
            'transformers' => $meterTransformers,
        ]);
    }
}
