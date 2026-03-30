<?php

namespace App\Http\Controllers\SecurityDeposit\Consumer;

use App\Http\Controllers\Controller;
use App\Services\SecurityDeposit\SdRegisterService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class SDRegisterByConnection extends Controller
{
    public function __construct(
        private readonly SdRegisterService $sdRegisterService,
    ) {}

    public function __invoke(int $connectionId, Request $request)
    {
        $sdTypeId = $request->input('sd_type_id');
        $occupancyTypeId = $request->input('occupancy_type_id');
        $periodFrom = $request->input('period_from');
        $periodTo = $request->input('period_to');
        $pageNumber = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $sdRegisters = $this->sdRegisterService->listPaginatedSdRegisters($connectionId, $sdTypeId, $occupancyTypeId, $periodFrom, $periodTo, $pageNumber, $pageSize);
        $paginated = null;

        if (! empty($sdRegisters->data)) {
            $paginated = new LengthAwarePaginator(
                $sdRegisters->data['sd_registers'],
                $sdRegisters->data['total_count'],
                $sdRegisters->data['page_size'],
                $sdRegisters->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return response()->json($paginated);
    }
}
