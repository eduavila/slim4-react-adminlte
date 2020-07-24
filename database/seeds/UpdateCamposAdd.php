<?php

use App\Models\GE\Acao;
use App\Models\GE\Iniciativa;
use App\Models\GE\Meta;
use App\Models\GE\Objetivo;
use Phinx\Seed\AbstractSeed;

class UpdateCamposAdd extends AbstractSeed
{
    public function run()
    {
        $acoes = Acao::all();

        echo 'Ações total:'.$acoes->count();
        $acoes->map(function($acao){
            echo 'Atualizando ação ID:'.$acao->id;
            Acao::updateSituacao($acao->id);

            echo '\n\n';
        });

        $iniciativas = Iniciativa::all();

        echo 'Iniciativa total:'.$iniciativas->count();
        $iniciativas->map(function($iniciativa){
            echo 'Atualizando Iniciativa ID:'.$iniciativa->id;
            Iniciativa::updateSituacao($iniciativa->id);

            echo '\n\n';
        });


        $metas = Meta::all();

        echo 'Metas total:'.$metas->count();
        $metas->map(function($meta){
            echo 'Atualizando Meta ID:'.$meta->id;
            Meta::updateSituacao($meta->id);

            echo '\n\n';
        });

        $objetivos = Objetivo::all();
        echo 'Metas total:'.$objetivos->count();
        $objetivos->map(function($objetivo){
            echo 'Atualizando Objetivos ID:'.$objetivo->id;
            Objetivo::updateSituacao($objetivo->id);

            echo '\n\n';
        });
    }
}
