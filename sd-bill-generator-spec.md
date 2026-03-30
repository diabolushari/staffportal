# SD Bill Generator and Recalculation Specification

## 1. Executive Summary

### Problem overview

The current billing engine (`BillGenerator`) calculates charges from one meter reading record and month-end connection
context. Security Deposit (SD) recalculation needs a different basis: a virtual meter reading derived from historical
consumption, with specific exclusion rules.

Required behavior:

- Build SD basis from a 12-month window.
- If a month has multiple readings, include all valid readings but count the month once in denominator.
- Exclude months with partial coverage (example: 15th to end of month).
- Support annual April recalculation and ad-hoc recalculation events (load change, tariff change, manual triggers).
- Compute power factor for the virtual meter reading.

### Proposed solution

Implement an SD-specific calculation flow as a copy/variant of bill generation logic:

1. Resolve trigger mode and context date.
2. Fetch and filter historical readings for a 12-month window.
3. Build month-level aggregates with eligibility checks.
4. Create an in-memory virtual `MeterReading` with averaged `MeterReadingValue` rows.
5. Compute virtual `MeterReadingPowerFactor`.
6. Run existing rule engine using a billing context date override (April/event date tariff and rates).
7. Persist SD result and recalculation audit details.

### Expected outcome

- Deterministic, auditable SD recalculation.
- Reuse of existing billing operators and rule execution.
- Correct handling of multiple readings, partial months, and event-based recalculation.

## 2. Scope

### 2.1 In Scope

- New SD recalculation generator (copy/variant of `BillGenerator`).
- Trigger modes:
    - Annual financial year run (April).
    - Event-driven run (load change, tariff change, manual).
- Historical window resolution for SD basis (12 months).
- Month eligibility engine:
    - Exclude months with partial-only readings.
    - Include all readings in eligible month while month denominator remains `1`.
- Virtual reading builder (`MeterReading`, `MeterReadingValue`, `MeterReadingPowerFactor`) in memory.
- Billing context override by recalculation context date.
- Execution of existing computed-properties and charge-head formulas.
- SD demand persistence and run audit metadata.
- gRPC APIs for preview and commit.

### 2.2 Out of Scope

- Redesign of formula syntax/operator pipeline.
- UI workflow implementation.
- Changes to unrelated billing or meter reading creation flows.
- Historical backfill migration for all old SD records.

## 3. Functional Requirements

### FR-1: Trigger and Date Window Resolution

#### Description

Resolve context date and 12-month basis window for SD recalculation.

#### Actors

- Scheduler (annual April run)
- Event processor (load/tariff change)
- Authorized billing operator (manual)

#### Preconditions

- `connectionId` is provided.
- Trigger type is valid.
- Context/event date is provided or derivable.

#### Main Flow

1. Receive recalculation request.
2. Resolve `contextDate`:
    - Annual run: April effective date of target financial year.
    - Event run: event effective date.
3. Resolve 12-month window:
    - Annual run default: previous April 1 to current March 31.
    - Event run default: previous 12 complete months before context month.
4. Create `runId` and initialize run metadata.

#### Alternate Flows

- Preview mode: compute and return without writing SD demand rows.
- Forced rerun mode: bypass idempotent return for same key (admin-only).

#### Edge Cases

- Duplicate request with same idempotency key.
- Context date in future.
- Insufficient historical months due to new connection.

#### Validation Rules

- `connectionId > 0`
- Trigger type must be enum-supported.
- `contextDate <= current_date` unless explicitly authorized simulation mode.

#### Failure Scenarios

- Connection not found for context date.
- Invalid trigger/date combination.
- Existing in-progress recalculation for same connection.

### FR-2: Historical Reading Eligibility Engine

#### Description

Filter and classify readings/months used for SD averaging.

#### Actors

- SD recalculation service

#### Preconditions

- Window start/end resolved.
- Historical readings retrievable for connection.

#### Main Flow

1. Fetch all readings where `readingEndDate` is within window.
2. Fetch all reading values and required relations.
3. Group readings by `YearMonth(readingEndDate)`.
4. For each month, validate full-month coverage using month readings:
    - Month start and month end must be covered by union of reading intervals.
    - Gaps invalidate month.
5. Mark month as included/excluded with reason code.

#### Alternate Flows

- If all months excluded, return structured validation error.
- If some months excluded, continue with included months.

#### Edge Cases

- Overlapping intervals in month.
- Missing start/end date in reading.
- Duplicate intervals.

#### Validation Rules

- `readingStartDate` and `readingEndDate` mandatory for eligibility.
- `readingStartDate <= readingEndDate`.
- Month is eligible only if full calendar month is covered.

#### Failure Scenarios

- Corrupt interval data prevents coverage evaluation.
- No eligible months remain.

### FR-3: Monthly Aggregation and Annual Averaging

#### Description

Build averaged virtual reading values from eligible months.

#### Actors

- Virtual reading builder

#### Preconditions

- Eligible months identified.

#### Main Flow

1. For each eligible month, aggregate all valid readings by:
    - `(meterId, timezoneId, parameterId)`
2. For each key, monthly value = sum of monthly `mulValue` from all readings.
3. Annual average per key =
    - `sum(monthlyValue over eligible months) / eligibleMonthCount`
4. Create virtual `MeterReadingValue` entries from annual averages.

#### Alternate Flows

- If key missing in a month, contribution is `0` for that month (configurable decision).

#### Edge Cases

- Multiple readings in month are all included.
- Month denominator remains 1 per eligible month.
- Uneven parameter/timezone presence across months.

#### Validation Rules

- `eligibleMonthCount >= 1`
- Decimal rounding uses deterministic mode (`HALF_UP`) and fixed scale.

#### Failure Scenarios

- Division by zero.
- Missing mandatory fields for virtual value entity.

### FR-4: Virtual Power Factor Calculation

#### Description

Compute virtual PF from averaged values for each meter.

#### Actors

- PF computation component

#### Preconditions

- Virtual `MeterReadingValue` list available.

#### Main Flow

1. Group virtual values by meter.
2. For each meter:
    - `totalConsumption = sum(import kWh mulValue)`
    - `totalApparent = sum(import kVAh mulValue)`
3. If totals valid, `PF = totalConsumption / totalApparent`.
4. Round PF to 2 decimals.
5. Create virtual `MeterReadingPowerFactor` for meter.

#### Alternate Flows

- If required parameter pair not available, PF entry is omitted unless rule requires PF.

#### Edge Cases

- `totalApparent = 0`
- PF outside `[0,1]` due to bad data

#### Validation Rules

- PF must satisfy `0 <= PF <= 1`.

#### Failure Scenarios

- PF required by formula but unavailable.

### FR-5: Billing Context Override and Rule Execution

#### Description

Run existing formula pipeline using virtual reading and context-date tariff/rates.

#### Actors

- `SdBillGenerator`
- Existing rule engine components

#### Preconditions

- Virtual reading and PF prepared.
- Context date resolved.

#### Main Flow

1. Build billing context with:
    - Virtual reading object.
    - Connection/tariff/variable rates active on `contextDate`.
2. Pick billing rule with current rule selector.
3. Execute computed properties.
4. Execute charge heads.
5. Extract SD amount from configured charge-head mapping.

#### Alternate Flows

- Preview mode returns computed results only.

#### Edge Cases

- Tariff boundary date transitions.
- Missing context data on event date.

#### Validation Rules

- Context date must drive tariff/rates, not reading end date.

#### Failure Scenarios

- No matching billing rule.
- Missing tariff config/rate entries.
- Formula property unresolved.

### FR-6: Persistence, Audit, and Idempotency

#### Description

Persist SD result and full recalculation trace for audits.

#### Actors

- SD service
- Auditors/support

#### Preconditions

- Rule execution successful (commit mode).

#### Main Flow

1. Save recalculation run metadata.
2. Save month-level inclusion/exclusion records.
3. Save/update `sd_demands` and related `sd_register` rows.
4. Return IDs and amount.

#### Alternate Flows

- Existing successful run for same idempotency key returns previous result.

#### Edge Cases

- Concurrent requests for same connection.
- Existing active SD demand record.

#### Validation Rules

- Commit executes in single DB transaction.
- Idempotency key uniqueness enforced.

#### Failure Scenarios

- Transaction rollback due to conflicts.
- Persistence failure after computation.

## 4. Non-Functional Requirements

### Performance

- Preview recalculation p95 <= 3s per connection for typical 12-month load.
- Commit recalculation p95 <= 4s.

### Scalability

- Stateless service nodes; horizontal scaling supported.
- Batch orchestration should partition by connection.

### Availability

- API availability target: 99.5% monthly.
- Retry-safe behavior through idempotency.

### Security

- Authenticated gRPC access only.
- Role-based authorization for preview/commit/audit retrieval.

### Compliance

- Store recalculation trace suitable for financial audit.
- Retain run metadata for at least 7 years.

### Observability

- Structured logs include `runId`, `connectionId`, trigger type.
- Metrics:
    - request count by status
    - execution latency
    - eligible/excluded month counts
    - exclusion reason distribution

### Backup and Recovery

- DB backup with PITR.
- RPO <= 15 minutes, RTO <= 2 hours for SD recalculation data.

## 5. System Architecture

### High-level architecture description

Add an SD recalculation orchestration path inside existing service boundaries, reusing billing rule execution
infrastructure.

### Service boundaries

- `SdRecalculationGrpcService` (new API facade)
- `SdRecalculationOrchestrator` (window, idempotency, flow control)
- `SdReadingEligibilityService` (month filtering and coverage)
- `SdVirtualReadingBuilder` (average values and PF)
- `SdBillGenerator` (rule execution wrapper)
- Existing persistence services (`SdDemandsService`, `SdRegisterService`)

### Data flow

1. Trigger received.
2. Window + context date resolved.
3. Readings fetched and classified.
4. Eligible months aggregated.
5. Virtual reading and PF built.
6. Billing context resolved at context date.
7. Rule execution performed.
8. SD amount persisted (commit mode).
9. Run audit saved and returned.

### External dependencies

- PostgreSQL
- Existing repositories for tariff, variable rates, connection data
- Existing gRPC and auth stack

## 6. Data Model

### Entities

#### Existing entities used

- `meter_readings`
- `meter_reading_values`
- `meter_reading_powerfactor`
- `sd_demands`
- `sd_register`

#### New entities recommended

1. `sd_recalculation_runs`
    - `run_id` (UUID, PK)
    - `connection_id`
    - `trigger_type`
    - `context_date`
    - `window_start`, `window_end`
    - `eligible_month_count`, `excluded_month_count`
    - `status`
    - `idempotency_key`
    - `computed_sd_amount`
    - `rule_id`
    - `created_ts`, `created_by`

2. `sd_recalculation_months`
    - `id` (PK)
    - `run_id` (FK)
    - `year_month`
    - `is_included`
    - `exclusion_reason_code`
    - `coverage_start`, `coverage_end`
    - `reading_ids_json`

### Key fields

- Reading grouping: `YearMonth(readingEndDate)`
- Aggregation key: `(meterId, timezoneId, parameterId)`
- Context selection date: `contextDate`

### Relationships

- One run -> many month decisions.
- One run optionally references generated/updated SD demand and register rows.

### Indexing strategy

- `meter_readings(connection_id, reading_end_date, is_active)`
- `meter_readings(connection_id, reading_start_date, reading_end_date)`
- `meter_reading_values(meter_reading_id, meter_id, parameter_id, timezone_id, is_active)`
- `sd_recalculation_runs(connection_id, context_date, trigger_type)`
- unique index on `sd_recalculation_runs(idempotency_key)`
- `sd_recalculation_months(run_id, year_month)`

### Data retention policy

- Recalculation runs and month decisions retained for 7 years.

## 7. API Design

### API style

Primary interface: gRPC.

### Endpoint A: Preview SD recalculation

- Method: gRPC unary
- RPC: `PreviewSdRecalculation`
- Request schema:
    - `connection_id` (required)
    - `trigger_type` (required)
    - `context_date` (required, `YYYY-MM-DD`)
    - `financial_year` (optional for annual mode)
    - `trigger_reference` (optional)
    - `idempotency_key` (optional)
- Response schema:
    - `run_id`
    - `total_sd_amount`
    - `eligible_month_count`
    - `month_decisions[]`
    - `generated_bill_summary`
- Status codes:
    - `OK`
    - `INVALID_ARGUMENT`
    - `NOT_FOUND`
    - `FAILED_PRECONDITION`
    - `INTERNAL`
- Error format:
    - Structured validation/internal error with field-level details.
- Authentication:
    - Required (`SD_PREVIEW` privilege).

### Endpoint B: Commit SD recalculation

- Method: gRPC unary
- RPC: `RecalculateSd`
- Request schema:
    - same fields as preview
    - `force` (optional)
    - `initiated_by` (required for audit)
- Response schema:
    - `run_id`
    - `sd_demand_id`
    - `sd_register_id`
    - `total_sd_amount`
    - `status`
- Status codes:
    - `OK`
    - `INVALID_ARGUMENT`
    - `PERMISSION_DENIED`
    - `ABORTED`
    - `INTERNAL`
- Error format:
    - Structured validation/internal error.
- Authentication:
    - Required (`SD_RECALCULATE_COMMIT` privilege).

### Endpoint C: Get recalculation run

- Method: gRPC unary
- RPC: `GetSdRecalculationRun`
- Request schema:
    - `run_id`
- Response schema:
    - run metadata
    - month decisions
    - linked SD IDs
- Status codes:
    - `OK`
    - `NOT_FOUND`
    - `PERMISSION_DENIED`
    - `INTERNAL`
- Authentication:
    - Required (`SD_VIEW_AUDIT` privilege).

## 8. Security Design

### Authentication

- Reuse existing gRPC auth interceptor stack.

### Authorization

- Role-based checks:
    - Preview: `SD_PREVIEW`
    - Commit: `SD_RECALCULATE_COMMIT`
    - Audit read: `SD_VIEW_AUDIT`

### Role model

- Billing Ops: preview + commit
- Auditor: read-only run history
- Admin: forced rerun and advanced controls

### Data protection

- Avoid sensitive data in logs.
- Persist only fields needed for financial audit.

### Encryption strategy

- TLS in transit.
- DB encryption at rest by infra policy.

### Audit logging

- Log principal, trigger, context date, included/excluded months, final amount, run ID.

## 9. Deployment and Infrastructure

### Environment setup

- Dev, QA, UAT, Prod environments.
- Liquibase migration for new run/audit tables and indexes.

### CI/CD expectations

- Compile, tests, checkstyle, proto generation.
- Liquibase validate and migration checks in pipeline.

### Configuration management

- Add config keys:
    - `sd.recalc.min.eligible.months`
    - `sd.recalc.event.window.strategy`
    - `sd.recalc.allow.force.rerun`

### Secrets management

- No secrets in repo.
- Use platform secret manager for DB/auth credentials.

### Monitoring setup

- Metrics dashboards for latency, success rate, exclusion reasons.
- Alert thresholds for repeated failures and high latency.

## 10. Risks and Mitigation

### Technical risks

- Incorrect partial month coverage algorithm.
    - Mitigation: interval union algorithm with dedicated test matrix.
- Formula dependency mismatch in SD extraction.
    - Mitigation: rule-output mapping tests.

### Operational risks

- Concurrent recalculations for same connection.
    - Mitigation: per-connection lock and idempotency key.
- Heavy data volume for industrial consumers.
    - Mitigation: query indexing and paged/batched processing.

### Security risks

- Unauthorized commit access.
    - Mitigation: strict role checks and audit trails.
- Overly verbose logs exposing operational data.
    - Mitigation: structured redaction policy.

## 11. Open Questions

1. Event-mode window rule confirmation: previous 12 complete months before context month.
2. Minimum required eligible months (1 or threshold such as 6).
3. Missing key in eligible month behavior (0 fill vs key-specific denominator).
4. Definitive charge-head(s) used to map generated bill into `total_sd_amount`.
5. Re-run behavior for existing SD demand: create new version or update in place.
6. PF unavailability policy when formula references power factor.

## 12. Implementation Phases

### Phase 1: Contracts and schema

- Add gRPC contracts for preview/commit/get-run.
- Add Liquibase for `sd_recalculation_runs` and `sd_recalculation_months`.
- Milestone: API and schema approved.

### Phase 2: Eligibility engine

- Implement historical fetch, full-month coverage, month decisions.
- Milestone: deterministic eligibility outputs against fixture set.

### Phase 3: Virtual reading and PF

- Implement monthly aggregation and annual averaging.
- Build virtual meter reading values and power factors.
- Milestone: virtual reading available for rule pipeline.

### Phase 4: SD bill generation

- Implement `SdBillGenerator` using existing rule execution components.
- Add context date override in billing context builder.
- Milestone: preview endpoint returns stable SD amount.

### Phase 5: Persistence and controls

- Implement commit flow, idempotency, locking, and run auditing.
- Milestone: commit endpoint production-ready.

### Phase 6: Hardening and rollout

- Add unit/integration/load tests.
- Configure dashboards/alerts.
- Roll out via feature flag across non-prod then prod.
