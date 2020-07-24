<?php declare(strict_types=1);

namespace App\Service;

use Firebase\JWT\JWT;
use Selective\Config\Configuration;
use Predis\Client as Redis;

class TokenJwt
{
    protected $config;
    protected $configJwt;
    protected $redis;

    public function __construct(Configuration $config,Redis $redis){
        $this->config = $config;
        $this->redis = $redis;
        $this->configJwt = $this->config->getArray('settings.jwt');
    }

    public function encodeAccess(array $data){
        $issuedAt = time();
        $expire = $issuedAt + $this->configJwt['exp_sec_access']; // tempo de expiracao do token
 
        $tokenParam = [
            'iat'  => $issuedAt,            // timestamp de geracao do token
            //'iss'  => $this->configJwt['iss'],  // dominio, pode ser usado para descartar tokens de outros dominios
            'exp'  => $expire,              // expiracao do token
            'nbf'  => $issuedAt - 1,        // token nao eh valido Antes de
            'data' => $data,                // Dados do usuario logado
        ];
 
        return JWT::encode($tokenParam,$this->configJwt['secret']);
    }

    public function encodeRefresh(array $data){
        
        $issuedAt = time();
        $expire = $issuedAt + $this->configJwt['exp_sec_refresh']; // tempo de expiracao do token
 
        $tokenParam = [
            'iat'  => $issuedAt,            // timestamp de geracao do token
            //'iss'  => $this->configJwt['iss'],  // dominio, pode ser usado para descartar tokens de outros dominios
            'exp'  => $expire,              // expiracao do token
            'nbf'  => $issuedAt - 1,        // token nao eh valido Antes de
            'data' => $data,                // Dados do usuario logado
        ];

        $jwtToken = JWT::encode($tokenParam,$this->configJwt['secret']);
        
        // Grava no redis para consulta no futuro.
        $this->redis->set($jwtToken,1);
        $this->redis->expireAt($jwtToken,$expire); // Adiciona tempo para jwt expirar do redis.

        return $jwtToken;
    }

    public function decode($jwt){
        return JWT::decode($jwt,$this->configJwt['secret'], ['HS256']);
    }

    public function revoge($jwt){
        if($this->redis->exists($jwt)){
            $this->redis->del($jwt);
        }
    }
}

