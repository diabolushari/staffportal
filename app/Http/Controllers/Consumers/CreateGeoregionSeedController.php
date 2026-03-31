<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consumers\GeoRegionFormRequest;
use App\Services\Consumers\GeoRegionsService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CreateGeoregionSeedController extends Controller
{
    public function __construct(
        private readonly GeoRegionsService $geoRegionsService,
        private readonly ParameterValueService $parameterValueService,
    ) {}

    public function __invoke(): Response|JsonResponse
    {
        // Fetch parameter values
        $geoRegionTypes = collect(
            $this->parameterValueService
                ->getParameterValues(1, 50, null, 'Regions', 'Region Type')
                ->data
        );

        if ($geoRegionTypes->isEmpty()) {
            return response()->json([
                'message' => 'GeoRegion Types not found, Please create a Regions Domain and Region Type Parameter (values: District,State)',
            ]);
        }

        $geoRegionClassifications = collect(
            $this->parameterValueService
                ->getParameterValues(1, 50, null, 'Regions', 'Region Classification')
                ->data
        );
        if ($geoRegionClassifications->isEmpty()) {
            return response()->json([
                'message' => 'GeoRegion Classifications not found, Please create a Regions Domain and Region Classification Parameter (values: Administrative)',
            ]);
        }
        $path = base_path('app/seed/kerala_regions.csv');
        $fileLines = file($path);

        if ($fileLines === false) {
            return response()->json([
                'message' => 'Unable to read file at '.$path,
            ]);
        }

        $csvData = array_map('str_getcsv', $fileLines);
        /** @var string[] $header */
        $header = array_shift($csvData);

        foreach ($csvData as $row) {
            $rowData = array_combine($header, $row);

            // Find classification ID
            $classification = $geoRegionClassifications
                ->firstWhere('parameter_value', $rowData['region_classification']);

            // Find type ID
            $type = $geoRegionTypes
                ->firstWhere('parameter_value', $rowData['type']);

            if (! $classification || ! $type) {
                continue; // skip if mapping not found
            }

            // Build request-like data
            $request = GeoRegionFormRequest::from([
                'regionId' => (int) $rowData['id'],
                'regionName' => $rowData['region_name'],
                'regionClassificationId' => $classification['id'],
                'regionTypeId' => $type['id'],
                'parentRegionId' => $rowData['parent_id'] ?? null,
            ]);

            // Call GeoRegion creation
            $this->geoRegionsService->createGeoRegion($request);
        }

        return response()->json([
            'message' => 'GeoRegions seeded successfully',
        ]);
    }
}
