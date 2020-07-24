<?php
namespace App\Models\System;

use App\Models\BaseModel;

class Parametro extends BaseModel{
    
    protected $table = 'sys_parametro';
    
    protected $fillable = ['nome', 'descricao', 'valor', 'status', 'type'];

    public static function get($name){

        $parametros = self::where('nome', '=', $name)->first();

        if(!$parametros) return;

        return $parametros->valor;
    }
}
