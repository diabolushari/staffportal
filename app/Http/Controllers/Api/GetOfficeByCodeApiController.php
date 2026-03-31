<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Consumers\OfficeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetOfficeByCodeApiController extends Controller
{
    public function __construct(private OfficeService $officeService) {}

    public function __invoke(Request $request, int $office_code): JsonResponse
    {
        $office = $this->officeService->getOffice(null, $office_code);

        return response()->json($office->data);
    }
}
