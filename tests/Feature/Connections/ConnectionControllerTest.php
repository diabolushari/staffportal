<?php

namespace Tests\Feature;

use Tests\TestCase;

class ConnectionControllerTest extends TestCase
{
    public function test_connections_page_renders_correctly()
    {
        $this->withoutMiddleware();

        $response = $this->get(route('connections.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Connections/ConnectionsIndex')->has('connections')
        );
    }
}
