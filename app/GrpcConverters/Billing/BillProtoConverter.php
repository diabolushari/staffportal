<?php

namespace App\GrpcConverters\Billing;


use App\GrpcConverters\Connection\ConnectionProtoConverter;
use Proto\Bill\BillMessage;

class BillProtoConverter
{


    /**
     * @return array<string, mixed>
     */
    public static function convertToArray(BillMessage $bill): array
    {
        $demands = [];
        foreach ($bill->getDemands() as $demand) {
            $demands[] = DemandProtoConverter::convertToArray($demand);
        }
        $connection = ConnectionProtoConverter::convertToArray($bill->getConnection());

        return [
            'bill_id' => $bill->getBillId(),
            'connection_id' => $bill->getConnectionId(),
            'reading_year_month' => $bill->getReadingYearMonth(),
            'bill_year_month' => $bill->getBillYearMonth(),
            'bill_date' => $bill->getBillDate() ? $bill->getBillDate() : null,
            'due_date' => $bill->getDueDate() ? $bill->getDueDate() : null,
            'dc_date' => $bill->getDcDate() ? $bill->getDcDate() : null,
            'bill_amount' => $bill->getBillAmount(),
            'remarks' => $bill->getRemarks(),
            'created_ts' => $bill->getCreatedTs(),
            'created_by' => $bill->getCreatedBy(),
            'deleted_ts' => $bill->getDeletedTs(),
            'deleted_by' => $bill->getDeletedBy(),
            'demands' => $demands,
            'connection' => $connection,
        ];
    }
}
