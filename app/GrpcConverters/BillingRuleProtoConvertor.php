<?php

namespace App\GrpcConverters;

use App\Http\Requests\Billing\BillingRuleRequest;
use App\Services\utils\DateTimeConverter;
use Proto\Billing\BillingRuleFormMessage;
use Proto\Billing\RuleJsonMessage;
use Proto\Billing\RulePropertyFormMessage;
use Proto\Billing\SchemaChargeHeadMessage;
use Proto\Billing\SchemaComputedPropertyMessage;

class BillingRuleProtoConvertor
{
    public static function billingRuleRequestToProto(BillingRuleRequest $request): BillingRuleFormMessage
    {
        $proto = new BillingRuleFormMessage;
        $proto->setName($request->name);
        $jsonContents = $request->billingRule->get();
        if ($jsonContents != false) {
            $decoded = json_decode($jsonContents, true);
            $proto->setRule(BillingRuleProtoConvertor::convertToRuleJson($decoded));
        }
        $effectiveStart = DateTimeConverter::convertStringToTimestamp($request->effectiveStart ?? null);
        if ($effectiveStart != null) {
            $proto->setEffectiveStart($effectiveStart);
        }
        $effectiveEnd = DateTimeConverter::convertStringToTimestamp($request->effectiveEnd ?? null);
        if ($effectiveEnd != null) {
            $proto->setEffectiveEnd($effectiveEnd);
        }

        return $proto;
    }

    /**
     * Convert array to RuleJsonMessage proto
     *
     * @param  array<string, mixed>  $data
     */
    public static function convertToRuleJson(array $data): RuleJsonMessage
    {
        $proto = new RuleJsonMessage;

        $proto->setSchemaVersion((float) ($data['schema_version'] ?? 0));
        $proto->setCode((string) ($data['code'] ?? ''));
        $proto->setSupportedZones((int) ($data['supported_zones'] ?? 0));
        $proto->setName((string) ($data['name'] ?? ''));

        $computedProperties = [];
        foreach ($data['computed_properties'] ?? [] as $property) {
            $computedProperties[] = self::convertToComputedProperty($property);
        }
        $proto->setComputedProperties($computedProperties);

        $chargeHeads = [];
        foreach ($data['charge_heads'] ?? [] as $chargeHead) {
            $chargeHeads[] = self::convertToChargeHead($chargeHead);
        }
        $proto->setChargeHeads($chargeHeads);

        return $proto;
    }

    /**
     * Convert array to RulePropertyFormMessage proto
     *
     * @param  array<string, mixed>  $data
     */
    public static function convertToRuleProperty(array $data): RulePropertyFormMessage
    {
        $proto = new RulePropertyFormMessage;

        if ($data['when'] ?? null) {
            $proto->setWhen((string) $data['when']);
        }

        if ($data['zone_id'] ?? null) {
            $proto->setZoneId((int) $data['zone_id']);
        }

        if ($data['formula'] ?? null) {
            $proto->setFormula((string) $data['formula']);
        }

        if ($data['constant'] ?? null) {
            $proto->setConstant((float) $data['constant']);
        }

        return $proto;
    }

    /**
     * Convert array to SchemaChargeHeadMessage proto
     *
     * @param  array<string, mixed>  $data
     */
    public static function convertToChargeHead(array $data): SchemaChargeHeadMessage
    {
        $proto = new SchemaChargeHeadMessage;

        $proto->setId((string) ($data['id'] ?? ''));
        $proto->setName((string) ($data['name'] ?? ''));

        $calculations = [];
        foreach ($data['calculations'] ?? [] as $calculation) {
            $calculations[] = self::convertToRuleProperty($calculation);
        }
        $proto->setCalculations($calculations);

        return $proto;
    }

    /**
     * Convert array to SchemaComputedPropertyMessage proto
     *
     * @param  array<string, mixed>  $data
     */
    public static function convertToComputedProperty(array $data): SchemaComputedPropertyMessage
    {
        $proto = new SchemaComputedPropertyMessage;

        $proto->setId((int) ($data['id'] ?? 0));
        $proto->setName((string) ($data['name'] ?? ''));

        $calculations = [];
        foreach ($data['calculations'] ?? [] as $calculation) {
            $calculations[] = self::convertToRuleProperty($calculation);
        }
        $proto->setCalculations($calculations);

        return $proto;
    }
}
