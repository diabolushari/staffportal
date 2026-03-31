<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDomainFormRequest;
use App\Services\Parameters\ParameterDomainService;
use App\Services\SystemModule\SystemModuleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ParameterDomainController extends Controller
{
    public function __construct(
        private ParameterDomainService $parameterDomainService,
        private SystemModuleService $systemModuleService
    ) {}

    public function index(Request $request): InertiaResponse|RedirectResponse
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        $search = $request->input('search');
        $moduleId = $request->input('module_id') ? (int) $request->input('module_id') : null;

        $response = $this->parameterDomainService->listPaginatedParameterDomains(
            $page,
            $pageSize,
            $search,
            $moduleId
        );

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter domains.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        $modulesResponse = $this->systemModuleService->getSystemModules();

        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['parameter_domains'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('Parameters/ParameterDomain/ParameterDomainIndex', [
            'domains' => $paginated,
            'modules' => $modulesResponse->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'module_id' => $request->input('module_id', ''),
            ],
        ]);
    }

    public function show(int $id): InertiaResponse|RedirectResponse
    {
        $response = $this->parameterDomainService->getParameterDomain($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter domain.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return Inertia::render('Parameters/ParameterDomain/ParameterDomainShow', [
            'domain' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function store(ParameterDomainFormRequest $request): RedirectResponse
    {
        $response = $this->parameterDomainService->createParameterDomain($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to create parameter domain.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Parameter domain created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(ParameterDomainFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->parameterDomainService->updateParameterDomain($request, $id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to update parameter domain.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Parameter domain updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->parameterDomainService->deleteParameterDomain($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to delete parameter domain.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Parameter domain deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
