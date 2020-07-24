<?php
namespace Tests\Utils;

use App\Lib\Slim\NRequest;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Headers;
use Slim\Psr7\Uri;

class WebTestClient
{
    /** @var \Slim\App */
    public $app;

    /** @var  \Slim\Http\Request */
    public $request;

    /** @var  \Slim\Http\Response */
    public $response;

    private $cookies = array();

    private $tokenJwt;

    public function __construct($appSlim)
    {
        $this->app = $appSlim;
    }

    public function __call($method, $arguments)
    {
        throw new \BadMethodCallException(strtoupper($method) . ' is not supported');
    }

    public function get($path, $data = array(), $optionalHeaders = array())
    {
        return $this->request('GET', $path, $data, $optionalHeaders);
    }

    public function post($path, $data = array(), $optionalHeaders = array())
    {
        return $this->request('POST', $path, $data, $optionalHeaders);
    }

    public function patch($path, $data = array(), $optionalHeaders = array())
    {
        return $this->request('PATCH', $path, $data, $optionalHeaders);
    }

    public function put($path, $data = array(), $optionalHeaders = array())
    {
        return $this->request('PUT', $path, $data, $optionalHeaders);
    }

    public function delete($path, $data = array(), $optionalHeaders = array())
    {
        return $this->request('DELETE', $path, $data, $optionalHeaders);
    }

    public function head($path, $data = array(), $optionalHeaders = array())
    {
        return $this->request('head', $path, $data, $optionalHeaders);
    }

    public function options($path, $data = array(), $optionalHeaders = array())
    {
        return $this->request('options', $path, $data, $optionalHeaders);
    }

    /**
     * Seta token de autentição.
     *
     * @param string $tokenAccess
     * @return void
     */
    public function setJwt($tokenAccess)
    {
        $this->tokenJwt = $tokenAccess;
    }

    public function getBodyArray()
    {
        $bodyRaw = (string) $this->response->getBody();
        
        return json_decode($bodyRaw);
    }

    // Abstract way to make a request to SlimPHP, this allows us to mock the
    // slim environment
    private function request($method, $path, $data = array(), $optionalHeaders = array())
    {
        //Make method uppercase
        $method  = strtoupper($method);
        $options = array(
            'REQUEST_METHOD' => $method,
            'REQUEST_URI'    => $path,
        );

        if ($method === 'GET') {
            $options['QUERY_STRING'] = http_build_query($data);
        } else {
            $params = json_encode($data);
        }

        // A phpunit fix #3026
        if (!isset($_SERVER['REQUEST_URI'])) {
            $_SERVER = [
                'SCRIPT_NAME'        => '/public/index.php',
                'REQUEST_TIME_FLOAT' => microtime(true),
                'REQUEST_TIME'       => (int) microtime(true),
            ];
        }

        $serverParams  = ['REMOTE_ADDR' => '127.0.0.1'];
        
        $uri = new Uri('', '', 80, $path);
        $handle = fopen('php://temp', 'w+');
        $stream = (new StreamFactory())->createStreamFromResource($handle);
        $headers = new Headers();

        $this->request = new NRequest($method, $uri, $headers, [], $serverParams, $stream);

        // Aplica body json na requisição.
        if (isset($params)) {
            $this->request = $this->request->withParsedBody($data);

            $this->request = $this->request->withHeader('Content-Type', 'application/json');
        }

        //Adiciona cabecalho customizado.
        foreach($optionalHeaders as $key => $value){
            $this->request = $this->request->withHeader($key, $value);
        }
       
        //Aplica token de autenticação.
        if($this->tokenJwt)
        {
            $this->request = $this->request->withHeader('Authorization',sprintf('Bearer %s', $this->tokenJwt));
        }

        $this->response = $this->app->handle($this->request);

        // Return the application output.
        return (string) $this->response->getBody();
    }

    public function setCookie($name, $value)
    {
        $this->cookies[$name] = $value;
    }
}
