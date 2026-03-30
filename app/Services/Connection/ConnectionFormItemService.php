<?php

namespace App\Services\Connection;

use App\Services\Parameters\ParameterValueService;

class ConnectionFormItemService
{
    public function __construct(private ParameterValueService $parameterValueService) {}

    /**
     * @return array<string, mixed>
     */
    public function __invoke(): array
    {
        $connectionTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Type'
        );

        $indicators = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Indicators',
            'attribute1Value',
            'Connection'

        );
        $generationTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Generation Type'
        );

        $connectionStatus = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Status'
        );

        $voltageTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Voltage'
        );
        $tariffTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );
        $connectionCategory = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Category'
        );
        $connectionSubCategory = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Subcategory'
        );

        $billingProcesses = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Billing Process'
        );
        $phaseTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Phase Type'
        );
        $primaryPurposes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Primary Purpose'
        );
        $openAccessTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Open Access Type'
        );
        $meteringTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Metering Type'
        );
        $renewableTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Renewable Type'
        );
        $BillingSides = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Billing Side'
        );

        return [
            'connectionTypes' => $connectionTypes->data,
            'connectionStatus' => $connectionStatus->data,
            'voltageTypes' => $voltageTypes->data,
            'tariffTypes' => $tariffTypes->data,
            'connectionCategory' => $connectionCategory->data,
            'connectionSubCategory' => $connectionSubCategory->data,
            'billingProcesses' => $billingProcesses->data,
            'phaseTypes' => $phaseTypes->data,
            'primaryPurposes' => $primaryPurposes->data,
            'openAccessTypes' => $openAccessTypes->data,
            'meteringTypes' => $meteringTypes->data,
            'renewableTypes' => $renewableTypes->data,
            'indicators' => $indicators->data,
            'generationTypes' => $generationTypes->data,
            'billingSides' => $BillingSides->data,
        ];
    }
}
