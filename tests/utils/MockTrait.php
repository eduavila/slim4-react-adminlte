<?php
namespace Tests\Utils;

use Tests\fixture\ParamentroFixture;

trait MockTrait
{
    use DatabaseTestTrait;
    
    protected function mockAD(){
        // Mocka chamada em servidores externo de AD.
        $mock = \Mockery::mock('overload:App\Lib\AdConnect\Ldap');
        $mock->shouldReceive('checkUser')->andReturn(true);
        $mock->shouldReceive('getInfoUser')->andReturn( [ 'displayname' => 'admin@admin.com']);
    }
}