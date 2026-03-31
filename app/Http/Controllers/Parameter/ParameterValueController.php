<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterValueFormRequest;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterDomainService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ParameterValueController extends Controller
{
    public function __construct(
        private ParameterValueService $parameterValueService,
        private ParameterDomainService $parameterDomainService,
        private ParameterDefinitionService $parameterDefinitionService
    ) {}

    public function edit(int $id): InertiaResponse|RedirectResponse
    {

        $value = $this->parameterValueService->getParameterValue($id);
        if ($value->hasValidationError()) {
            return $value->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter value.',
                'grpcStatus' => [
                    'code' => $value->statusCode,
                    'details' => $value->statusDetails,
                ],
            ]);
        }
        $domains = $this->parameterDomainService->getParameterDomains(1, 10, null, null);
        $definitions = $this->parameterDefinitionService->getParameterDefinitions(1, 10, null, null);

        return Inertia::render('Parameters/ParameterValue/ParameterValueCreate', [
            'parameter_value' => $value->data,
            'domains' => $domains->data,
            'definitions' => $definitions->data,
        ]);
    }

    public function index(Request $request): InertiaResponse|RedirectResponse
    {

        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $domainName = $request->input('domain_name');
        $parameterName = $request->input('parameter_name');
        $search = $request->input('search');
        $values = $this->parameterValueService->listParameterValuePaginated($page, $pageSize, $search, $domainName, $parameterName);
        $domains = $this->parameterDomainService->getParameterDomains($page, $pageSize, null, null);
        $definitions = $this->parameterDefinitionService->getParameterDefinitions($page, $pageSize, null, null);
        if ($values->hasValidationError()) {
            return $values->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter values.',
                'grpcStatus' => [
                    'code' => $values->statusCode,
                    'details' => $values->statusDetails,
                ],
            ]);
        }
        $paginated = null;
        if (! empty($values->data)) {
            $paginated = new LengthAwarePaginator(
                $values->data['parameter_values'],                // items for this page
                $values->data['total_count'],            // total items count
                $values->data['page_size'],              // items per page
                $values->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        return Inertia::render('Parameters/ParameterValue/ParameterValueIndex', [
            'values' => $paginated,
            'domains' => $domains->data,
            'definitions' => $definitions->data,
            'filters' => [
                'domain_name' => $domainName,
                'parameter_name' => $parameterName,
                'search' => $search,
            ],

        ]);
    }

    public function create(): InertiaResponse
    {
        $domains = $this->parameterDomainService->getParameterDomains(1, 10, null, null);
        $definitions = $this->parameterDefinitionService->getParameterDefinitions(1, 10, null, null);

        return Inertia::render('Parameters/ParameterValue/ParameterValueCreate', [
            'domains' => $domains->data,
            'definitions' => $definitions->data,
        ]);
    }

    public function show(int $id): InertiaResponse|RedirectResponse
    {
        $value = $this->parameterValueService->getParameterValue($id);
        if ($value->hasValidationError()) {
            return $value->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter value.',
                'grpcStatus' => [
                    'code' => $value->statusCode,
                    'details' => $value->statusDetails,
                ],
            ]);
        }

        return Inertia::render('Parameters/ParameterValue/ParameterValueShow', [
            'parameter_value' => $value->data,
        ]);
    }

    public function store(ParameterValueFormRequest $request): RedirectResponse
    {

        $response = $this->parameterValueService->createParameterValue($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to create parameter value.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Parameter value created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(ParameterValueFormRequest $request, int $id): RedirectResponse
    {

        $response = $this->parameterValueService->updateParameterValue($request, $id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to update parameter value.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Parameter value updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->parameterValueService->deleteParameterValue($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to delete parameter value.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with(['message' => 'Deleted successfully.']);
    }
}
