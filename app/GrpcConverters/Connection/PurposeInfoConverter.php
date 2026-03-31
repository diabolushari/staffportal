<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Connections\PurposeInfoFormRequest;
use Illuminate\Validation\ValidationException;
use Proto\Connections\MultiplePurpsesForTariffForm;
use Proto\Connections\PuropseInfoWithMulitplePurpseForm;
use Proto\Connections\PurposeInfoFormMessage;
use Proto\Connections\PurposeInfoMessage;

class PurposeInfoConverter
{


    public static function toArray(?PurposeInfoMessage $purposeInfoMessage): array|null
    {
        if ($purposeInfoMessage == null) {
            return null;
        }
        return [
            'id' => $purposeInfoMessage->getId(),
            'purpose_id' => $purposeInfoMessage->getPurposeId(),
            'tariff_id' => $purposeInfoMessage->getTariffId(),
            'is_non_dps' => $purposeInfoMessage->getIsNonDps(),
            'is_active' => $purposeInfoMessage->getIsActive(),
            'effective_start' => $purposeInfoMessage->getEffectiveStart(),
            'effective_end' => $purposeInfoMessage->getEffectiveEnd(),
            'created_by' => $purposeInfoMessage->getCreatedBy(),
            'updated_by' => $purposeInfoMessage->getUpdatedBy(),
            'deleted_by' => $purposeInfoMessage->getDeletedBy(),
            'created_ts' => $purposeInfoMessage->getCreatedTs(),
            'updated_ts' => $purposeInfoMessage->getUpdatedTs(),
            'deleted_ts' => $purposeInfoMessage->getDeletedTs(),
            'purpose' => ParameterValueProtoConvertor::convertToArray($purposeInfoMessage->getPurpose()),
            'tariff' => ParameterValueProtoConvertor::convertToArray($purposeInfoMessage->getTariff()),
            'tariff_name' => ParameterValueProtoConvertor::convertToArray($purposeInfoMessage->getTariff())['parameter_value'] ?? null
        ];
    }

    public static function toProto(PurposeInfoFormRequest $request): PurposeInfoFormMessage
    {
        $purposeInfoFormMessage = new PurposeInfoFormMessage();
        if ($request->id) {
            $purposeInfoFormMessage->setId($request->id);
        }
        if ($request->purposeId) {
            $purposeInfoFormMessage->setPurposeId($request->purposeId);
        } else {
            throw ValidationException::withMessages([
                'purpose_id' => ['Purpose is required'],
            ]);
        }

        $purposeInfoFormMessage->setTariffId($request->tariffId);

        $purposeInfoFormMessage->setIsNonDps($request->isNonDps);
        $purposeInfoFormMessage->setEffectiveStart($request->effectiveStart);
        if ($request->effectiveEnd) {
            $purposeInfoFormMessage->setEffectiveEnd($request->effectiveEnd);
        }
        return $purposeInfoFormMessage;
    }

    public static function multiplePurposeFormToProto(PurposeInfoFormRequest $request): MultiplePurpsesForTariffForm
    {
        $purposeInfoFormMessage = new MultiplePurpsesForTariffForm();
        if ($request->id) {
            $purposeInfoFormMessage->setId($request->id);
        }
        $purposeInfoFormMessage->setTariffId($request->tariffId);
        $purposeInfoFormMessage->setIsNonDps($request->isNonDps);
        $purposeInfoFormMessage->setEffectiveStart($request->effectiveStart);
        if ($request->effectiveEnd) {
            $purposeInfoFormMessage->setEffectiveEnd($request->effectiveEnd);
        }
        $purposes = [];
        if ($request->mulitplePurposes) {
            foreach ($request->mulitplePurposes as $purpose) {
                $purposes[] = $purpose;
            }
        } else {
            throw ValidationException::withMessages([
                'mulitple_purposes' => ['Purpose is required'],
            ]);
        }
        $purposeInfoFormMessage->setPurposeIds($purposes);
        return $purposeInfoFormMessage;
    }
}
