<?php


use Phinx\Seed\AbstractSeed;

class SituacoesSeeder extends AbstractSeed
{
    public function run()
    {
        $data = [
            [
                'id'    => 1,
                'descricao'  => 'Aguardando',
                'tipo'  => 'A',
                'secretaria_id'=> null,
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por'   => 1
            ],
            [
                'id'    => 2,
                'descricao'  => 'Em andamento',
                'tipo'  => 'A',
                'secretaria_id'=> null,
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por'   => 1
            ],
            [
                'id'    => 3,
                'descricao'  => 'Cancelada',
                'tipo'  => 'F',
                'secretaria_id'=> null,
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por'   => 1
            ],
            [
                'id'    => 4,
                'descricao'  => 'Concluída',
                'tipo'  => 'F',
                'secretaria_id'=> null,
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por'   => 1
            ]
        ];

        $posts = $this->table('ge_situacao');
        $posts->insert($data)
              ->save();
    }
}
