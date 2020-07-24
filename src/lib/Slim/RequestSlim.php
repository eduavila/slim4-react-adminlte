<?php
namespace App\Lib\Slim;

use Psr\Http\Message\RequestInterface;

class NRequest extends \Slim\Psr7\Request implements RequestInterface{
    public function getQueryParam($name, $default = null)
    {
        $params = $this->getQueryParams();

        if(isset($params[$name])){
            return $params[$name];
        }else{
            return $default;
        }
    }
}

interface NRequestInterface extends \Psr\Http\Message\ServerRequestInterface{
    public function getQueryParam($name, $default = null);
}