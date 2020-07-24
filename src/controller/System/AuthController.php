<?php declare (strict_types = 1);

namespace App\Controller\System;

use App\Controller\BaseController;
use App\Exception\ValidationException;
use App\Lib\ResponseTrait;
use Awurth\SlimValidation\Validator;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator as V;
use Slim\App;
use \App\Service\AuthService;

class AuthController extends BaseController
{
    use ResponseTrait;

    public function __construct(App $app, AuthService $authService, Validator $valid)
    {
        parent::__construct($app);

        $this->authService = $authService;
        $this->valid       = $valid;
    }

    /**
     * Faz login e retorna token acesso e token de refresh.
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function login(Request $request, Response $response)
    {
        $rules = [
            'login' => V::notBlank()->setName("Login"),
            'senha' => V::notBlank()->setName("Senha"),
        ];

        // Verifica regras  e retornar erros.
        $v = $this->valid->validate($request, $rules);
        if (!$this->valid->isValid()) {
            return $this->withJson($this->valid->getErrors(), 400);
        }

        try {
            $data            = $request->getParsedBody();
            $data['ip']      = $request->getServerParams()['REMOTE_ADDR'];
            $data['browser'] = $request->getHeader('User-Agent');

            $data = $this->authService->login($data);

            return $this->withJson($data);
        } catch (ValidationException $exVal) {

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage());
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    /**
     * Retorna informações sobre usuario
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function info(Request $request, Response $response)
    {
        try {
            $usuario = $request->getAttribute('usuario');

            $data = $this->authService->info($usuario);

            return $this->withJson($data);
        } catch (ValidationException $exVal) {

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage());
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    /**
     * Atualiza token de acesso
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function refresh(Request $request, Response $response)
    {
        $rules = [
            'token' => V::notBlank()->setName("Token Refresh"),
        ];

        // Verifica regras  e retornar erros.
        $this->valid->validate($request, $rules);
        if (!$this->valid->isValid()) {
            return $this->withJson($this->valid->getErrors(), 400);
        }

        try {
            $data = $request->getParsedBody();

            $tokenAccess = $this->authService->refresh($data['token']);

            return $this->withJson($tokenAccess);
        } catch (ValidationException $exVal) {

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage(), $exVal->getCode());
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    /**
     * Revoga token de atualização.
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function logout(Request $request, Response $response)
    {
        $rules = [
            'token'     => V::notBlank()->setName("Token Refresh")
        ];

        // Verifica regras  e retornar erros.
        $this->valid->validate($request, $rules);
        if (!$this->valid->isValid()) {
            return $this->withJson($this->valid->getErrors(), 400);
        }

        //Extrai token request.
        $usuario = $request->getAttribute('usuario');
        $data    = $request->getParsedBody();

        try {
            $this->authService->revoge($usuario->id, $data['token'], $data['device_id']);

            return $this->withJson(['msg' => 'Revogado token com sucesso.']);
        } catch (ValidationException $exVal) {
            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage(), $exVal->getCode());
        } catch (Exception $ex) {
            throw $ex;
        }
    }
}
