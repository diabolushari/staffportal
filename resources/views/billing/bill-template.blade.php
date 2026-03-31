<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>KSEB HT Consumer Bill</title>

  <style>
    body {
      font-family: 'DM Sans', Arial, Helvetica, sans-serif;
      font-size: 11px;
      margin: 0;
      padding: 0;
      color: #000;
    }

    .page {
      width: 100%;
      border: 3px solid #000;
      padding: 4px;
      box-sizing: border-box;
    }

    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }

    .header h1 {
      font-size: 20px;
      margin: 0;
      font-weight: bold;
      text-transform: uppercase;
    }

    .sub {
      font-size: 10px;
    }

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-top: 4px;
    }

    @media print {

      /* Allow tables to split naturally */
      table {
        page-break-inside: auto;
      }

      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      thead {
        display: table-header-group;
        /* repeat header on next page */
      }

      tfoot {
        display: table-footer-group;
      }

      /* Prevent headings from being left alone */
      h1,
      h2,
      h3,
      h4 {
        page-break-after: avoid;
      }

      /* Allow content blocks to split */
      .section,
      .invoice {
        page-break-inside: auto;
      }

      /* Nested tables inside invoice should also break */
      .invoice table {
        page-break-inside: auto;
      }

      .invoice tbody {
        page-break-inside: auto;
      }

      /* Force new page only when YOU want */
      .page-break {
        page-break-before: always;
      }
    }


    .small-table,
    .grid {
      width: 100%;
      border-collapse: collapse;
    }

    .small-table td,
    .small-table th,
    .grid td,
    .grid th {
      border: 1px solid #000;
      padding: 3px;
      font-size: 10px;
      vertical-align: top;
    }

    .grid th {
      background: #f5f5f5;
      font-weight: bold;
    }

    .section {
      border: 1px solid #000;
      padding: 4px;
      margin-top: 4px;
    }

    .invoice {
      border: 1px solid #000;
      padding: 4px;
      margin-top: 4px;

    }

    .total-row {
      background: #eee;
      font-weight: bold;
    }

    .footer {
      margin-top: 4px;
      font-size: 9.5px;
    }

    .signature-row {
      margin-top: 12px;
    }

    .signature {
      width: 250px;
      text-align: center;
      border-top: 1px solid #000;
      margin-left: auto;
      font-weight: bold;
    }

    .right {
      text-align: right;
    }

    .center {
      text-align: center;
    }

    .mono {
      font-family: "Courier New";
    }
  </style>
  <style>
    .header {
      font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
    }

    .kseb-title {
      font-weight: 400;
      font-style: normal;
      font-size: 22px;
      /* Regular only */
    }
  </style>

</head>

<body>
  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <div class="kseb-title">KERALA STATE ELECTRICITY BOARD LIMITED</div>
      <div class="sub">Office of the Special Officer (Revenue), Pattom, Thiruvananthapuram</div>
      <div class="title">DEMAND CUM DISCONNECTION NOTICE FOR {{ \Carbon\Carbon::parse($bill['bill_year_month'])->format('F Y') }}
      </div>
      <div class="sub" style="font-style: italic;">As per CHAPTER VII OF KERALA ELECTRICITY SUPPLY CODE - 2014</div>
    </div>

    <!-- Bill Summary -->

    @include('billing.bill-summary', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer,
    'tariff' => $computedProperties['tariff'] ?? null,
    ])


    <!-- ARREARS SECTION -->

    @include('billing.bill-arrears', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer,
    'meter' => $meter,
    'computedProperties' => $computedProperties,
    'otherCharges' => $otherCharges,
    ])



    @include('billing.bill-reading', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer,
    'meter' => $meter,
    'kwhValues' => $kwhValues,
    'kvahValues' => $kvahValues,
    'lagValues' => $lagValues,
    'leadValues' => $leadValues,
    'kvaValues' => $kvaValues,
    'selfGenerationkwhValues' => $selfGenerationkwhValues,
    ])


    <!-- INVOICE SECTION -->

    @include('billing.bill-invoice', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer,
    'meter' => $meter,
    'kwhValues' => $kwhValues,
    'kvahValues' => $kvahValues,
    'lagValues' => $lagValues,
    'leadValues' => $leadValues,
    'kvaValues' => $kvaValues,
    'chargeHeads' => $chargeHeads,
    'totalDemandChargeRows' => $totalDemandChargeRows,
    'totalEnergyChargeRows' => $totalEnergyChargeRows,
    'selfGenerationkwhValues' => $selfGenerationkwhValues,

    ])



    <div class="footer">
      <i>(Rupees {{ $amountInWords['amount_words'] ?? '-' }} Only)</i>
      <div class="signature">SPECIAL OFFICER (REVENUE)</div>
    </div>
  </div>

  <!-- FOOTER BLOCK OUTSIDE BORDER -->
  <div class="footer" style="page-break-inside: avoid;">
    <p><i>1. As per Regulation 130 of Kerala Electricity Supply Code 2014
        any complaint regarding accuracy of a bill shall be first
        taken up with the officer designated to issue the bill (Special Officer(Revenue)). For Enquiry, please
        contact: 0471 2514323, 2514262. Please follow our official Facebook page fb.com/ksebl for information &
        announcements.</i></p>
    <p><i>2. The connection will be disconnected without further notice,
        if the amount is not remitted on or before the DC date above.</i></p>

    <table width="100%" style="page-break-inside: avoid;">
      <tr>
        <td><strong>Cons#:</strong> <span class="mono">{{ $connection['consumer_number'] ?? '-' }}</span></td>
        <td><strong>Bill No:</strong> <span class="mono">{{$bill['bill_id'] ?? '-'}}</span></td>
        <td><strong>Rs:</strong> <span class="mono">{{$bill['bill_amount'] ?? '-'}}</span></td>
      </tr>
    </table>
  </div>

</body>

</html>