<?php

namespace Tests\fixture;

/**
 * Fixture.
 */
class UsuarioFixture
{
    /** @var string Table name */
    public $table = 'sys_usuario';

    /**
     * Records.
     *
     * @var array Records
     */
    public $records = [
        [
            'id'              => 1,
            'perfil_id'       => 1, // Administrador
            'secretaria_id'   => 1,
            'nome'            => 'Admin 12',
            'matricula'       => '284',
            'email'           => 'admin@admin.com',
            'login'           => 'admin.admin',
            'senha'           => '2393173f6f0363ba95663236609b4839',
            'status'          => 'A',
            'token_id'        => 1,
            'criado_por'      => 1,
            'created_at'      => '2020-04-02 08:07:51',
            'refresh_at'      => '2020-04-02 08:07:51',
        ],
        [
            'id'              => 2,
            'perfil_id'       => 2, // Coodernador
            'secretaria_id'   => 1,
            'nome'            => 'Coodernador',
            'matricula'       => '284',
            'email'           => 'coodernardo@coodernardo.com',
            'login'           => 'coodernardo.coodernardo',
            'senha'           => '2393173f6f0363ba95663236609b4839',
            'status'          => 'A',
            'token_id'        => 1,
            'criado_por'      => 1,
            'created_at'      => '2020-04-02 08:07:51',
            'refresh_at'      => '2020-04-02 08:07:51',
        ],
        [
            'id'              => 3,
            'perfil_id'       => 3, // Usuário
            'secretaria_id'   => 1,
            'nome'            => 'Usuário',
            'matricula'       => '284',
            'email'           => 'usuario@usuario.com',
            'login'           => 'usuario.usuario',
            'senha'           => '2393173f6f0363ba95663236609b4839',
            'status'          => 'A',
            'token_id'        => 1,
            'criado_por'      => 1,
            'created_at'      => '2020-04-02 08:07:51',
            'refresh_at'      => '2020-04-02 08:07:51',
        ],
        [
            'id'              => 4,
            'perfil_id'       => 3, // Usuário
            'secretaria_id'   => 1,
            'nome'            => 'Usuário 4',
            'matricula'       => '284',
            'email'           => 'usuario4@usuario4.com',
            'login'           => 'usuario4.usuario4',
            'senha'           => '2393173f6f0363ba95663236609b4839',
            'status'          => 'A',
            'token_id'        => 1,
            'criado_por'      => 1,
            'created_at'      => '2020-04-02 08:07:51',
            'refresh_at'      => '2020-04-02 08:07:51'
        ],
        [
            'id'              => 5,
            'perfil_id'       => 3, // Usuário
            'secretaria_id'   => 1,
            'nome'            => 'Usuário 5',
            'matricula'       => '284',
            'email'           => 'usuario5@usuario5.com',
            'login'           => 'usuario5.usuario5',
            'senha'           => '2393173f6f0363ba95663236609b4839',
            'status'          => 'A',
            'token_id'        => 1,
            'criado_por'      => 1,
            'created_at'      => '2020-04-02 08:07:51',
            'refresh_at'      => '2020-04-02 08:07:51'
        ],
    ];
}
