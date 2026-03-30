<?php

namespace App\Http\Controllers\Api\ChargeHeadDefinition;

use App\Http\Controllers\Controller;
use App\Services\Billing\ChargeHeadDefinitionService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class GetChargeHeadDefinitionController extends Controller
{
    public function __construct(
        private readonly ChargeHeadDefinitionService $chargeHeadDefinition
    ) {}

    public function __invoke(Request $request): ?JsonResponse
    {
        $category = $request->input('category');

        $chargeHeadDefinition = $this->chargeHeadDefinition->listChargeHeadByCategory($category)->data;

        return response()->json($chargeHeadDefinition);
    }
}
