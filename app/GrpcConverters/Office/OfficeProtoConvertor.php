<?php

namespace App\GrpcConverters\Office;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\Consumers\OfficeMessage;

class OfficeProtoConvertor
{
    /**
     * Convert MeterResponse proto to array.
     *
     * @return array{
     *    office_id: int,
     *    office_name: string,
     *    office_code: int,
     *    office_description: string,
     *    office_type_id: int|string,
     *    location_id: int,
     *    office_address_id: int,
     *    effective_start: string|null,
     *    effective_end: string|null,
     *    is_current: bool,
     *    created_at: string|null,
     *    updated_at: string|null,
     *    created_by: int|null,
     *    updated_by: int|null,
     *    contact_folio: array<string, mixed>|null,
     *    office_type: array{
     *        id: int|string,
     *        parameter_value: string,
     *        parameter_code: string,
     *        attribute1_value: string,
     *        attribute2_value: string,
     *        attribute3_value: string,
     *        attribute4_value: string,
     *        attribute5_value: string,
     *        is_active: bool,
     *        sort_priority: int,
     *        notes: string
     *    }|null
     * }|null
     */
    public static function convertToArray(?OfficeMessage $office): ?array
    {
        if ($office === null) {
            return null;
        }

        $contactFolio = [];
        $contactFolioStruct = $office->getContactFolio();
        if ($contactFolioStruct) {
            $contactFolioJsonString = $contactFolioStruct->serializeToJsonString();
            $contactFolio = json_decode($contactFolioJsonString, true);
        }

        // Format timestamps
        $effectiveStart = $office->getEffectiveStart()
            ? $office->getEffectiveStart()->toDateTime()->format('Y-m-d')
            : null;

        $effectiveEnd = $office->getEffectiveEnd()
            ? $office->getEffectiveEnd()->toDateTime()->format('Y-m-d')
            : null;

        $createdAt = $office->getCreatedAt()
            ? $office->getCreatedAt()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $updatedAt = $office->getUpdatedAt()
            ? $office->getUpdatedAt()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        // Handle office type
        $officeType = ParameterValueProtoConvertor::convertToArray($office->getOfficeType());

        return [
            'office_id' => $office->getOfficeId(),
            'office_name' => $office->getOfficeName(),
            'office_code' => $office->getOfficeCode(),
            'office_description' => $office->getOfficeDescription(),
            'office_type_id' => $office->getOfficeTypeId(),
            'location_id' => $office->getLocationId(),
            'office_address_id' => $office->getOfficeAddressId(),
            'effective_start' => $effectiveStart,
            'effective_end' => $effectiveEnd,
            'is_current' => $office->getIsCurrent(),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
            'created_by' => $office->getCreatedBy(),
            'updated_by' => $office->getUpdatedBy(),
            'contact_folio' => $contactFolio,
            'office_type' => $officeType,
        ];
    }
}
