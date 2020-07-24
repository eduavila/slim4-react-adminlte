<?php declare (strict_types = 1);

namespace Tests\integration;

use Tests\fixture\ParamentroFixture;
use Tests\fixture\UsuarioFixture;
use Tests\fixture\UsuarioMensagensFixture;
use Tests\Utils\ContainerTestTrait;
use Tests\Utils\DatabaseTestTrait;
use Tests\Utils\MockTrait;
use Tests\Utils\WebTestCase;

class MensagemControllerTest extends WebTestCase
{
    //use HttpTestTrait;
    use MockTrait;
    use DatabaseTestTrait;
    use ContainerTestTrait;

    public function testDeveRetornarListaMensagemParaUsuario()
    {
        $this->insertFixtures([
            UsuarioFixture::class,
            UsuarioMensagensFixture::class
        ]);

        // 
        $token = $this->getTokenAccess(1, 1);
        $this->client->setJwt($token);
        $this->client->get('/api/mensagens',['status'=> 1]);

        $this->assertEquals(200, $this->client->response->getStatusCode());
            
        $data = $this->client->getBodyArray();
        $this->assertNotEmpty($data[0]->mensagem);
    }

    public function testDeveSetarMensagemComoLida()
    {
        $this->insertFixtures([
            UsuarioFixture::class,
            UsuarioMensagensFixture::class
        ]);

        // 
        $token = $this->getTokenAccess(1, 1);
        $this->client->setJwt($token);
        $this->client->post('/api/mensagens/1');

        $this->assertEquals(200, $this->client->response->getStatusCode());
    }
}
