<?php


use Phinx\Seed\AbstractSeed;

class UsuariosSeeder extends AbstractSeed
{

    public function run()
    {
        $data = [
            [
                'id'    => 1,
                'perfil_id'  => 1,
                'secretaria_id'  => 1,
                'nome'       => 'Administrador',
                'email'       => 'admin@admin.com',
                'login'       => 'admin',
                'senha'       => md5('12345'),
                'status'     => 'A',
                'created_at' => date('Y-m-d H:i:s'),
                'refresh_at' => date('Y-m-d H:i:s'),
                'token_id'   => 1,
                'criado_por' => 1,
            ]
        ];

        $posts = $this->table('sys_usuario');
        $posts->insert($data)
              ->save();
    }
}
