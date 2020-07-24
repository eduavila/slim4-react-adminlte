<?php declare(strict_types=1);

namespace App\Service;

use Predis\Client as Redis;
use Psr\Log\LoggerInterface;
use RuntimeException;
use DomainException;
use Selective\Config\Configuration;
use Illuminate\Database\Capsule\Manager as DB;
use App\Exception\ValidationException;
use App\Lib\AdConnect\Ldap;
use App\Models\System\Parametro;
use App\Models\System\Usuario;
use App\Models\System\UsuarioToken;
use App\Models\System\UsuarioTokenDevice;

class AuthService
{
    protected $user;

    protected $config;
    protected $jwt;
    protected $redis;

    public function __construct(LoggerInterface $logger, Configuration $config,TokenJwt $jwt, Redis $redis){
        $this->config = $config;
        $this->jwt = $jwt;
        $this->redis = $redis;
        $this->logger = $logger;
    }
    /**
     * Faz login retornando token e info do usuario.
     *
     * @param [type] $data
     * @return void
     */
    public function login($data){

        $adServers = Parametro::get('SERVERS_AD');

        if (!$adServers) {
            throw new \Exception('Não foi encontrado parâmetros de configurações do AD. Verifique!');
        }

        $servers = json_decode($adServers, true);
     
        DB::beginTransaction();
        try{
            // Instancia servidor de AD para verificar se usuário existe.
            $ad = new Ldap($servers);
            $user = $ad->checkUser($data['login'],$data['senha']);
            
            if(!$user){
                throw new ValidationException("Usuário ou senha incorreta!",400);
            }
            
            $userAd = $ad->getInfoUser($data['login']);

            $usuario = Usuario::from('sys_usuario as u')
                                ->leftJoin('sys_usuario_perfil as s','s.id','=','u.perfil_id')
                                ->where('u.login',trim($data['login']))
                                ->selectRaw("u.*,s.descricao as perfil_descricao")
                                ->first();
            if(!$usuario){
                $novoUsuario = Usuario::create([
                    'login'     => $data['login'],
                    'nome'      => $userAd['displayname'],
                    'perfil_id' => 3,
                    'senha'     => md5((string) time())
                ]);

                $usuario = Usuario::from('sys_usuario as u')
                    ->leftJoin('sys_usuario_perfil as s','s.id','=','u.perfil_id')
                    ->where('u.id', $novoUsuario->id)
                    ->selectRaw("u.*,s.descricao as perfil_descricao")
                    ->first();
            }

            if(!$usuario){
                throw new ValidationException("Não foi possivel encontrar usuário. Entre contato com suporte!",400);
            }

       
            //Grava log de registro token.
            $usuarioToken = new UsuarioToken();
            $usuarioToken->usuario_id = $usuario->id;
            $usuarioToken->tipo       = 'WEB';
            $usuarioToken->ip         = $data['ip'];
            $usuarioToken->browser    = json_encode($data['browser']);

            $usuarioToken->save();

            //Gera token de acesso.
            $data = [ 'id' => $usuario->id, 'perfilId'=> $usuario->perfil_id, 'usuarioTokenId'=> $usuarioToken->id ];

            $tokenRefresh = $this->jwt->encodeRefresh($data);
            $usuarioToken->token = $tokenRefresh;
            $usuarioToken->save();

            DB::commit();

            if(!$usuario->secretaria_id){
                throw new ValidationException("Usuário não está vinculado a nenhuma secretaria. Entre contato com suporte!",400);
            }

            return [
                'token_access'  => $this->jwt->encodeAccess($data),
                'token_refresh' => $tokenRefresh,
                'usuario'       => $usuario->toArray()
            ];
        }catch(\Exception $ex){
            DB::rollBack();

            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }

    /**
     * Retornar informação do usuário
     *
     * @param [type] $data
     * @return void
     */
    public function info($data)
    {   
        try{
            $usuario =  Usuario::from('sys_usuario as u')
                        ->leftJoin('sys_usuario_perfil as s','s.id','=','u.perfil_id')
                        ->where('u.id',$data->id)
                        ->selectRaw("u.*,s.descricao as perfil_descricao")
                        ->first();
            
            if(!$usuario){
                throw new ValidationException("Usuário não encontrado",400);
            }
        
            return $usuario->load('secretarias')->toArray();
        }catch(\Exception $ex){
            $this->logger->error($ex->getMessage());
            throw new \Exception('Erro ao solicitar token',500);
        }
    }

    /**
     * Atualiza token de acesso.
     *
     * @param [type] $token
     * @return void
     */
    public function refresh($token)
    {
        try{
            $jwtDecode = $this->jwt->decode($token);    

            if(!$this->redis->exists($token)){
                throw new ValidationException("Token não existe ou foi revogado.",401);
            }
            
            return [
                'token_access'  => $this->jwt->encodeAccess((array) $jwtDecode->data)
            ];
        } catch (RuntimeException | DomainException | ValidationException $exception) {
            throw new ValidationException("Token invalido",401);
        } catch(\Exception $ex){
            $this->logger->error($ex->getMessage());
            throw new \Exception('Erro ao solicitar token',500);
        }
    }

    /**
     * Revoga token de atualizacao.
     *
     * @param [type] $usuarioId
     * @param [type] $token
     * @return void
     */
    public function revoge($usuarioId,$token,$deviceId)
    {
        try{
            $jwtDecode = $this->jwt->decode($token);

            if($usuarioId != $jwtDecode->data->id){
                throw new ValidationException("Token não e do usuário",400);
            }

            // Exclui  token para se revogado 
            if($this->redis->exists($token)){
                $this->redis->del($token);
            }

            // Deleta device da lista de token para push.
            if($deviceId){
                $listDevice = UsuarioTokenDevice::where('usuario_id',$jwtDecode->data->id)
                ->where('device_id', $deviceId)->get();
                $listDevice->each(function($device){
                    $device->delete();
                });
            }

            return;
        } catch (RuntimeException | DomainException | ValidationException $exception) {
            throw new ValidationException("Token invalido",401);
        } catch(\Exception $ex){
            $this->logger->error($ex->getMessage());
            throw new \Exception('Erro ao solicitar token',500);
        }
    }

    /**
     * Seta usuario
     *
     * @param [type] $usuario
     * @return void
     */
    public function getUsuario()
    {
        return $this->usuario;
    }

    /**
     * Seta usuario
     *
     * @param [type] $usuario
     * @return void
     */
    public function setUsuario($usuario)
    {
        $this->usuario = $usuario;
    }

    /**
     * retorna ID e Perfil do usuário 
     *
     * @return void
     */
    public function getUsuarioId()
    {
        return $this->usuario->id;
    }

    public function getTokenId()
    {
        return $this->usuario->usuarioTokenId;
    }

    /**
     * retorna Perfil do usuário 
     *
     * @return void
     */
    public function getUsuarioPerfil()
    {
        return $this->usuario->perfilId;
    }

    public function isPerfils($perfils){
        return in_array($this->usuario->perfilId,(array) $perfils);
    }

     /**
     * Retorna informação do usuario logado
     *
     * @return void
     */
    public function getUsuarioInfo(){
        return Usuario::find($this->usuario->id);
    }

    public function checkPerfils($perfils)
    {
        return in_array($this->usuario->perfilId,(array) $perfils);
    }
}
