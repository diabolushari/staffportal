<?php

namespace App\Services\SecurityDeposit;

use App\Http\Requests\SecurityDeposit\SdCollectionFormRequest;
use Illuminate\Support\Facades\Storage;

class SdAttributeService
{
    protected string $filesTargetDir = 'sd_collection_attributes';

    protected array $filesToCleanUp = [];

    public function processSdAttribute(SdCollectionFormRequest $request): array
    {
        $attributes = [];

        if (! $request->attributeData) {
            return $attributes;
        }

        foreach ($request->attributeData as $attribute) {


            if ($attribute['file'] !== null) {
                $file = $attribute['file'];
                // TODO will generate duplicate file names, need to generate unique name
                $fileName = time() . '.' . $file->getClientOriginalExtension();

                // Store file (auto-creates folder)
                Storage::disk('public')->putFileAs(
                    $this->filesTargetDir,
                    $file,
                    $fileName
                );

                $filePath = $this->filesTargetDir . '/' . $fileName;

                $this->filesToCleanUp[] = $filePath;

                $mimeType = $file->getClientMimeType();

                $attributes[] = [
                    'attribute_definition_id' => $attribute['attribute_definition_id'],
                    'attribute_value' => $filePath,
                    'mime_type' => $mimeType,
                ];
            } else {
                $attributes[] = [
                    'attribute_definition_id' => $attribute['attribute_definition_id'],
                    'attribute_value' => $attribute['attribute_value'],
                    'mime_type' => null,
                ];
            }
        }

        return $attributes;
    }
}
