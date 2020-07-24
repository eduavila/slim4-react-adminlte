<?php

use \Database\Migration;

class SysSecretaria extends Migration
{
    public function up()
    {

        $this->schema->create('sys_secretaria', function (Illuminate\Database\Schema\Blueprint $table) {
            
            // Auto-increment id
            $table->increments('id');
            $table->string('sigla',255);
            $table->string('nome',255);
            $table->string('nome_reduzido',255);
            $table->string('responsavel',255);
            $table->enum('status',['I','A'])->default('A');
    
            //metas
            $table->integer('criado_por')->unsigned();
            $table->datetime('created_at')->nullable();
            $table->datetime('refresh_at')->nullable();
            $table->integer('token_id')->unsigned();

            // Chaves
            $table->foreign('criado_por')->references('id')->on('sys_usuario');
        });
    }

    public function down(){

    }
}
    
