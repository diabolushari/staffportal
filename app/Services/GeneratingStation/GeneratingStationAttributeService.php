<?php

namespace App\Services\GeneratingStation;

use App\Http\Requests\GeneratingStation\GeneratingStationFormRequest;

class GeneratingStationAttributeService
{
    public function processGeneratingStationAttributes(GeneratingStationFormRequest $request): array
    {
        $attributes = [];

        if (! $request->attributeData) {
            return $attributes;
        }

        foreach ($request->attributeData as $attribute) {
            $attributes[] = [
                'attribute_definition_id' => $attribute->attributeDefinitionId,
                'attribute_value' => $attribute->attributeValue ?? '',
                'created_by' => $attribute->createdBy ?? null,
                'updated_by' => $attribute->updatedBy ?? null,
            ];
        }

        return $attributes;
    }
}