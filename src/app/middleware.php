<?php

use App\Exception\ValidationException;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;
// 
// Configurando Erro Handler (Retorno erro padrão)
// 
//$app->addRoutingMiddleware();
$app->addBodyParsingMiddleware();

$customErrorHandler = function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails, bool $logErrors, bool $logErrorDetails) use ($app,$container) {  
    $statusCode = 500;
    if (is_int($exception->getCode()) && $exception->getCode() !== 0 && $exception->getCode() < 599) {
        $statusCode = $exception->getCode();
    }        

    if($exception instanceof ValidationException){
        $data = [
            'msg'=>  $exception->getMessage(),
            'erroCode' => $statusCode
        ];

    }else{
        //Adicionar erro no log.
        $logger = $container->get(LoggerInterface::class);
        $logger->log(\Monolog\Logger::ERROR,$exception->getMessage());

        $className = new \ReflectionClass(get_class($exception));
        $data = [
            'message'    => $exception->getMessage(),
            'class'      => $className->getShortName(),
            'status'     => 'error',
            'code'       => $statusCode,
            'trace'      => $exception->getTrace()
        ];
    }

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));

    return $response->withStatus($statusCode)->withHeader("Content-type", "application/json");
};

$displayError = filter_var(getenv('DISPLAY_ERROR_DETAILS'), FILTER_VALIDATE_BOOLEAN);
$errorMiddleware = $app->addErrorMiddleware($displayError, true, true);
$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

// Adicionar CORS
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});