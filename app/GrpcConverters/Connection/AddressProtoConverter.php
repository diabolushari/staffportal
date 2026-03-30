<?php

namespace App\GrpcConverters\Connection;

use Proto\Connections\ConsumerAddressMessage;

class AddressProtoConverter
{

    public function __construct(
        private readonly GeoRegionProtoConverter $geoRegionProtoConverter
    ) {}


    /**
     * @return array<string, mixed>
     */
    public static function addressToArray(?ConsumerAddressMessage $address): ?array
    {
        if ($address === null) {
            return null;
        }

        return [
            'address_id' => $address->getAddressId(),
            'address_line1' => $address->getAddressLine1(),
            'address_line2' => $address->getAddressLine2(),
            'city_town_village' => $address->getCityTownVillage(),
            'state_id' => $address->getStateId(),
            'pincode' => $address->getPincode(),
            'district_id' => $address->getDistrictId(),
            'state' => $address->getState() ? GeoRegionProtoConverter::toArray($address->getState()) : null,
            'district' => $address->getDistrict() ? GeoRegionProtoConverter::toArray($address->getDistrict()) : null,
        ];
    }
}
