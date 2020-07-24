<?php declare(strict_types=1);

namespace App\Service;

use App\Exception\ValidationException;
use App\Models\System\Parametro;
use Illuminate\Database\Capsule\Manager as DB;
use Psr\Log\LoggerInterface;

class ParametrosService
{
    public function __construct(LoggerInterface $logger){
        $this->logger = $logger;
    }
    
    // Retorna lista de secretaria
    public function getAll(){
        return Parametro::all();
    }

    // Retorna lista de secretaria
    public function get($id){
        return Parametro::find($id);
    }

    // Retorna lista de secretaria
    public function createOrUpdate($data){
        try{
        
            if(isset($data['id'])){
                $save = Parametro::find($data['id']);
                if(!$save){
                    throw new ValidationException("Parametro não encontrada",400);
                }
                
            }else{
                $save = new Parametro();
                $save->token_id      = $data['token_id'];
            }
           
            $save->fill($data);
            $save->save();

            DB::commit();
            return $save;
        }catch(\Exception $ex){
            DB::rollBack();
            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }
}
