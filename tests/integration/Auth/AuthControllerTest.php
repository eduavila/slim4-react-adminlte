<?php declare(strict_types=1);

namespace Tests\integration;

use Tests\fixture\UsuarioFixture;
use Tests\fixture\AcaoTipoFixture;
use Tests\fixture\ParamentroFixture;
use Tests\fixture\SecretariaFixture;
use Tests\Utils\ContainerTestTrait;
use Tests\Utils\DatabaseTestTrait;
use Tests\Utils\MockTrait;
use Tests\Utils\WebTestCase;

class AuthControllerTest extends WebTestCase
{
    //use HttpTestTrait;
    use MockTrait;  
    use DatabaseTestTrait;
    use ContainerTestTrait;

    public function testRealizaLoginComUsuarioInformado()
    {
        $this->insertFixtures([
            UsuarioFixture::class,
            ParamentroFixture::class
        ]);
        
        // Faz mock da conexão do AD
        $this->mockAD();

        // POST
        $this->client->post('/api/auth/login', ['login'=> 'admin.admin' , 'senha'=>'usuario']);

        $this->assertEquals(200, $this->client->response->getStatusCode());
        $this->assertStringContainsString('token_access', (string) $this->client->response->getBody());
        $this->assertStringContainsString('token_refresh', (string) $this->client->response->getBody());
    }

    public function testDeveRetornaInformacaoDoUsuario(): void
    {
        $this->insertFixtures([
            UsuarioFixture::class,
            SecretariaFixture::class
        ]);
        
        $tokenAcess = $this->getTokenAccess(1, 1);
        
        $result = $this->client->get('/api/auth/info',[],['Authorization' => sprintf('Bearer %s', $tokenAcess)]);
        
        $this->assertEquals(200, $this->client->response->getStatusCode());
        $this->assertStringContainsString('id', $result);
    }

    public function testDeveRetornarTokenDeAcessoAtualizado():void
    {
        $this->insertFixtures([
            UsuarioFixture::class
        ]);
            
        // Cria token para utilizar na requisição
        $tokenRefresh = $this->getTokenRefresh(1, 1);

        $result = $this->client->post('/api/auth/refresh',[ 'token' => $tokenRefresh ]);
    
        $this->assertEquals(200, $this->client->response->getStatusCode());
        $this->assertStringContainsString('token_access', $result);
    }

    public function testDeveRealizarLogoutDoUsuario():void
    {
        $this->insertFixtures([
            UsuarioFixture::class
        ]);
            
        // Cria token para utilizar na requisição
        $tokenAcess = $this->getTokenAccess(1, 1);
        $tokenRefresh = $this->getTokenRefresh(1, 1);

        $result = $this->client->post('/api/auth/logout',[ 'device_id' => '11144455','token'=> $tokenRefresh ],['Authorization' => sprintf('Bearer %s', $tokenAcess)]);
    
        $this->assertEquals(200, $this->client->response->getStatusCode());
    }
}
