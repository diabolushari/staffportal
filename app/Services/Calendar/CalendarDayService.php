<?php

namespace App\Services\Calendar;

use App\Http\Requests\Calendar\CalendarUpdateFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Calendar\CalendarDayPaginatedListRequest;
use Proto\Calendar\CalendarDayPaginatedListResponse;
use Proto\Calendar\CalendarDayResponse;
use Proto\Calendar\CalendarDayServiceClient;
use Proto\Calendar\UpdateCalendarDayRequest;

class CalendarDayService
{
    private CalendarDayServiceClient $client;

    public function __construct()
    {
        $this->client = new CalendarDayServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listCalendarPaginated(
        ?int $pageNumber = 1,
        ?int $pageSize = 20,
        ?string $fromDate = null,
        ?string $toDate = null,
        ?string $sortBy = null,
        ?string $sortDirection = null
    ): GrpcServiceResponse {

        $grpcRequest = new CalendarDayPaginatedListRequest;

        if ($pageNumber) {
            $grpcRequest->setPageNumber($pageNumber);
        }

        if ($pageSize) {
            $grpcRequest->setPageSize($pageSize);
        }

        if ($fromDate) {
            $grpcRequest->setFromDate($fromDate);
        }

        if ($toDate) {
            $grpcRequest->setToDate($toDate);
        }

        if ($sortBy) {
            $grpcRequest->setSortBy($sortBy);
        }

        if ($sortDirection) {
            $grpcRequest->setSortDirection($sortDirection);
        }

        /** @var CalendarDayPaginatedListResponse $response */
        [$response, $status] =
            $this->client->ListCalendarPaginated($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->convertToPaginatedArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    /**
     * Update calendar row
     */
    public function updateCalendar(int $id, CalendarUpdateFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new UpdateCalendarDayRequest;
        $grpcRequest->setId($id);
        $grpcRequest->setIsHoliday($request->isHoliday);
        $grpcRequest->setIsWeekend($request->isWeekend);
        $grpcRequest->setRemarks($request->remarks ?? '');

        /** @var CalendarDayResponse $response */
        [$response, $status] =
            $this->client->UpdateCalendar($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->calendarMessageToArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    private function calendarMessageToArray(CalendarDayResponse $msg): array
    {
        return [
            'id' => $msg->getId(),
            'calendar_date' => $msg->getCalendarDate(),
            'is_holiday' => $msg->getIsHoliday(),
            'is_weekend' => $msg->getIsWeekend(),
            'day_of_week' => $msg->getDayOfWeek(),
            'day_of_year' => $msg->getDayOfYear(),
            'remarks' => $msg->getRemarks(),
        ];
    }

    private function convertToPaginatedArray(CalendarDayPaginatedListResponse $response): array
    {
        $rows = [];
        foreach ($response->getData() as $item) {
            $rows[] = $this->calendarMessageToArray($item);
        }

        return [
            'data' => $rows,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];
    }
}
