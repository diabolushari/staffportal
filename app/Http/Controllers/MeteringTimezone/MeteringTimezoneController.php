<?php

namespace App\Http\Controllers\MeteringTimezone;

use App\Http\Controllers\Controller;
use App\Services\MeteringTimezone\MeteringTimezoneService;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MeteringTimezoneController extends Controller
{
    public function __construct(
        private MeteringTimezoneService $meteringTimezoneService,
        private ParameterValueService $parameterValueService,
        private ParameterDefinitionService $parameterDefinitionService
    ) {}

    /**
     * Display a listing of the meter timezones.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $search = $request->input('search') ?? null;
        $profileId = $request->input('profile_id') ?? null;
        $response = $this->meteringTimezoneService->listTimezoneGroupByMeteringType($profileId, $search);

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: $search,
            domainName: 'Meter',
            parameterName: 'Timezone Type'
        );
        $pricingTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Pricing Type'
        );
        $timezoneNameParameter = $this->parameterDefinitionService->getParameterDefinition(
            null,
            'Meter',
            'Timezone Name',
            'Consumer'
        );
        $timeZoneTypeParameter = $this->parameterDefinitionService->getParameterDefinition(
            null,
            'Meter',
            'Timezone Type',
            'Consumer'
        );
        $timezoneNamesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Name'
        );
        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching timezones: ' . ($response->statusDetails ?? 'Unknown error'),
            ]);
        }

        return Inertia::render('MeteringTimezones/MeteringTimezoneIndexPage', [
            'timezones' => $response->data,
            'timezone_types' => $timezoneTypesResponse->data,
            'pricing_types' => $pricingTypesResponse->data,
            'timezone_name_parameter' => $timezoneNameParameter->data,
            'timezone_type_parameter' => $timeZoneTypeParameter->data,
            'timezone_names' => $timezoneNamesResponse->data,
            'filter' => [
                'search' => $search,
                'profile_id' => $profileId,
            ],
        ]);
    }

    /**
     * Show the form for creating a new meter timezone.
     */
    public function create(): Response|RedirectResponse
    {

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Type'
        );

        $timezoneNamesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Name'
        );

        return Inertia::render('MeteringTimezones/MeteringTimezoneFormPage', [
            'timezoneTypes' => $timezoneTypesResponse->data,
            'timezoneNames' => $timezoneNamesResponse->data,
        ]);
    }

    /**
     * Store a newly created meter timezone.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->all();
        $user = Auth::user();
        if ($user) {
            $data['created_by'] = $user->id;
        }

        $response = $this->meteringTimezoneService->createMeteringTimezone($data);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error)->withInput();
        }

        return redirect()->back()->with('message', 'Meter timezone created successfully.');
    }

    /**
     * Display the specified meter timezone.
     */
    public function show(int $id): Response|RedirectResponse
    {
        $timezone = $this->meteringTimezoneService->getTimezoneGroupByTimezoneType($id);
        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Type'
        );
        $pricingTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Pricing Type'
        );
        $timezoneNameParameter = $this->parameterDefinitionService->getParameterDefinition(
            null,
            'Meter',
            'Timezone Name',
            'Consumer'
        );
        $timeZoneTypeParameter = $this->parameterDefinitionService->getParameterDefinition(
            null,
            'Meter',
            'Timezone Type',
            'Consumer'
        );
        $timezoneNamesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Name'
        );
        if ($timezone->hasValidationError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching timezone: ' . ($timezone->statusDetails ?? 'Unknown error'),
            ]);
        }

        return Inertia::render('MeteringTimezones/MeteringTimezoneShowPage', [
            'timezone' => $timezone->data,
            'timezoneTypes' => $timezoneTypesResponse->data,
            'pricingTypes' => $pricingTypesResponse->data,
            'timezoneNameParameter' => $timezoneNameParameter->data,
            'timeZoneTypeParameter' => $timeZoneTypeParameter->data,
            'timezoneNames' => $timezoneNamesResponse->data,
        ]);
    }

    /**
     * Show the form for editing the specified meter timezone.
     */
    public function edit(int $id): Response|RedirectResponse
    {
        $timezone = $this->meteringTimezoneService->getMeteringTimezone($id);

        if ($timezone->hasValidationError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching timezone: ' . ($timezone->statusDetails ?? 'Unknown error'),
            ]);
        }

        // Fetch all required parameter values for the form
        $pricingTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Pricing Type'
        );

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Type'
        );

        $timezoneNamesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Name'
        );

        // Check for errors in any of the responses
        if ($pricingTypesResponse->hasValidationError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Pricing Types: ' . ($pricingTypesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        if ($timezoneTypesResponse->hasValidationError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Timezone Types: ' . ($timezoneTypesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        if ($timezoneNamesResponse->hasValidationError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Timezone Names: ' . ($timezoneNamesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        // Transform the responses to the required format
        $pricingTypes = collect($pricingTypesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        $timezoneTypes = collect($timezoneTypesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        $timezoneNames = collect($timezoneNamesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        return Inertia::render('MeteringTimezones/MeteringTimezoneFormPage', [
            'timezone' => $timezone->data,
            'pricingTypes' => $pricingTypes,
            'timezoneTypes' => $timezoneTypes,
            'timezoneNames' => $timezoneNames,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified meter timezone.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->all();
        $data['metering_timezone_id'] = $id;
        $data['updated_by'] = auth()->id();

        $response = $this->meteringTimezoneService->updateMeteringTimezone($data);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->back()->with('message', 'Meter timezone updated successfully.');
    }

    /**
     * Remove the specified meter timezone.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->meteringTimezoneService->deleteMeteringTimezone($id);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors([
                'error' => 'Error deleting timezone: ' . ($response->statusDetails ?? 'Unknown error'),
            ]);
        }

        return redirect()->back()->with('message', 'Meter timezone deleted successfully.');
    }

    /**
     * Get meter timezones by pricing type.
     */
    public function getByPricingType(int $pricingTypeId): \Illuminate\Http\JsonResponse
    {
        $response = $this->meteringTimezoneService->getMeteringTimezonesByPricingType($pricingTypeId);

        if ($response->hasValidationError()) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching timezones',
                'error' => $response->error,
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $response->data,
        ]);
    }
}
