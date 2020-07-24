<?php

use \Database\Migration;

class SysUsuarioPerfil extends Migration
{
    public function up()
    {
        $this->schema->create('sys_usuario_perfil', function (Illuminate\Database\Schema\Blueprint $table) {
            
            // Auto-increment id
            $table->increments('id');
            $table->string('descricao',255);
            $table->enum('status',['A','I'])->default('A');

          
            //metas
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();
            $table->integer('token_id')->unsigned();
        });
    }

    public function down(){

    }
}
