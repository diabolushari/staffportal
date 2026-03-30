<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Connections\ConnectionGreenEnergyFormRequest;
use Proto\GreenEnergy\CreateGreenEnergyMessage;
use Proto\GreenEnergy\UpdateGreenEnergyMessage;
use Proto\GreenEnergy\GreenEnergyMessage;

class ConnectionGreenEnergyConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertToArray(?GreenEnergyMessage $greenEnergy): ?array
    {
        if ($greenEnergy === null) {
            return null;
        }

        return [
            'id' => $greenEnergy->getId(),
            'connection_id' => $greenEnergy->getConnectionId(),
            'green_energy_type_id' => $greenEnergy->getGreenEnergyTypeId(),
            'green_energy_type' => ParameterValueProtoConvertor::convertToArray($greenEnergy->getGreenEnergyType()),
            'agreement_authority_id' => $greenEnergy->getAgreementAuthorityId(),
            'agreement_authority' => ParameterValueProtoConvertor::convertToArray($greenEnergy->getAgreementAuthority()),
            'percentage' => $greenEnergy->getPercentage(),
            'remarks' => $greenEnergy->getRemarks(),
            'is_active' => $greenEnergy->getIsActive(),
            'effective_start' => $greenEnergy->getEffectiveStartTs(),
            'effective_end' => $greenEnergy->getEffectiveEndTs(),
            'created_by' => $greenEnergy->getCreatedBy() ?: null,
            'updated_by' => $greenEnergy->getUpdatedBy() ?: null,
        ];
    }

    public function formToGrpcMessage(ConnectionGreenEnergyFormRequest $request): CreateGreenEnergyMessage
    {
        $msg = new CreateGreenEnergyMessage;
        $msg->setConnectionId($request->connectionId);
        $msg->setGreenEnergyTypeId($request->greenEnergyTypeId);
        $msg->setAgreementAuthorityId($request->agreementAuthorityId);
        $msg->setPercentage($request->percentage);
        if ($request->effectiveStart != null) {

            $msg->setEffectiveStartTs($request->effectiveStart);
        }
        if ($request->effectiveEnd != null) {
            $msg->setEffectiveEndTs($request->effectiveEnd);
        }
        if ($request->remarks != null) {
            $msg->setRemarks($request->remarks);
        }
        $msg->setIsActive($request->isActive);

        return $msg;
    }

    public function formToGrpcUpdateMessage(ConnectionGreenEnergyFormRequest $request, int $id): UpdateGreenEnergyMessage
    {
        $msg = new UpdateGreenEnergyMessage;
        $msg->setId($id);
        $msg->setConnectionId($request->connectionId);
        $msg->setGreenEnergyTypeId($request->greenEnergyTypeId);
        $msg->setAgreementAuthorityId($request->agreementAuthorityId);
        $msg->setPercentage($request->percentage);
        if ($request->effectiveStart != null) {
            $msg->setEffectiveStartTs($request->effectiveStart);
        }
        if ($request->effectiveEnd != null) {
            $msg->setEffectiveEndTs($request->effectiveEnd);
        }
        if ($request->remarks != null) {
            $msg->setRemarks($request->remarks);
        }
        $msg->setIsActive($request->isActive);

        return $msg;
    }
}
