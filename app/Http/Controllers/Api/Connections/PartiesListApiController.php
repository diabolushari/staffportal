<?php

namespace App\Http\Controllers\Api\Connections;

use App\Http\Controllers\Controller;
use App\Services\Parties\PartyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartiesListApiController extends Controller
{
    public function __construct(private PartyService $partyService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->query('search');
        $parties = $this->partyService->getParties($query);

        return response()->json($parties->data);
    }
}
