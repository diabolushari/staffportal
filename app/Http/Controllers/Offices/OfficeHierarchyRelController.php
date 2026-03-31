<?php

namespace App\Http\Controllers\Offices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Offices\OfficeHierarchyForm;
use App\Services\Offices\OfficeHierarchyRelService;
use Illuminate\Http\RedirectResponse;

class OfficeHierarchyRelController extends Controller
{
    public function __construct(private OfficeHierarchyRelService $officeHierarchyRelService) {}

    public function store(OfficeHierarchyForm $request): RedirectResponse
    {
        $response = $this->officeHierarchyRelService->createOfficeHierarchyRel(
            $request
        );
        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->back()->with('success', 'Office hierarchy relationship created successfully');
    }

    public function update(OfficeHierarchyForm $request, int $id): RedirectResponse
    {
        $response = $this->officeHierarchyRelService->updateOfficeHierarchyRel($request, $id);
        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->back()->with('success', 'Office hierarchy relationship updated successfully');
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->officeHierarchyRelService->deleteOfficeHierarchyRel($id);
        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->back()->with('success', 'Office hierarchy relationship deleted successfully');
    }
}
