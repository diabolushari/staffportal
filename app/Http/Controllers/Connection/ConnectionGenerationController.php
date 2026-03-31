<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionGenerationTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConnectionGenerationController extends Controller
{
    public function __construct(
        private ConnectionGenerationTypeService $connectionGenerationTypeService,
    ) {}

    public function update(Request $request, int $connectionId): RedirectResponse
    {
        $response = $this->connectionGenerationTypeService->update($connectionId, $request->input('generation_types'));

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connections.show', $connectionId)->with('message', 'Connection generation type updated successfully.');
    }
}
