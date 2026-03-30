<?php

namespace App\Http\Controllers\VariableRate;

use App\Http\Controllers\Controller;
use App\Http\Requests\VariableRate\VariableRateFormRequest;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterValueService;
use App\Services\VariableRate\VariableRateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class VariableRateController extends Controller
{
    public function __construct(
        private VariableRateService $variableRateService,
        private ParameterDefinitionService $parameterDefinitionService,
        private ParameterValueService $parameterValueService
    ) {}

    public function index(Request $request): Response
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $search = $request->input('search') ?? null;
        $orderBy = $request->input('order_by') ?? null;
        $orderDirection = $request->input('order_direction') ?? null;
        $variableNameId = $request->input('variable_name_id') ?? null;
        $variableName = null;
        if (! empty($variableNameId)) {
            $variableName = $this->parameterValueService->getParameterValue($variableNameId)->data;
        }

        $variableRateResponse = $this->variableRateService->listPaginatedVariableRates(
            $pageNumber,
            $pageSize,
            $search,
            $orderBy,
            $orderDirection,
            $variableNameId
        );
        $paginated = null;
        if (! empty($variableRateResponse->data)) {
            $paginated = new LengthAwarePaginator(
                $variableRateResponse->data['variable_rates'],
                $variableRateResponse->data['total_count'],
                $variableRateResponse->data['page_size'],
                $variableRateResponse->data['page_number'],
                ['path' => request()->url()]
            );
        }

        $variableRateParameter = $this->parameterDefinitionService->getParameterDefinition(
            null,
            'Billing',
            'Variable Name',
            'Billing'
        );

        return Inertia::render('VariableRate/VariableRateIndexPage', [
            'variableRateParameter' => $variableRateParameter->data,
            'variableRates' => $paginated ?? [],
            'filters' => [
                'search' => $search,
                'order_by' => $orderBy,
                'order_direction' => $orderDirection,
                'oldVariableName' => $variableName,
            ],
        ]);
    }

    public function store(VariableRateFormRequest $request): RedirectResponse
    {
        $response = $this->variableRateService->createVariableRate($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with(['error' => 'Unknown error']);
        }

        return redirect()->back()->with('message', 'Variable rate created successfully.');
    }

    public function update(VariableRateFormRequest $request): RedirectResponse
    {
        $response = $this->variableRateService->updateVariableRate($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with(['error' => 'Unknown error']);
        }

        return redirect()->back()->with('message', 'Variable rate updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->variableRateService->deleteVariableRate($id);

        return redirect()->back()->with(['message' => 'Variable Rate deleted successfuly']);
    }
}
