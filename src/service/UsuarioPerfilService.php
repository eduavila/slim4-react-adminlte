<?php declare(strict_types=1);

namespace App\Service;

use App\Exception\ValidationException;
use App\Models\System\UsuarioPerfil;
use Illuminate\Database\Capsule\Manager as DB;
use Psr\Log\LoggerInterface;

class UsuarioPerfilService
{
    public function __construct(LoggerInterface $logger){
        $this->logger = $logger;
    }
    
    // Retorna lista Perfils
    public function getAll(){
        return UsuarioPerfil::all();
    }

    // Retorna lista Perfils
    public function get($id){
        return UsuarioPerfil::find($id);
    }

    // Retorna lista Perfils
    public function createOrUpdate($data){
        try{
        
            if(isset($data['id'])){
                $perfil = UsuarioPerfil::find($data['id']);
                if(!$perfil){
                    throw new ValidationException("Perfil não encontrada",400);
                }
                
            }else{
                $perfil = new UsuarioPerfil();
                $perfil->token_id      = $data['token_id'];
            }
           
            $perfil->fill($data);
            $perfil->save();

            DB::commit();
            return $perfil;
        }catch(\Exception $ex){
            DB::rollBack();
            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }
}
