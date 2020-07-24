<?php
namespace App\Lib\Slim;

use Slim\Psr7\Cookies;
use Slim\Psr7\Headers;
use Slim\Psr7\Stream;
use Slim\Psr7\UploadedFile;
use Slim\Psr7\Factory\UriFactory;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Request;

class NServerRequestFactory extends \Slim\Psr7\Factory\ServerRequestFactory
{
    /**
     * Função para substituir o request padrao utilizando o NRequest aonde possui methodos personalizados.
     *
     * @internal This method is not part of PSR-17
     *
     * @return Request
     */
    public static function customCreateFromGlobals()
    {
        $method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
        $uri = (new UriFactory())->createFromGlobals($_SERVER);

        $headers = Headers::createFromGlobals();
        $cookies = Cookies::parseHeader($headers->getHeader('Cookie', []));

        // Cache the php://input stream as it cannot be re-read
        $cacheResource = fopen('php://temp', 'wb+');
        $cache = $cacheResource ? new Stream($cacheResource) : null;

        $body = (new StreamFactory())->createStreamFromFile('php://input', 'r', $cache);
        $uploadedFiles = UploadedFile::createFromGlobals($_SERVER);

        $request = new NRequest($method, $uri, $headers, $cookies, $_SERVER, $body, $uploadedFiles);
        $contentTypes = $request->getHeader('Content-Type') ?? [];

        $parsedContentType = '';
        foreach ($contentTypes as $contentType) {
            $fragments = explode(';', $contentType);
            $parsedContentType = current($fragments);
        }

        $contentTypesWithParsedBodies = ['application/x-www-form-urlencoded', 'multipart/form-data'];
        if ($method === 'POST' && in_array($parsedContentType, $contentTypesWithParsedBodies)) {
            return $request->withParsedBody($_POST);
        }


        return $request;
    }
}