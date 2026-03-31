<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionFlagProtoConverter;
use App\GrpcConverters\Connection\ConsumerContactDetailsProtoConverter;
use App\GrpcConverters\Connection\GeoRegionProtoConverter;
use App\Http\Requests\Connections\ConsumerFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Struct;
use Google\Protobuf\Value;
use Grpc\ChannelCredentials;
use Proto\Connections\AddressMessage;
use Proto\Connections\ConsumerAddressMessage;
use Proto\Connections\ConsumerContactDetailMessage;
use Proto\Connections\ConsumerCreateRequest;
use Proto\Connections\ConsumerIdRequest;
use Proto\Connections\ConsumerMessage;
use Proto\Connections\ConsumerServiceClient;
use Proto\Connections\ConsumerUpdateRequest;
use Proto\Connections\ContactMessage;

class ConsumerService
{
    private ConsumerServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService,
        private GeoRegionProtoConverter $geoRegionProtoConverter

    ) {
        $this->client = new ConsumerServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createConsumer(ConsumerFormRequest $request): GrpcServiceResponse
    {

        $grpcRequest = new ConsumerCreateRequest;
        $grpcRequest->setConsumer($this->toConsumerProfile($request));
        $grpcRequest->setAddress($this->toConsumerAddress($request));
        $grpcRequest->setContact($this->toContactInfo($request));

        [$response, $status] = $this->client->createConsumer($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    public function getConsumer(int $connectionId): GrpcServiceResponse
    {

        $grpcRequest = new ConsumerIdRequest;
        $grpcRequest->setConnectionId($connectionId);

        [$response, $status] = $this->client->getConsumerById($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,
            );
        }

        $connection = $response->getConsumer();
        $contact = $response->getContact() ?? null;

        return GrpcServiceResponse::success(
            [
                'consumer' => $this->transformConsumerToArray($connection),
                'contact' => $this->transformContactToArray($contact),
            ],
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateConsumer(ConsumerFormRequest $request, int $connectionId): GrpcServiceResponse
    {

        $grpcRequest = new ConsumerUpdateRequest;
        $grpcRequest->setConsumer($this->toConsumerProfile($request));
        $grpcRequest->setAddress($this->toConsumerAddress($request));
        $grpcRequest->setContact($this->toContactInfo($request));

        [$response, $status] = $this->client->updateConsumer($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details

            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    // -------------------- Helper Methods --------------------

    public function toConsumerProfile(ConsumerFormRequest $request): ConsumerMessage
    {
        $consumer = new ConsumerMessage;
        $consumer->setConnectionId($request->connectionId);
        $consumer->setConsumerTypeId($request->consumerTypeId);
        if ($request->organizationName) {
            $consumer->setOrganizationName($request->organizationName);
        }
        $consumer->setConsumerOwnershipTypeId($request->consumerOwnershipTypeId);
        $consumer->setConsumerName($request->consumerName);

        if ($request->virtualAccountNumber) {
            $consumer->setVirtualAccountNumber($request->virtualAccountNumber);
        }
        if ($request->contactPerson) {
            $consumer->setContactPerson($request->contactPerson);
        }
        if ($request->departmentNameId) {
            $consumer->setDepartmentNameId($request->departmentNameId);
        }
        if ($request->consumerCin) {
            $consumer->setConsumerCin($request->consumerCin);
        }
        if ($request->consumerPan) {
            $consumer->setConsumerPan($request->consumerPan);
        }
        if ($request->consumerTan) {
            $consumer->setConsumerTan($request->consumerTan);
        }
        if ($request->consumerGstin) {
            $consumer->setConsumerGstin($request->consumerGstin);
        }
        $consumer->setManufacturingInfo(new Struct);
        $consumer->setTaxInfo(new Struct);
        $consumer->setIdentityInfo(new Struct);
        $consumer->setApplicationInfo(new Struct);
        if (!empty($request->indicators)) {
            foreach ($request->indicators as $group) {

                if (empty($group['flags'])) {
                    continue;
                }

                foreach ($group['flags'] as $flag) {
                    if (!($flag['value'] ?? false)) {
                        continue;
                    }
                    $flagPayload = [
                        'connection_id' => $request->connectionId ?? 0,
                        'flag_id' => $flag['id'],
                        'value' => $flag['value'] ??  null,
                        'label' => $flag['label'] ??  null,
                    ];

                    $consumer->getConsumerFlags()[] =
                        ConnectionFlagProtoConverter::convertToFormRequest($flagPayload);
                }
            }
        }

        // Convert billing & premises addresses to Struct
        $pendingAddresses = $request->otherAddresses ?? [];
        $addresses = [];
        if (isset($pendingAddresses['billing'])) {
            $addresses['billing'] = $pendingAddresses['billing'];
        }
        if (isset($pendingAddresses['premises'])) {
            $addresses['premises'] = $pendingAddresses['premises'];
        }
        $consumer->setAddresses($this->arrayToStruct($addresses));

        return $consumer;
    }

    public function toConsumerAddress(ConsumerFormRequest $request): AddressMessage
    {
        $address = new AddressMessage;
        $address->setAddressId($request->addressId ?? 0);
        $address->setAddressLine1($request->addressLine1);
        if ($request->addressLine2) {
            $address->setAddressLine2($request->addressLine2);
        }
        $address->setCityTownVillage($request->cityTownVillage);
        $address->setPincode($request->pincode);
        $address->setDistrictId($request->districtId);
        $address->setStateId($request->stateId);

        return $address;
    }

    public function toContactInfo(ConsumerFormRequest $request): ContactMessage
    {
        $contact = new ContactMessage;
        $contact->setConnectionId($request->connectionId);
        $contact->setPrimaryEmail($request->primaryEmail);
        $contact->setPrimaryPhone($request->primaryPhone);
        $contact->setContactFolio($request->contactFolio ? $this->arrayToStruct($request->contactFolio) : new Struct);

        return $contact;
    }

    /**
     * @return array<string, mixed>
     */
    public function transformConsumerToArray(ConsumerMessage $consumer): array
    {

        $consumerFlags = $consumer->getConsumerFlagsMessage();
        $flags = [];
        foreach ($consumerFlags as $flag) {
            $flag = ConnectionFlagProtoConverter::convertToArray($flag);
            $flags[] = $flag;
        }
        $contactDetailsArray = [];
        $contactDetails = $consumer->getConsumerContactDetails();
        foreach ($contactDetails as $contactDetail) {
            $contactDetail = ConsumerContactDetailsProtoConverter::convertToArray($contactDetail);
            $contactDetailsArray[] = $contactDetail;
        }
        return [
            'connection_id' => $consumer->getConnectionId(),
            'consumer_type_id' => $consumer->getConsumerTypeId(),
            'consumer_ownership_type_id' => $consumer->getConsumerOwnershipTypeId(),
            'organization_name' => $consumer->getOrganizationName(),
            'consumer_name' => $consumer->getConsumerName(),
            'consumer_pan' => $consumer->getConsumerPan(),
            'consumer_tan' => $consumer->getConsumerTan(),
            'consumer_gstin' => $consumer->getConsumerGstin(),
            'manufacturing_info' => $consumer->getManufacturingInfo(),
            'tax_info' => $consumer->getTaxInfo(),
            'identity_info' => $consumer->getIdentityInfo(),
            'application_info' => $consumer->getApplicationInfo(),
            'consumer_type' => $this->parameterValueService->toArray($consumer->getConsumerType()),
            'consumer_ownership_type' => $this->parameterValueService->toArray($consumer->getConsumerOwnershipType()),
            'consumer_cin' => $consumer->getConsumerCin(),
            'virtual_account_number' => $consumer->getVirtualAccountNumber(),
            'contact_person' => $consumer->getContactPerson(),
            'department_name_id' => $consumer->getDepartmentNameId(),
            'flags' => $flags,
            'contact_details' => $contactDetailsArray,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function transformContactToArray(?ConsumerContactDetailMessage $contact): array
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
            'primary_address' => $this->addressToArray($contact->getPrimaryAddress()),
            'billing_address' => $this->addressToArray($contact->getBillingAddress()),
            'premises_address' => $this->addressToArray($contact->getPremisesAddress()),
        ];
    }

    /**
     * @param  array<string, mixed>  $arr
     */
    public function arrayToStruct(array $arr): Struct
    {
        $struct = new Struct;
        $fields = [];
        foreach ($arr as $key => $value) {
            $val = new Value;
            if (is_array($value)) {
                $val->setStructValue($this->arrayToStruct($value));
            } elseif (is_bool($value)) {
                $val->setBoolValue($value);
            } elseif (is_numeric($value)) {
                if (is_int($value)) {
                    $val->setNumberValue((float) $value);
                } elseif (is_float($value)) {
                    $val->setNumberValue($value);
                } elseif (is_string($value)) {
                    $val->setNumberValue((float) $value);
                }
            } else {
                $val->setStringValue((string) $value);
            }
            $fields[$key] = $val;
        }
        $struct->setFields($fields);

        return $struct;
    }

    /**
     * @return array<string, mixed>
     */
    private function addressToArray(?ConsumerAddressMessage $address): ?array
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
            'state' => $address->getState() ? $this->geoRegionProtoConverter->toArray($address->getState()) : null,
            'district' => $address->getDistrict() ? $this->geoRegionProtoConverter->toArray($address->getDistrict()) : null,
        ];
    }
}
