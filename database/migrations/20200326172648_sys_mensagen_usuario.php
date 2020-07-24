<?php

use \Database\Migration;

class SysMensagenUsuario extends Migration
{
    public function up()
    {
        $this->schema->create('sys_mensagem_usuario', function (Illuminate\Database\Schema\Blueprint $table) {
            // Auto-increment id
            $table->increments('id');
            $table->string('tipo');
            $table->boolean('lida');
            $table->longText('dados');

            //Coluna
            $table->string('titulo')->nullable();
            $table->text('mensagem');
            $table->integer('token_id')->unsigned();
            $table->integer('usuario_para')->unsigned()->nullable();
            $table->integer('criado_por')->nullable();
            // Relacionamentos
            $table->foreign('usuario_para')
                ->references('id')
                ->on('sys_usuario');

            //metas
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();
        });
    }

    public function down(){

    }
}
