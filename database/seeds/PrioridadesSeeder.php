<?php

use Phinx\Seed\AbstractSeed;

class PrioridadesSeeder extends AbstractSeed
{
    public function run()
    {   
        $data = [
            [
                'id'    => 1,
                'descricao'  => 'Baixa',
                'cor'  => '#5EB864',
                'secretaria_id'=> null,
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por'   => 1,
            ],
            [
                'id'    => 2,
                'descricao'  => 'Média',
                'cor'  => '#FACE6D',
                'secretaria_id'=> null,
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por'   => 1,
            ],
            [
                'id'    => 3,
                'descricao'  => 'Alta',
                'cor'  => '#F36969',
                'secretaria_id'=> null,
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por'   => 1,
            ]
        ];

        $posts = $this->table('ge_prioridade');
        $posts->insert($data)
              ->save();
    }
}
