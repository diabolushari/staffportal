<?php

namespace App\Http\Controllers\Api\Connections;

use App\Http\Controllers\Controller;
use App\Services\Connection\PurposeInfoService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetPurposeInfoApiController extends Controller
{
    public function __construct(
        private PurposeInfoService $purposeInfoService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $date = $request->query('date') ?? Carbon::now()->format('Y-m-d');
        $purposeId = $request->query('purpose_id');
        $purposeInfo = $this->purposeInfoService->getTariffWithPurposeAndDate($purposeId, $date);
        return response()->json($purposeInfo->data);
    }
}
