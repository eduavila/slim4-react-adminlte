<?php

use \Database\Migration;

class SysUsuarioSecretaria extends Migration
{
    public function up()
    {
        $this->schema->create('sys_usuario_secretaria', function (Illuminate\Database\Schema\Blueprint $table) {
            
            // Auto-increment id
            $table->increments('id');
            $table->integer('usuario_id')->unsigned();
            $table->integer('secretaria_id')->unsigned();

            //metas
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();

            //Chave
            $table->foreign('usuario_id')->references('id')->on('sys_usuario');
            $table->foreign('secretaria_id')->references('id')->on('sys_secretaria');
        });
    
    }

    public function down(){

    }
}
