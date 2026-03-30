<?php

namespace App\GrpcConverters\SecurityDeposit;

use Proto\Consumers\SdBalanceSummaryMessage;

class SdBalanceSummaryConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertToArray(?SdBalanceSummaryMessage $sdBalanceSummary): ?array
    {
        if ($sdBalanceSummary === null) {
            return null;
        }

        return [
            'sd_balance_id' => $sdBalanceSummary->getSdBalanceId(),
            'connection_id' => $sdBalanceSummary->getConnectionId(),
            'period_from' => $sdBalanceSummary->getPeriodFrom(),
            'period_to' => $sdBalanceSummary->hasPeriodTo() ? $sdBalanceSummary->getPeriodTo() : null,
            'sd_principal_required' => $sdBalanceSummary->getSdPrincipalRequired(),
            'sd_principal_on_file' => $sdBalanceSummary->getSdPrincipalOnFile(),
            'sd_principal_variance' => $sdBalanceSummary->getSdPrincipalVariance(),
            'interest_accrued' => $sdBalanceSummary->getInterestAccrued(),
            'tds_deducted' => $sdBalanceSummary->getTdsDeducted(),
            'net_interest_payable' => $sdBalanceSummary->getNetInterestPayable(),
            'remarks' => $sdBalanceSummary->hasRemarks() ? $sdBalanceSummary->getRemarks() : null,
            'last_updated_by_demand' => $sdBalanceSummary->hasLastUpdatedByDemand() ? $sdBalanceSummary->getLastUpdatedByDemand() : null,
            'last_updated_by_collection' => $sdBalanceSummary->hasLastUpdatedByCollection() ? $sdBalanceSummary->getLastUpdatedByCollection() : null,
            'created_by' => $sdBalanceSummary->getCreatedBy(),
            'updated_by' => $sdBalanceSummary->getUpdatedBy(),
            'sd_demand' => $sdBalanceSummary->hasSdDemand() ? SdDemandConverter::convertToArray($sdBalanceSummary->getSdDemand()) : null,
            'sd_collection' => $sdBalanceSummary->hasSdCollection() ? SdCollectionConverter::convertToArray($sdBalanceSummary->getSdCollection()) : null,
            'available_cash_balance' => $sdBalanceSummary->hasAvailableCashBalance() ? $sdBalanceSummary->getAvailableCashBalance() : null,
        ];
    }
}
