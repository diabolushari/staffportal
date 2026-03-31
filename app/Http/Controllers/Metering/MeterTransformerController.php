<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterTransformerFormRequest;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class MeterTransformerController extends Controller
{
    public function __construct(
        private readonly MeterTransformerService $transformerService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    /**
     * Display a listing of transformers.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $ctptSerial = $request->input('ctpt_serial') ?? null;
        $makeId = $request->input('make_id') ?? null;
        $typeId = $request->input('type_id') ?? null;
        $ownershipTypeId = $request->input('ownership_type_id') ?? null;
        $ratio = $request->input('ratio') ?? null;
        $sortBy = $request->input('sort_by') ?? null;
        $sortDirection = $request->input('sort_direction') ?? null;
        $response = $this->transformerService->listTransformersPaginated(
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            ctptSerial: $ctptSerial,
            makeId: $makeId,
            typeId: $typeId,
            ownershipTypeId: $ownershipTypeId,
            ratio: $ratio,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
        );
        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['transformers'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }
        $types = $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Type')->data;
        $makes = $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Make')->data;
        $ownershipTypes = $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Ownership Type')->data;
        $primaryRatios = $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Primary Ratio')->data;
        $secondaryRatios = $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Secondary Ratio')->data;

        $ratios = [];

        foreach ($primaryRatios as $primary) {
            foreach ($secondaryRatios as $secondary) {
                $ratios[] = [
                    'primary_id' => $primary['id'],
                    'secondary_id' => $secondary['id'],
                    'ratio' => $primary['parameter_value'].'/'.$secondary['parameter_value'],
                ];
            }
        }

        return Inertia::render('MeterTransformers/MeterTransformerIndex', [
            'transformers' => $paginated ?? [],
            'filters' => [
                'search' => $ctptSerial,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
            'oldCtptSerial' => $ctptSerial,
            'oldMakeId' => $makeId,
            'oldTypeId' => $typeId,
            'oldOwnershipTypeId' => $ownershipTypeId,
            'oldRatio' => $ratio,
            'types' => $types,
            'makes' => $makes,
            'ownershipTypes' => $ownershipTypes,
            'primaryRatios' => $primaryRatios,
            'secondaryRatios' => $secondaryRatios,
            'ratios' => $ratios,
        ]);
    }

    /**
     * Show the form for creating a transformer (with dropdowns).
     */
    public function create(): Response|RedirectResponse
    {
        $parameterRequests = [
            'ownershipTypes' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Ownership Type')->data,
            'accuracyClasses' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Accuracy Class')->data,
            'burdens' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Burden')->data,
            'makes' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Make')->data,
            'types' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Type')->data,

        ];

        return Inertia::render('MeterTransformers/MeterTransformerForm', $parameterRequests);
    }

    /**
     * Store a new transformer.
     */
    public function store(MeterTransformerFormRequest $request): RedirectResponse
    {

        $response = $this->transformerService->createTransformer($request);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Unknown error');
        }

        return redirect()->route('meter-ctpt.index')
            ->with('message', 'Meter Transformer created successfully.');
    }

    /**
     * Show a transformer.
     */
    public function show(int $id): Response
    {
        $response = $this->transformerService->getTransformer($id);

        return Inertia::render('MeterTransformers/MeterTransformerShow', [
            'transformer' => $response->data ?? null,
        ]);
    }

    public function edit(int $id): Response
    {

        $response = $this->transformerService->getTransformer($id);
        $parameterRequests = [
            'ownershipTypes' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Ownership Type')->data,
            'accuracyClasses' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Accuracy Class')->data,
            'burdens' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Burden')->data,
            'makes' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Make')->data,
            'types' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Type')->data,
        ];

        return Inertia::render('MeterTransformers/MeterTransformerForm', [
            'transformer' => $response->data ?? null,
            ...$parameterRequests,
        ]);
    }

    public function update(int $id, MeterTransformerFormRequest $request): RedirectResponse
    {
        $response = $this->transformerService->updateTransformer($id, $request);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Unknown error');
        }

        return redirect()->route('meter-ctpt.show', $id)
            ->with('message', 'Meter Transformer updated successfully.');
    }

    /**
     * Delete a transformer.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->transformerService->deleteTransformer($id);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Unknown error');
        }

        return redirect()->route('meter-ctpt.index')
            ->with('success', 'Meter Transformer deleted successfully.');
    }
}
