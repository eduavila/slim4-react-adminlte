<?php declare(strict_types=1);

namespace App\Exception;

use Exception;

class ForbiddenException extends ValidationException
{
    function __construct()
    {
        parent::__construct("Usuário não possui acesso para recurso.",403);
    }
}
