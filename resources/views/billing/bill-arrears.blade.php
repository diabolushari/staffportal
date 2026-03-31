<table class="grid">

    {{-- ───────── Row 1 : Arrears + Previous Reading + Email ───────── --}}
    @php
    $mf = $meter['meter_mf'] ?? 1;
    @endphp
    <tr>
        <td colspan="6" class="center">
            <strong>Arrears as on</strong> {{ \Carbon\Carbon::parse($connection['previous_reading']['reading_end_date'])->format('d-m-Y') ?? '-' }}
        </td>

        <td colspan="2">
            <strong>Date of Previous Reading</strong>
        </td>

        <td colspan="3" class="center" style="width: 100px;">
            {{ \Carbon\Carbon::parse($connection['previous_reading']['reading_end_date'])->format('d-m-Y') ?? '-' }}
        </td>

        <td>
            {{ $connection['consumer_profiles'][0]['contact_details'][0]['primary_email'] ?? '-' }}
        </td>
    </tr>

    {{-- ───────── Row 2 : Disputed / Undisputed + Present Reading + Voltage ───────── --}}
    <tr>
        <td>Disputed</td>
        <td class="right">0</td>
        <td>Undisputed</td>
        <td class="right">0</td>
        <td colspan="2"></td>

        <td colspan="2">
            <strong>Date of Present Reading</strong>
        </td>

        <td colspan="3" class="center" style="width: 100px;">
            {{ \Carbon\Carbon::parse($connection['latest_meter_reading']['reading_end_date'])->format('d-m-Y') ?? '-' }}
        </td>

        <td>
            <strong>Supply Voltage:</strong>
            {{ $connection['voltage']['parameter_value'] ?? '-' }} kV
            |
            {{ $connection['connection_type']['parameter_value'] ?? '-' }}
        </td>
    </tr>

    {{-- ───────── Row 3 : Contract Demand headers + Average header + Billing Type ───────── --}}
    <tr>
        <th class="center">Contract Demand (kVA)</th>
        <th class="center">75% of CD (kVA)</th>
        <th class="center">130% of CD (kVA)</th>
        <th colspan="3" class="center">Connected Load (kW)</th>

        <th colspan="3" class="center">Average</th>

        <td colspan="3">
            <strong>Billing Type:</strong>
            {{ $connection['billing_process']['parameter_value'] ?? '-' }}
        </td>
    </tr>

    {{-- ───────── Row 4 : Contract Demand values + Average headers + Section ───────── --}}
    <tr>
        <td class="center">
            {{ $connection['contract_demand_kva_val'] ?? '-' }}
        </td>

        <td class="center">
            {{ $computedProperties['75_of_contract_demand']['result'] ?? '-' }}
        </td>

        <td class="center">
            {{ $computedProperties['130_of_contract_demand']['result'] ?? '-' }}
        </td>

        <td colspan="3" class="center">
            {{ $connection['connected_load_kw_val'] ?? '-' }}
        </td>

        <th class="center">MD (kVA)</th>
        <th class="center">Consumption (kWh)</th>
        <th class="center">PF</th>

        <td colspan="3">
            <strong>Section:</strong>
            {{ $connection['service_office']['office_name'] ?? '-' }}
        </td>
    </tr>

    {{-- ───────── Row 5 : Average values + Circle ───────── --}}
    <tr>
        <td colspan="6"></td>

        {{-- Average MD --}}
        <td class="center">
            @if(!empty($kvaValues))
            {{ number_format(
          collect($kvaValues)->avg(fn($r) => $r['difference'] ?? 0),
          2
        ) }}
            @else
            -
            @endif
        </td>

        {{-- Total Consumption --}}
        <td class="center">
            {{ !empty($kwhValues)
        ? collect($kwhValues)->sum(fn($r) => ($r['difference'] ?? 0) * $mf)
        : '-' }}
        </td>

        {{-- PF --}}
        <td class="center">
            {{ isset($computedProperties['power_factor']['result'])
        ? number_format($computedProperties['power_factor']['result'], 2)
        : '-' }}
        </td>

        <td colspan="3">
            <strong>Circle:</strong>
            {{ $connection['admin_office']['office_name'] ?? '-' }}
        </td>
    </tr>

</table>