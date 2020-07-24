<?php declare(strict_types=1);

namespace App\Controller;

use Slim\App;

abstract class BaseController
{
    protected $app;

    public function __construct(App $app)
    {
        $this->app = $app;
    }
}
