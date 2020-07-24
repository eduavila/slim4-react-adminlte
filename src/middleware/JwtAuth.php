<?php

namespace App\Middleware;

use App\Service\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\ResponseFactory as SlimPsr7ResponseFactory;
use Firebase\JWT\JWT;
use Selective\Config\Configuration;

use RuntimeException;
use DomainException;
use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;

class JwtAuth
{
    protected $options;
    protected $log;

    public function __construct(Configuration $config, LoggerInterface $log,AuthService $authService)
    {
        $this->log = $log;
        $this->authService = $authService;

        $secret = $config->getString('settings.jwt.secret');

        $this->options = [
            "regexp"    => "/Bearer\s+(.*)$/i", //Regex para encontrar o Token nos Headers - Livre
            "header"    => "Authorization", //O Header que vai conter o token
            "realm"     => "Protected",
            "secret"    => $secret, //Nosso secretkey criado 
            "algorithm" => "HS256",
            "cookie"    => "token",//nome cookie de token
            "parameter" => "token" // nome do parametro do token 
        ];
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        /* Se o token não puder ser encontrado ou decodificado, retorne com 401 Não autorizado */
        $token = "";
        try {
            // Extrai token da requisição.
            $token = $this->fetchToken($request);
         
            // Valida token
            $decoded = $this->decodeToken($token);
        } catch (RuntimeException | DomainException $exception) {
            $response = (new SlimPsr7ResponseFactory)->createResponse(401, "");
            return $response;
        }

        list('data' => $data ) = $decoded;
        
        // Seta usuario no container para usar no services
        $this->authService->setUsuario($data);

        /* Adicione um token decodificado para solicitar como atributo quando solicitado */
        $request = $request->withAttribute('token', $token)
                            ->withAttribute('usuario', $data);

        /* Tudo bem, chame o próximo middleware */
        $response = $handler->handle($request);

        return $response;
    }

    /**
     * 
     * Busque o token de acesso.
     * 
     */
    private function fetchToken(Request $request): string
    {
        /* Verifique se há token no cabeçalho. */
        $header = $request->getHeaderLine($this->options["header"]);

        if (false === empty($header)) {
            if (preg_match($this->options["regexp"], $header, $matches)) {
                $this->log->log(LogLevel::DEBUG, "Usando token do cabeçalho da solicitação");
                return $matches[1];
            }
        }

        /* token não encontrado no cabeçalho, tente um cookie */
        $cookieParams = $request->getCookieParams();

        if (isset($cookieParams[$this->options["cookie"]]))
        {
            $this->log->log(LogLevel::DEBUG, "Using token from cookie");
            return $cookieParams[$this->options["cookie"]];
        };

        /* token não encontrado no cookie, tente um paramentros ( ?token=.....) */
        $params = $request->getQueryParams();

        if(isset($params[$this->options["parameter"]]))
        {
            $this->log->log(LogLevel::DEBUG, "Using token from params");
            return $params[$this->options["parameter"]];
        }

        /* Se tudo falhar, log e throw. */
        $this->log->warning("Token não encontrado.");
        throw new RuntimeException("Token não encontrado.");
    }

    /**
     * 
     * Decodifique o token.
     * 
     */
    private function decodeToken(string $token): array
    {
        try {
            $decoded = JWT::decode(
                $token,
                $this->options["secret"],
                (array) $this->options["algorithm"]
            );
            return (array) $decoded;
        } catch (\Exception $exception) {
            $this->log->log(LogLevel::DEBUG,$exception->getMessage());
            throw $exception;
        }
    }
}
