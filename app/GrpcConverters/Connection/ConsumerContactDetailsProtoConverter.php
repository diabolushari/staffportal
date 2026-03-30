<?php

namespace App\GrpcConverters\Connection;

use Proto\Connections\ConsumerContactDetailMessage;

class ConsumerContactDetailsProtoConverter
{


    public static function convertToArray(?ConsumerContactDetailMessage $contact): array
    {
        if (!$contact) {
            return [];
        }
        $contactFolio = $contact->getContactFolio();

        return [
            'connection_id' => $contact->getConnectionId(),
            'version_id' => $contact->hasVersionId() ? $contact->getVersionId() : null,
            'primary_address_id' => $contact->getPrimaryAddressId(),
            'billing_address_id' => $contact->getBillingAddressId(),
            'premises_address_id' => $contact->getPremisesAddressId(),
            'primary_email' => $contact->getPrimaryEmail(),
            'primary_phone' => $contact->getPrimaryPhone(),
            'contact_folio' => $contactFolio
                ? json_decode($contactFolio->serializeToJsonString(), true)
                : null,
            'primary_address' => AddressProtoConverter::addressToArray($contact->getPrimaryAddress()),
            'billing_address' => AddressProtoConverter::addressToArray($contact->getBillingAddress()),
            'premises_address' => AddressProtoConverter::addressToArray($contact->getPremisesAddress()),
        ];
    }
}
