<?php declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';
$baseDir = __DIR__ . '/../../';

// 
// Carrega dados do arquivo .env
// 
$dotenv = new Dotenv\Dotenv($baseDir);
if (file_exists($baseDir . '.env')) {
    $dotenv->load();
}
$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS','DB_PORT','BASE_PATH','REDIS_URL']);

$settings = require __DIR__ . '/settings.php';

use DI\ContainerBuilder;
use Slim\App;
use SlimFacades\Facade;


// Instancia container 
// Container PHP-DI 
$containerBuilder = new ContainerBuilder();

// Configura PHP-DI
$containerDefinitions = require __DIR__ .'/container.php';

$containerBuilder->addDefinitions($containerDefinitions);

$container = $containerBuilder->build();
$app = $container->get(App::class);

// 
require __DIR__ . '/middleware.php';
require __DIR__ . '/routes.php';

// Retorna exception caso nao existe a rota.S
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new \Slim\Exception\HttpNotFoundException($request);
});

// Configura a inicialização do Facade, isso possibilita o uso de funções estaticas da request , containre e outros disponivel no container.

Facade::setFacadeApplication($app);

return $app;