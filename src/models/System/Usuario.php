<?php
namespace App\Models\System;

use App\Models\BaseModel;

class Usuario extends BaseModel{
    
    protected $table = 'sys_usuario';
    
    protected $fillable = ['perfil_id','secretaria_id','nome','matricula','email','login','senha','status','criado_por','gerencia_agenda','tipo_demanda_ids'];
    
    // Esconder campo na funcao toArray,toJson
    protected $hidden = ['senha','pivot'];
    
    public function checkPassword($user){
        if (!isset($user['senha']) or !isset($this->senha)) {
            return false;
        } else {
            if (md5($user['senha']) == $this->senha) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function secretarias(){
        return $this->belongsToMany('App\Models\System\Secretaria','sys_usuario_secretaria', 'usuario_id','secretaria_id')->withTimestamps();
    }

    public function tarefasParticipantes(){
        return $this->belongsToMany('App\Models\System\Tarefas','ge_tarefa_participante', 'usuario_id','id')->withTimestamps();
    }
}
