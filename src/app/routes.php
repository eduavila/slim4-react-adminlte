<?php declare (strict_types = 1);
use Slim\Routing\RouteCollectorProxy;

$app->get('/', 'App\Controller\IndexController:index');

$app->get('/status', 'App\Controller\IndexController:getStatus');

// Login Route
$app->post('/api/auth/login', 'App\Controller\System\AuthController:login')->add('App\Middleware\SysLog');
$app->post('/api/auth/refresh', 'App\Controller\System\AuthController:refresh');

// Area restrita
$app->group('/api', function (RouteCollectorProxy $group) {
    // Info Usuario
    $group->get('/auth/info', 'App\Controller\System\AuthController:info');
    $group->post('/auth/logout', 'App\Controller\System\AuthController:logout')->add('App\Middleware\SysLog');
    
    //Registra token de device do usuário.
    $group->post('/usuarios/devices', 'App\Controller\System\UsuarioDeviceController:createOrUpdate')->add('App\Middleware\SysLog');

    //
    // Route  USUARIOS
    //
    $group->post('/usuarios/alterar-senha', 'App\Controller\System\UsuarioController:alterarSenha')->add('App\Middleware\SysLog');

    $group->get('/usuarios/secretarias', 'App\Controller\System\UsuarioController:secretarias');
    $group->get('/usuarios', 'App\Controller\System\UsuarioController:all');
    $group->post('/usuarios', 'App\Controller\System\UsuarioController:createOrUpdate')->add('App\Middleware\SysLog');
    $group->get('/usuarios/{id}', 'App\Controller\System\UsuarioController:get');

    //
    // Mensagem
    //
    $group->get('/mensagens', 'App\Controller\System\MensagemController:all');
    $group->post('/mensagens/{mensagenId}', 'App\Controller\System\MensagemController:setLida');

    //
    // Route  PERFILS
    //
    $group->get('/perfils', 'App\Controller\System\UsuarioPerfilController:all');
    $group->post('/perfils', 'App\Controller\System\UsuarioPerfilController:createOrUpdate')->add('App\Middleware\SysLog');
    $group->get('/perfils/{id}', 'App\Controller\System\UsuarioPerfilController:get');

    //
    // Route  Parametros
    //
    $group->get('/parametros', 'App\Controller\System\ParametrosController:all');
    $group->post('/parametros', 'App\Controller\System\ParametrosController:createOrUpdate')->add('App\Middleware\SysLog');
    $group->get('/parametros/{id}', 'App\Controller\System\ParametrosController:get');
})->add('App\Middleware\JwtAuth');
