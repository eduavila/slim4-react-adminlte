<?php

use \Database\Migration;

class SysConfig extends Migration
{
    public function up()
    {
        $this->schema->create('sys_config', function (Illuminate\Database\Schema\Blueprint $table) {
            
            // Auto-increment id
            $table->increments('id');
            $table->string('titulo',255);
            $table->string('titulo_mini',255);
            $table->string('descricao',255);
            $table->string('msg_login',255);
            $table->string('rodape',255);
        });
    }

    public function down(){

    }
}
