<?php
namespace App\Works;

use App\Lib\NQueue\NWork;
use App\Models\System\UsuarioTokenDevice;
use NPusher\NPusher;
use Selective\Config\Configuration;

class PushWork extends NWork{
    protected $pusher;

    function __construct($container,$config)
    {   
        $this->container = $container;
        $this->config    = $config;

        // Config Geral
        $this->settings = $this->container->get(Configuration::class);
        $this->configPusher = $this->settings->getArray('settings.pusher');
    }

    public function run($data){
        $pusher = New NPusher($this->configPusher['api_key']);

        $dataNotification = [
            "vibrate" => 1,
            "sound" => 1,
        ];

        $dataNotification = array_merge($dataNotification, $data);
        $pusher->notify($data['token_device'], $dataNotification);

        // if($this->config['queue']['debug']){
        //     echo $result;
        // }

        return true;
    }
}
