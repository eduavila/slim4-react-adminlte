<?php declare(strict_types=1);

namespace App\Service;

use App\Models\System\Usuario;
use App\Exception\ValidationException;
use App\Models\System\Secretaria;
use Illuminate\Database\Capsule\Manager as DB;
use Psr\Log\LoggerInterface;

class UsuarioService
{
    public function __construct(LoggerInterface $logger){
        $this->logger = $logger;
    }

    // Retorna lista de usuario
    public function getAll($onlyAtivos)
    {
        $query = Usuario::from('sys_usuario as u')
            ->leftJoin('sys_usuario_perfil as p','p.id','=','u.perfil_id')
            ->leftJoin('sys_secretaria as s','s.id','=','u.secretaria_id')
            ->selectRaw("u.*,p.descricao as perfil_descricao, s.nome as secretaria_descricao
                ,(select group_concat(sa.nome_reduzido, ' ') from sys_usuario_secretaria us 
                    left join sys_secretaria as sa on sa.id = us.secretaria_id
                    where us.usuario_id = u.id and us.secretaria_id <> u.secretaria_id) as acessos");

        if($onlyAtivos){
            $query->where('u.status','A');
        }

        return $query->get();
    }

    /**
     * Busca usuario por ID
     *  
     * @param int $id
     * @return App\Models\System\Usuario
     */
    public function get($id)
    {   
        $usuario = Usuario::from('sys_usuario as u')
            ->leftJoin('sys_usuario_perfil as p','p.id','=','u.perfil_id')
            ->leftJoin('sys_secretaria as s','s.id','=','u.secretaria_id')
            ->selectRaw("u.*,p.descricao as perfil_descricao, s.nome as secretaria_descricao")
            ->where('u.id',$id)
            ->first();

        return $usuario->load('secretarias');
    }

    // Retorna lista de usuario
    public function createOrUpdate($data)
    {
        DB::beginTransaction();
        try{
     
            if(isset($data['id'])){
                $usuario = Usuario::find($data['id']);
                if(!$usuario){
                    throw new ValidationException("usuario não encontrada",400);
                }                
                $usuario->fill($data);
            }else{
                $checkEmail = Usuario::where('email',$data['email'])->exists();
                if($checkEmail){
                    throw new ValidationException("Já existe usuário com este email!",400);
                }

                $checkLogin = Usuario::where('login',$data['login'])->exists();
                if($checkLogin){
                    throw new ValidationException("Já está sendo usando esse usuário!",400);
                }

                $usuario = new Usuario();
                $usuario->fill($data);

                $usuario->criado_por = $data['criado_por'];
                $usuario->senha    = md5($data['senha']);
                $usuario->token_id = $data['token_id'];
            }
            if(isset($data['tipo_demanda_ids']))
            {
                $usuario->tipo_demanda_ids = implode(',',$data['tipo_demanda_ids']);
            }
            
            $usuario->save();

            //Grava secretaria usuario possui permissão
            if(isset($data['secretarias'])){
                $usuario->secretarias()->sync($data['secretarias']);
            }
    
            DB::commit();            
            return $usuario;
        }catch(\Exception $ex){
            DB::rollBack();

            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }

    public function getSecretariaUsuarios($usuarioId)
    {
        $usuario = Usuario::find($usuarioId);
        if(!$usuario){
            throw new ValidationException("usuario não encontrada",400);
        }
        $secretarias = $usuario->secretarias;

        $secretariaPadrao = Secretaria::find($usuario->secretaria_id);
        if($secretariaPadrao){
            $secretarias->push($secretariaPadrao);
        }
        
        return $secretarias->unique('id');
    }

    public function alterarSenha($usuarioId,$senha){
        $usuario = Usuario::find($usuarioId);
        if(!$usuario){
            throw new ValidationException("usuario não encontrada",400);
        }

        $usuario->senha = md5($senha);
        $usuario->save();
        
        return false;
    }
}
