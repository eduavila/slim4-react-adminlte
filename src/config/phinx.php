<?php
use Selective\Config\Configuration;
use Illuminate\Database\Capsule\Manager as DB;
use Slim\App;

//$settings = (require __DIR__.'/../app/settings.php')['settings'];

//var_dump($settings);
// Configuracao banco sempre pega oque tiver configurado no .env

/** @var App $app */
$app = require __DIR__ . '/../app/app.php';

$container = $app->getContainer();
$db = $container->get(DB::class);

//Recupera PDO aloquent passa pro phinx.
$pdo = $db->connection()->getPdo();

// Busca configuracao 
$settings = $container->get(Configuration::class)->getArray('settings');

$database = $settings['db']['database'];

$phinx = $settings['phinx'];
$phinx['environments']['local'] = [
    // Set database name
    'name'       => $database,
    'connection' => $pdo,
];

return $phinx;