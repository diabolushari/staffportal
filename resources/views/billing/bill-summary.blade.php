<table class="grid ">
    <!-- ROW 1 -->
    <tr>
        <td class="mono">Cons#</td>
        <td><strong>{{ $connection['consumer_number'] ?? '-' }}</strong></td>

        <td>Bill Date</td>
        <td><strong>{{ \Carbon\Carbon::parse($bill['bill_date'])->format('d-m-Y') ?? '-' }}</strong></td>

        <td>Due Date</td>
        <td><strong>{{ \Carbon\Carbon::parse($bill['due_date'])->format('d-m-Y') ?? '-' }}</strong></td>

        <td>DC Date</td>
        <td><strong>{{ \Carbon\Carbon::parse($bill['dc_date'])->format('d-m-Y') ?? '-' }}</strong></td>

        <td>Bill No</td>
        <td class="mono"><strong>{{ $bill['bill_number'] ?? '-' }}</strong></td>
    </tr>

    <!-- ROW 2 -->
    <tr>
        <td>LCN</td>
        <td>{{ $connection['consumer_legacy_code'] ?? '-' }}</td>

        <td>Tariff</td>
        <td colspan="3">{{ $tariff['result'] ?? $connection['tariff']['parameter_value'] ?? '-' }}</td>

        <td>CD</td>
        <td><strong>00.0</strong></td>

        <td>BG</td>
        <td>0</td>
    </tr>

    <!-- ROW 3 : ADDRESS + VIRTUAL ACCOUNT -->
    <tr>
        <!-- LEFT : ADDRESS -->
        <td colspan="5" rowspan="2" style="vertical-align: top;">
            <strong>{{ $consumer['organization_name'] ?? '-' }}</strong><br>

            {{ $consumer['contact_details'][0]['billing_address']['address_line1'] ?? '-' }},
            {{ $consumer['contact_details'][0]['billing_address']['address_line2'] ?? '-' }}<br>

            {{ $consumer['contact_details'][0]['billing_address']['city_town_village'] ?? '-' }},
            {{ $consumer['contact_details'][0]['billing_address']['district']['name'] ?? '-' }}<br>

            {{ $consumer['contact_details'][0]['billing_address']['state']['name'] ?? '-' }} -
            {{ $consumer['contact_details'][0]['billing_address']['pincode'] ?? '-' }}<br>

            {{ $consumer['contact_person'] ?? '-' }},
            Phone: {{ $consumer['contact_details'][0]['primary_phone'] ?? '-' }}
        </td>

        <!-- RIGHT -->
        <td colspan="5">
            <strong>SBI Virtual A/c No(IFS Code:SBIN0070493)-</strong>
            {{ $consumer['virtual_account_number'] ?? '-' }}
        </td>
    </tr>

    <!-- ROW 4 -->
    <tr>
        <td colspan="5">
            <strong>Consumer GSTIN:</strong>
            {{ $consumer['consumer_gstin'] ?? '-' }}
        </td>
    </tr>
</table>