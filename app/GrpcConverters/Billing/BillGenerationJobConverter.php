<?php

declare(strict_types=1);

namespace App\GrpcConverters\Billing;

use App\GrpcConverters\BillingGroup\BillingGroupProtoConvertor;
use Proto\BillGenerationJob\BillGenerationJobMessage;
use App\GrpcConverters\Billing\BillGenerationJobStatusConverter;
use Proto\BillGenerationJob\BillGenerationJobForStatusMessage;

class BillGenerationJobConverter
{

    public static function convertToArray(?BillGenerationJobMessage $billGenerationJob): array
    {

        if (!$billGenerationJob) {
            return [];
        }
        $billGenerationJobStatusArray = [];
        foreach ($billGenerationJob->getBillGenerationJobStatus() as $billGenerationJobStatus) {
            $billGenerationJobStatus = BillGenerationJobStatusConverter::convertToArray($billGenerationJobStatus);
            $billGenerationJobStatusArray[] = $billGenerationJobStatus;
        }

        return [
            'id' => $billGenerationJob->getId(),
            'reading_year_month' => $billGenerationJob->getReadingYearMonth(),
            'billing_group_id' => $billGenerationJob->getBillingGroupId(),
            'bill_year_month' => $billGenerationJob->getBillYearMonth(),
            'initialized_date' => $billGenerationJob->getInitializedDate(),
            'billing_group' => BillingGroupProtoConvertor::convertToArray($billGenerationJob->getBillingGroup()),
            'bill_generation_job_status' => $billGenerationJobStatusArray,
            'total_connections' => $billGenerationJob->getTotalConnections(),
            'total_bills' => $billGenerationJob->getTotalBills(),
            'total_exceptions' => $billGenerationJob->getTotalExceptions(),
            'total_pending' => $billGenerationJob->getTotalPending(),
        ];
    }

    public static function convertStatusProtoToArray(?BillGenerationJobForStatusMessage $billGenerationJob): array
    {

        if (!$billGenerationJob) {
            return [];
        }

        return [
            'id' => $billGenerationJob->getId(),
            'reading_year_month' => $billGenerationJob->getReadingYearMonth(),
            'billing_group_id' => $billGenerationJob->getBillingGroupId(),
            'bill_year_month' => $billGenerationJob->getBillYearMonth(),
            'initialized_date' => $billGenerationJob->getInitializedDate(),
            'billing_group' => BillingGroupProtoConvertor::convertToArray($billGenerationJob->getBillingGroup()),
            'total_connections' => $billGenerationJob->getTotalConnections(),
            'total_bills' => $billGenerationJob->getTotalBills(),
            'total_exceptions' => $billGenerationJob->getTotalExceptions(),
            'total_pending' => $billGenerationJob->getTotalPending(),
        ];
    }
}
