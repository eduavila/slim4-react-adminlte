<?php

namespace Tests\fixture;

/**
 * Fixture.
 */
class ParamentroFixture
{
    /** @var string Table name */
    public $table = 'sys_parametro';

    /**
     * Records.
     *
     * @var array Records
     */
    public $records = [
        [
            'id' => 1,
            'nome' => 'SERVERS_AD',
            'descricao' => 'Servers AD',
            'valor' => '[{"server":"192.168.0.1","user":"administrador","domain":"PMLRV","pass":""]',
            'status' => 'A',
            'type' => 'STRING',
            'token_id' => 1, 
            'created_at' => '2020-04-02 08:07:51',
            'refresh_at' => '2020-04-02 08:07:51'
        ]
    ];
}