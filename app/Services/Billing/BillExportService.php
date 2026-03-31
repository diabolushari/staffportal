<?php

namespace App\Services\Billing;

use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterReadingService;
use NumberFormatter;

class BillExportService
{
    public function __construct(
        private readonly MeterConnectionMappingService $meterConnectionMappingService,
        private readonly MeterReadingService $meterReadingService
    ) {}

    public function getEnergyConsumptionMeter(?int $connectionId, ?array $meterUseCategory): ?array
    {
        $meter = [];
        if (! $connectionId) {
            return $meter;
        }
        $useCategory = $meterUseCategory['result'] ?? 'Energy Consumption';
        $meterConnectionMapping = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($connectionId)->data;
        if ($meterConnectionMapping) {
            foreach ($meterConnectionMapping as $mapping) {
                if (strtolower($mapping['meter_use_category']['parameter_value']) == strtolower($useCategory)) {
                    $meter['meter'] = $mapping['meter'];
                    $meter['meter_mf'] = $mapping['meter_mf'];
                }
            }
        }

        return $meter;
    }

    public function getSelfGenerationMeter(?int $connectionId): ?array
    {
        $meter = [];
        if (! $connectionId) {
            return $meter;
        }
        $meterConnectionMapping = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($connectionId)->data;
        if ($meterConnectionMapping) {
            foreach ($meterConnectionMapping as $mapping) {
                if (strtolower($mapping['meter_use_category']['parameter_value']) == 'self generation') {
                    $meter['meter'] = $mapping['meter'];
                    $meter['meter_mf'] = $mapping['meter_mf'];
                }
            }
        }

        return $meter;
    }

    public function getMeterReading(?int $connectionId, ?string $yearMonth): ?array
    {
        $meterReading = null;
        if (! $connectionId) {
            return $meterReading;
        }
        $meterReading = $this->meterReadingService->listMeterReadings(null, null, null, $connectionId, $yearMonth)->data;

        return $meterReading;
    }

    public function filterReadingByParameter(
        ?array $meterReading,
        ?string $parameterName,
        $energyConsumptionMeterId,
        ?array $timeZones
    ): array {
        if (empty($meterReading) || empty($parameterName) || empty($energyConsumptionMeterId)) {
            return [];
        }

        // Each reading object contains "values"
        $values = collect($meterReading[0]['values'] ?? []);

        $unsortedValues = $values
            ->filter(function ($value) use ($parameterName, $energyConsumptionMeterId) {

                $parameterMatch =
                    strtolower($value['meter_profile_parameter']['name'] ?? '') === strtolower($parameterName);

                $meterMatch =
                    ($value['meter_id'] ?? null) == $energyConsumptionMeterId;
                $parameterIsExport = $value['meter_profile_parameter']['is_export'] ?? false;

                return $parameterMatch && $meterMatch && !$parameterIsExport;
            })
            ->map(function ($item) {
                return [
                    'timezone_id'       => $item['timezone_id'] ?? null,
                    'timezone'          => $item['time_zone']['parameter_value'] ?? null,
                    'timezone_code'     => $item['time_zone']['parameter_code'] ?? null,
                    'initial_reading'   => $item['initial_reading'] ?? null,
                    'final_reading'     => $item['final_reading'] ?? null,
                    'difference'        => $item['difference'] ?? null,
                    'meter_mf'          => $item['meter_mf'] ?? null,
                    'value'             => $item['value'] ?? null,
                    'parameter_id'      => $item['meter_profile_parameter']['meter_parameter_id'] ?? null,
                    'parameter_name'    => $item['meter_profile_parameter']['name'] ?? null,
                    'parameter_display' => $item['meter_profile_parameter']['display_name'] ?? null,
                ];
            })
            ->values()
            ->toArray();


        $sortedValues = [];
        $defaultZone = [
            ['result' => 'Normal'],
            ['result' => 'Peak'],
            ['result' => 'Off Peak']
        ];
        $timeZoneNames = $timeZones['result'] ?? $defaultZone;
        foreach ($timeZoneNames as $timeZoneName) {
            foreach ($unsortedValues as $value) {
                if (strtolower($value['timezone']) == strtolower($timeZoneName['result'])) {
                    $sortedValues[] = $value;
                }
            }
        }

        return $sortedValues ? $sortedValues : $unsortedValues;
    }




    public function getChargeHeads(array $chargeHeads): array
    {
        $result = [];

        foreach ($chargeHeads as $item) {
            $name = $item['name'] ?? null;
            $key = $this->toSnakeCase($name);

            if ($name && isset($item['results'][0])) {
                $result[$key] = [
                    'id' => $item['id'],
                    'name' => $name,
                    'result' => $item['results'][0]['result'] ?? null,
                    'zoneId' => $item['results'][0]['zoneId'] ?? null,
                ];
            }
        }

        return $result;
    }

    public function getComputedProperties(array $computed): array
    {
        $normalized = [];

        foreach ($computed as $item) {

            $name = $item['name'];
            $key = $this->toSnakeCase($name);
            $id = $item['id'];
            $results = $item['results'];

            // Single result → return flat form
            if (count($results) === 1) {
                $normalized[$key] = [
                    'id' => $id,
                    'name' => $name,
                    'result' => $results[0]['result'],
                    'zoneId' => $results[0]['zoneId'],
                ];
            }

            // Multiple → return zone result array
            else {
                $normalized[$key] = [
                    'id' => $id,
                    'name' => $name,
                    'result' => $results,
                ];
            }
        }

        return $normalized;
    }

    public function getTotolDemandChargeRows(?array $computed, ?array $kvaValues, ?array $timeZones): array
    {
        if (empty($computed)) {
            return [];
        }

        $maxKvaIndex = 0;
        $maxKvaValue = -INF;

        foreach ($kvaValues as $index => $kva) {
            $value = (float) ($kva['value'] ?? 0);

            if ($value > $maxKvaValue) {
                $maxKvaValue = $value;
                $maxKvaIndex = $index;
            }
        }

        $excessDemand = $computed['excess_demand'];
        $zoneWithMaxDemand = $computed['zone_with_max_demand_value'] ?? [];
        $recordedMaxDemand = $computed['recorded_max_demand'] ?? [];
        $contract75 = $computed['75_of_contract_demand'] ?? [];
        $demandRate = $computed['kva_rate']['result'] ?? 0;
        $excessDemandRate = $computed['excess_demand_rate']['result'] ?? 0;
        $demandChargeHead = $computed['demand_charge'] ?? [];
        $excessDemandHead = $computed['excess_demand_charge'] ?? [];


        $demandRows = [];
        $excessRows = [];


        $useContractDemand =
            empty($zoneWithMaxDemand['result']) ||
            $zoneWithMaxDemand['result'] === 'Contract Demand';

        $demandUnits = $useContractDemand
            ? (float) round($contract75['result'] ?? 0)
            : (float) round($recordedMaxDemand['result'] ?? 0);

        $zoneWithMaxExcessDemand = null;
        $previousMax = 0;

        if (gettype($excessDemand['result']) == 'array') {
            foreach ($excessDemand['result'] as $index => $zoneData) {
                $zoneId = $zoneData['zoneId'] ?? $index;
                if ((float) ($zoneData['result'] ?? 0) > $previousMax) {
                    $previousMax = (float) ($zoneData['result'] ?? 0);
                    $zoneWithMaxExcessDemand = $zoneId;
                }
            }
        }

        if (gettype($excessDemand['result']) == 'array') {
            foreach ($excessDemand['result'] as $index => $zoneData) {

                $zoneId = $zoneData['zoneId'] ?? $index;
                $units = 0;
                $demandChargeAmount = 0;

                if (($useContractDemand && $zoneId == $maxKvaIndex) || (! $useContractDemand && $zoneId == $zoneWithMaxDemand['result'])) {
                    $units = $demandUnits;
                    $demandChargeAmount = $demandChargeHead ? (float) ($demandChargeHead['result'] ?? 0) : 0;
                } elseif (!$useContractDemand && $zoneWithMaxDemand['result'] - 1 == $index) {
                    $units = $demandUnits;
                    $demandChargeAmount = $demandChargeHead ? (float) ($demandChargeHead['result'] ?? 0) : 0;
                }

                $demandRows[] = [
                    'label' => $this->getZoneLabel($index, 'Demand Charge', $timeZones['result'] ?? null),
                    'zone' => $zoneId,
                    'units' => round($units),
                    'rate' => $demandRate,
                    'amount' => $demandChargeAmount,
                ];

                $excessUnits = (float) ($zoneData['result'] ?? 0);

                $excessRows[] = [
                    'label' => $this->getZoneLabel($index, 'Excess Demand Charge', $timeZones['result'] ?? null),
                    'zone' => $zoneId,
                    'units' => $zoneId == $zoneWithMaxExcessDemand ? round($excessUnits) : 0,
                    'rate' => $excessDemandRate,
                    'amount' => $zoneId == $zoneWithMaxExcessDemand ? (float) ($excessDemandHead['result'] ?? 0) : 0,
                ];
            }
        } else {
            return [
                'title' => 'Total Demand Charge',
                'rows' => [
                    [
                        'label' => 'Demand Charge',
                        'zone' => 'All',
                        'units' => round($demandUnits),
                        'rate' => $demandRate,
                        'amount' => $demandChargeHead['result'],
                    ],
                ],
            ];
        }

        return [
            'title' => 'Total Demand Charge',
            'rows' => array_merge($demandRows, $excessRows),
        ];
    }


    public function getTotalEnergyChargeRows(array $computed, array $kwhValues, ?array $timezones): ?array
    {
        if (empty($computed) || empty($kwhValues)) {
            return [];
        }


        $totalEnergyChargeRows = [];
        $energyCharges = $computed['energy_charges'];
        $energyChargeRates = $computed['energy_charge_rates'];

        if (gettype($energyCharges['result']) == 'string') {
            $sumOfUnits = array_sum(array_column($kwhValues, 'value'));
            return [
                'label' => 'Total Energy Charge',
                'rows' => [
                    [
                        'label' => 'Energy Charge',
                        'zone' => 'All',
                        'units' => round($sumOfUnits),
                        'rate' => $energyChargeRates['result'][0] ?? 0,
                        'amount' => $energyCharges['result'],
                    ],
                ],
            ];
        }

        foreach ($energyCharges['result'] as $index => $zoneData) {
            $zoneId = $zoneData['zoneId'] ?? $index;

            // Round the units
            $units = $kwhValues[$index]['value'] ?? 0;
            $roundedUnits = round($units); // rounds .5 and above up, below .5 down

            $totalEnergyChargeRows[] = [
                'label' => $this->getZoneLabel($index, 'Energy Charge', $timezones['result'] ?? null),
                'zone' => $zoneId,
                'units' => $roundedUnits,
                'rate' => $energyChargeRates['result'][$index] ?? 0,
                'amount' => $zoneData['result'] ?? 0,
            ];
        }

        return [
            'title' => 'Total Energy Charge',
            'rows' => $totalEnergyChargeRows,
        ];
    }


    public function getAverageAndTotalKva(?array $filteredkVAs): ?array
    {
        if (empty($filteredkVAs)) {
            return [];
        }
        $totalKva = array_sum(array_column($filteredkVAs, 'difference'));
        if (count($filteredkVAs) == 0) {
            return [
                'totalKva' => 0,
                'averageKva' => 0,
            ];
        }
        $averageKva = $totalKva / count($filteredkVAs);

        return [
            'totalKva' => $totalKva,
            'averageKva' => $averageKva,
        ];
    }

    public function getAverageAndTotalKwh(?array $filteredkWhs): ?array
    {
        if (empty($filteredkWhs)) {
            return [];
        }
        $totalKwh = array_sum(array_column($filteredkWhs, 'difference'));
        if (count($filteredkWhs) == 0) {
            return [
                'totalKwh' => 0,
                'averageKwh' => 0,
            ];
        }
        $averageKwh = $totalKwh / count($filteredkWhs);

        return [
            'totalKwh' => $totalKwh,
            'averageKwh' => $averageKwh,
        ];
    }

    public function calculateDemand(?array $kvaReadings, float $contractDemand): ?array
    {
        if (empty($kvaReadings)) {
            return [];
        }
        // Filter timezone readings
        $timezoneReadings = array_filter(
            $kvaReadings,
            fn($r) => ! empty($r['timezone_code'])
        );

        $threshold = $contractDemand * 0.75;

        if (! empty($timezoneReadings)) {

            // Priority order
            $orderedZones = ['Peak', 'Normal', 'OffPeak'];

            // Build timezone => value map
            $zoneMap = [];
            foreach ($timezoneReadings as $r) {
                $zoneMap[$r['timezone']] = $r['value'];
            }

            // Find max value
            $maxValue = max($zoneMap);

            if ($maxValue > $threshold) {

                // Pick ONLY ONE zone based on priority
                $selectedZone = null;
                foreach ($orderedZones as $zone) {
                    if (($zoneMap[$zone] ?? 0) === $maxValue) {
                        $selectedZone = $zone;
                        break;
                    }
                }

                // Build result: selected zone = value, others = 0
                $result = [];
                foreach ($orderedZones as $zone) {
                    $result[] = [
                        'timezone' => $zone,
                        'value' => ($zone === $selectedZone) ? $maxValue : 0,
                    ];
                }

                return [
                    'is_contract_demand' => false,
                    'result' => $result,
                ];
            }
        }

        // Fallback → contract demand
        return [
            'is_contract_demand' => true,
            'result' => [
                'timezone' => null,
                'value' => $threshold,
            ],
        ];
    }

    private function toSnakeCase(string $value): string
    {


        return strtolower(
            preg_replace('/[^a-z0-9]+/i', '_', trim($value))
        );
    }

    public function generateBillNumber(?array $billData): string
    {
        // 1️⃣ Connection type → prefix
        if ($billData == null) {
            return '0';
        };
        $connectionType = strtolower(
            $billData['connection']['connection_type']['parameter_value'] ?? ''
        );

        $connectionPrefix = match ($connectionType) {
            'ht'  => '2',
            'eht' => '1',
            default => '0', // fallback safety
        };

        // 2️⃣ Service office code (4 digits)
        $officeCode = $billData['connection']['service_office']['office_code'] ?? '0000';
        $officeCode = str_pad($officeCode, 4, '0', STR_PAD_LEFT);

        // 3️⃣ Serial number from bill_id → 8 digits
        $billId = $billData['bill_id'] ?? 0;
        $serialNumber = str_pad($billId, 8, '0', STR_PAD_LEFT);

        // 4️⃣ Final bill number
        return $connectionPrefix . $officeCode . $serialNumber;
    }

    private function getZoneLabel(int $index, string $base, ?array $timezones): string
    {
        $defaultZones = [
            'Normal',
            'Peak',
            'Off Peak',
        ];

        // If timezones exist and index is OUTSIDE their count → do not allow
        if (!empty($timezones) && !array_key_exists($index, $timezones)) {
            return '';
        }

        $label =
            $timezones[$index]['result']
            ?? $defaultZones[$index]
            ?? "Zone {$index}";

        return "{$base} - {$label}";
    }




    /**
     * Convert amount to words
     * 
     * @param ?float $amount
     * @return array
     */
    public function getAmountInWords(?float $amount): array
    {
        if ($amount === null) {
            return [
                'amount_rounded' => null,
                'amount_words' => '-',
            ];
        }

        // Round amount
        $rounded = round($amount);

        // Convert to words (Indian format)
        $formatter = new NumberFormatter('en_IN', NumberFormatter::SPELLOUT);
        $words = $formatter->format($rounded);

        return [
            'amount_rounded' => $rounded,
            'amount_words' => ucfirst($words) . ' rupees only',
        ];
    }

    public function splitTimeZones(?array $computedProperty): array|null
    {
        if ($computedProperty == null) {
            return null;
        }
        $value = $computedProperty['result'] ?? null;

        if (!$value || !is_string($value)) {
            return $computedProperty;
        }

        $zones = array_map(
            fn($item) => [
                'result' => trim($item),
                'zoneId' => null,
            ],
            explode(',', $value)
        );

        $computedProperty['result'] = $zones;

        return $computedProperty;
    }

    public function configure_other_charges(?array $chargeHeads, ?array $computedProperties): array
    {

        $nonOtherCharges = [
            'total demand charge',
            "energy charge",
            "electricity duty",
            "electricity surcharge",
            "power factor incentive and disincentive",
            "self generation duty",
            "factory lighting",
            "colony lighting"
        ];
        $otherCharges = [];
        foreach ($chargeHeads as $chargeHead) {
            if (in_array(strtolower($chargeHead['name']), $nonOtherCharges) || (int)$chargeHead['result'] == 0) {
                continue;
            }
            $otherCharges[] = [
                'id' => $chargeHead['id'],
                'name' => $chargeHead['name'],
                'rate' => $computedProperties[$this->toSnakeCase($chargeHead['name']) . '_rate']['result'] ?? null,
                'units' => $computedProperties[$this->toSnakeCase($chargeHead['name']) . '_unit']['result'] ?? null,
                'amount' => $chargeHead['result'] ?? null,
                'zoneId' => $chargeHead['results'][0]['zoneId'] ?? null,
            ];
        }
        return $otherCharges;
    }
}
