<?php
# === Para mostrar todos erros

//use Slim\Psr7\Factory\ServerRequestFactory;

use App\Lib\Slim\NServerRequestFactory;

error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);

error_reporting(-1);

setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
date_default_timezone_set('America/Cuiaba');

require __DIR__ . '/../src/app/app.php';

//$request = new Slim\Psr7\Factory\RequestFactory();

$request = NServerRequestFactory::customCreateFromGlobals();

$app->run($request);
