# Station-Consumer Relation Specification

## 1. Document Metadata

| Field              | Value                                                             |
|--------------------|-------------------------------------------------------------------|
| Module Name        | Station Consumer Relation                                         |
| Version            | 1.1                                                               |
| Author Role        | Principal Software Architect                                      |
| Technology Stack   | Spring Boot, PostgreSQL, gRPC, Laravel 12, Inertia React          |
| Development Phase  | Development Ready                                                 |
| Target Environment | Internal KSEB Staff Portal (Consumer + Generating Station domain) |
| Last Updated       | 2026-03-06                                                        |

## 2. Executive Summary

This module introduces a versioned relation between generating stations and consumer connections.

The module exists to support two independent priorities without resequencing side effects:

- `station_priority_order`: station preference from consumer side
- `consumer_priority_order` (UI alias: `consumer_station`): dispatch priority from station side

Key integration behavior:

- Station attachment is initiated from `connections.show`.
- At attach time, user provides `station_priority_order`, `effective_start`, and `effective_end`.
- System sets `consumer_priority_order = 0` during attachment.
- Priority updates are allowed from both sides:
  - station side updates `consumer_priority_order`
  - consumer side updates `station_priority_order`

The relation is append-only and versioned, with strict auditability and active-row uniqueness guarantees.

## 3. System Context

### 3.1 Context Diagram

```text
Inertia UI (ConnectionsShow / GeneratingStationShow)
                |
          Laravel Web Layer
                |
   Laravel gRPC Gateway Service Layer
                |
Spring Boot Consumer Service (gRPC)
                |
      PostgreSQL (consumer schema)
```

### 3.2 Upstream Systems

- Authenticated staff UI actions from Inertia pages
- Route context for current connection (`connections.show`)

### 3.3 Downstream Systems

- PostgreSQL relation persistence (`consumer.station_consumer_rel`)
- Parameter lookup (`parameter_value`) for relation type, station type, generation type, and station status

### 3.4 External Dependencies

- gRPC transport and protobuf contracts
- Liquibase for schema migration

## 4. Scope Definition

### 4.1 In Scope

- Versioned relation table, constraints, indexes, and changelog plan
- Create/update/deactivate/list/get/replacement service behavior
- gRPC contract and Laravel gateway normalization
- Inertia UI contract for:
  - connection-side attach
  - station-side consumer priority maintenance

### 4.2 Out of Scope

- Bulk historical backfill implementation
- Automatic priority resequencing
- Drag-and-drop priority UX
- Any dependency changes outside current project stack

### 4.3 Assumptions

- `connections` and `generating_stations` are versioned tables using logical IDs.
- `connections.show` route context identifies the consumer connection for attach flow.
- `consumer_type_id` is stored via `parameter_value` entries (`PRIMARY`, `SECONDARY`).

## 5. Domain Model

### 5.1 Entities

| Entity               | Description                                                              |
|----------------------|--------------------------------------------------------------------------|
| `GeneratingStation`  | Logical station aggregate (`station_id`) with station connection linkage |
| `Connection`         | Logical consumer connection aggregate (`connection_id`)                  |
| `StationConsumerRel` | Versioned relation aggregate linking station and consumer connection     |
| `ParameterValue`     | Domain values for relation type and station classification domains       |

### 5.2 Aggregate Relationships

```text
GeneratingStation (station_id)
   | 1..*
   | via StationConsumerRel
   |
Connection (consumer_connection_id)
```

### 5.3 Domain Invariants

- Only one active relation per `(station_id, consumer_connection_id)`.
- Active `station_priority_order` values are unique per consumer connection.
- Active `consumer_priority_order` values are unique per station when `consumer_priority_order > 0`.
- `station_priority_order >= 1`.
- `consumer_priority_order >= 0`.
- For prosumer stations, `consumer_priority_order = 1` is reserved exclusively for the `PRIMARY` relation.
- Relation updates never resequence other rows.

## 6. Business Rules

| Rule ID | Description                                                                                                                           |
|---------|---------------------------------------------------------------------------------------------------------------------------------------|
| BR-001  | Attach flow starts from `connections.show`, not station show.                                                                         |
| BR-002  | Attach request must include `station_priority_order`, `effective_start`, `effective_end` (nullable end).                              |
| BR-003  | On attach, service sets `consumer_priority_order = 0` automatically.                                                                  |
| BR-004  | Priority updates are bi-directional: station side updates `consumer_priority_order`, consumer side updates `station_priority_order`.  |
| BR-005  | Active uniqueness applies to station priority and consumer priority constraints as defined in Section 5.3.                            |
| BR-006  | Mutations are versioned append-only; old row is closed, new row inserted.                                                             |
| BR-007  | For prosumer stations, `consumer_priority_order = 1` is reserved for the primary station relation only.                               |
| BR-008  | Structured validation errors must map to field-level keys for Inertia forms.                                                          |
| BR-009  | Not-found get/list behavior returns empty/null payloads, not hard errors.                                                             |
| BR-010  | A station is treated as prosumer when `STATION_TYPE = Prosumer`.                                                                      |
| BR-011  | Update priority request uses `rel_id` + exactly one priority field + new record `effective_start` and `effective_end`.                |
| BR-012  | Deactivate request uses `rel_id` + deactivation `effective_end`.                                                                      |
| BR-013  | New update/deactivate dates must be validated against the current active record dates to prevent backward or out-of-window intervals. |
| BR-014  | Any non-primary prosumer relation with `consumer_priority_order = 1` must be rejected as a validation error.                          |

## 7. Parameter Domains

| Domain Code                 | Domain Name     | Values                                                  | Usage                                                |
|-----------------------------|-----------------|---------------------------------------------------------|------------------------------------------------------|
| `STATION_CONSUMER_REL_TYPE` | Relation Type   | `PRIMARY`, `SECONDARY`                                  | Stored in `consumer_type_id`                         |
| `STATION_TYPE`              | Station Type    | `Prosumer`, `CPP`, `IPP`                                | Prosumer rule enforcement and station classification |
| `GENERATION_TYPE`           | Generation Type | `Solar`, `Wind`, `Hydel`, `Thermal`, `Nuclear`, `Other` | Station generation source classification             |
| `STATION_STATUS`            | Station Status  | `Active`, `Inactive`, `Decommissioned`                  | Station lifecycle status                             |

Resolution pattern:

- Resolve parameter IDs by stable `parameter_code`.
- Cache lookups in service layer.

## 8. Database Design

### 8.1 Core Table

Table: `consumer.station_consumer_rel`

| Column                    | Type             | Null | Default  | Description                                |
|---------------------------|------------------|------|----------|--------------------------------------------|
| `version_id`              | integer identity | No   | identity | Row version PK                             |
| `rel_id`                  | integer          | Yes  | -        | Stable relation identity                   |
| `station_id`              | integer          | No   | -        | Logical station ID                         |
| `station_connection_id`   | integer          | No   | -        | Station-linked logical connection ID       |
| `consumer_connection_id`  | integer          | No   | -        | Consumer logical connection ID             |
| `consumer_type_id`        | integer          | No   | -        | FK to `parameter_value.id`                 |
| `consumer_priority_order` | integer          | No   | `0`      | Station-side priority (`consumer_station`) |
| `station_priority_order`  | integer          | No   | -        | Consumer-side station preference           |
| `effective_start`         | timestamp        | No   | -        | Row active start                           |
| `effective_end`           | timestamp        | Yes  | null     | Row active end                             |
| `is_current`              | boolean          | No   | `true`   | Current row flag                           |
| `created_ts`              | timestamp        | No   | `now()`  | Create audit timestamp                     |
| `updated_ts`              | timestamp        | Yes  | null     | Update audit timestamp                     |
| `created_by`              | integer          | Yes  | null     | Create actor                               |
| `updated_by`              | integer          | Yes  | null     | Update actor                               |
| `deleted_ts`              | timestamp        | Yes  | null     | Soft-delete timestamp                      |
| `deleted_by`              | integer          | Yes  | null     | Soft-delete actor                          |

### 8.2 Constraints

- `consumer_type_id -> parameter_value.id`
- Check constraints:
  - `consumer_priority_order >= 0`
  - `station_priority_order >= 1`
  - `effective_end IS NULL OR effective_end > effective_start`

### 8.3 Active Uniqueness Indexes

```sql
CREATE UNIQUE INDEX uq_scr_station_pri_active
    ON consumer.station_consumer_rel (station_id, consumer_priority_order) WHERE is_current = true AND deleted_ts IS NULL AND consumer_priority_order > 0;

CREATE UNIQUE INDEX uq_scr_consumer_pri_active
    ON consumer.station_consumer_rel (consumer_connection_id, station_priority_order) WHERE is_current = true AND deleted_ts IS NULL;

CREATE UNIQUE INDEX uq_scr_station_consumer_pair_active
    ON consumer.station_consumer_rel (station_id, consumer_connection_id) WHERE is_current = true AND deleted_ts IS NULL;
```

### 8.4 Read Indexes

```sql
CREATE INDEX idx_scr_station_active
    ON consumer.station_consumer_rel (station_id, is_current, consumer_priority_order);

CREATE INDEX idx_scr_consumer_active
    ON consumer.station_consumer_rel (consumer_connection_id, is_current, station_priority_order);

CREATE INDEX idx_scr_rel_id
    ON consumer.station_consumer_rel (rel_id);
```

## 9. Entity Relationship Model

```text
GeneratingStation (logical: station_id)
   └── StationConsumerRel (versioned: rel_id + version_id)
Connection (logical: connection_id)
   └── StationConsumerRel (consumer_connection_id)
ParameterValue
   └── StationConsumerRel.consumer_type_id
```

Cardinality:

- One station can have many relation rows over time.
- One consumer connection can have many relation rows over time.
- One active station-consumer pair is allowed at a time.

## 10. Service Architecture

```text
gRPC / Web API Layer
      |
StationConsumerRel Orchestrator Service
      |
Domain Validation + Prosumer Rule Services
      |
Repository Layer (JPA)
      |
PostgreSQL
```

Service operations:

- `createRelation(...)`
- `updatePriorities(...)`
- `deactivateRelation(...)`
- `replacePrimaryConsumer(...)`
- `get/list` read operations

## 11. Component Responsibilities

| Component               | Class/File                                                       | Responsibility                                                                             |
|-------------------------|------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| gRPC API                | `station-consumer-rel.proto` handlers                            | Contract handling, error translation                                                       |
| Domain Service          | `StationConsumerRelService`                                      | Validation, lifecycle, transaction orchestration                                           |
| Repository              | `StationConsumerRelRepository`                                   | Active-row queries, lock queries, existence checks                                         |
| Entity                  | `StationConsumerRel`                                             | Persistence mapping and relation metadata                                                  |
| Laravel Controller      | `StationConsumerRelController`                                   | Web mutation endpoints and redirects                                                       |
| Laravel Page Controller | `ConnectionController@show`                                      | Attach UI props and consumer-side station priority update props (`station_priority_order`) |
| Laravel Page Controller | `GeneratingStationController@show`                               | Station-side consumer priority update props (`consumer_priority_order`)                    |
| Inertia Page            | `resources/js/pages/Connections/ConnectionsShow.tsx`             | Station attach UX                                                                          |
| Inertia Page            | `resources/js/pages/GeneratingStation/GeneratingStationShow.tsx` | Consumer priority edit UX                                                                  |

## 12. Core Algorithms

### 12.1 Attach Station (Connection Side)

Inputs:

- `consumer_connection_id` (route context)
- `station_id`
- `station_priority_order`
- `effective_start`
- `effective_end` (optional)

Output:

- New active relation version row

Pseudocode:

```text
BEGIN TRANSACTION
1. Validate station active and resolve station_connection_id
2. Validate consumer connection active
3. Validate station_priority_order >= 1
4. Validate effective date interval
5. Set consumer_priority_order = 0
6. Set consumer_type_id (default SECONDARY unless explicit workflow supplies value)
7. Validate uniqueness constraints (including >0 rule for consumer priority)
8. Insert active row with provided effective_start/effective_end
9. Set rel_id = version_id for first insert
COMMIT
```

### 12.2 Update Priorities (Station Side and Consumer Side)

Inputs:

- `rel_id`
- one of:
  - `consumer_priority_order` (station-side update)
  - `station_priority_order` (consumer-side update)
- `effective_start` (new version start)
- `effective_end` (new version end)
- optional `consumer_type_id`

Output:

- New active version row with same `rel_id`

Pseudocode:

```text
BEGIN TRANSACTION
1. SELECT active row FOR UPDATE by rel_id
2. Validate exactly one new priority is provided
3. Validate new record interval (effective_end > effective_start)
4. Validate new dates against current active row dates:
   - request.effective_start > current.effective_start
   - if current.effective_end is not null:
     - request.effective_start < current.effective_end
     - request.effective_end <= current.effective_end
5. Validate new priorities and prosumer rules
   - for prosumer stations:
     - `consumer_priority_order = 1` requires `consumer_type_id = PRIMARY`
     - `consumer_type_id != PRIMARY` requires `consumer_priority_order != 1`
6. Close current row (effective_end = request.effective_start, is_current=false)
7. Insert replacement row with same rel_id:
   - carry forward unchanged priority from previous active row
   - apply provided priority value
   - set effective_start/effective_end from request
COMMIT
```

### 12.3 Deactivate Relation

Inputs:

- `rel_id`
- `effective_end` (deactivation end date)

Pseudocode:

```text
BEGIN TRANSACTION
1. Lock active row FOR UPDATE by rel_id
2. Validate requested effective_end against current active row dates:
   - request.effective_end > current.effective_start
   - if current.effective_end is not null:
     - request.effective_end <= current.effective_end
3. Validate primary deactivation safety for prosumer stations
4. Close row with effective_end=request.effective_end and delete audit fields
COMMIT
```

### 12.4 Replace Primary Consumer (Prosumer)

Pseudocode:

```text
BEGIN TRANSACTION
1. Validate old primary is active
2. Deactivate old primary
3. Create new primary with consumer_priority_order = 1
COMMIT
```

## 13. Data Processing Flow

```text
UI Submit
  -> Laravel Validation/Controller
  -> Laravel gRPC Service Wrapper
  -> gRPC Request
  -> Spring Service Validation
  -> Repository Read/Lock + Persist
  -> gRPC Response (or structured validation error)
  -> Laravel error/flash normalization
  -> Inertia re-render with updated props
```

Data transformations:

- UI alias `consumer_station` -> backend field `consumer_priority_order`
- gRPC validation details -> Inertia field error map

## 14. API Design

### 14.1 gRPC Methods

- `CreateStationConsumerRel`
- `UpdateStationConsumerRelPriority`
- `DeactivateStationConsumerRel`
- `ReplaceStationPrimaryConsumer`
- `GetStationConsumerRel`
- `ListStationConsumers`
- `ListConsumerStations`

### 14.2 gRPC Message Requirements

Core message includes:

- identity: `version_id`, `rel_id`
- relation: `station_id`, `station_connection_id`, `consumer_connection_id`, `consumer_type_id`
- priorities: `consumer_priority_order`, `station_priority_order`
- lifecycle: `effective_start`, `effective_end`, `is_current`
- audit: `created_by`, `updated_by`, `deleted_by`

Update request contract:

- `rel_id` (required)
- one of:
  - `consumer_priority_order`
  - `station_priority_order`
- `effective_start` (required)
- `effective_end` (required)

Deactivate request contract:

- `rel_id` (required)
- `effective_end` (required)

### 14.3 Web Routes

- `POST /station-consumer-rel` -> `station-consumer-rel.store`
- `PUT /station-consumer-rel/{relId}` -> `station-consumer-rel.update`
- `DELETE /station-consumer-rel/{relId}` -> `station-consumer-rel.destroy`
- `POST /station-consumer-rel/replace-primary` -> `station-consumer-rel.replace-primary`

Reference pages:

- `GET /connections/{connection}` -> `connections.show`
- `GET /generating-stations/{id}` -> `generating-stations.show`

### 14.4 Validation/Error Contract

Field-level errors supported:

- `rel_id`
- `consumer_priority_order`
- `station_priority_order`
- `consumer_type_id`
- `consumer_connection_id`
- `station_connection_id`
- `effective_start`
- `effective_end`

Date-window validation rules:

- Update must satisfy:
  - `request.effective_end > request.effective_start`
  - `request.effective_start > current.effective_start`
  - when `current.effective_end` is present:
    - `request.effective_start < current.effective_end`
    - `request.effective_end <= current.effective_end`
- Deactivate must satisfy:
  - `request.effective_end > current.effective_start`
  - when `current.effective_end` is present:
    - `request.effective_end <= current.effective_end`

Error classes:

- `INVALID_ARGUMENT` for validation/conflicts
- `INTERNAL` for unexpected failures

## 15. Configuration

| Key                           | Type         | Default         | Description                            |
|-------------------------------|--------------|-----------------|----------------------------------------|
| `prosumer.station-type-codes` | list<string> | `Prosumer`      | Station type codes treated as prosumer |
| `grpc.host` / `GRPC_HOST`     | string       | env-specific    | Consumer service endpoint              |
| `grpc.timeout.ms`             | int          | service default | gRPC request timeout                   |

## 16. Security Considerations

- All routes are in authenticated web middleware.
- Authorization must ensure only permitted staff mutate relations.
- Audit fields (`created_by`, `updated_by`, `deleted_by`) must be populated.
- No sensitive personal data is stored in relation table.
- Validation errors must not leak internal stack traces.

## 17. Concurrency and Idempotency

- Use `SELECT ... FOR UPDATE` for mutation on active relation rows.
- Unique indexes are final conflict guards after service pre-checks.
- Retries for transient DB errors are allowed at service boundary.
- Idempotency strategy:
  - client repeats same create payload may return duplicate-pair validation error
  - updates/deactivations are relation-based (`rel_id`); invalid active-window transitions yield deterministic failure

## 18. Observability

Metrics:

- relation_create_success_total
- relation_update_success_total
- relation_deactivate_success_total
- relation_validation_error_total (tagged by field)
- relation_conflict_error_total

Logging:

- structured logs with `rel_id`, `version_id`, `station_id`, `consumer_connection_id`, actor ID
- warn-level logs for validation conflicts
- error-level logs for internal failures with trace correlation

Tracing:

- Laravel request trace -> gRPC span -> DB operation spans

## 19. Acceptance Criteria

```yaml
-   id: AC-001
    maps_to: BR-001
    description: Station attachment originates from connections.show.
    given: User opens connections.show
    when: User attaches a station
    then: Backend creates relation without requiring station-page create flow

-   id: AC-002
    maps_to: BR-002
    description: Attach payload captures station priority and date range.
    given: Valid station + consumer connection
    when: Create is submitted
    then: station_priority_order/effective_start/effective_end are persisted

-   id: AC-003
    maps_to: BR-003
    description: consumer_station defaults to 0 at attach.
    given: Create request from connection-side attach
    when: Service persists relation
    then: consumer_priority_order is stored as 0

-   id: AC-004
    maps_to: BR-004
    description: Priority updates are supported from both sides.
    given: Existing active relation
    when: Station-side or consumer-side update is submitted
    then: New version row stores only the side-specific updated priority

-   id: AC-005
    maps_to: BR-005
    description: Active uniqueness constraints are enforced.
    given: Existing active conflicting row
    when: Create or update violates unique rules
    then: Structured field-level validation error is returned

-   id: AC-006
    maps_to: BR-006
    description: Mutations are append-only.
    given: Existing active relation
    when: Update/deactivate occurs
    then: Previous row is closed and not mutated in place

-   id: AC-007
    maps_to: BR-008
    description: Field errors are usable by Inertia forms.
    given: Validation failure in gRPC layer
    when: Laravel maps response
    then: errors[field] keys match contract

-   id: AC-008
    maps_to: BR-009
    description: get/list not-found behavior is non-fatal.
    given: No matching relation for lookup
    when: Get/list executes
    then: empty/null payload returned without hard page error

-   id: AC-009
    maps_to: BR-010
    description: Prosumer rules are triggered from station type domain.
    given: A station with STATION_TYPE = Prosumer
    when: Primary/secondary relation validations run
    then: Prosumer constraints are enforced for that station

-   id: AC-010
    maps_to: BR-011
    description: Update payload uses rel_id + exactly one priority + new record date window.
    given: Existing active relation identified by rel_id
    when: Update is submitted with one priority field and effective_start/effective_end
    then: Service creates new version row with provided window and rejects invalid combinations

-   id: AC-011
    maps_to: BR-012
    description: Deactivate payload uses rel_id + deactivation end date.
    given: Existing active relation identified by rel_id
    when: Deactivate is submitted with effective_end
    then: Active row closes at requested effective_end

-   id: AC-012
    maps_to: BR-013
    description: New dates are validated against old active record dates.
    given: Existing active relation with current effective_start/effective_end
    when: Update or deactivate is submitted
    then: Request is rejected if submitted dates move backward or exceed the current active window

-   id: AC-013
    maps_to: BR-014
    description: Priority slot 1 is reserved for primary station relation in prosumers.
    given: A prosumer station relation update/create attempt
    when: consumer_priority_order is set to 1 for a non-primary relation
    then: Request is rejected with validation error on consumer_priority_order/consumer_type_id
```

## 20. Worked Example

Input state:

- consumer connection: `connection_id=9001`
- station: `station_id=301`, `station_connection_id=7001`
- no active relation for this pair

Step A: Attach from `connections.show`

- request values:
  - `station_priority_order=2`
  - `effective_start=2026-03-06T00:00:00`
  - `effective_end=null`

Result:

- inserted row values:
  - `station_priority_order=2`
  - `consumer_priority_order=0`
  - `is_current=true`
  - `rel_id=version_id`

Step B: Station-side update on `generating-stations.show`

- request values:
  - `rel_id=<existing_rel_id>`
  - `consumer_priority_order=4`
  - `effective_start=2026-03-10T00:00:00`
  - `effective_end=2026-12-31T23:59:59`

Result:

- old row closed (`effective_end=request.effective_start`, `is_current=false`)
- new row inserted with same `rel_id` and `consumer_priority_order=4`

Step C: Consumer-side update on `connections.show`

- request values:
  - `rel_id=<existing_rel_id>`
  - `station_priority_order=1`
  - `effective_start=2027-01-01T00:00:00`
  - `effective_end=2027-12-31T23:59:59`

Result:

- new version row inserted with updated `station_priority_order`
- existing `consumer_priority_order` value is carried forward unchanged

Step D: Deactivate relation

- request values:
  - `rel_id=<existing_rel_id>`
  - `effective_end=2027-12-31T23:59:59`

Result:

- active row is closed at provided end date

## 21. Performance Requirements

- p95 create/update/deactivate latency: <= 300 ms at service layer (excluding network jitter)
- list calls should return sorted active rows in <= 200 ms for typical station/connection scopes
- indexing must support active-row filters without sequential scans in normal loads

## 22. Failure Handling

- Validation errors:
  - return structured `INVALID_ARGUMENT` with field mappings
- Unique conflict errors:
  - map DB constraint violation to corresponding field error
- Internal errors:
  - return `INTERNAL`, log with trace ID
- Transaction rollback:
  - all mutation failures rollback fully

## 23. Deployment Model

- Database changes delivered through Liquibase changelog:
  - `79-station-consumer-rel.xml`
  - optional seed file for relation type values
- Backend deploy updates gRPC service and proto consumers
- Laravel deploy updates controllers/services/pages for prop and form contract
- Feature flag optional for gradual UI exposure of new card/actions

## 24. Implementation Phases

| Phase | Deliverable                                   | Milestone                                        |
|-------|-----------------------------------------------|--------------------------------------------------|
| 1     | DB schema + indexes + entity/repository       | Migration complete and repository tests pass     |
| 2     | Service + gRPC contract + validation mapping  | gRPC test suite green                            |
| 3     | Laravel gateway + Inertia attach/update flows | Feature tests green for route/controller mapping |
| 4     | Observability + hardening + rollout           | Production readiness checklist complete          |

## 25. Developer Checklist

- [ ] Liquibase table, checks, and partial unique indexes implemented
- [ ] `consumer_priority_order` default `0` verified in create path
- [ ] `connections.show` attach flow sends required fields only
- [ ] station-side page updates `consumer_priority_order`
- [ ] consumer-side page updates `station_priority_order`
- [ ] update payload validates `rel_id` + exactly one priority + `effective_start/effective_end`
- [ ] deactivate payload validates `rel_id` + `effective_end`
- [ ] update/deactivate date validation compares request dates with current active row dates
- [ ] prosumer rule enforces reserved `consumer_priority_order = 1` for `PRIMARY` only
- [ ] append-only mutation behavior verified by tests
- [ ] validation errors map to agreed field keys
- [ ] prosumer primary constraints covered by tests
- [ ] logs and metrics added for all mutating paths

## 26. Risks and Mitigations

| Risk                                                                                      | Impact                                       | Mitigation                                                             |
|-------------------------------------------------------------------------------------------|----------------------------------------------|------------------------------------------------------------------------|
| Ambiguity between UI alias and DB field (`consumer_station` vs `consumer_priority_order`) | Wrong field wiring in UI/API                 | Keep alias mapping explicit in DTO/form adapters and tests             |
| Conflicts under concurrent updates                                                        | User-visible failures                        | Lock active rows + retain unique indexes as final guard                |
| Prosumer rule misconfiguration                                                            | Invalid primary state                        | Parameter-code validation at startup and runtime checks                |
| Route-level context mistakes in attach flow                                               | Relation linked to wrong consumer connection | Derive consumer connection from route context and validate server-side |
