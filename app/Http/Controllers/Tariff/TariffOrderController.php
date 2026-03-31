<?php

namespace App\Http\Controllers\Tariff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\TariffOrderFormRequest;
use App\Http\Requests\Tariff\TariffOrderUpdateFormRequest;
use App\Services\Parameters\ParameterValueService;
use App\Services\Tariff\TariffConfigService;
use App\Services\Tariff\TariffOrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class TariffOrderController extends Controller
{
    public function __construct(
        private readonly TariffOrderService $tariffOrderService,
        private readonly TariffConfigService $tariffConfigService
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $orderDescriptor = $request->input('search') ?? null;
        $orderBy = $request->input('order_by') ?? null;
        $orderDirection = $request->input('order_direction') ?? null;

        $response = $this->tariffOrderService->listTariffOrders(
            $pageNumber,
            $pageSize,
            $orderBy,
            $orderDescriptor,
            $orderDirection
        );
        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['tariff_orders'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return Inertia::render('TariffOrder/TariffOrderIndexPage', [
            'tariffOrders' => $paginated ?? [],
            'filters' => [
                'search' => $orderDescriptor,
                'order_by' => $orderBy,
                'order_direction' => $orderDirection,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('TariffOrder/TariffOrderCreatePage');
    }

    public function store(TariffOrderFormRequest $request): RedirectResponse
    {
        $response = $this->tariffOrderService->createTariffOrder($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to create tariff order');
        }

        return redirect()->route('tariff-orders.index');
    }

    public function show(int $id, Request $request, ParameterValueService $parameterValueService): Response|RedirectResponse
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 5;
        $response = $this->tariffOrderService->getTariffOrder($id);

        $connectionTariffId= $request->input('connection_tariff_id');
        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors([
                'message' => $response->error ?? $response->statusDetails ?? 'Unknown error',
            ]);
        }
        
        $tariffConfigs = $this->tariffConfigService->listPaginatedTariffConfigs(
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            tariffOrderId: $response->data['tariff_order_id'] ?? null,
            connectionTariffId: $connectionTariffId ?? null
        );

        $paginated = null;
        if (! empty($tariffConfigs->data)) {
            $paginated = new LengthAwarePaginator(
                $tariffConfigs->data['tariff_configs'],                // items for this page
                $tariffConfigs->data['total_count'],            // total items count
                $tariffConfigs->data['page_size'],              // items per page
                $tariffConfigs->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        $connectionTariffs = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );

        return Inertia::render('TariffOrder/TariffOrderShowPage', [
            'tariff_order' => $response->data,
            'tariff_configs' => $paginated ?? [],
            'connection_tariffs' => $connectionTariffs->data,
            'oldConnectionTariffId'=>$connectionTariffId,
        ]);
    }

    public function edit(int $id): Response|RedirectResponse
    {
        $response = $this->tariffOrderService->getTariffOrder($id);
        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return Inertia::render('TariffOrder/TariffOrderCreatePage', [
            'tariff_order' => $response->data,
        ]);
    }

    public function update(TariffOrderUpdateFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->tariffOrderService->updateTariffOrder($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to update tariff order');
        }

        return redirect()->route('tariff-orders.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->tariffOrderService->deleteTariffOrder($id);
        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', 'Failed to delete tariff order');
        }

        return redirect()->route('tariff-orders.index');
    }
}
