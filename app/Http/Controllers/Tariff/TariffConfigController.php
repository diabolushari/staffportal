<?php

namespace App\Http\Controllers\Tariff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\TariffConfigFormRequest;
use App\Http\Requests\Tariff\TariffConfigUpdateFormRequest;
use App\Services\Parameters\ParameterValueService;
use App\Services\Tariff\TariffConfigService;
use App\Services\Tariff\TariffOrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class TariffConfigController extends Controller
{
    public function __construct(
        private TariffOrderService $tariffOrderService,
        private ParameterValueService $parameterValueService,
        private TariffConfigService $tariffConfigService
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $pageNumber = $request->input('pageNumber');
        $pageSize = $request->input('pageSize');
        $tariffOrderId = $request->input('tariffOrderId');

        $response = $this->tariffConfigService->listPaginatedTariffConfigs($pageNumber, $pageSize, $tariffOrderId);
        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', $response->error ?? 'Unknown error');
        }

        $paginatedData = null;
        if (! empty($response->data)) {
            $paginatedData = new LengthAwarePaginator(
                $response->data['tariff_configs'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('TariffConfig/TariffConfigIndexPage', [
            'filters' => [
                'search' => '',
                'sort' => '',
                'sortBy' => '',
            ],
            'tariff_configs' => $paginatedData,
        ]);
    }

    public function create(Request $request, int $tariffOrderId): Response
    {
        $tariffOrder = $this->tariffOrderService->getTariffOrder($tariffOrderId);

        $connectionTariff = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );

        return Inertia::render('TariffConfig/TariffConfigCreatePage', [
            'tariff_order' => $tariffOrder->data,
            'connection_tariffs' => $connectionTariff->data,
        ]);
    }

    public function store(TariffConfigFormRequest $request): RedirectResponse
    {
        $response = $this->tariffConfigService->createTariffConfig($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back();
        }
        if ($response->statusCode !== 0) {
            return redirect()->back();
        }


        return redirect()->route('tariff-orders.show', $request->tariffOrderId)->with('message', 'Tariff config added successfully');
    }

    public function show(Request $request): Response
    {
        return Inertia::render('TariffConfig/TariffConfigShowPage');
    }

    public function edit(Request $request, int $id): Response
    {
        $tariffOrder = $this->tariffOrderService->listTariffOrders();

        $consumptionTariff = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );

        $tariffConfig = $this->tariffConfigService->getTariffConfig($id);

        return Inertia::render('TariffConfig/TariffConfigEditPage', [
            'tariff_orders' => $tariffOrder->data['tariff_orders'] ?? [],
            'consumption_tariffs' => $consumptionTariff->data,
            'tariff_config' => $tariffConfig->data,
        ]);
    }

    public function update(TariffConfigFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->tariffConfigService->updateTariffConfig($request, $id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back();
        }
        if ($response->statusCode !== 0) {
            return redirect()->back();
        }

        return redirect()->route('tariff-orders.show', $request->tariffOrderId)
            ->with('message', 'Tariff config updated successfully');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $response = $this->tariffConfigService->deleteTariffConfig($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back();
        }

        return redirect()->back()->with('message', 'Tariff config deleted successfully');
    }
}
