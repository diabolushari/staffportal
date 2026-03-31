<?php

namespace App\Http\Controllers\Calendar;

use App\Http\Controllers\Controller;
use App\Http\Requests\Calendar\CalendarUpdateFormRequest;
use App\Services\Calendar\CalendarDayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class CalendarDayController extends Controller
{
    public function __construct(
        private CalendarDayService $calendarService
    ) {}

    /**
     * List calendar with pagination
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $pageNumber = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        $fromDate = $request->input('fromDate');
        $toDate = $request->input('toDate');

        $response = $this->calendarService->listCalendarPaginated(
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            fromDate: $fromDate,
            toDate: $toDate
        );

        if ($response->hasValidationError()) {
            return redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        $paginated = new LengthAwarePaginator(
            $response->data['data'] ?? [],
            $response->data['total_count'] ?? 0,
            $response->data['page_size'] ?? $pageSize,
            $response->data['page_number'] ?? $pageNumber,
            ['path' => request()->url()]
        );

        return Inertia::render('Calendar/CalendarDayList', [
            'calendar' => $paginated,
            'filters' => [
                'fromDate' => $fromDate,
                'toDate' => $toDate,
            ],
        ]);
    }

    /**
     * Update calendar row (holiday/weekend/remarks)
     */
    public function update(CalendarUpdateFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->calendarService->updateCalendar($id, $request);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back();
        }

        return redirect()->back()->with('message', 'Calendar updated successfully');
    }
}
