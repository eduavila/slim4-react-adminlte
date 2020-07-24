<?php

use Psr\Container\ContainerInterface;
use Selective\Config\Configuration;
use Illuminate\Database\Capsule\Manager as DB;
use Slim\App;
use Slim\Factory\AppFactory;
use App\Factory\LoggerFactory;
use App\Lib\NQueue\NQueue;
use Psr\Log\LoggerInterface;
use Predis\Client as Redis;
use Awurth\SlimValidation\Validator;
use App\Commands\RunQueue;
use App\Service\AuthService;
use function DI\object;

$settings = require __DIR__ . '/settings.php';

// Inicia instancia global.
$capsule = new DB;
$capsule->addConnection($settings['settings']['db']);
$capsule->setAsGlobal();
$capsule->bootEloquent();
DB::connection()->enableQueryLog();

return [
    // Disponibiliza configurações no container
    Configuration::class => function ()use ($settings){
        return new Configuration($settings);
    },

    App::class => function (ContainerInterface $container) use ($settings) {
        AppFactory::setContainer($container);
        $app = AppFactory::create();

        // Optional: Set the base path to run the app in a subdirectory.
        if(isset($settings['settings']['base_path'])){
            $app->setBasePath($settings['settings']['base_path']);
        }

        return $app;
    },

    // Database - Instancia configuranção    
    DB::class => function (Configuration $config) use ($capsule){
        return $capsule;
    },

    // The logger factory
    LoggerInterface::class => function (Configuration $config) {
        $settings = $config->getArray('settings.logger');

        $monolog = new LoggerFactory($settings);
        $monolog->addFileHandler($settings['filename']);
        $monolog->addConsoleHandler($settings['level']);

        return $monolog->createInstance($settings['name']);
    },

    //
    // Configuração do Redis.
    //
    Redis::class => function(Configuration $config){
        $settings = $config->getArray('settings.redis');

        return new Redis($settings['url']);
    },
    
    //
    //  Validacoes
    //
    Validator::class => function(){
        $defaultMessages = [
            'length'   => 'O campo {{name}} deve ter um tamanho entre {{minValue}} e {{maxValue}} caracteres.',
            'notBlank' => 'O campo {{name}} é obrigatório.',
            'intVal'   => 'O campo {{name}} deve ser um número inteiro.',
            'email'    => 'O campo {{name}} deve ser um email válido.',
            'ip'       => 'O campo {{name}} deve ser um endereço de IP válido.',
            'in'       => 'O campo {{name}} selecionado é inválido,Opções: {{haystack}}.',
            'date'     => 'O campo {{name}} não é uma data válida.',
            'numeric'  => 'O campo {{name}} deve ser um número.',
            'cpf'      => 'O campo {{name}} deve ser um número de CPF válido.',
            'cnpj'     => 'O campo {{name}} deve ser um número de CNPJ válido.',
            'min'      => 'O campo {{name}} deve ser um valor mínimo {{interval}}',
            'max'      => 'O campo {{name}} deve ser um valor máximo {{interval}}',
            'intType'  => 'O campo {{name}} deve ser do tipo inteiro.',
            'stringType'  => 'O campo {{name}} deve ser do tipo string.'
        ];
    
        return new Validator(true,$defaultMessages);
    },
    NQueue::class => function(ContainerInterface $container, Configuration $config){
        $config = $config->getArray('settings.queue');
        return new NQueue($container,$config);
    },
    //
    // Registra comando para executar no CLI.
    // 
    RunQueue::class => function(ContainerInterface $container){
        return new RunQueue($container);
    },

    TokenJwt::class => DI\autowire(),
    AuthService::class => DI\autowire()
];
