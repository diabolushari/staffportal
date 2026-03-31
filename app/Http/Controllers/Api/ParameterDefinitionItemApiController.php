<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Proto\Parameters\GetParameterDefinitionRequest;
use Proto\Parameters\ParameterDefinitionServiceClient;

class ParameterDefinitionItemApiController extends Controller
{
    public function __construct(
        private readonly ParameterDefinitionServiceClient $client
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $req = new GetParameterDefinitionRequest;
        $req->setId($id);

        [$res, $status] = $this->client->GetParameterDefinition($req)->wait();

        if ($status->code !== 0) {
            return response()->json(['error' => $status->details], 500);
        }

        $parameter = $res;

        return response()->json([
            'id' => $parameter->getId(),
            'domain_id' => $parameter->getDomainId(),
            'parameter_name' => $parameter->getParameterName(),
            'is_effective_date_driven' => $parameter->getIsEffectiveDateDriven(),
            'attribute1_name' => $parameter->getAttribute1Name(),
            'attribute2_name' => $parameter->getAttribute2Name(),
            'attribute3_name' => $parameter->getAttribute3Name(),
            'attribute4_name' => $parameter->getAttribute4Name(),
            'attribute5_name' => $parameter->getAttribute5Name(),
        ]);
    }
}
