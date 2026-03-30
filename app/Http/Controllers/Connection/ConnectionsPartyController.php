<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\ConnectionPartiesMappingFormRequest;
use App\Services\Connection\ConnectionPartiesMappingService;
use Illuminate\Http\RedirectResponse;

class ConnectionsPartyController extends Controller
{
    public function __construct(
        private ConnectionPartiesMappingService $connectionPartiesMappingService,
    ) {}

    public function store(ConnectionPartiesMappingFormRequest $request): RedirectResponse
    {

        $response = $this->connectionPartiesMappingService->createConnectionPartiesMapping($request);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Failed to create connection parties mapping');
        }

        return redirect()->back()->with('success', 'Connection parties mapping created successfully.');
    }

    public function update(int $id, ConnectionPartiesMappingFormRequest $request): RedirectResponse
    {
        $response = $this->connectionPartiesMappingService->updateConnectionPartiesMapping($request, $id);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Failed to update connection parties mapping');
        }

        return redirect()->back()->with('success', 'Connection parties mapping updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->connectionPartiesMappingService->deleteConnectionPartiesMapping($id);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors($response->error ?? 'Failed to delete connection parties mapping');
        }

        return redirect()->back()->with('success', 'Connection parties mapping deleted successfully.');
    }
}
