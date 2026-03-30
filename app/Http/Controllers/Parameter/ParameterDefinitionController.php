<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDefinitionFormRequest;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterDomainService;
use App\Services\SystemModule\SystemModuleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ParameterDefinitionController extends Controller
{
    public function __construct(
        private ParameterDefinitionService $parameterDefinitionService,
        private ParameterDomainService $parameterDomainService,
        private SystemModuleService $systemModuleService
    ) {}

    public function index(Request $request): RedirectResponse|InertiaResponse
    {

        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $domainName = $request->input('domain_name');
        $moduleName = $request->input('module_name');
        $search = $request->input('search');
        $domainsResponse = $this->parameterDomainService->getParameterDomains($page, $pageSize, null, null);
        $systemModulesResponse = $this->systemModuleService->getSystemModules($page, $pageSize);
        $response = $this->parameterDefinitionService->listPaginatedParameterDefinitions($page, $pageSize, $domainName, $moduleName, $search);

        if ($domainsResponse->hasValidationError()) {
            return $domainsResponse->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter domains.',
                'grpcStatus' => [
                    'code' => $domainsResponse->statusCode,
                    'details' => $domainsResponse->statusDetails,
                ],
            ]);
        }

        if ($systemModulesResponse->hasValidationError()) {
            return $systemModulesResponse->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch system modules.',
                'grpcStatus' => [
                    'code' => $systemModulesResponse->statusCode,
                    'details' => $systemModulesResponse->statusDetails,
                ],
            ]);
        }

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter definitions.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }


        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['parameter_definitions'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }
        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionIndex', [
            'parameter_definitions' => $paginated ?? [],
            'domains' => $domainsResponse->data ?? [],
            'system_modules' => $systemModulesResponse->data ?? [],
            'filters' => [
                'module_name' => $request->input('module_name'),
                'domain_name' => $request->input('domain_name'),
                'search' => $request->input('search'),
            ],
        ]);
    }

    public function show(int|string $id): InertiaResponse|RedirectResponse
    {
        $response = $this->parameterDefinitionService->getParameterDefinition($id, null, null, null);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionShow', [
            'definition' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function store(ParameterDefinitionFormRequest $request): RedirectResponse
    {
        $response = $this->parameterDefinitionService->createParameterDefinition($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to create parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('parameter-definition.index')->with([
            'message' => 'Parameter definition created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(ParameterDefinitionFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->parameterDefinitionService->updateParameterDefinition($request, $id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to update parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('parameter-definition.index')->with([
            'message' => 'Parameter definition updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->parameterDefinitionService->deleteParameterDefinition($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to delete parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('parameter-definition.index')->with([
            'message' => 'Parameter definition deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
