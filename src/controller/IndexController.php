<?php declare (strict_types = 1);

namespace App\Controller;

use App\Lib\NQueue\NQueue;
use App\Lib\ResponseTrait;

class IndexController
{
    use ResponseTrait;

    public function __construct(NQueue $queue)
    {
        $this->queue = $queue;
    }

    const API_NAME    = 'sge_api';
    const API_VERSION = '1.0.0';

    public function index($request, $response)
    {
        $renderer = new \Slim\Views\PhpRenderer(__DIR__ . '/../../public/dist');
        return $renderer->render($response, "index.html");
    }

    public function getStatus($request, $response)
    {
        $message = [
            'api'       => self::API_NAME,
            'version'   => self::API_VERSION,
            'timestamp' => time(),
        ];

        return $this->withJson($message);
    }
}
