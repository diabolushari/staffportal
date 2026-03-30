<?php

test('ui test page renders', function () {
    config([
        'database.default' => 'sqlite',
        'database.connections.sqlite.database' => ':memory:',
    ]);

    $response = $this->get(route('page-ui'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('UItest'));
});
