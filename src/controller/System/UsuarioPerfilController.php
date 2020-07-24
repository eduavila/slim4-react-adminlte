<?php declare(strict_types=1);

namespace App\Controller\System;

use App\Exception\ValidationException;
use App\Lib\ResponseTrait;
use App\Service\UsuarioPerfilService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator as V;
use Awurth\SlimValidation\Validator;
use Exception;

class UsuarioPerfilController
{
    use ResponseTrait;
    
    public function __construct(UsuarioPerfilService $perfilService, Validator $valid)
    {
        $this->perfilService = $perfilService;
        $this->valid = $valid;
    }

    /**
     * Retorna lista de perfils
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function all(Request $request,Response $response)
    {
        try{
            $perfils = $this->perfilService->getAll();

            return $this->withJson($perfils);
        }catch(Exception $ex){
            throw $ex;
        }
    }

    /**
     * Get perfil
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function get(Request $request,Response $response)
    {
        try{
            $id = $request->getAttribute('id');

            $perfil = $this->perfilService->get($id);

            return $this->withJson($perfil);
        }catch(Exception $ex){
            throw $ex;
        }
    }


    public function createOrUpdate(Request $request,Response $response){
        $rules = [
            'descricao'=> V::notBlank()->setName("Descrição"),
            'status'=> V::in(['I','A'])->setName("Status")
        ];

        // Verifica regras  e retornar erros.
        $v = $this->valid->validate($request, $rules);
        if (!$this->valid->isValid()) {
            return $this->withJson($this->valid->getErrors(),400);
        }

        try{
            $usuario = $request->getAttribute('usuario');
            $data = $request->getParsedBody();
            $data['token_id']   = $usuario->usuarioTokenId;

            $perfil = $this->perfilService->createOrUpdate($data);

            return $this->withJson($perfil);
        }catch(ValidationException $exVal){

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage());
        }catch(Exception $ex){
            throw $ex;
        }
    }
}
