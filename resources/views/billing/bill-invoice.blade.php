<div class="invoice">

    <div class="center" style="font-weight:bold;font-size:14px;border:1px solid #000;padding:4px;">
        Invoice
    </div>

    <table class="grid">
        <tr>

            {{-- ================= LEFT : MAIN INVOICE ================= --}}
            <td style="width:66%;vertical-align:top;padding:0;">

                <table class="grid">
                    <thead>
                        <tr>
                            <th colspan="2"></th>
                            <th class="right">Units</th>
                            <th class="right">Rate</th>
                            <th class="right">Amount (Rs)</th>
                        </tr>
                    </thead>

                    <tbody>

                        {{-- 1. TOTAL DEMAND CHARGE --}}
                        <tr>
                            <td colspan="5">1. Total Demand Charge</td>
                        </tr>

                        @foreach($totalDemandChargeRows['rows'] ?? [] as $i => $row)
                        <tr>
                            <td colspan="2">{{ chr(97+$i) }}. {{ $row['label'] }}</td>
                            <td class="right">{{ $row['units'] }}</td>
                            <td class="right">{{ is_numeric($row['rate'] ?? null) ? number_format($row['rate'], 2) : '-' }}</td>
                            <td class="right">{{ is_numeric($row['amount'] ?? null) ? number_format($row['amount'], 2) : '-' }}</td>
                        </tr>
                        @endforeach

                        @php
                        $rows = $totalDemandChargeRows['rows'] ?? [];
                        $letters = [];

                        for ($i = 0; $i < count($rows); $i++) {
                            $letters[]=chr(97 + $i);
                            }
                            @endphp

                            <tr class="total-row">
                            <td colspan="4">Sub Total ({{ implode('+', $letters) }})</td>
                            <td class="right">
                                {{ is_numeric($chargeHeads['total_demand_charge']['result'] ?? null)
            ? number_format($chargeHeads['total_demand_charge']['result'], 2)
            : '-' }}
                            </td>
        </tr>


        {{-- 2. TOTAL ENERGY CHARGES --}}
        <tr>
            <td colspan="5">2. Total Energy Charges</td>
        </tr>

        @foreach($totalEnergyChargeRows['rows'] ?? [] as $i => $row)
        <tr>
            <td colspan="2">{{ chr(97+$i) }}. {{ $row['label'] }}</td>
            <td class="right">{{ $row['units'] }}</td>
            <td class="right">{{ is_numeric($row['rate']['result'] ?? null) ? number_format($row['rate']['result'], 4) : '-' }}</td>
            <td class="right">{{ is_numeric($row['amount'] ?? null) ? number_format($row['amount'], 2) : '-' }}</td>
        </tr>
        @endforeach

        @php
        $rows = $totalEnergyChargeRows['rows'] ?? [];
        $letters = [];

        for ($i = 0; $i < count($rows); $i++) {
            $letters[]=chr(97 + $i);
            }
            @endphp

            <tr class="total-row">
            <td colspan="4">Sub Total ({{ implode('+', $letters) }})</td>
            <td class="right">
                {{ is_numeric($chargeHeads['energy_charge']['result'] ?? null)
            ? number_format($chargeHeads['energy_charge']['result'], 2)
            : '-' }}
            </td>
            </tr>


            {{-- 3. PF INCENTIVE / DISINCENTIVE --}}
            <tr>
                <td colspan="4">3. PF Incentive / Disincentive</td>
                <td class="right">
                    {{ is_numeric($chargeHeads['power_factor_incentive_and_disincentive']['result'] ?? null) ? number_format($chargeHeads['power_factor_incentive_and_disincentive']['result'], 2) : '-' }}
                </td>
            </tr>

            {{-- TOTAL ENERGY CHARGE --}}
            <tr class="total-row">
                <td colspan="4">Total Energy Charge</td>
                <td class="right">
                    @php
                    $ec = $chargeHeads['energy_charge']['result'] ?? null;
                    $pf = $chargeHeads['power_factor_incentive_and_disincentive']['result'] ?? null;
                    @endphp
                    {{ (is_numeric($ec) && is_numeric($pf)) ? number_format($ec + $pf, 2) : '-' }}
                </td>
            </tr>

            {{-- 4. LIGHTING LOAD --}}
            <tr>
                <td colspan="5">4. Energy Charges on Lighting load</td>
            </tr>

            <tr>
                <td colspan="2">a. Factory lighting</td>
                <td class="right">{{ is_numeric($computedProperties['total_consumption_factory_lighting']['result'] ?? null) ? number_format($computedProperties['total_consumption_factory_lighting']['result'], 2) : '-' }}</td>
                <td class="right">0.2</td>
                <td class="right">{{ is_numeric($chargeHeads['factory_lighting']['result'] ?? null) ? number_format($chargeHeads['factory_lighting']['result'], 2) : '-' }}</td>
            </tr>

            <tr>
                <td colspan="2">b. Colony lighting</td>
                <td class="right">{{ is_numeric($computedProperties['total_consumption_colony_lighting']['result'] ?? null) ? number_format($computedProperties['total_consumption_colony_lighting']['result'], 2) : '-' }}</td>
                <td class="right">0.2</td>
                <td class="right">{{ is_numeric($chargeHeads['colony_lighting']['result'] ?? null) ? number_format($chargeHeads['colony_lighting']['result'], 2) : '-' }}</td>
            </tr>

            <tr class="total-row">
                <td colspan="4">Sub Total (a+b)</td>
                <td class="right">
                    @php
                    $f = $chargeHeads['factory_lighting']['result'] ?? null;
                    $c = $chargeHeads['colony_lighting']['result'] ?? null;
                    @endphp
                    {{ (is_numeric($f) && is_numeric($c)) ? number_format($f + $c, 3) : '-' }}
                </td>
            </tr>

            {{-- 5. ELECTRICITY DUTY --}}
            <tr>
                <td colspan="2">5. Electricity Duty</td>
                <td class="right">{{ is_numeric($chargeHeads['energy_charge']['result'] ?? null) ? number_format($chargeHeads['energy_charge']['result'], 2) : '-' }}</td>
                <td class="right">{{ is_numeric($computedProperties['electricity_duty_rate']['result'] ?? null) ? number_format($computedProperties['electricity_duty_rate']['result'], 3) : '-' }}</td>
                <td class="right">{{ is_numeric($chargeHeads['electricity_duty']['result'] ?? null) ? number_format($chargeHeads['electricity_duty']['result'], 2) : '-' }}</td>
            </tr>

            {{-- 6. SURCHARGE --}}
            <tr>
                <td colspan="2">6. Ele. Surcharge (*)</td>
                <td class="right">{{collect($kwhValues)->sum('value') }}</td>
                <td class="right">{{ is_numeric($computedProperties['electricity_surcharge_rate']['result'] ?? null) ? number_format($computedProperties['electricity_surcharge_rate']['result'], 3) : '-' }}</td>
                <td class="right">{{ is_numeric($chargeHeads['electricity_surcharge']['result'] ?? null) ? number_format($chargeHeads['electricity_surcharge']['result'], 2) : '-' }}</td>
            </tr>

            {{-- 7. SELF GENERATION --}}
            <tr>
                <td colspan="2">7. Duty On Self Generated Energy</td>
                <td class="right">{{ collect($selfGenerationkwhValues)->sum('value') }}</td>
                <td class="right">{{ is_numeric($computedProperties['self_generation_duty_rate']['result'] ?? null) ? number_format($computedProperties['self_generation_duty_rate']['result'], 3) : '-' }}</td>
                <td class="right">{{ is_numeric($chargeHeads['self_generation_duty']['result'] ?? null) ? number_format($chargeHeads['self_generation_duty']['result'], 2) : '-' }}</td>
            </tr>

            {{-- 8. PENALTY --}}
            <tr>
                <td colspan="4">8. Penalty for non-segregation of light load</td>
                <td class="right">0</td>
            </tr>

            </tbody>
    </table>

    </td>

    {{-- ================= RIGHT : SUMMARY ================= --}}
    <td style="width:34%;vertical-align:top;padding:0;">

        <table class="grid">
            <thead>
                <tr>
                    <th colspan="2"></th>
                    <th class="right">Amount (Rs)</th>
                </tr>
            </thead>

            <tbody>

                <tr class="total-row">
                    <td colspan="3">9. Other Charges</td>
                </tr>

                @foreach($otherCharges as $charge)
                @php
                $amount = $charge['amount'] ?? null;
                @endphp

                @if(is_numeric($amount) && $amount != 0)
                <tr>
                    <td colspan="2">
                        {{ $charge['name'] }}
                        ({{ $charge['units'] ?? 0 }} units at rate of {{ $charge['rate'] ?? 0 }})
                    </td>
                    <td class="right">
                        {{ number_format($amount, 2) }}
                    </td>
                </tr>
                @endif
                @endforeach



                <tr>
                    <td colspan="3" style="height:165px;"></td>
                </tr>

                <tr class="total-row">
                    <td colspan="2">10. Total (add 1 to 9)</td>
                    <td class="right">{{ is_numeric($bill['bill_amount'] ?? null) ? number_format($bill['bill_amount'], 2) : '-' }}</td>
                </tr>

                @php
                $billAmount = (float) ($bill['bill_amount'] ?? 0);
                $netPayable = round($billAmount);
                $roundOff = $netPayable - $billAmount;
                $sign = $roundOff > 0 ? '+' : '';
                @endphp

                <!-- Plus / Minus (Round off) -->
                <tr>
                    <td colspan="2" class="border">Plus / Minus (Round off)</td>
                    <td class="border right">
                        {{ $billAmount ? $sign . number_format($roundOff, 2) : '-' }}
                    </td>
                </tr>

                <!-- Undisputed Arr Amount -->
                <tr>
                    <td colspan="2" class="border">UnDisputed Arr Amount</td>
                    <td class="border right">0.00</td>
                </tr>

                <!-- ACD_FY Assessment -->
                <tr>
                    <td colspan="2" class="border">ACD_FY Assessment</td>
                    <td class="border right">0.00</td>
                </tr>

                <!-- Less Section -->
                <tr>
                    <td rowspan="3" class="border top">Less</td>
                    <td class="border">1. Advance / Credit</td>
                    <td class="border right">0.00</td>
                </tr>

                <tr>
                    <td class="border">2. CD Interest</td>
                    <td class="border right">0.00</td>
                </tr>

                <tr>
                    <td class="border">3. CD / Oth Ref</td>
                    <td class="border right">0.00</td>
                </tr>

                <!-- Net Payable -->
                <tr class="total-row">
                    <td colspan="2" class="border bold">Net Payable</td>
                    <td class="border right bold">
                        {{ $billAmount ? number_format($netPayable, 2) : '-' }}
                    </td>
                </tr>


            </tbody>
        </table>

    </td>
    </tr>
    </table>
</div>