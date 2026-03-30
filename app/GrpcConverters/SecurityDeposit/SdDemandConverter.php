<?php

namespace App\GrpcConverters\SecurityDeposit;

use App\GrpcConverters\Billing\ChargeHeadDefinitionConverter;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\SecurityDeposit\SdDemandFormRequest;
use Proto\Consumers\CreateSdDemandWithRegisterRequest;
use Proto\Consumers\SdDemandMessage;

class SdDemandConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertToArray(?SdDemandMessage $sdDemand): ?array
    {
        if ($sdDemand === null) {
            return null;
        }
        $collections = [];

        foreach ($sdDemand->getCollections() as $collection) {
            $collections[] = SdCollectionConverter::convertToArray($collection);
        }

        return [
            'sd_demand_id' => $sdDemand->getSdDemandId(),
            'connection_id' => $sdDemand->getConnectionId(),
            'charge_head_definition_id' => $sdDemand->getChargeHeadDefinitionId(),
            'demand_type_id' => $sdDemand->getDemandTypeId(),
            'demand_type' => $sdDemand->hasDemandType() ? ParameterValueProtoConvertor::convertToArray($sdDemand->getDemandType()) : null,
            'total_sd_amount' => $sdDemand->getTotalSdAmount(),
            'calculation_basic_id' => $sdDemand->hasCalculationBasic() ? $sdDemand->getCalculationBasicId() : null,
            'calculation_basic' => $sdDemand->hasCalculationBasic() ? ParameterValueProtoConvertor::convertToArray($sdDemand->getCalculationBasic()) : null,
            'charge_head_definition' => $sdDemand->hasChargeHeadDefinition() ?
                ChargeHeadDefinitionConverter::convertToArray($sdDemand->getChargeHeadDefinition()) :
                null,
            'collections' => $collections,
            'is_active' => $sdDemand->getIsActive(),
            'created_by' => $sdDemand->getCreatedBy(),
            'updated_by' => $sdDemand->getUpdatedBy(),
        ];
    }

    public function formToGrpcMessage(SdDemandFormRequest $request, ?int $id): SdDemandMessage
    {
        $msg = new SdDemandMessage;

        if ($id != null) {
            $msg->setSdDemandId($id);
        }

        $msg->setConnectionId($request->connectionId);
        $msg->setDemandTypeId($request->demandTypeId);
        if ($request->calculationBasicId != null) {
            $msg->setCalculationBasicId($request->calculationBasicId);
        }
        $msg->setTotalSdAmount($request->totalSdAmount);
        $msg->setApplicableFrom($request->applicableFrom);
        if ($request->applicableTo != null) {
            $msg->setApplicableTo($request->applicableTo);
        }
        $msg->setChargeHeadDefinitionId($request->chargeHeadDefinitionId);
        $msg->setIsActive($request->isActive);

        return $msg;
    }

    public function grpcToDemandRegisterCreateRequest(SdDemandFormRequest $sdDemand): CreateSdDemandWithRegisterRequest
    {
        $msg = new CreateSdDemandWithRegisterRequest;

        $msg->setConnectionId($sdDemand->connectionId);
        $msg->setDemandTypeId($sdDemand->demandTypeId);
        if ($sdDemand->calculationBasicId != null) {
            $msg->setCalculationBasicId($sdDemand->calculationBasicId);
        }
        $msg->setTotalSdAmount($sdDemand->totalSdAmount);
        $msg->setApplicableFrom($sdDemand->applicableFrom);
        if ($sdDemand->applicableTo != null) {
            $msg->setApplicableTo($sdDemand->applicableTo);
        }
        $msg->setChargeHeadDefinitionId($sdDemand->chargeHeadDefinitionId);
        $msg->setIsActive($sdDemand->isActive);

        return $msg;
    }
}
