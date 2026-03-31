<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterTransformerRelFormRequest;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MeterTransformerRelController extends Controller
{
    public function __construct(
        private readonly MeterTransformerRelService $relService,
        private readonly MeterService $meterService,
        private readonly MeterTransformerService $meterTransformerService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $response = $this->relService->listRelations();

        return Inertia::render('MeterTransformerRel/MeterTransformerRelIndex', [
            'relations' => $response->data,
        ]);
    }

    /**
     * Show the form for creating a new relation.
     */
    public function create(): Response|RedirectResponse
    {
        // Fetch dropdowns
        $ctpts = $this->meterTransformerService->listUnassignedTransformers();
        $meters = $this->meterService->listMeters();

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Status')->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Change Reason')->data,
        ];

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'ctpts' => $ctpts->data,
            'meters' => $meters->data,
            ...$parameterRequests,
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(MeterTransformerRelFormRequest $request): RedirectResponse
    {

        $request->createdBy = auth()->id();
        $response = $this->relService->createRelation($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors(['message' => 'Failed to create relation']);
        }

        return redirect()->route('connection.meters', $request->connectionId)
            ->with(['message' => 'Relation created successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): Response
    {
        $response = $this->relService->getRelation($id);

        return Inertia::render('MeterTransformerRel/MeterTransformerRelShow', [
            'relation' => $response->data,
        ]);
    }

    public function edit(int $id): Response
    {
        $response = $this->relService->getRelation($id);
        $ctpts = $this->meterTransformerService->listUnassignedTransformers();
        $ctptsData = $ctpts->data;
        $currentCtpt = null;
        $meter = null;
        if ($response->data !== null) {
            $meter = $this->meterService->getMeter($response->data['meter_id'])->data;
            $currentCtpt = $this->meterTransformerService->getTransformer($response->data['ctpt_id']);
        }

        if ($currentCtpt && ! collect($ctptsData)->contains('meter_ctpt_id', $currentCtpt->data['meter_ctpt_id'])) {
            $ctptsData[] = $currentCtpt->data;
        }
        // Fetch statuses + change reasons

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Status')->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(1, 100, null, 'CTPT', 'Change Reason')->data,
        ];

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'relation' => $response->data,
            'ctpts' => $ctptsData,
            'meter' => $meter,
            'currentCtpt' => $currentCtpt,
            ...$parameterRequests,
        ]);
    }

    public function update(MeterTransformerRelFormRequest $request, int $id): RedirectResponse
    {
        $data = $request->toArray();
        $data['updated_by'] = auth()->id(); // Use updated_by, not created_by

        // Call updateRelation instead of createRelation
        $response = $this->relService->updateRelation($data, $id);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Failed to update relation');
        }

        return redirect()->route('meters.show', $response->data['meter_id'])->with('success', 'Relation updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->relService->deleteRelation($id);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Failed to delete relation');
        }

        return redirect()->back()->with('message', 'Relation deleted successfully.');
    }
}
