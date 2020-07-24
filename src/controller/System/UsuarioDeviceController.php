<?php declare(strict_types=1);

namespace App\Controller\System;

use App\Controller\BaseController;
use App\Exception\ValidationException;
use App\Lib\ResponseTrait;
use App\Models\System\UsuarioTokenDevice;
use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Service\UsuarioTokenDeviceService;
use Respect\Validation\Validator as V;
use Awurth\SlimValidation\Validator;
use Exception;

class UsuarioDeviceController extends BaseController
{
    use ResponseTrait;
    
    public function __construct(App $app, UsuarioTokenDeviceService $tokenDeviceService, Validator $valid)
    {
        parent::__construct($app);

        $this->tokenDeviceService = $tokenDeviceService;
        $this->valid = $valid;
    }

    public function createOrUpdate(Request $request, Response $response){
        $rules = [
            'token'    => V::notBlank()->setName("Token"),
            'device_id'=> V::notBlank()->setName("Device Id")
        ];

        // Verifica regras  e retornar erros.
        $v = $this->valid->validate($request, $rules);
        if (!$this->valid->isValid()) {
            return $this->withJson($this->valid->getErrors(),400);
        }
        
        try{
            $usuario            = $request->getAttribute('usuario');
            $data               = $request->getParsedBody();
            $data['ip']         = $request->getServerParams()['REMOTE_ADDR'];
            $data['usuario_id'] = $usuario->id;
            $data['browser']    = json_encode($request->getHeader('User-Agent'));
            $result = $this->tokenDeviceService->createOrUpdate($data);

            return $this->withJson($result);
        }catch(ValidationException $exVal){

            //Captura erro de validacao
            return $this->withValidation($exVal->getMessage());
        }catch(Exception $ex){
            throw $ex;
        }
    }
}
