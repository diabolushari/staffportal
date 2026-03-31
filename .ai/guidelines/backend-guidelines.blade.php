{{-- Consolidated Backend Guidelines (unique & non-conflicting) --}}
{{-- Sourced from .github/workflows/instructions/back-end.md with removal of rules already covered in
copilot-instructions.md attachment. --}}

@php
    // Purpose: Provide Laravel Boost with concise, de-duplicated backend engineering guardrails.
@endphp

<h2>Project Structure & Architecture</h2>
<ul>
    <li>Group backend classes by feature inside default Laravel folders (Controllers, Models, Services, Requests,
        Policies, etc.).</li>
    <li>Use final classes for controllers, services, actions, requests, models to prevent unintended inheritance.</li>
    <li>Prefer read-only promoted constructor properties for dependencies; avoid public mutable state.</li>
    <li>No business logic inside controllers; delegate to small single-purpose service/action classes.</li>
    <li>Keep classes focused: max ~300 lines; methods &lt;= 80 lines (strive for much smaller).</li>
</ul>

<h2>Naming & Conventions</h2>
<ul>
    <li>PascalCase class names; singular nouns (e.g. <code>ProjectInstance</code>, <code>ReferenceDataParameter</code>).
    </li>
    <li>Method names in camelCase starting with a verb (e.g. <code>storeRecord</code>, <code>verifySecondValue</code>).
    </li>
    <li>Boolean method prefixes: is / has / can / should (e.g. <code>isAuthorized</code>, <code>hasSecondValue</code>).
    </li>
    <li>Constants in UPPER_SNAKE_CASE.</li>
    <li>Use imported class names instead of fully-qualified inline references.</li>
</ul>

<h2>Class Design & Dependencies</h2>
<ul>
    <li>Inject dependencies via constructor (property promotion) — never instantiate heavy collaborators inline.</li>
    <li>Prefer interfaces for abstractions that may change (e.g. external gateways, complex domain services).</li>
    <li>Keep service classes single-action; compose multiple services for orchestration.</li>
    <li>Use value objects or enums for constrained primitives instead of raw strings/ints.</li>
</ul>

<h2>Type Safety & Data Handling</h2>
<ul>
    <li>Explicitly type every parameter & return; if impossible, document using PHPDoc with precise shapes.</li>
    <li>Document array shapes with PHPDoc; extract DTOs (Spatie Data) for multi-dimensional structures.</li>
    <li>Prefer DTOs over associative arrays for request/response boundaries.</li>
    <li>Use enums for fixed sets; value objects (e.g. Money, Email) for domain invariants.</li>
</ul>

<h2>Validation & Authorization</h2>
<ul>
    <li>Never consume request input before validation.</li>
    <li>Use Spatie Data attribute validation for structured form/data requests; Form Requests only for simple or legacy
        cases.</li>
    <li>Centralize authorization via policies / Gate::allows inside Data::authorize when following project pattern.</li>
    <li>Prefer <code>Gate::authorize()</code> or policy helpers over manual conditionals.</li>
</ul>

<h2>Error Handling</h2>
<ul>
    <li>Wrap persistence mutations in try/catch; convert user-facing validation branches into ErrorResponse objects.
    </li>
    <li>Surface unexpected exceptions through <code>ExceptionMessage::getMessage()</code> for production safety.</li>
</ul>

<h2>Database & Performance</h2>
<ul>
    <li>Use Eloquent ORM and relationships; avoid raw queries unless justified for performance.</li>
    <li>Prevent N+1 via eager loading (select only required columns).</li>
    <li>Chunk large data operations; queue long-running tasks instead of blocking HTTP cycle.</li>
    <li>Add indexes for frequently filtered columns; analyze slow queries before optimizing code paths.</li>
    <li>Use caching strategically for read-heavy, slow-to-compute aggregates.</li>
</ul>

<h2>Security</h2>
<ul>
    <li>Route groups must enforce authentication for any state-changing endpoint.</li>
    <li>Avoid using <code>env()</code> outside config files; read via <code>config()</code>.</li>
    <li>Validate file uploads and use centralized FileSaver abstraction.</li>
</ul>

<h2>Middleware & Cross-Cutting Concerns</h2>
<ul>
    <li>Implement custom middleware for recurring concerns (feature flags, subscription state) rather than scattering
        checks.</li>
    <li>Keep middleware lean—delegate heavy logic to services.</li>
</ul>


<h2>Documentation & Maintainability</h2>
<ul>
    <li>Prefer self-expressive naming over inline comments; reserve comments for clarifying domain rules.</li>
</ul>
