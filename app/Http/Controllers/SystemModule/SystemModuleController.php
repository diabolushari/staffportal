<?php

namespace App\Http\Controllers\SystemModule;

use App\Http\Controllers\Controller;
use App\Http\Requests\SystemModule\SystemModuleFormRequest;
use App\Services\SystemModule\SystemModuleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SystemModuleController extends Controller
{
    public function __construct(private SystemModuleService $systemModuleService) {}

    public function index(): InertiaResponse|RedirectResponse
    {
        $response = $this->systemModuleService->getSystemModules(page: 1, pageSize: 5);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch system modules.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return Inertia::render('SystemModules/SystemModuleIndex', [
            'systemModules' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function store(SystemModuleFormRequest $request): RedirectResponse
    {
        $response = $this->systemModuleService->createSystemModule($request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to create system module.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'System Module created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(SystemModuleFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->systemModuleService->updateSystemModule($request, $id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to update system module.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'System Module updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->systemModuleService->deleteSystemModule($id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to delete system module.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->back()->with([
            'message' => 'System Module deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
