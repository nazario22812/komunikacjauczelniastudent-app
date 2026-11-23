<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ProtectedRoutesTest extends TestCase
{
    /**
     * Tests EVERY registered route protected by the auth middleware.
     * No controller write action is executed because the requests are guests.
     */
    public function test_every_protected_route_rejects_guests(): void
    {
        $tested = 0;

        foreach (Route::getRoutes() as $route) {
            $middleware = $route->gatherMiddleware();
            if (!in_array('auth', $middleware, true)) {
                continue;
            }

            $uri = '/' . ltrim(preg_replace('/\{[^}]+\}/', '1', $route->uri()), '/');
            $method = in_array('GET', $route->methods(), true) ? 'GET'
                : (in_array('POST', $route->methods(), true) ? 'POST' : null);
            if ($method === null) {
                continue;
            }

            $response = $this->call($method, $uri);
            $this->assertSame(
                302,
                $response->getStatusCode(),
                sprintf('%s %s failed guest protection', $method, $uri)
            );
            $this->assertStringContainsString(
                '/login',
                (string) $response->headers->get('Location'),
                sprintf('%s %s did not redirect to login', $method, $uri)
            );
            $tested++;
        }

        $this->assertGreaterThan(50, $tested, 'Too few auth routes discovered; check route registration.');
    }

    public function test_public_login_page_is_accessible(): void
    {
        $this->get('/login')->assertOk();
    }

    public function test_invalid_login_input_is_rejected(): void
    {
        $this->post('/login', ['email' => 'not-an-email', 'password' => ''])
            ->assertSessionHasErrors(['email', 'password']);
    }
}
