<?php

use \Database\Migration;

class SysParametro extends Migration
{
    public function up()
    {
        $this->schema->create('sys_parametro', function (Illuminate\Database\Schema\Blueprint $table) {
                
            // Auto-increment id
            $table->increments('id');
            $table->string('nome',255);
            $table->string('descricao',255);
            $table->text('valor');
            $table->enum('status',['I','A'])->default('A');
            $table->enum('type',['STRING','ARRAY','INT','FLOAT'])->default("STRING");
            
            //metas
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();
            $table->integer('token_id')->unsigned();

            // Chaves
        });
    }

    public function down(){

    }
}
