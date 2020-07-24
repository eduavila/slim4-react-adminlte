<?php

namespace Tests\Utils;

use App\Service\TokenJwt;
use DI\Container;
use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;
use Slim\App;
use UnexpectedValueException;

/**
 * Container Trait.
 */
trait ContainerTestTrait
{
    /** @var ContainerInterface|Container|null */
    protected $container;

    /** @var App|null */
    protected $app;

    /**
     * Bootstrap app.
     *
     * @return void
     */
    protected function bootApp(): void
    {
        require __DIR__ . '/../../vendor/autoload.php';

        $baseDir = __DIR__ . '/../../';
        $envFile = $baseDir . '.env.test';
        if (file_exists($envFile)) {
            $dotenv = new \Dotenv\Dotenv($baseDir, '.env.test');
            $dotenv->load();
        }
        
        $dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_PORT', 'BASE_PATH','REDIS_URL']);

        $settings = require __DIR__ . '/../../src/app/settings.php';

        // Instancia container
        // Container PHP-DI
        $containerBuilder = new ContainerBuilder();

        // Configura PHP-DI
        $containerDefinitions = require __DIR__ . '/../../src/app/container.php';

        $containerBuilder->addDefinitions($containerDefinitions);

        $container = $containerBuilder->build();
        $app       = $container->get(App::class);

        require __DIR__ . '/../../src/app/middleware.php';
        require __DIR__ . '/../../src/app/routes.php';

        $this->container = $container;
        $this->app       = $app;
    }

    /**
     * Shutdown app.
     *
     * @return void
     */
    protected function shutdownApp(): void
    {
        $this->app       = null;
        $this->container = null;
    }

    /**
     * Get container.
     *
     * @throws UnexpectedValueException
     *
     * @return ContainerInterface|Container The container
     */
    protected function getContainer(): ContainerInterface
    {
        if ($this->container === null) {
            throw new UnexpectedValueException('Container must be initialized');
        }

        return $this->container;
    }

    /**
     * Get app.
     *
     * @throws UnexpectedValueException
     *
     * @return App The app
     */
    protected function getApp(): App
    {
        if ($this->app === null) {
            throw new UnexpectedValueException('App must be initialized');
        }

        return $this->app;
    }

    protected function getTokenAccess($usuarioId, $perfilId){
        $container = $this->app->getContainer();
        $tokenJwtService = $container->get(TokenJwt::class);

        $data = [ 'id' => $usuarioId, 'perfilId'=> $perfilId, 'usuarioTokenId'=> 1 ];
   
        return $tokenJwtService->encodeAccess($data);
    }

    protected function getTokenRefresh($usuarioId, $perfilId){
        $tokenJwtService = $this->container->get(TokenJwt::class);

        $data = [ 'id' => $usuarioId, 'perfilId'=> $perfilId, 'usuarioTokenId'=> 1 ];

        return $tokenJwtService->encodeRefresh($data);
    }
    
}
