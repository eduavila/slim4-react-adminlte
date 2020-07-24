<?php

use Phinx\Seed\AbstractSeed;

class PerfilsSeeder extends AbstractSeed
{
    public function run()
    {   
        $data = [
            [
                'id'    => 1,
                'descricao'  => 'Administrador',
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
            ],[
                'id'    => 2,
                'descricao'  => 'Coordenador',
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
            ],
            [
                'id'    => 3,
                'descricao'  => 'Usuário',
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
            ]
        ];

        $posts = $this->table('sys_usuario_perfil');
        $posts->insert($data)
              ->save();
    }
}
