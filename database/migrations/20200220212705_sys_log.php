<?php

use \Database\Migration;

class SysLog extends Migration
{
    public function up()
    {
        $this->schema->create('sys_log', function (Illuminate\Database\Schema\Blueprint $table) {   
            // Auto-increment id
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->nullable();
            $table->string('token')->nullable();
            $table->text('browser')->nullable();
            $table->string('ip')->nullable();
            $table->string('url')->nullable();
            $table->longText('data')->nullable();
           
            //metas
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();
        });
    }

    public function down(){

    }
}
