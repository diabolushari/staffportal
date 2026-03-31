<?php

namespace App\Http\Controllers\Api\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterTransformerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class UnassignedTransformersApiController extends Controller
{
    public function __construct(
        private readonly MeterTransformerService $transformerService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $pageSize = (int) $request->query('page_size', 10);
        $search = $request->query('search');
        $typeId = $request->query('type_id') ? (int) $request->query('type_id') : null;

        $response = $this->transformerService->listUnassignedTransformersPaginated(
            $page,
            $pageSize,
            $search,
            $typeId
        );

        if ($response->hasValidationError()) {
            return response()->json(['success' => false, 'message' => $response->error]);
        }

        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['transformers'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => $request->url()]
            );
        }

        return response()->json([
            'success' => true,
            'data' => $paginated ?? null,
            'message' => 'Transformers fetched successfully',
        ]);
    }
}
