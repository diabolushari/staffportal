<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Consumers\OfficeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetOfficeByIdApiController extends Controller
{
    public function __construct(private OfficeService $officeService) {}

    public function __invoke(Request $request, int $officeId): JsonResponse
    {
        if ($officeId !== 0) {
            $office = $this->officeService->getOffice($officeId, null);

            return response()->json($office);
        }

        return response()->json(null);
    }
}
