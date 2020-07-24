<?php declare(strict_types=1);

namespace App\Controller\System;

use App\Controller\BaseController;
use App\Exception\ValidationException;
use App\Lib\ResponseTrait;
use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Service\UsuarioService;
use Respect\Validation\Validator as V;
use Awurth\SlimValidation\Validator;
use Exception;

class UsuarioController extends BaseController
{
    use ResponseTrait;
    
    public function __construct(App $app, UsuarioService $usuarioService, Validator $valid)
    {
        parent::__construct($app);

        $this->usuarioService = $usuarioService;
        $this->valid = $valid;
    }

    /**
     * Retorna lista de usuarios
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function all(Request $request,Response $response)
    {
        try{
            $params = $request->getQueryParams();
            $onlyAtive =  isset($params['status']) && $params['status'] == 'ativos' ? true : false;
            $usuarios = $this->usuarioService->getAll($onlyAtive);

            return $this->withJson($usuarios);
        }catch(Exception $ex){
            throw $ex;
        }
    }

    /**
     * Retorna dados de usuarios
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function get(Request $request,Response $response)
    {
        try{            
            $id = $request->getAttribute('id');
            $usuario = $this->usuarioService->get($id);

            return $this->withJson($usuario);
        }catch(Exception $ex){
            throw $ex;
        }
    }

    public function secretarias(Request $request,Response $response){
        try{
            $usuario = $request->getAttribute('usuario');
            $secretarias = $this->usuarioService->getSecretariaUsuarios($usuario->id);

            return $this->withJson($secretarias);
        }catch(Exception $ex){
            throw $ex;
        }
    }
    
    public function alterarSenha(Request $request,Response $response){
        try{
            $rules = [
                'senha'=> V::notBlank()->setName("Senha"),
                'confirmar_senha'=> V::notBlank()->setName("Confirmar senha")
            ];
    
            // Verifica regras  e retornar erros.
            $v = $this->valid->validate($request, $rules);
            if (!$this->valid->isValid()) {
                return $this->withJson($this->valid->getErrors(),400);
            }
            
            $usuario = $request->getAttribute('usuario');
            $data = $request->getParsedBody();

            if($data['senha'] != $data['confirmar_senha']){
                return $this->withValidation("Senhas estão divergentes!");
            }
            if( !$data['id'] ){
                $data['id'] = $usuario->id;                
            }

            $this->usuarioService->alterarSenha($data['id'], $data['senha']);

            return $this->withJson(true);
        }catch(Exception $ex){
            throw $ex;
        }
    }
    
    public function createOrUpdate(Request $request,Response $response){
        $rules = [
            'login'=> V::notBlank()->setName("Login"),
            'nome'=> V::notBlank()->setName("Nome"),
            'status'=> V::in(['I','A'])->setName("Status")
        ];

        // Verifica regras  e retornar erros.
        $v = $this->valid->validate($request, $rules);
        if (!$this->valid->isValid()) {
            return $this->withJson($this->valid->getErrors(),400);
        }

        try{
            $data = $request->getParsedBody();
            $usuario = $request->getAttribute('usuario');
            $data['criado_por'] = $usuario->id;
            $data['token_id']   = $usuario->usuarioTokenId;

            $usuario = $this->usuarioService->createOrUpdate($data);

            return $this->withJson($usuario);
        }catch(ValidationException $exVal){

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage());
        }catch(Exception $ex){
            throw $ex;
        }
    }
}
