<?php


namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\PurposeInfoFormRequest;
use App\Services\Connection\PurposeInfoService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class PurposeInfoController extends Controller
{

    public function __construct(
        private PurposeInfoService $purposeInfoService,
        private ParameterValueService $parameterValueService
    ) {}

    public function index(Request $request): Response
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $search = $request->input('search');
        $orderBy = $request->input('sort_by');
        $orderDirection = $request->input('sort_direction', 'asc');
        $purposeId = $request->input('purpose_id');
        $tariffId = $request->input('tariff_id');
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        $purposeInfoList = $this->purposeInfoService->listPaginatedPurposeInfo($page, $pageSize, $search, $orderBy, $orderDirection, $purposeId, $tariffId, $fromDate, $toDate);
        $paginatedPuropseInfo = null;
        if ($purposeInfoList->data) {
            $paginatedPuropseInfo = new LengthAwarePaginator(
                $purposeInfoList->data['purposeInfo'],
                $purposeInfoList->data['total'],
                $purposeInfoList->data['pageSize'],
                $purposeInfoList->data['page'],
                ['path' => request()->url()]
            );
        }
        $olfPurpse  = null;
        $oldTariff = null;
        if ($purposeId) {
            $olfPurpse = $this->parameterValueService->getParameterValue($purposeId, null);
        }
        if ($tariffId) {
            $oldTariff = $this->parameterValueService->getParameterValue($tariffId, null);
        }
        return Inertia::render('PurposeInfo/PurposeInfoIndexPage', [
            'purposeInfo' => $paginatedPuropseInfo,
            'oldPurpose' => $olfPurpse->data ?? null,
            'oldTariff' => $oldTariff->data ?? null,
            'oldFromDate' => $fromDate,
            'oldToDate' => $toDate,
        ]);
    }

    public function create(): Response
    {

        return Inertia::render('PurposeInfo/PurposeInfoCreatePage');
    }

    public function store(PurposeInfoFormRequest $request): RedirectResponse
    {
        $response = $this->purposeInfoService->createPurposeInfoWithMultiplePurpose($request);
        if ($response->hasValidationError()) {
            return $response->error ?? back()->with(['error' => 'Something went wrong']);
        }
        if ($response->statusCode !== 0) {
            return back()->with(['error' => $response->error ?? 'Something went wrong']);
        }
        return redirect()->route('tariff-mappings.index')->with(['message' => 'Purpose Info created successfully']);
    }

    public function edit(int $id): Response
    {
        $purposeInfo = $this->purposeInfoService->getPurposeInfoById($id);
        return Inertia::render('PurposeInfo/PurposeInfoCreatePage', [
            'purposeInfo' => $purposeInfo->data,
        ]);
    }

    public function update(PurposeInfoFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->purposeInfoService->updatePurposeInfo($request);
        if ($response->hasValidationError()) {
            return $response->error ?? back()->with(['error' => 'Something went wrong']);
        }
        if ($response->statusCode !== 0) {
            return back()->with(['error' => $response->error ?? 'Something went wrong']);
        }
        return redirect()->route('tariff-mappings.index')->with(['message' => 'Purpose Info updated successfully']);
    }


    public function destroy(int $id): RedirectResponse
    {
        $response = $this->purposeInfoService->deletePurposeInfo($id);
        if ($response->hasValidationError()) {
            return $response->error ?? back()->with(['error' => 'Something went wrong']);
        }
        if ($response->statusCode !== 0) {
            return back()->with(['error' => $response->error ?? 'Something went wrong']);
        }
        return redirect()->route('tariff-mappings.index')->with(['message' => 'Purpose Info deleted successfully']);
    }
}
