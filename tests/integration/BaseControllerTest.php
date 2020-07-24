<?php declare(strict_types=1);

namespace Tests\integration;

use Tests\Utils\WebTestCase;

class BaseControllerTest extends WebTestCase
{
    public function testStatus()
    {
        $app = $this->getAppInstance();
        $request = $this->createRequest('GET', '/status');
        $response = $app->handle($request);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('api', (string) $response->getBody());
        $this->assertStringContainsString('version', (string) $response->getBody());
        $this->assertStringContainsString('time', (string) $response->getBody());
    }
}
