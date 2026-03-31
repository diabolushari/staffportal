<?php

namespace App\Http\Controllers\GeneratingStation;

use App\Http\Controllers\Controller;
use App\Http\Requests\GeneratingStation\GeneratingStationFormRequest;
use App\Services\GeneratingStation\GeneratingStationService;
use App\Services\Parameters\ParameterValueService;
use App\Services\Consumers\GeoRegionsService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Concurrency;
use Inertia\Inertia;
use Inertia\Response;

class GeneratingStationController extends Controller
{
    public function __construct(
        private readonly GeneratingStationService $generatingStationService,
        private readonly ParameterValueService $parameterValueService,
        private readonly GeoRegionsService $geoRegionsService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'station_name' => $request->input('station_name'),
            'consumer_number' => $request->input('consumer_number'),
            'generation_type_id' => $request->input('generation_type_id'),
            'voltage_category_id' => $request->input('voltage_category_id'),
            'plant_type_id' => $request->input('plant_type_id'),
            'generation_status_id' => $request->input('generation_status_id'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
        ];

        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;

        $response = $this->generatingStationService
            ->listPaginatedGeneratingStations($pageNumber, $pageSize, $filters);

        $paginated = null;

        if (!empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['items'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }
          $generationStatus = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Generation Status')->data;

        $generationTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Generation Type')->data;

        $voltageCategories = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Voltage Category')->data;

        $plantTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Plant Type')->data;


        return Inertia::render('GeneratingStation/GeneratingStationIndex', [
            'generatingStations' => $paginated ?? [],
            'filters' => $filters,
            'generationTypes' => $generationTypes,
            'voltageCategories' => $voltageCategories,
            'plantTypes' => $plantTypes,
            'generationStatuses' => $generationStatus,

        ]);

    }
    /**
     * Show create form
     */
    public function create(Request $request): Response
    {
        $connectionId = $request->input('connectionId');

        $generationStatus = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Generation Status')
            ->data;
        $generationTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Generation Type')
            ->data;
        $voltageCategories = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Voltage Category')
            ->data;
        $plantTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Plant Type')
            ->data;
        $attributeDefinitions = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station', 'Generating Station Attribute')
            ->data;
        $districts = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'District'
        );
        $states = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'State'
        );

        return Inertia::render('GeneratingStation/GeneratingStationCreate', [
            'connectionId' => $connectionId,
            'generationStatus' => $generationStatus,
            'generationTypes' => $generationTypes,
            'voltageCategories' => $voltageCategories,
            'plantTypes' => $plantTypes,
            'attributeDefinitions' => $attributeDefinitions,
            'districts' => $districts->data,
            'states' => $states->data,
        ]);
    }

    /**
     * Store new generating station
     */
    public function store(GeneratingStationFormRequest $request): RedirectResponse
    {
        $response = $this->generatingStationService->create($request);

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()
            ->route('generating-stations.index')
            ->with('message', 'Generating Station added successfully');
    }

    public function show(int $id): Response
    {
        $response = $this->generatingStationService->getGeneratingStation($id);


        return Inertia::render('GeneratingStation/GeneratingStationShow', [
            'station' => $response->data
        ]);
    }
}
