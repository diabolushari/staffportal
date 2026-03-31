<?php


declare(strict_types=1);

namespace App\GrpcConverters\Billing;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use Proto\BillGenerationJob\BillGenerationJobStatusMessage;

class BillGenerationJobStatusConverter
{
    public static function convertToArray(?BillGenerationJobStatusMessage $billJobGenerationStatus): array
    {

        if (!$billJobGenerationStatus) {
            return [];
        }

        return [
            'version_id' => $billJobGenerationStatus->getVersionId(),
            'connection_id' => $billJobGenerationStatus->getConnectionId(),
            'bill_generation_job_id' => $billJobGenerationStatus->getBillGenerationJobId(),
            'bill_id' => $billJobGenerationStatus->getBillId(),
            'status' => $billJobGenerationStatus->getStatus(),
            'is_exception' => $billJobGenerationStatus->getIsException(),
            'job_started_ts' => $billJobGenerationStatus->getJobStartedTs(),
            'job_completed_ts' => $billJobGenerationStatus->getJobCompletedTs(),
            'exception' => $billJobGenerationStatus->getException() ? $billJobGenerationStatus->getException() : '',
            'connection' => $billJobGenerationStatus->getConnection() ? ConnectionProtoConverter::convertToArray($billJobGenerationStatus->getConnection()) : null,
            'bill' => $billJobGenerationStatus->getBill() ? BillProtoConverter::convertToArray($billJobGenerationStatus->getBill()) : null,
            'bill_generation_job' => $billJobGenerationStatus->getBillGenerationJob() ? BillGenerationJobConverter::convertStatusProtoToArray($billJobGenerationStatus->getBillGenerationJob()) : null,
        ];
    }
}
