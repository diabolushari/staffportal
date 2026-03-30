# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **KSEB (Kerala State Electricity Board) Staff Portal** built with Laravel 12 + React + Inertia.js + gRPC microservices architecture. The application serves as a staff management system with gRPC-based communication to external services.

### Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript + Inertia.js v2
- **Protocol**: gRPC with Protocol Buffers
- **Styling**: TailwindCSS v4 + Radix UI components
- **Testing**: Pest PHP v3
- **Build Tool**: Vite

## Development Commands

### Essential Commands

```bash
# Start full development environment (server, queue, logs, vite)
composer dev

# Start with SSR
composer dev:ssr

# Frontend development only
npm run dev

# Build for production
npm run build
npm run build:ssr

# Code quality
npm run lint          # ESLint with auto-fix
npm run format        # Prettier formatting
npm run types         # TypeScript type checking
vendor/bin/pint       # PHP code formatting (Laravel Pint)

# Testing
php artisan test                           # Run all tests
php artisan test --filter=testName        # Run specific test
php artisan test tests/Feature/ExampleTest.php  # Run specific file

# gRPC code generation (critical after .proto changes)
./scripts/generate-grpc.sh
```

## Architecture & Key Patterns

### gRPC Integration Pattern

**Always run** `./scripts/generate-grpc.sh` after modifying `.proto` files in `protos/` directory.

Generated PHP classes go to:
- `generated/Proto/` - gRPC client stubs and message classes  
- `generated/GPBMetadata/` - Protocol Buffer metadata

### Controller Structure

Controllers follow domain-based organization in `app/Http/Controllers/{Domain}/`:

```php
public function __construct()
{
    $this->client = new ParameterDefinitionServiceClient(env('GRPC_HOST'), [
        'credentials' => ChannelCredentials::createInsecure()
    ]);
}
```

### Error Handling

Use `GrpcErrorHandler::extractError($status)` for structured gRPC error parsing from `grpc-status-details-bin` metadata.

### Inertia Data Flow

```php
return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionIndex', [
    'parameterDefinitions' => $parameterDefinitions,
]);
```

### Proto Message Mapping

Manual mapping between Laravel requests and Protocol Buffer messages:

```php
$definition = new ParameterDefinitionProto();
$definition->setParameterName($request->parameterName);
```

## File Organization

### Backend Structure
- **Controllers**: `app/Http/Controllers/{Domain}/`
- **Services**: `app/Services/{Domain}/` and `app/Services/Grpc/`
- **Form Requests**: `app/Http/Requests/{Domain}/`
- **Proto Definitions**: `protos/{domain}/` (e.g., `protos/parameters/`)
- **Generated Classes**: `generated/Proto/{Domain}/` and `generated/GPBMetadata/`

### Frontend Structure  
- **Pages**: `resources/js/pages/{Domain}/` (Inertia convention)
- **Components**: `resources/js/components/{Domain}/`
- **UI Components**: `resources/js/components/ui/` (Radix UI based)
- **Hooks**: `resources/js/hooks/`
- **Types**: `resources/js/interfaces/`

## Critical Workflow Requirements

### Environment Setup
- PHP 8.2+ with `ext-grpc` extension enabled
- `protoc` compiler and `grpc_php_plugin` for code generation
- Node.js for frontend tooling

### Development Workflow
1. **Proto Changes**: Create/modify `.proto` → run `./scripts/generate-grpc.sh` → create/update controllers → create/update Inertia pages
2. **Frontend Components**: Use existing Radix UI patterns and TailwindCSS utilities
3. **Testing**: Use Pest syntax with Laravel-specific helpers
4. **Code Quality**: Always run `vendor/bin/pint` before finalizing PHP changes

### Key Dependencies
- **gRPC**: `grpc/grpc`, `google/protobuf`, `google/common-protos`
- **Frontend**: `@inertiajs/react`, `@radix-ui/*`, TailwindCSS v4
- **Laravel**: Inertia.js, Spatie Laravel Data, Ziggy

## Naming Conventions

- **Proto packages**: `com.kseb.consumerservice.proto.{domain}`
- **PHP namespaces**: `Proto\{Domain}` for generated classes
- **Controllers**: `{Entity}Controller` in domain folders  
- **Inertia pages**: `{Domain}/{Entity}/{Action}` structure
- **React components**: PascalCase with descriptive names

## Laravel Boost Integration

This project includes Laravel Boost with specific tools:
- Use `search-docs` tool for Laravel ecosystem documentation
- Use `tinker` tool for PHP debugging and Eloquent queries
- Use `database-query` tool for database reads
- Use `browser-logs` tool for frontend debugging

## Important Notes

- **Always** regenerate gRPC files after proto changes
- Follow existing code conventions - check sibling files for structure and patterns
- Use Form Request validation classes instead of inline controller validation
- Prefer Eloquent relationships over raw queries
- Real-time logs available via `php artisan pail --timeout=0`
- Frontend changes require `npm run build` or development server restart

===

<laravel-boost-guidelines>
=== .ai/backend-guidelines rules ===

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


=== .ai/frontend-guidelines rules ===

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


=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4.16
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- tightenco/ziggy (ZIGGY) - v2
- larastan/larastan (LARASTAN) - v3
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v3
- phpunit/phpunit (PHPUNIT) - v11
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.


=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

## URLs
- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms


=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.


=== tests rules ===

## Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test` with a specific filename or filter.


=== inertia-laravel/core rules ===

## Inertia Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use `search-docs` for accurate guidance on all things Inertia.

<code-snippet lang="php" name="Inertia::render Example">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>


=== inertia-laravel/v2 rules ===

## Inertia v2

- Make use of all Inertia features from v1 & v2. Check the documentation before making any changes to ensure we are taking the correct approach.

### Inertia v2 New Features
- Polling
- Prefetching
- Deferred props
- Infinite scrolling using merging props and `WhenVisible`
- Lazy loading data on scroll

### Deferred Props & Empty States
- When using deferred props on the frontend, you should add a nice empty state with pulsing / animated skeleton.

### Inertia Form General Guidance
- Build forms using the `useForm` helper. Use the code examples and `search-docs` tool with a query of `useForm helper` for guidance.


=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.


=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.


=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.


=== pest/core rules ===

## Pest
### Testing
- If you need to verify a feature is working, write or update a Unit / Feature test.

### Pest Tests
- All tests must be written using Pest. Use `php artisan make:test --pest {name}`.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files - these are core to the application.
- Tests should test all of the happy paths, failure paths, and weird paths.
- Tests live in the `tests/Feature` and `tests/Unit` directories.
- Pest tests look and behave like this:
<code-snippet name="Basic Pest Test Example" lang="php">
it('is true', function () {
    expect(true)->toBeTrue();
});
</code-snippet>

### Running Tests
- Run the minimal number of tests using an appropriate filter before finalizing code edits.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a related file).
- When the tests relating to your changes are passing, ask the user if they would like to run the entire test suite to ensure everything is still passing.

### Pest Assertions
- When asserting status codes on a response, use the specific method like `assertForbidden` and `assertNotFound` instead of using `assertStatus(403)` or similar, e.g.:
<code-snippet name="Pest Example Asserting postJson Response" lang="php">
it('returns all', function () {
    $response = $this->postJson('/api/docs', []);

    $response->assertSuccessful();
});
</code-snippet>

### Mocking
- Mocking can be very helpful when appropriate.
- When mocking, you can use the `Pest\Laravel\mock` Pest function, but always import it via `use function Pest\Laravel\mock;` before using it. Alternatively, you can use `$this->mock()` if existing tests do.
- You can also create partial mocks using the same import or self method.

### Datasets
- Use datasets in Pest to simplify tests which have a lot of duplicated data. This is often the case when testing validation rules, so consider going with this solution when writing tests for validation rules.

<code-snippet name="Pest Dataset Example" lang="php">
it('has emails', function (string $email) {
    expect($email)->not->toBeEmpty();
})->with([
    'james' => 'james@laravel.com',
    'taylor' => 'taylor@laravel.com',
]);
</code-snippet>


=== inertia-react/core rules ===

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet name="Inertia Client Navigation" lang="react">

import { Link } from '@inertiajs/react'
<Link href="/">Home</Link>

</code-snippet>


=== inertia-react/v2/forms rules ===

## Inertia + React Forms

<code-snippet name="Inertia React useForm Example" lang="react">

import { useForm } from '@inertiajs/react'

const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
})

function submit(e) {
    e.preventDefault()
    post('/login')
}

return (
<form onSubmit={submit}>
    <input type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
    {errors.email && <div>{errors.email}</div>}
    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
    {errors.password && <div>{errors.password}</div>}
    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} /> Remember Me
    <button type="submit" disabled={processing}>Login</button>
</form>
)

</code-snippet>


=== tailwindcss/core rules ===

## Tailwind Core

- Use Tailwind CSS classes to style HTML, check and use existing tailwind conventions within the project before writing your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc..)
- Think through class placement, order, priority, and defaults - remove redundant classes, add classes to parent or child carefully to limit repetition, group elements logically
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing
- When listing items, use gap utilities for spacing, don't use margins.

    <code-snippet name="Valid Flex Gap Spacing Example" lang="html">
        <div class="flex gap-8">
            <div>Superior</div>
            <div>Michigan</div>
            <div>Erie</div>
        </div>
    </code-snippet>


### Dark Mode
- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way, typically using `dark:`.


=== tailwindcss/v4 rules ===

## Tailwind 4

- Always use Tailwind CSS v4 - do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, configuration is CSS-first using the `@theme` directive — no separate `tailwind.config.js` file is needed.
<code-snippet name="Extending Theme in CSS" lang="css">
@theme {
  --color-brand: oklch(0.72 0.11 178);
}
</code-snippet>

- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff">
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>


### Replaced Utilities
- Tailwind v4 removed deprecated utilities. Do not use the deprecated option - use the replacement.
- Opacity values are still numeric.

| Deprecated |	Replacement |
|------------+--------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |
</laravel-boost-guidelines>
