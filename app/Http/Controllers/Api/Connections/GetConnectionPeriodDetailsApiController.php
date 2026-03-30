<?php

namespace App\Http\Controllers\Api\Connections;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionPeriodDetailsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GetConnectionPeriodDetailsApiController extends Controller
{
    public function __construct(
        private readonly ConnectionPeriodDetailsService $connectionPeriodDetailsService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'connection_id' => ['required', 'integer'],
            'meter_ids' => ['required', 'array'],
            'meter_ids.*' => ['integer'],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
        ]);

        $response = $this->connectionPeriodDetailsService->getConnectionPeriodDetails(
            (int) $validated['connection_id'],
            $validated['meter_ids'] ?? [],
            $validated['start_date'] ?? null,
            $validated['end_date'] ?? null,
        );

        if ($response->validationErrors !== []) {
            throw ValidationException::withMessages($response->validationErrors);
        }

        if ($response->statusCode != 0) {
            return response()->json([
                'success' => false,
                'message' => $response->statusDetails,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $response->data,
        ]);
    }
}
