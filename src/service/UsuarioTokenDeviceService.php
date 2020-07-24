<?php declare(strict_types=1);

namespace App\Service;

use App\Models\System\UsuarioTokenDevice;
use Psr\Log\LoggerInterface;

class UsuarioTokenDeviceService
{
    public function __construct(LoggerInterface $logger){
        $this->logger = $logger;
    }
    
    /**
     *  Registra token do device.
     * 
     */
    public function createOrUpdate($data){
        try{            
            // Tenta achar token caso nao existir gerar novo.
            $device = UsuarioTokenDevice::where('device_id',$data['device_id'])->first();
            if(!$device)
            {
                $device = new UsuarioTokenDevice();
            }
            
            $device->fill($data);
            $device->save();
            return true;
        }catch(\Exception $ex){
            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }
}
