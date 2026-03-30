<?php

namespace App\Http\Controllers\Api\Tariff;

use App\Http\Controllers\Controller;
use App\Services\Tariff\TariffOrderService;
use Illuminate\Http\Response;

class TariffOrderDownloadApiController extends Controller
{
    public function __construct(
        private TariffOrderService $tariffOrderService
    ) {}

    public function __invoke(int $id): Response
    {
        $file = $this->tariffOrderService->downloadTariffOrder($id);

        if (! $file->data) {
            abort(404, 'File not found');
        }

        $safeFilename = basename($file->data['file_name']);
        $safeFilename = preg_replace('/[^a-zA-Z0-9._-]/', '', $safeFilename);

        return response($file->data['contents'])
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="'.$safeFilename.'"')
            ->header('Content-Length', strlen($file->data['contents']));
    }
}
