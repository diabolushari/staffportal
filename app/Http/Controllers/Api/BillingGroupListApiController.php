<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillingGroup;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingGroupListApiController extends Controller
{

    public function __construct(private BillingGroupService $billingGroupService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $search = $request->query('q');
        $billingGroups = $this->billingGroupService->listBillingGroups($search);
        return response()->json($billingGroups->data);
    }
}
