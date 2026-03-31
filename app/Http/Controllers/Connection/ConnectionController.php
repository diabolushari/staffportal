<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionFormRequest;
use App\Services\Connection\ConnectionFormItemService;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Consumers\OfficeService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    public function __construct(
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ConsumerService $consumerService,
        private readonly OfficeService $officeService

    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 5;
        $consumerNumber = $request->input('consumer_number') ?? null;
        $officeCode = $request->input('office_code') ?? null;
        $consumerLegacyCode = $request->input('consumer_legacy_code') ?? null;
        $consumerName = $request->input('consumer_name') ?? null;
        $organisationName = $request->input('organisation_name') ?? null;
        $connectionTypeId = $request->input('connection_type_id') ?? null;
        $tariffId = $request->input('tariff_id') ?? null;
        $fromDate = $request->input('from_date') ?? null;
        $toDate = $request->input('to_date') ?? null;
        $primaryPhone = $request->input('primary_phone') ?? null;

        $connections = $this->connectionService->listPaginatedConnections(
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            consumerNumber: $consumerNumber,
            officeCode: $officeCode,
            consumerLegacyCode: $consumerLegacyCode,
            consumerName: $consumerName,
            organisationName: $organisationName,
            connectionTypeId: $connectionTypeId,
            tariffId: $tariffId,
            fromDate: $fromDate,
            toDate: $toDate,
            primaryPhone: $primaryPhone,
        );
        if ($connections->hasValidationError()) {
            return $connections->error ?? redirect()->back()->withErrors([
                'message' => $connections->statusDetails ?? 'Unknown error',
            ]);
        }
        $paginated = null;

        if (! empty($connections->data)) {
            $paginated = new LengthAwarePaginator(
                $connections->data['connections'],
                $connections->data['total_count'],
                $connections->data['page_size'],
                $connections->data['page_number'],
                ['path' => request()->url()]
            );
        }

        $connectionTypes = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'Connection Type'
        )->data;
       
        $tariffs = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'Tariff'
        )->data;

         $office = null;

        if ($officeCode) {
            $office = $this->officeService->getOffice(null, $officeCode)->data;
        }

        return Inertia::render('Connections/ConnectionsIndex', [
            'connections' => $paginated,
            'connectionTypes' => $connectionTypes,
            'tariffs' => $tariffs,
            'oldConsumerNumber' => $consumerNumber,
            'oldOffice' => $office ?? null,
            'oldConnectionTypeId' => $connectionTypeId,
            'oldTariffId'         => $tariffId,
            'oldFromDate' => $fromDate,
            'oldToDate' => $toDate,
            'oldConsumerName' => $consumerName,
            'oldOrganisationName' => $organisationName,
            'oldConsumerLegacyCode' => $consumerLegacyCode,
            'oldPrimaryPhone' => $primaryPhone,
        ]);
    }

    public function create(): Response|RedirectResponse
    {

        $formItems = (new ConnectionFormItemService($this->parameterValueService))();

        return Inertia::render('Connections/ConnectionsForm', $formItems);
    }

    public function store(CreateConnectionFormRequest $request): RedirectResponse
    {
        $response = $this->connectionService->createConnection($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to create connection');
        }
        $connection = $response->data;

        return redirect()->route('connection.consumer', $connection['connection_id'])
            ->with('message', 'Connection created successfully');
    }

    public function show(int $id): Response|RedirectResponse
    {
        $connection = $this->connectionService->getConnection($id);
        $indicators = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'Indicators',
            'attribute1Value',
            'Connection'
        );
        $generationTypes = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'Generation Type'
        );
        $primaryPurposes = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'Primary Purpose'
        );
        $greenEnergyTypes = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'Green Energy Type'
        );
        $agreementAuthorities = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'Agreement Authority'
        );
        if ($connection->hasValidationError()) {
            if ($connection->error) {
                return $connection->error;
            } else {
                return redirect()->back()->with('error', 'Failed to get connection');
            }
        }

        $consumer = $this->consumerService->getConsumer($id);
        $consumerExist = ! $consumer->hasValidationError() && $consumer->data !== null;

        return Inertia::render('Connections/ConnectionsShow', [
            'connection' => $connection->data,
            'consumerExist' => $consumerExist,
            'indicators' => $indicators->data,
            'generationTypes' => $generationTypes->data,
            'primaryPurposes' => $primaryPurposes->data,
            'greenEnergyTypes' => $greenEnergyTypes->data,
            'agreementAuthorities' => $agreementAuthorities->data,
        ]);
    }

    public function edit(int $id): Response|RedirectResponse
    {

        $connection = $this->connectionService->getConnection($id);

        return Inertia::render('Connections/ConnectionsForm', [
            'connection' => $connection->data,
            ...(new ConnectionFormItemService($this->parameterValueService))(),
        ]);
    }

    public function update(CreateConnectionFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->connectionService->updateConnection($request, $id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connections.show', $id)->with([
            'message' => 'Connection updated successfully.',
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->connectionService->deleteConnection($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connections.index')->with('success', 'Connection deleted successfully.');
    }
}
