<?php declare(strict_types=1);

namespace App\Service;

use App\Exception\ValidationException;
use App\Models\System\Secretaria;
use Psr\Log\LoggerInterface;

class SecretariaService
{
    public function __construct(LoggerInterface $logger){
        $this->logger = $logger;
    }
    // Retorna lista de secretaria
    public function getAll(){
        //return Secretaria::all();
        return Secretaria::from('sys_secretaria as s')
            ->leftJoin('sys_usuario as u','u.id','s.responsavel')
            ->selectRaw("s.*, u.nome responsavel_nome")
            ->get(); 
    }

    // Retorna lista de secretaria
    public function get($id){
        return Secretaria::find($id);
    }

    // Retorna lista de secretaria
    public function createOrUpdate($data){
        try{
            if(isset($data['id'])){
                $secretaria = Secretaria::find($data['id']);
                if(!$secretaria){
                    throw new ValidationException("Secretaria não encontrada",400);
                }
            }else{
                $secretaria = new Secretaria();
                $secretaria->criado_por = $data['criado_por'];
            }
           
            $secretaria->fill($data);

            $secretaria->save();
            return $secretaria;
        }catch(\Exception $ex){
            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }
}
