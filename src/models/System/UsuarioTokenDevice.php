<?php
namespace App\Models\System;

use App\Models\BaseModel;

class UsuarioTokenDevice extends BaseModel{
    
    protected $table = 'sys_usuario_token_device';
    
    protected $fillable = [
        'device_id',
        'token',
        'browser',
        'ip',
        'tipo',
        'usuario_id'
    ];
}
