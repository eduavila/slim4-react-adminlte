<?php declare(strict_types=1);

namespace App\Controller\System;

use App\Exception\ValidationException;
use App\Lib\ResponseTrait;
use App\Service\MensagemService;
use App\Lib\Slim\NRequest;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Validator as V;
use Awurth\SlimValidation\Validator;
use Exception;

class MensagemController
{
    use ResponseTrait;
    
    public function __construct(MensagemService $mensagemService, Validator $valid)
    {
        $this->mensagemService = $mensagemService;
        $this->valid = $valid;
    }

    /**
     * Retorna lista de mensagem do referente ao usuário.
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    public function all(NRequest $request,Response $response)
    {
        try{
            $usuario = $request->getAttribute('usuario');
            $limit = $request->getQueryParam('limit');
          
            $dados = $this->mensagemService->getAll($usuario->id, $limit);

            return $this->withJson($dados);
        }catch(Exception $ex){
            throw $ex;
        }
    }

    public function setLida(NRequest $request,Response $response)
    {
        try{
            $usuario = $request->getAttribute('usuario');
            $mensagemId = $request->getAttribute('mensagenId');

            $this->mensagemService->setLida($usuario->id, $mensagemId);

            return $this->withJson(true);
        }catch(Exception $ex){
            throw $ex;
        }
    }
}
