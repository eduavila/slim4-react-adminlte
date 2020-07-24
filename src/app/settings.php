<?php declare(strict_types=1);

return [
    'settings' => [
        'name_app'  => "SGE",
        'base_path' => getenv('BASE_PATH'),
        'app_url'   => getenv('APP_URL'),
        'phinx' => [
            'paths' => [
                'migrations' => __DIR__.'/../../database/migrations',
                'seeds' => __DIR__.'/../../database/seeds',
            ],
            'migration_base_class' => '\Database\Migration',
        ],
        'db' => [
            'driver'    => 'mysql',
            'host'      => getenv('DB_HOST'),
            'database'  => getenv('DB_NAME'),
            'username'  => getenv('DB_USER'),
            'password'  => getenv('DB_PASS'),
            'port'      => getenv('DB_PORT'),
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => ''    
        ],
        'jwt' => [
            'secret' => 'teste',
            'exp_sec_refresh' => 259200, // 3h
            'exp_sec_access' => 300, // 5 min    
        ],
        'queue' =>[
            'name'=> 'queueSGE',
            'redis' => [
                'scheme'   => 'tcp',
                'host'     => getenv('REDIS_HOST'),
                'port'     => getenv('REDIS_PORT'),
                'database' => 1
            ],
            'logger' => [
                'name' => 'queue',
                'path' => __DIR__.'/../../tmp/logs',
                'filename' => 'queue.log',
                'level' => \Monolog\Logger::ERROR,
                'file_permission' => 0775,
            ]
        ],
        'logger'=>[
            'name' => 'app',
            'path' => __DIR__.'/../../tmp/logs',
            'filename' => 'app.log',
            'level' => \Monolog\Logger::ERROR,
            'file_permission' => 0775,
        ],
        'redis' =>[
            'url' => getenv('REDIS_URL'),
            'host' => getenv('REDIS_HOST') ,
            'port' => getenv('REDIS_PORT')
        ],
        'files' =>[
            'path' => getenv('FILES_PATH')
        ],
        'pusher' => [
            'api_key' => getenv('PUSHER_API_KEY')
        ]
    ],
];
