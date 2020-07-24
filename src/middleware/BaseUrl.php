<?php

namespace App\Middleware;

use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Middleware.
 */
final class BaseUrl
{
    /**
     * The app base path.
     *
     * @var string
     */
    private $basePath;

    /**
     * The constructor.
     *
     * @param string $basePath The slim app basePath ($app->getBasePath())
     */
    public function __construct(string $basePath = '')
    {
        $this->basePath = $basePath;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $request = $request->withAttribute('base_url', $this->getBaseUrl($request));

        return $handler->handle($request);
    }

    /**
     * Return the fully qualified base URL.
     *
     * Note that this method never includes a trailing /
     *
     * @param Request $request The request
     *
     * @return string The base url
     */
    public function getBaseUrl(Request $request): string
    {
        $uri = $request->getUri();
        $scheme = $uri->getScheme();
        $authority = $uri->getAuthority();
        $basePath = $this->basePath;

        if ($authority !== '' && strpos($basePath, '/') !== 0) {
            $basePath .= '/' . $basePath;
        }

        return ($scheme !== '' ? $scheme . ':' : '')
            . ($authority ? '//' . $authority : '')
            . rtrim($basePath, '/');
    }
}