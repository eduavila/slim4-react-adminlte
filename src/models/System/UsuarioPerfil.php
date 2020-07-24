<?php
namespace App\Models\System;

use App\Models\BaseModel;

class UsuarioPerfil extends BaseModel{
    
    protected $table = 'sys_usuario_perfil';
    
    protected $fillable = ['descricao','status'];
}
