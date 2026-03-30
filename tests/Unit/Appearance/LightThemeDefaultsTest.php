<?php

use Tests\TestCase;

uses(TestCase::class);

test('application does not bootstrap system theme detection', function () {
    $response = $this->get('/login');

    $response->assertOk();
    $response->assertDontSee('prefers-color-scheme', false);
});

test('dark appearance cookie is ignored for initial html', function () {
    $response = $this
        ->withCookie('appearance', 'dark')
        ->get('/login');

    $locale = str_replace('_', '-', app()->getLocale());

    $response->assertOk();
    $response->assertSee("<html lang=\"{$locale}\">", false);
    $response->assertDontSee("<html lang=\"{$locale}\" class=\"dark\">", false);
});
