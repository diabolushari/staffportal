<style>
    /* ===== Reading Layout ===== */
    .reading-wrapper {
        border: 1px solid #000;
        padding: 0px;
        margin-top: 0;
        font-size: 10px;
    }

    .reading-title {
        text-align: center;
        font-weight: bold;
        margin-bottom: 0;
    }

    .reading-row {
        width: 100%;
        display: table;
        table-layout: fixed;
        margin-bottom: 0;
    }

    .reading-cell {
        display: table-cell;
        width: 50%;
        vertical-align: top;
    }

    .reading-cell+.reading-cell {
        padding-left: 4px;
    }

    /* ===== Table ===== */
    .reading-grid {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .reading-grid th,
    .reading-grid td {
        border: 1px solid #000;
        padding: 2px;
        vertical-align: middle;
    }

    .reading-grid th {
        background: #f5f5f5;
        font-weight: bold;
        text-align: center;
    }

    .center {
        text-align: center;
    }

    .right {
        text-align: right;
    }

    .total-row {
        background: #eee;
        font-weight: bold;
    }

    @media print {
        .reading-grid {
            page-break-inside: auto;
        }

        .reading-grid thead {
            display: table-header-group;
        }

        .reading-grid tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }

        .reading-wrapper {
            page-break-inside: auto;
        }
    }
</style>

@php
function zoneLabel($zoneName, $index) {
$standardZones = ['normal', 'peak', 'off peak', 'offpeak'];

if (in_array(strtolower(trim($zoneName ?? '')), $standardZones)) {
return $index + 1; // show index (1-based)
}

return $zoneName ?: ($index + 1);
}
@endphp


<div class="reading-wrapper">

    <div class="reading-title">
        Reading Details of meter {{ $meter['meter']['meter_serial'] ?? '-' }}
        – Working (KVA, KWh, KVAh & KVARh)
        for {{ \Carbon\Carbon::parse($bill['reading_year_month'])->format('F Y') }}
    </div>

    {{-- ===============================
     ROW 1 : kWh  |  kVARh Lag + Lead
     =============================== --}}
    <div class="reading-row">

        {{-- kWh --}}
        <div class="reading-cell">
            <table class="reading-grid">
                <colgroup>
                    <col span="2" style="width:10%">
                    <col span="3" style="width:22%">
                    <col span="3" style="width:22%">
                    <col span="2" style="width:16%">
                    <col span="2" style="width:30%">
                </colgroup>

                <thead>
                    <tr>
                        <th colspan="12">1. Energy Consumption (kWh)</th>
                    </tr>
                    <tr>
                        <th colspan="2">Zone</th>
                        <th colspan="3">FR</th>
                        <th colspan="3">IR</th>
                        <th colspan="2">MF</th>
                        <th colspan="2">Units</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($kwhValues as $i => $kwh)
                    <tr>
                        <td colspan="2" class="center">{{ zoneLabel($kwh['timezone'], $i) }}</td>
                        <td colspan="3" class="right">{{ $kwh['final_reading'] ?? 0 }}</td>
                        <td colspan="3" class="right">{{ $kwh['initial_reading'] ?? 0 }}</td>
                        <td colspan="2" class="center">{{ $kwh['meter_mf'] ?? 1 }}</td>
                        <td colspan="2" class="right">{{ $kwh['value'] ?? 0 }}</td>
                    </tr>
                    @endforeach

                    <tr class="total-row">
                        <td colspan="10" class="right">Total</td>
                        <td colspan="2" class="right">
                            {{ collect($kwhValues)->sum('value') }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {{-- kVARh Lag + Lead --}}
        <div class="reading-cell">
            <table class="reading-grid">
                <colgroup>
                    <col style="width:10%">
                    <col style="width:18%">
                    <col style="width:18%">
                    <col style="width:12%">
                    <col style="width:12%">
                    <col style="width:15%">
                    <col style="width:15%">
                    <col style="width:20%">
                </colgroup>

                <thead>
                    <tr>
                        <th colspan="4">3. Energy Consumption (kVARh) Lag</th>
                        <th colspan="4">Energy Consumption (kVARh) Lead</th>
                    </tr>
                    <tr>
                        <th>Zone</th>
                        <th>FR</th>
                        <th>IR</th>
                        <th>MF</th>
                        <th>Units</th>
                        <th>FR</th>
                        <th>IR</th>
                        <th>Units</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($lagValues as $i => $lag)
                    @php $lead = $leadValues[$i] ?? []; @endphp
                    <tr>
                        <td class="center">{{ zoneLabel($lag['timezone'], $i) }}</td>
                        <td class="right">{{ $lag['final_reading'] ?? 0 }}</td>
                        <td class="right">{{ $lag['initial_reading'] ?? 0 }}</td>
                        <td class="center">{{ $lag['meter_mf'] ?? 1 }}</td>
                        <td class="right">{{ $lag['value'] ?? 0 }}</td>

                        <td class="right">{{ $lead['final_reading'] ?? 0 }}</td>
                        <td class="right">{{ $lead['initial_reading'] ?? 0 }}</td>
                        <td class="right">{{ $lead['value'] ?? 0 }}</td>
                    </tr>
                    @endforeach

                    <tr class="total-row">
                        <td colspan="4" class="right">Total kVARh (Lag)</td>
                        <td class="right">{{ collect($lagValues)->sum('value') }}</td>
                        <td colspan="2" class="right">Total kVARh (Lead)</td>
                        <td class="right">{{ collect($leadValues)->sum('value') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    {{-- ===============================
     ROW 2 : kVAh  |  Demand
     =============================== --}}
    <div class="reading-row">

        {{-- kVAh --}}
        <div class="reading-cell">
            <table class="reading-grid">
                <colgroup>
                    <col style="width:10%">
                    <col style="width:25%">
                    <col style="width:25%">
                    <col style="width:15%">
                    <col style="width:25%">
                </colgroup>

                <thead>
                    <tr>
                        <th colspan="5">2. Energy Consumption (kVAh)</th>
                    </tr>
                    <tr>
                        <th>Zone</th>
                        <th>FR</th>
                        <th>IR</th>
                        <th>MF</th>
                        <th>Units</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($kvahValues as $i => $kvah)
                    <tr>
                        <td class="center">{{ zoneLabel($kvah['timezone'], $i) }}</td>
                        <td class="right">{{ $kvah['final_reading'] ?? '-' }}</td>
                        <td class="right">{{ $kvah['initial_reading'] ?? '-' }}</td>
                        <td class="center">{{ $kvah['meter_mf'] ?? 1 }}</td>
                        <td class="right">{{ $kvah['value'] ?? 0 }}</td>
                    </tr>
                    @endforeach

                    <tr class="total-row">
                        <td colspan="4" class="right">Total</td>
                        <td class="right">{{ collect($kvahValues)->sum('value') }}</td>
                    </tr>

                    <tr class="total-row">
                        <td colspan="3">Ave. PF = KWh / KVAh</td>
                        <td colspan="2" class="center">
                            {{ number_format($computedProperties['power_factor']['result'] ?? 0, 2) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {{-- Demand --}}
        <div class="reading-cell">
            <table class="reading-grid">
                <colgroup>
                    <col style="width:20%">
                    <col style="width:30%">
                    <col style="width:20%">
                    <col style="width:30%">
                </colgroup>

                <thead>
                    <tr>
                        <th colspan="4">4. Demand (kVA)</th>
                    </tr>
                    <tr>
                        <th>Zone</th>
                        <th>Reading</th>
                        <th>MF</th>
                        <th>Units</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($kvaValues as $i => $kva)
                    <tr>
                        <td class="center">{{ zoneLabel($kva['timezone'], $i) }}</td>
                        <td class="center">{{ $kva['final_reading'] ?? '-' }}</td>
                        <td class="center">{{ $kva['meter_mf'] ?? 1 }}</td>
                        <td class="right">{{ number_format($kva['value'] ?? 0, 2) }}</td>
                    </tr>
                    @endforeach

                    <tr class="total-row">
                        <td colspan="2">Factory lighting</td>
                        <td colspan="2" class="right">
                            {{ $computedProperties['total_consumption_factory_lighting']['result'] ?? 0 }}
                        </td>
                    </tr>

                    <tr class="total-row">
                        <td colspan="2">Colony lighting</td>
                        <td colspan="2" class="right">
                            {{ $computedProperties['total_consumption_colony_lighting']['result'] ?? 0 }}
                        </td>
                    </tr>

                    <tr class="total-row">
                        <td colspan="2">Generator</td>
                        <td colspan="2" class="right"> {{ collect($selfGenerationkwhValues)->sum('value') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>