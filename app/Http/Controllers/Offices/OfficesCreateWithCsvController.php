<?php

namespace App\Http\Controllers\Offices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Http\Requests\Offices\HierarchyOfficeForm;
use App\Http\Requests\Offices\OfficeHierarchyForm;
use App\Services\Consumers\OfficeService;
use App\Services\Offices\OfficeHierarchyRelService;
use App\Services\Offices\OfficeHierarchyService;
use App\Services\Parameters\ParameterValueService;

class OfficesCreateWithCsvController extends Controller
{
    public function __construct(
        private OfficeService $officeService,
        private ParameterValueService $parameterValueService,
        private OfficeHierarchyRelService $officeHierarchyRelService,
        private OfficeHierarchyService $officeHierarchyService,
    ) {}

    public function __invoke()
    {
        $delimiter = ';'; // Change if CSV is comma-separated

        /**
         * Utility: Load CSV into associative array
         */
        $loadCsv = function (string $path, string $delimiter) {
            if (($handle = fopen($path, 'r')) === false) {
                return response()->json([
                    'message' => 'Failed to open file: '.$path,
                ], 500);
            }
            $headers = fgetcsv($handle, 0, $delimiter);
            $rows = [];
            while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
                $rows[] = array_combine($headers, $row);
            }
            fclose($handle);

            return [$headers, $rows];
        };
        $officeHierarchyResponse = $this->officeHierarchyService->createOfficeHierarchy(
            HierarchyOfficeForm::from([
                'hierarchy_code' => 'ORGANISATION_DISTRIBUTION',
                'hierarchy_name' => 'Organization-Distribution',
                'hierarchy_description' => 'Organization-Distribution',
            ])
        );

        if (! $officeHierarchyResponse->data) {
            // Handle error or return a default value

            return response()->json([
                'message' => 'Failed to create office hierarchy: response data is null',
            ], 500);
        }

        $officeHierarchyCode = $officeHierarchyResponse->data['hierarchy_code'];

        [$regionHeaders, $regionRows] = $loadCsv(base_path('app/seed/region.csv'), $delimiter);
        [$circleHeaders, $circleRows] = $loadCsv(base_path('app/seed/circle.csv'), $delimiter);
        [$divisionHeaders, $divisionRows] = $loadCsv(base_path('app/seed/division.csv'), $delimiter);
        [$subDivisionHeaders, $subDivRows] = $loadCsv(base_path('app/seed/subdivision.csv'), $delimiter);
        [$sectionHeaders, $sectionRows] = $loadCsv(base_path('app/seed/section.csv'), $delimiter);

        // Step 2: Get office_type_ids
        $officeTypeResponse = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Organization-Distribution',
            'Office Type'
        );
        if (! $officeTypeResponse->data) {

            return response()->json([
                'message' => 'Failed to get office type',
            ], 500);
        }

        $officeTypeMap = [];
        foreach ($officeTypeResponse->data as $officeType) {
            $officeTypeMap[$officeType['parameter_value']] = $officeType['id'];
        }

        $regionOfficeTypeId = $officeTypeMap['Region'] ?? 0;
        $circleOfficeTypeId = $officeTypeMap['Circle'] ?? 0;
        $divisionOfficeTypeId = $officeTypeMap['Division'] ?? 0;
        $subDivisionOfficeTypeId = $officeTypeMap['Sub Division'] ?? 0;
        $sectionOfficeTypeId = $officeTypeMap['Section'] ?? 0;

        // Lookup maps (id → code)
        $regions = collect($regionRows)->mapWithKeys(fn ($r) => [$r['id'] => $r['code']])->all();
        $circles = collect($circleRows)->mapWithKeys(fn ($r) => [$r['id'] => $r['code']])->all();
        $divisions = collect($divisionRows)->mapWithKeys(fn ($r) => [$r['id'] => $r['code']])->all();
        $subDivisions = collect($subDivRows)->mapWithKeys(fn ($r) => [$r['id'] => $r['code']])->all();

        /**
         * Step 3: Create Regions
         */
        foreach ($regionRows as $record) {
            $this->officeService->createOffice(OfficeFormRequest::from([
                'office_name' => $record['office_name'],
                'office_code' => (int) $record['code'],
                'office_description' => $record['office_name'],
                'office_type_id' => $regionOfficeTypeId,
                'parent_offices' => null,
            ]));
        }

        /**
         * Step 4: Create Circles → Regions
         */
        foreach ($circleRows as $record) {
            $this->officeService->createOffice(OfficeFormRequest::from([
                'office_name' => $record['office_name'],
                'office_code' => (int) $record['code'],
                'office_description' => $record['office_name'],
                'office_type_id' => $circleOfficeTypeId,
                'parent_offices' => null,
            ]));

            $parentOfficeCode = $regions[$record['region_id']] ?? null;
            if ($parentOfficeCode) {
                $this->officeHierarchyRelService->createOfficeHierarchyRel(
                    OfficeHierarchyForm::from([
                        'office_code' => (int) $record['code'],
                        'hierarchy_code' => $officeHierarchyCode,
                        'parent_office_code' => (int) $parentOfficeCode,
                    ])
                );
            }
        }

        /**
         * Step 5: Create Divisions → Circles
         */
        foreach ($divisionRows as $record) {
            $this->officeService->createOffice(OfficeFormRequest::from([
                'office_name' => $record['office_name'],
                'office_code' => (int) $record['code'],
                'office_description' => $record['office_name'],
                'office_type_id' => $divisionOfficeTypeId,
                'parent_offices' => null,
            ]));

            $parentOfficeCode = $circles[$record['circle_id']] ?? null;
            if ($parentOfficeCode) {
                $this->officeHierarchyRelService->createOfficeHierarchyRel(
                    OfficeHierarchyForm::from([
                        'office_code' => (int) $record['code'],
                        'hierarchy_code' => $officeHierarchyCode,
                        'parent_office_code' => (int) $parentOfficeCode,
                    ])
                );
            }
        }

        /**
         * Step 6: Create Sub Divisions → Divisions
         */
        foreach ($subDivRows as $record) {
            $this->officeService->createOffice(OfficeFormRequest::from([
                'office_name' => $record['office_name'],
                'office_code' => (int) $record['code'],
                'office_description' => $record['office_name'],
                'office_type_id' => $subDivisionOfficeTypeId,
                'parent_offices' => null,
            ]));

            $parentOfficeCode = $divisions[$record['division_id']] ?? null;
            if ($parentOfficeCode) {
                $this->officeHierarchyRelService->createOfficeHierarchyRel(
                    OfficeHierarchyForm::from([
                        'office_code' => (int) $record['code'],
                        'hierarchy_code' => $officeHierarchyCode,
                        'parent_office_code' => (int) $parentOfficeCode,
                    ])
                );
            }
        }

        /**
         * Step 7: Create Sections → Sub Divisions
         */
        foreach ($sectionRows as $record) {
            $this->officeService->createOffice(OfficeFormRequest::from([
                'office_name' => $record['office_name'],
                'office_code' => (int) $record['code'],
                'office_description' => $record['office_name'],
                'office_type_id' => $sectionOfficeTypeId,
                'parent_offices' => null,
            ]));

            $parentOfficeCode = $subDivisions[$record['subdivision_id']] ?? null;
            if ($parentOfficeCode) {
                $this->officeHierarchyRelService->createOfficeHierarchyRel(
                    OfficeHierarchyForm::from([
                        'office_code' => (int) $record['code'],
                        'hierarchy_code' => $officeHierarchyCode,
                        'parent_office_code' => (int) $parentOfficeCode,
                    ])
                );
            }
        }

        return response()->json(['message' => 'Offices created successfully']);
    }
}
