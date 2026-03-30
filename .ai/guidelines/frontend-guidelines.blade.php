{{-- Consolidated Frontend Guidelines (unique & non-conflicting) --}}
{{-- Sourced from .github/workflows/instructions/front-end.md with duplicates/conflicts removed. --}}

@php
    // Purpose: Provide concise React + Inertia + TypeScript guardrails for development.
@endphp

<h2>Structure & Organization</h2>
<ul>
    <li>Organize code by feature inside domain folders (Components, Hooks, Pages, Layout, Libs, DataStructures, ui for
        shadcn).</li>
    <li>Keep reusable cross-feature components in a shared directory; avoid duplication.</li>
    <li>All shadcn components live under <code>ui</code> retaining original filenames.</li>
    <li>Use kebab-case (preferred) or camelCase for file & folder names; components/pages keep PascalCase exports.</li>
</ul>

<h2>Component Design</h2>
<ul>
    <li>Single responsibility per component; extract reusable UI fragments promptly.</li>
    <li>Do not nest component declarations inside other components; declare at module top scope.</li>
    <li>Avoid ternary or switch for conditional rendering; use logical <code>&amp;&amp;</code> blocks or separate
        functions/components.</li>
    <li>Props must be readonly (TypeScript <code>readonly</code> or inferred immutability).</li>
    <li>Co-locate feature interfaces/types in a single <code>types.ts</code> (or similar) file per feature.</li>
</ul>

<h2>Hooks & State</h2>
<ul>
    <li>Encapsulate data fetching / complex state in custom hooks instead of inline useEffect logic in components.</li>
    <li>Custom hook names start with <code>use</code> and describe purpose (e.g. <code>useProjectMetrics</code>).</li>
    <li>Call hooks only at top level of components or other hooks (never in conditions/loops).</li>
    <li>Don't pass hook functions themselves as props—expose derived callbacks/state values instead.</li>
    <li>Use Inertia's <code>usePage</code> to access page props.</li>
</ul>

<h2>Performance</h2>
<ul>
    <li>Memoize expensive calculations with <code>useMemo</code>; stable callback props via <code>useCallback</code>.
    </li>
    <li>Always supply dependency arrays; never omit them.</li>
    <li>Wrap pure presentational components with <code>React.memo</code> when prop churn risks re-render cost.</li>
    <li>Reserve <code>useLayoutEffect</code> only for pre-paint DOM measurements.</li>
</ul>

<h2>Data & Logic</h2>
<ul>
    <li>Use nullish coalescing <code>??</code> instead of logical OR for defaulting.</li>
    <li>Favor custom hooks over ad-hoc effects for side-effects & fetching.</li>
    <li>Use <code>useSyncExternalStore</code> for subscription-based external sources.</li>
    <li>All JSON fields use snake_case; map to camelCase in TypeScript layer if desired (centralize mapping).</li>
</ul>

<h2>Routing</h2>
<ul>
    <li>Use global <code>route()</code> helper (Ziggy) without importing from ziggy-js.</li>
</ul>

<h2>Styling</h2>
<ul>
    <li>Prefer Tailwind <code>gap-*</code> utilities over space-* where layout allows.</li>
</ul>

<h2>Naming</h2>
<ul>
    <li>Components & enums in PascalCase (enum members UPPER_SNAKE_CASE).</li>
    <li>Variables, functions, and props in camelCase; boolean prefixed with is/has/can/should.</li>
    <li>Event handlers prefixed with handle / on (e.g. <code>handleSubmit</code>).</li>
    <li>Context provider files use <code>-context</code> suffix.</li>
    <li>Use single-letter generic type params (T, U, V...).</li>
</ul>

<h2>TypeScript</h2>
<ul>
    <li>All component props must be typed via interfaces or type aliases.</li>
    <li>Define hook return types explicitly when not inferred clearly.</li>
    <li>Use enums for discrete sets; discriminated unions for variant states.</li>
</ul>
