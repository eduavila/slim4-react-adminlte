<?php declare(strict_types=1);

namespace App\Controller\System;

use App\Exception\ValidationException;
use App\Lib\ResponseTrait;
use App\Service\ParametrosService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator as V;
use Awurth\SlimValidation\Validator;
use Exception;

class ParametrosController
{
    use ResponseTrait;
    
    public function __construct(ParametrosService $parametrosService, Validator $valid)
    {
        $this->parametrosService = $parametrosService;
        $this->valid = $valid;
    }

    /**
     * Retorna lista de paramentros
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function all(Request $request,Response $response)
    {
        try{
            $dados = $this->parametrosService->getAll();

            return $this->withJson($dados);
        }catch(Exception $ex){
            throw $ex;
        }
    }

    /**
     * Get Parametro
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function get(Request $request,Response $response)
    {
        try{
            $id = $request->getAttribute('id');

            $dados = $this->parametrosService->get($id);

            return $this->withJson($dados);
        }catch(Exception $ex){
            throw $ex;
        }
    }


    public function createOrUpdate(Request $request,Response $response){
        $rules = [
            'descricao'=> V::notBlank()->setName("Descrição"),
            'nome'=> V::notBlank()->setName("nome"),
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

            $dados = $this->parametrosService->createOrUpdate($data);

            return $this->withJson($dados);
        }catch(ValidationException $exVal){

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage());
        }catch(Exception $ex){
            throw $ex;
        }
    }
}
