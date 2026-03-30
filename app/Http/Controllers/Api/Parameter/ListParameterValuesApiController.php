<?php

namespace App\Http\Controllers\Api\Parameter;

use App\Http\Controllers\Controller;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListParameterValuesApiController extends Controller
{
    public function __construct(
        private ParameterValueService $client
    ) {}

    public function __invoke(Request $request): JsonResponse
    {

        $domainName = $request->query('domain_name');
        $parameterName = $request->query('parameter_name');
        $attributeName = $request->query('attribute_name');
        $attributeValue = $request->query('attribute_value');
        $search = $request->query('search');

        $res = $this->client->getParameterValues(null, null, $search, $domainName, $parameterName, $attributeName, $attributeValue);

        return response()->json($res->data);
    }
}
