<?php

namespace Tests\fixture;

/**
 * Fixture.
 */
class SecretariaFixture
{
    /** @var string Table name */
    public $table = 'sys_secretaria';

    /**
     * Records.
     *
     * @var array Records
     */
    public $records = [
        [
            'id' => 1,
            'sigla' => 'SMA',
            'nome' => 'SECRETARIA MUNICIPAL DE ADMINISTRAÇÃO',
            'nome_reduzido' => 'SEC. DE ADMINISTRAÇÃO',
            'responsavel' => '1',
            'status' => 'A',
            'token_id'   => 1, 
            'criado_por' => 1,
            'created_at' => '2020-04-02 08:07:51',
            'refresh_at' => '2020-04-02 08:07:51'
        ]
    ];
}