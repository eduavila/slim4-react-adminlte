<?php

namespace Tests\fixture;

/**
 * Fixture.
 */
class UsuarioMensagensFixture
{
    /** @var string Table name */
    public $table = 'sys_mensagem_usuario';

    /**
     * Records.
     *
     * @var array Records
     */
    public $records = [
        [
            "id" => 1,
            "tipo" => "EDIT_ACAO",
            "lida" => 1,
            "mensagem" => "Eduardo Avila Malheiros editou a <p class=\"max-text\"><b>Ação: <a href=\"javascript:window.openAcao(296);\">7.2.3.2.  Verificar quais espaços estão ociosos e podem ser revitalizados</a></b></p>",
            "criado_por" => 1,
            "created_at" => "2020-06-08 16:58:12",
            "refresh_at" => "2020-06-09 08:56:20",
            "token_id" => 1,
            "titulo" => "Ação foi editada!",
            "usuario_para" => 1,
            "dados" => "{\"acaoId\":296,\"descricao\":\"7.2.3.2.  Verificar quais espa\\u00e7os est\\u00e3o ociosos e podem ser revitalizados\"}",
        ],
        [
            "id" => 2,
            "tipo" => "ADD_PARTICIPANTE_ACAO",
            "lida" => 0,
            "mensagem" => "Eduardo Avila Malheiros adicionou você como participante na <p class=\"max-text\"><b>Ação <a href=\"javascript:window.openAcao(296);\"> 7.2.3.2.  Verificar quais espaços estão ociosos e podem ser revitalizados</a></b></p>",
            "criado_por" => 1,
            "created_at" => "2020-06-08 16:58:12",
            "refresh_at" => "2020-06-08 16:58:12",
            "token_id" => 1,
            "titulo" => "Adicionou como participante de uma nova ação!",
            "usuario_para" => 1,
            "dados" => "{\"acaoId\":296,\"descricao\":\"7.2.3.2.  Verificar quais espa\\u00e7os est\\u00e3o ociosos e podem ser revitalizados\"}",
        ],
    ];
}