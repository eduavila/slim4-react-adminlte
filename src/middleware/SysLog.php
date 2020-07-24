<?php

namespace App\Middleware;

use App\Service\LogService;
use App\Service\LogData;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Selective\Config\Configuration;

use Psr\Log\LoggerInterface;

class SysLog
{
    public function __construct(Configuration $config, LoggerInterface $log,LogService $logService)
    {
        $this->log = $log;
        $this->logService = $logService;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $uri = $request->getUri();

        $urlFull = (string) $uri;
        $ipAddress = $request->getServerParams()['REMOTE_ADDR'];
        $data      = $request->getParsedBody();
        $token     = $request->getAttribute('token');
        $usuario     = $request->getAttribute('usuario');
        $usuarioId = isset($usuario) ? $usuario->id : null;
        
        $log = new LogData();
        $log->ip         = $ipAddress;
        $log->url        = $urlFull;
        $log->usuario_id = $usuarioId;
        $log->token      = $token;
        $log->data       = isset($data) ? json_encode($data) : null;
        
        $this->logService->add($log);
        
        /* Tudo bem, chame o próximo middleware */
        $response = $handler->handle($request);

        return $response;
    }
}
