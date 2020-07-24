<?php declare(strict_types=1);

namespace App\Controller\System;

use App\Exception\ValidationException;
use App\Lib\ResponseTrait;
use App\Service\SecretariaService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator as V;
use Awurth\SlimValidation\Validator;
use Exception;

class SecretariaController
{
    use ResponseTrait;
    
    public function __construct(SecretariaService $secretariaService, Validator $valid)
    {
        $this->secretariaService = $secretariaService;
        $this->valid = $valid;
    }

    /**
     * Retorna lista de secretarias
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function all(Request $request,Response $response)
    {
        try{
            $secretarias = $this->secretariaService->getAll();

            return $this->withJson($secretarias);
        }catch(Exception $ex){
            throw $ex;
        }
    }

    /**
     * Get secretarias
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function get(Request $request,Response $response)
    {
        try{
            $id = $request->getAttribute('id');

            $secretaria = $this->secretariaService->get($id);

            return $this->withJson($secretaria);
        }catch(Exception $ex){
            throw $ex;
        }
    }
    /**
     * Cria ou atualiza secretaria
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function createOrUpdate(Request $request,Response $response){

        $rules = [
            'sigla'=> V::notBlank()->setName("Sigla"),
            'nome'=> V::notBlank()->setName("Nome"),
            'nome_reduzido'=> V::notBlank()->setName("Nome Reduzido"),
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
            
            $perfil = $this->secretariaService->createOrUpdate($data);

            return $this->withJson($perfil);
        }catch(ValidationException $exVal){

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage());
        }catch(Exception $ex){
            throw $ex;
        }
    }
}
