<?php
namespace App\Lib;
      
use \Slim\Psr7\Factory\ResponseFactory;
use Slim\Psr7\Factory\StreamFactory;

trait ResponseTrait
{
    public function withJson($data,$code = 200){
        $payload = json_encode($data);

        $response = (new ResponseFactory)->createResponse($code);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     *  
     * Criar response com erro ve validação (HttpCode 400) 
     * 
     */
    public function withValidation($msg,$code = 400){
        $payload = json_encode([
            'msg'=> $msg,
            'erroCode' => $code
        ]);

        $response = (new ResponseFactory)->createResponse($code);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    }

    
    /**
     * Retorna json http
     *
     * @param [type] $data
     * @param integer $httpCode
     * @return void
     */
    /*public function withJson($data,int $httpCode = 200)
    {
        return $this->app->response
            ->withHeader('Content-Type', 'application/json')
            ->withJson($data,$httpCode);
    }*/

    /**
     *  Retorna arquivo do arquivo passado.
     *
     * @param string $file - Arquivo a ser retornado.
     * @return mixed
     */
    public function responseFile($file,$customName = null,$forceDownload = false){
        $stream =  (new StreamFactory)->createStreamFromFile($file);
        $response = (new ResponseFactory)->createResponse(200);

        $response = $response
                        ->withHeader('Content-Type', 'application/octet-stream')
                        ->withHeader('Content-Type', 'application/download')
                        ->withHeader('Content-Description', 'File Transfer')
                        ->withHeader('Content-Transfer-Encoding', 'binary')
                        ->withHeader('Content-Disposition', 'attachment; filename="' . ($customName ?  $customName : basename($file)) . '"')
                        ->withHeader('Expires', '0')
                        ->withHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                        ->withHeader('Pragma', 'public')
                        ->withBody($stream); // all stream contents will be sent to the response

        if($forceDownload){
            $response = $response->withHeader('Content-Type', 'application/force-download');
        }
        
        return  $response;
    }


    /**
     * Retornar arquivo do caminho especificado. 
     *
     * @param  string $file
     * @return void
     */
    public function responseFileRead($file){
        if(file_exists($file)){
            $fh = fopen($file, 'rb');
            $stream = new \Psr\Http\Message\StreamInterface($fh); // create
            
            $response = (new ResponseFactory)->createResponse(200);
            $response = $response
                ->withHeader('Content-Type', mime_content_type($file))
                ->withHeader('Content-Length',filesize($file))
                ->withBody($stream);

            return $response;
        }else{
            return $this->app->response->withStatus(404);
        }
    }
}