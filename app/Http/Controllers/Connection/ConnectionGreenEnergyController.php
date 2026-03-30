<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Connections\ConnectionGreenEnergyFormRequest;
use App\Services\Connection\ConnectionGreenEnergyService;

class ConnectionGreenEnergyController extends Controller
{
    public function __construct(
        private readonly ConnectionGreenEnergyService $connectionGreenEnergyService,
    ) {}

    public function __invoke(ConnectionGreenEnergyFormRequest $request)
    {
         
        if ($request->id) {
        
        $response = $this->connectionGreenEnergyService
            ->update($request, $request->id);

        $message = 'Green energy updated successfully';
    } else {
        
        $response = $this->connectionGreenEnergyService
            ->create($request);

        $message = 'Green energy created successfully';
    }


        //$response = $this->connectionGreenEnergyService->create($request);

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return back()->with('message',  $message);
    }

    public function update(ConnectionGreenEnergyFormRequest $request, int $id)
    {
        $response = $this->connectionGreenEnergyService->update($request, $id);

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return back()->with('message', 'Green energy updated successfully');
    }
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->connectionGreenEnergyService->deleteGreenEnergy($id);

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors([
                'error' => 'Error deleting green energy: ' . ($response->statusDetails ?? 'Unknown error'),
            ]);
        }

        return redirect()->back()->with('message', 'Green energy deleted successfully.');
    }


}
