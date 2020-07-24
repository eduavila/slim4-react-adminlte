<?php

namespace Tests\Utils;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UriInterface;
use Slim\Psr7\Factory\ServerRequestFactory;
use Tests\fixture\ParamentroFixture;

/**
 * Acceptance Test.
 */
trait HttpTestTrait
{
    use DatabaseTestTrait;

    /**
     * Create a server request.
     *
     * @param string $method The HTTP method
     * @param string|UriInterface $uri The URI
     * @param array $serverParams The server parameters
     *
     * @return ServerRequestInterface
     */
    protected function createRequest(string $method, $uri, array $serverParams = ['REMOTE_ADDR' => '127.0.0.1']): ServerRequestInterface
    {
        // A phpunit fix #3026
        if (!isset($_SERVER['REQUEST_URI'])) {
            $_SERVER = [
                'SCRIPT_NAME'        => '/public/index.php',
                'REQUEST_TIME_FLOAT' => microtime(true),
                'REQUEST_TIME'       => (int) microtime(true),
            ];
        }

        $factory = new ServerRequestFactory();

        return $factory->createServerRequest($method, $uri, $serverParams);
    }

    /**
     * Add post data.
     *
     * @param ServerRequestInterface $request The request
     * @param mixed[] $data The data
     *
     * @return ServerRequestInterface
     */
    protected function withFormData(ServerRequestInterface $request, array $data): ServerRequestInterface
    {
        if (!empty($data)) {
            $request = $request->withParsedBody($data);
        }

        return $request->withHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    /**
     * Add Json data.
     *
     * @param ServerRequestInterface $request The request
     * @param mixed[] $data The data
     *
     * @return ServerRequestInterface
     */
    protected function withJson(ServerRequestInterface $request, array $data): ServerRequestInterface
    {
        $request = $request->withParsedBody($data);

        return $request->withHeader('Content-Type', 'application/json');
    }

    /**
     * Make request.
     *
     * @param ServerRequestInterface $request The request
     *
     * @return ResponseInterface
     */
    protected function request(ServerRequestInterface $request): ResponseInterface
    {
        return $this->getApp()->handle($request);
    }

    /**
     * Login user.
     *
     * @return void
     */
    protected function withUserJwt(ServerRequestInterface $request): ServerRequestInterface
    {
        $this->insertFixtures([
            ParamentroFixture::class,
        ]);

        // Mock chamada em servidores externo de AD.
        $mock = \Mockery::mock('overload:App\Lib\AdConnect\Ldap');
        $mock->shouldReceive('checkUser')->andReturn(true);
        $mock->shouldReceive('getInfoUser')->andReturn(['displayname' => 'admin@admin.com']);

        //Faz Chamanda na api caputrar token
        $request  = $this->createRequest('POST', '/api/auth/login');
        $request  = $this->withJson($request, ['login' => 'admin.admin', 'senha' => 'usuario']);
        $response = $this->request($request);

        $bodyRaw = (string) $response->getBody();

        if (empty($bodyRaw)) {
            throw new \Exception('Dados do usuário autenticado não foi encontrado!');
        } else {
            $bodyData = json_decode($bodyRaw);

            // Aplica token na requisição passada
            $request->withHeader('Authorization', sprintf('Bearer %s', $bodyData->token_access));
        }

        return $request;
    }
}
