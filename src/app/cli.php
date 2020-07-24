<?php

error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
ini_set('display_errors','On');

setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
date_default_timezone_set('America/Cuiaba');

require __DIR__ . '/../../vendor/autoload.php';
session_start();
$baseDir = __DIR__ . '/../../';

// 
// Carrega dados do arquivo .env
// 
$dotenv = new Dotenv\Dotenv($baseDir);
if (file_exists($baseDir . '.env')) {
    $dotenv->load();
}
$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS','DB_PORT','BASE_PATH']);

$settings = require __DIR__ . '/settings.php';

use App\Commands\RunQueue;
use DI\ContainerBuilder;

// Instancia container 
// Container PHP-DI 
$containerBuilder = new ContainerBuilder();

// Configura PHP-DI
$containerDefinitions = require __DIR__ .'/container.php';

$containerBuilder->addDefinitions($containerDefinitions);
$container = $containerBuilder->build();

$app = new \DrewM\SlimCommander\App($container);

// Definições de comandos cli.
$app->command('RunQueue', RunQueue::class.':run',[]);

// Run app
$app->run($argv);

