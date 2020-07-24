<?php

use \Database\Migration;

class SysUsuario extends Migration
{
    public function up()
    {
        $this->schema->create('sys_usuario', function (Illuminate\Database\Schema\Blueprint $table) {
            // Auto-increment id
            $table->increments('id');
            $table->integer('perfil_id')->nullable();
            $table->integer('secretaria_id')->nullable();
            $table->string('nome',50)->nullable();
            $table->string('matricula',50)->nullable();
            $table->string('email',255)->nullable();
            $table->string('login',255)->unique();
            $table->string('senha',255);
            $table->enum('status',['A','I'])->default('A');
          
            //metas
            $table->integer('criado_por')->nullable();
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();
            $table->integer('token_id')->unsigned();
        });
    }

    public function down(){

    }
}
