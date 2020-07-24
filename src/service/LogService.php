<?php declare(strict_types=1);

namespace App\Service;

use App\Models\System\Log;
use Psr\Log\LoggerInterface;
use Illuminate\Database\Capsule\Manager as DB;

class LogService
{
    public function __construct(LoggerInterface $logger){
        $this->logger = $logger;
      
    }
    /**
     * Adiciona log no bando de dados
     *
     * @param [type] $data
     * @return void
     */
    public function add(LogData $data){
        DB::beginTransaction();
        try{  
            //Grava log
            $log = new Log();
            $log->usuario_id = $data->usuarioId;
            $log->token      = $data->token;
            $log->browser    = $data->browser;
            $log->data       = $data->data;
            $log->ip        = $data->ip;
            $log->url       = $data->url;

            $log->save();

            DB::commit();
        }catch(\Exception $ex){
            DB::rollBack();
            $this->logger->error($ex->getMessage());
        }
    }
}


class LogData{
    public $usuarioId;
    public $token;
    public $browser;
    public $data;
    public $ip;
    public $url;
}
