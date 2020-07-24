<?php
declare (strict_types = 1);

namespace Tests\Utils;

class WebTestCase extends TestCase
{
    /** @var \Slim\App */
    protected $app;

    /** @var WebTestClient */
    protected $client;

    // Run for each unit test to setup our slim app environment
    protected function setUp(): void
    {
        // Establish a local reference to the Slim app object
        // Ensure no cache Router
        $this->app    = $this->getAppInstance();
        $this->client = new WebTestClient($this->app);
    }
}
