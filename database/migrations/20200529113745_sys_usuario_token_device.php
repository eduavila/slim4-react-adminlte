<?php

use \Database\Migration;

class SysUsuarioTokenDevice extends Migration
{
    public function up()
    {
        $this->schema->create('sys_usuario_token_device', function (Illuminate\Database\Schema\Blueprint $table) {   
            // Auto-increment id
            $table->increments('id');
            $table->integer('usuario_id')->unsigned();
            $table->enum('tipo',['WEB','MOBILE']);
            $table->text('token');
            $table->string('device_id')->nullable();
            $table->string('ip')->nullable();
            $table->string('browser')->nullable();
            
            //metas
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();
            
            //Chaves
            $table->foreign('usuario_id')
                ->references('id')
                ->on('sys_usuario');
        });
    }

    public function down(){

    }
}
