<?php

namespace App\Services\Metering;

use App\Services\Parameters\ParameterValueService;

class GetMeterFormParameterService
{
    public function __construct(
        private readonly ParameterValueService $parameterValueService,
    ) {}

    public function getMeterFormParameters(): array
    {
        $viewData = [
            'ownershipTypes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Ownership Type'
            )->data,
            'makes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Make'
            )->data,
            'types' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Type'
            )->data,
            'categories' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Category'
            )->data,
            'accuracyClasses' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Accuracy Class'
            )->data,
            'phases' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Phase'
            )->data,
            'dialingFactors' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Dialing Factor'
            )->data,
            'units' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Unit'
            )->data,
            'resetTypes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Reset Type'
            )->data,
            'internalPtRatios' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal PT Ratio'
            )->data,
            'internalCtRatios' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal CT Ratio'
            )->data,
            'timezoneTypes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Timezone Type'
            )->data,
            'meterCtPrimary' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal CT Primary'
            )->data,
            'meterCtSecondary' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal CT Secondary'
            )->data,
            'meterPtPrimary' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal PT Primary'
            )->data,
            'meterPtSecondary' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal PT Secondary'
            )->data,

        ];

        return $viewData;
    }
}
