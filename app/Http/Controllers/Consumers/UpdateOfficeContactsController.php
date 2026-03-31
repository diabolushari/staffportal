<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Offices\UpdateOfficeContactsData;
use App\Services\Consumers\OfficeService;
use Illuminate\Http\RedirectResponse;

class UpdateOfficeContactsController extends Controller
{
    public function __construct(
        private readonly OfficeService $officeService,
    ) {}

    public function __invoke(UpdateOfficeContactsData $data): RedirectResponse
    {
        $response = $this->officeService->updateOfficeContactFolio($data);

        if ($response->hasValidationError() && $response->error !== null) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Office contacts updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
