<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\ConsumerFormRequest;
use App\Services\Connection\ConsumerService;
use App\Services\Consumers\GeoRegionsService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ConsumerController extends Controller
{
    public function __construct(
        private readonly ConsumerService $consumerService,
        private readonly ParameterValueService $parameterValueService,
        private readonly GeoRegionsService $geoRegionsService,
    ) {}

    public function index(): InertiaResponse
    {
        return Inertia::render('Consumer/ConsumerIndex');
    }

    public function create(): InertiaResponse
    {
        $consumerTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Type'
        );
        $consumerOwnershipTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Ownership Type'
        );
        $districts = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'District'
        );
        $states = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'State'
        );


        return Inertia::render('Consumer/ConsumerForm', [
            'consumerTypes' => $consumerTypes->data,
            'consumerOwnershipTypes' => $consumerOwnershipTypes->data,
            'districts' => $districts->data,
            'states' => $states->data,
        ]);
    }

    public function store(ConsumerFormRequest $request): RedirectResponse
    {

        $response = $this->consumerService->createConsumer($request);
        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connections.index')->with('message', 'Consumer created successfully');
    }

    public function edit(int $connectionId): InertiaResponse
    {
        $consumer = $this->consumerService->getConsumer($connectionId);
        $consumerTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Type'
        );
        $consumerOwnershipTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Ownership Type'
        );
        $districts = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'District'
        );
        $states = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'State'
        );

        return Inertia::render('Consumer/ConsumerForm', [
            'consumerTypes' => $consumerTypes->data,
            'consumerOwnershipTypes' => $consumerOwnershipTypes->data,
            'districts' => $districts->data,
            'states' => $states->data,
            'consumer' => $consumer->data,
        ]);
    }

    public function update(ConsumerFormRequest $request, int $connectionId): RedirectResponse
    {
        $response = $this->consumerService->updateConsumer($request, $connectionId);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connection.consumer', $connectionId);
    }
}
