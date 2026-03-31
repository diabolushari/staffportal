<?php

namespace App\Services\Parties;

use App\Http\Requests\Parties\PartiesFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Google\Protobuf\GPBEmpty;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Consumers\CreatePartyRequest;
use Proto\Consumers\DeletePartyRequest;
use Proto\Consumers\GetCurrentPartyRequest;
use Proto\Consumers\GetPartyByVersionIdRequest;
use Proto\Consumers\GetPartyHistoryRequest;
use Proto\Consumers\PartyServiceClient;
use Proto\Consumers\SearchPartiesRequest;
use Proto\Consumers\UpdatePartyRequest;

class PartyService
{
    private PartyServiceClient $client;

    public function __construct()
    {
        $this->client = new PartyServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * Get list of all current parties
     */
    public function getParties(?string $search): GrpcServiceResponse
    {
        $request = new GPBEmpty;
        if ($search !== null) {
            $request = new SearchPartiesRequest;
            $request->setSearch($search);
            [$response, $status] = $this->client->SearchParties($request)->wait();

        } else {

            $request = new GPBEmpty;
            [$response, $status] = $this->client->ListCurrentParties($request)->wait();
        }

        // Updated gRPC method call
        // [$response, $status] = $this->client->ListCurrentParties($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $parties = $response?->getParties();
        $partiesArray = [];

        if ($parties) {
            foreach ($parties as $party) {
                $partiesArray[] = $this->transformPartyToArray($party);
            }
        }

        return GrpcServiceResponse::success($partiesArray, $response, $status->code, $status->details);
    }

    /**
     * Get a specific party by version ID
     */
    public function getParty(int $versionId): GrpcServiceResponse
    {
        // Updated request message
        $request = new GetPartyByVersionIdRequest;
        $request->setVersionId($versionId);

        // Updated gRPC method call
        [$response, $status] = $this->client->GetPartyByVersionId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $party = $response->getParty();
        $partyArray = $this->transformPartyToArray($party);

        return GrpcServiceResponse::success($partyArray, $response, $status->code, $status->details);
    }

    /**
     * Create a new party
     */
    public function createParty(PartiesFormRequest $request): GrpcServiceResponse
    {
        // Updated request message
        $grpcRequest = new CreatePartyRequest;

        // Set fields based on the new proto definition
        if ($request->partyCode) {
            $grpcRequest->setPartyCode($request->partyCode);
        }

        if ($request->partyLegacyCode) {
            $grpcRequest->setPartyLegacyCode($request->partyLegacyCode);
        }

        if ($request->name) {
            $grpcRequest->setName($request->name);
        }

        if ($request->partyTypeId) {
            $grpcRequest->setPartyTypeId($request->partyTypeId);
        }

        if ($request->statusId) {
            $grpcRequest->setStatusId($request->statusId);
        }

        if ($request->createdBy) {
            $grpcRequest->setCreatedBy($request->createdBy);
        }

        // Contact information fields
        if ($request->mobileNumber) {
            $grpcRequest->setMobileNumber($request->mobileNumber);
        }

        if ($request->telephoneNumber) {
            $grpcRequest->setTelephoneNumber($request->telephoneNumber);
        }

        if ($request->emailAddress) {
            $grpcRequest->setEmailAddress($request->emailAddress);
        }

        if ($request->address) {
            $grpcRequest->setAddress($request->address);
        }

        if ($request->faxNumber) {
            $grpcRequest->setFaxNumber($request->faxNumber);
        }

        [$response, $status] = $this->client->CreateParty($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $party = $response->getParty();
        $partyArray = $this->transformPartyToArray($party);

        return GrpcServiceResponse::success($partyArray, $response, $status->code, $status->details);
    }

    /**
     * Update an existing party
     */
    public function updateParty(PartiesFormRequest $request): GrpcServiceResponse
    {
        // Updated request message
        $grpcRequest = new UpdatePartyRequest;

        // Proto requires party_id for update, using it from the request object
        $grpcRequest->setPartyId($request->partyId);

        // Set fields based on the new proto definition
        if ($request->partyCode) {
            $grpcRequest->setPartyCode($request->partyCode);
        }

        if ($request->partyLegacyCode) {
            $grpcRequest->setPartyLegacyCode($request->partyLegacyCode);
        }

        if ($request->name) {
            $grpcRequest->setName($request->name);
        }

        if ($request->partyTypeId) {
            $grpcRequest->setPartyTypeId($request->partyTypeId);
        }

        if ($request->statusId) {
            $grpcRequest->setStatusId($request->statusId);
        }

        if ($request->updatedBy) {
            $grpcRequest->setUpdatedBy($request->updatedBy);
        }

        // Contact information fields
        if ($request->mobileNumber) {
            $grpcRequest->setMobileNumber($request->mobileNumber);
        }

        if ($request->telephoneNumber) {
            $grpcRequest->setTelephoneNumber($request->telephoneNumber);
        }

        if ($request->emailAddress) {
            $grpcRequest->setEmailAddress($request->emailAddress);
        }

        if ($request->address) {
            $grpcRequest->setAddress($request->address);
        }

        if ($request->faxNumber) {
            $grpcRequest->setFaxNumber($request->faxNumber);
        }

        [$response, $status] = $this->client->UpdateParty($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $party = $response->getParty();
        $partyArray = $this->transformPartyToArray($party);

        return GrpcServiceResponse::success($partyArray, $response, $status->code, $status->details);
    }

    /**
     * Delete a party
     */
    public function deleteParty(int $partyId): GrpcServiceResponse
    {
        // Updated request message. Assuming $versionId passed is the party_id.
        $grpcRequest = new DeletePartyRequest;
        $grpcRequest->setPartyId($partyId);

        [$response, $status] = $this->client->DeleteParty($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        // Delete returns Empty; no payload data
        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    /**
     * Get the current version of a party by party ID.
     */
    public function getCurrentParty(int $partyId): GrpcServiceResponse
    {
        $request = new GetCurrentPartyRequest;
        $request->setPartyId($partyId);

        [$response, $status] = $this->client->GetCurrentParty($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $party = $response->getParty();
        $partyArray = $this->transformPartyToArray($party);

        return GrpcServiceResponse::success($partyArray, $response, $status->code, $status->details);
    }

    /**
     * Get the version history of a party.
     */
    public function getPartyHistory(int $partyId): GrpcServiceResponse
    {
        $request = new GetPartyHistoryRequest;
        $request->setPartyId($partyId);

        [$response, $status] = $this->client->GetPartyHistory($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $parties = $response?->getParties();
        $partiesArray = [];

        if ($parties) {
            foreach ($parties as $party) {
                $partiesArray[] = $this->transformPartyToArray($party);
            }
        }

        return GrpcServiceResponse::success($partiesArray, $response, $status->code, $status->details);
    }

    /**
     * Transform PartyMessage protobuf to PHP array
     */
    public function transformPartyToArray($party): array
    {
        return [
            'version_id' => $party->getVersionId(),
            'party_id' => $party->getPartyId(),
            'party_code' => $party->getPartyCode(),
            'party_legacy_code' => $party->getPartyLegacyCode(),
            'name' => $party->getName(),
            'party_type_id' => $party->getPartyTypeId(),
            'party_type' => $this->transformParameterValueToArray($party->getPartyType()),
            'status_id' => $party->getStatusId(),
            'status' => $this->transformParameterValueToArray($party->getStatus()),
            'effective_start' => $this->convertFromTimestamp($party->getEffectiveStart()),
            'effective_end' => $this->convertFromTimestamp($party->getEffectiveEnd()),
            'is_current' => $party->getIsCurrent(),
            'created_by' => $party->getCreatedBy(),
            'updated_by' => $party->getUpdatedBy(),
            'created_at' => $this->convertFromTimestamp($party->getCreatedAt()),
            'updated_at' => $this->convertFromTimestamp($party->getUpdatedAt()),
            // Contact information fields
            'mobile_number' => $party->getMobileNumber(),
            'telephone_number' => $party->getTelephoneNumber(),
            'email_address' => $party->getEmailAddress(),
            'address' => $party->getAddress(),
            'fax_number' => $party->getFaxNumber(),
        ];
    }

    /**
     * Transform ParameterValueProto to PHP array
     */
    private function transformParameterValueToArray($parameterValue): ?array
    {
        if ($parameterValue === null) {
            return null;
        }

        // The structure is assumed based on usage in the provided controller context
        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
        ];
    }

    /**
     * Convert PHP DateTime/Carbon to protobuf Timestamp
     */
    private function convertToTimestamp($dateTime): Timestamp
    {
        if (is_string($dateTime)) {
            $carbon = Carbon::parse($dateTime);
        } elseif ($dateTime instanceof Carbon) {
            $carbon = $dateTime;
        } elseif ($dateTime instanceof \DateTime) {
            $carbon = Carbon::instance($dateTime);
        } else {
            // Return a new Timestamp object if the input is not a valid date format
            return new Timestamp;
        }

        $timestamp = new Timestamp;
        $timestamp->setSeconds($carbon->getTimestamp());
        $timestamp->setNanos($carbon->micro * 1000);

        return $timestamp;
    }

    /**
     * Convert protobuf Timestamp to Carbon
     */
    private function convertFromTimestamp(?Timestamp $timestamp): ?string
    {
        if ($timestamp === null) {
            return null;
        }

        $seconds = $timestamp->getSeconds();
        $nanos = $timestamp->getNanos();

        // Check for default/unset timestamp
        if ($seconds === 0 && $nanos === 0) {
            return null;
        }

        $carbon = Carbon::createFromTimestamp($seconds);
        $carbon->addMicroseconds(intval($nanos / 1000));

        return $carbon->toISOString();
    }
}
