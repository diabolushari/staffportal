<?php

namespace App\Http\Controllers\MeterProfileParameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\MeterProfileParameter\MeterProfileParameterFormRequest;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class MeterProfileParameterController extends Controller
{
    public function __construct(
        private MeteringParameterProfileService $meterProfileParameterService,
        private ParameterValueService $parameterValueService,
        private ParameterDefinitionService $parameterDefinitionService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|RedirectResponse
    {

        $search = $request->input('search') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $meterProfileParameter = $this->parameterDefinitionService->getParameterDefinition(null, 'Meter', 'Meter Profile', 'Consumer');

        $search = $request->input('search');
        $response = $this->meterProfileParameterService->listMeteringProfileParameterGroupByMeterProfile(
            $pageNumber,
            $pageSize,
            $search,
            null,
            null,

        );

        $meterProfiles = $this->parameterValueService->getParameterValues(null, null, $search, 'Meter', 'Meter Profile');

        $responseData = $response->data['metering_parameter_profiles'] ?? [];

        $profileIds = collect($responseData)
            ->pluck('profile.id')
            ->unique()
            ->values()
            ->all();

        $profilesWithNoParameterValue = collect($meterProfiles->data)
            ->whereNotIn('id', $profileIds)
            ->values()
            ->all();

        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $responseData,                // items for this page
                $response->data['total_count'],            // total items count
                $response->data['page_size'],              // items per page
                $response->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch Meter Profile Parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return Inertia::render('MeterProfileParameter/MeterProfileParameterIndex', [
            'meterProfileParameters' => $paginated ?? [],
            'profilesWithNoParameterValue' => $profilesWithNoParameterValue,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
            'oldSearch' => $request->input('search'),
            'definition' => $meterProfileParameter->data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {

        $profileId = (int) $request->query('profileId');
        $profiles = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Meter Profile');
        $profileParameters = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Profile Parameter');

        return Inertia::render('MeterProfileParameter/MeterProfileParameterCreate', [
            'profiles' => $profiles->data,
            'profileParameters' => $profileParameters->data,
            'profileId' => $profileId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MeterProfileParameterFormRequest $request): RedirectResponse
    {
        $response = $this->meterProfileParameterService->createMeterProfileParameter($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to create meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('meter-profile.show', $request->profileId)->with([
            'message' => 'Meter profile parameter created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id): Response|RedirectResponse
    {

        $search = $request->input('search') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $profileId = $id;
        $meterProfileParameter = $this->parameterDefinitionService->getParameterDefinition(null, 'Meter', 'Meter Profile', 'Consumer');
        $response = $this->meterProfileParameterService->listMeteringProfileParameters(
            $pageNumber,
            $pageSize,
            $search,
            $profileId
        );

        $paginated = null;
        if (! empty($response->data)) {
            $currentPage = LengthAwarePaginator::resolveCurrentPage();
            $perPage = 10; // change if needed

            $collection = collect($response->data);

            $paginated = new LengthAwarePaginator(
                $collection->forPage($currentPage, $perPage)->values(),
                $collection->count(),
                $perPage,
                $currentPage,
                ['path' => request()->url()]
            );
        }

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }
        $profile = $this->parameterValueService->getParameterValue($profileId, null);

        return Inertia::render('MeterProfileParameter/MeterProfileParameterShow', [
            'meterProfileParameter' => $paginated,
            'profileId' => $profileId,
            'profile' => $profile->data,
            'definition' => $meterProfileParameter->data,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): Response|RedirectResponse
    {
        $response = $this->meterProfileParameterService->getMeterProfileParameter($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        $profiles = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Meter Profile');
        $profileParameters = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Profile Parameter');

        return Inertia::render('MeterProfileParameter/MeterProfileParameterCreate', [
            'profiles' => $profiles->data,
            'profileParameters' => $profileParameters->data,
            'meterProfileParameter' => $response->data,
            'profileId' => $response->data['profile_id'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MeterProfileParameterFormRequest $request, int $meterParameterId): RedirectResponse
    {
        $response = $this->meterProfileParameterService->updateMeterProfileParameter($request, $meterParameterId);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to update meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('meter-profile.show', $request->profileId)->with([
            'message' => 'Meter profile parameter updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->meterProfileParameterService->deleteMeterProfileParameter($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to delete meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('meter-profile.index')->with([
            'message' => 'Meter profile parameter deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
