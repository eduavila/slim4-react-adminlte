<?php
namespace App\Models\System;

use App\Models\BaseModel;

class Secretaria extends BaseModel{
    
    protected $table = 'sys_secretaria';
    
    protected $fillable = ['sigla','nome','nome_reduzido','responsavel','status','institucional'];
    
    protected $primaryKey='id';

    public $timestamps = true;

    public function usuarios(){
        return $this->belongsToMany('App\Models\System\Usuario','sys_usuario_secretaria', 'usuario_id','id')->withTimestamps();
    }
}
