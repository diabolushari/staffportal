<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionFlagService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConnectionFlagController extends Controller
{
    public function __construct(
        private ConnectionFlagService $connectionFlagService
    ) {}

    public function update(Request $request, int $connectionId): RedirectResponse
    {
        $this->connectionFlagService->update($connectionId, $request->input('indicators'));
        return redirect()->back()->with('message', 'Connection flag updated successfully');
    }
}
