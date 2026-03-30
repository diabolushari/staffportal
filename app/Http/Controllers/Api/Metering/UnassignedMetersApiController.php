<?php

namespace App\Http\Controllers\Api\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class UnassignedMetersApiController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $pageSize = (int) $request->query('page_size', 10);
        $search = $request->query('search');

        $response = $this->meterService->listUnassignedMeters(
            $page,
            $pageSize,
            $search
        );

        if ($response->hasValidationError()) {
            return response()->json(['success' => false, 'message' => $response->error]);
        }

        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['meters'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => $request->url()]
            );
        }

        return response()->json([
            'success' => true,
            'data' => $paginated ?? null,
            'message' => 'Meters fetched successfully',
        ]);
    }
}
