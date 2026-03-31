<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Parameters\ParameterDefinitionService;
use Illuminate\Http\JsonResponse;

class ParameterDefinitionListApiController extends Controller
{
    public function __construct(
        private readonly ParameterDefinitionService $parameterDefinitionService
    ) {}

    public function __invoke(): ?JsonResponse
    {
        $domainName = request('domain_name');
        $moduleName = request('module_name');
        $search = request('search');
        $response = $this->parameterDefinitionService->getParameterDefinitions(1, 100, $domainName, $moduleName, $search);

        if ($response->hasValidationError()) {
            return response()->json(['error' => $response->error], 500);
        }

        $definitions = $response->data;

        return response()->json($definitions);
    }
}
