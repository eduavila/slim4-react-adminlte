<?php
namespace App\Lib\NQueue;

use App\Factory\LoggerFactory;
use Predis\Client as Redis;

class NQueue
{
    protected $queue;
    protected $nameQueue;
    protected $config;

    protected $container;

    public function __construct($container, $config = null)
    {
        $this->config    = $config;
        $this->container = $container;
        
        // criar conexão com base Redis.
        $this->queue = new Redis($config['redis']);

        $this->logger = $this->newLogger();
    }

    /**
     * Enviar novo work para fila
     *
     * @param string $work
     * @param array $data
     * @return void
     */
    public function sendQueue($work, $data)
    {
        $id = getmypid();
        $job = [
            "work"   => $work,
            "data"   => $data,
        ];
  
        return $this->queue->lPush($this->config['name'], json_encode($job, false));
    }

    public function watch()
    {
        echo "[" . date('Y-m-d H:m:s') . "] Inicializando queue.\n";
 
        $id = getmypid();//ideally, for restarting task queues, this would be passed in from PM2 or Supervisor or whatever.
        
        $taskQ = $this->config['name'];
        $workerID = $taskQ . ':worker:' . $id;
        // 
        $this->queue->lPush($taskQ . ':workers', $workerID);
        $run = true;

        while ($run) {

            // Verifique minha fila para qualquer coisa dirigida a mim pessoalmente.
            $messageRaw = $this->queue->get($workerID);
            if (!$messageRaw) {
                // verifique a fila do conjunto de trabalhadores
                $messageRaw = $this->queue->rPopLPush($this->config['name'], $workerID);
            }

            // As pesquisas sem bloqueio não podem retornar nada se não houver nada.
            if ($messageRaw) {
                try {
                    $received = json_decode($messageRaw,true);
                 
                    // Verifica se foi passado dados para work.
                    $work = $received['work'];
                    if (isset($received['data'])) {
                        $data = $received['data'];
                    } else {
                        $data = array();
                    }

                    echo "[" . date('Y-m-d H:m:s') . "] Recebeu um $work (" . current($data) . ") ...";

                    // Criar nova instacia do Work enviado.
                    $instanceWork = new $work($this->container, $this->config);

                    // Verifica se work tem metodo  'run'.
                    if (method_exists($instanceWork,'run')) {

                        try{
                            // Executa metodo run do work.
                            $outcome = $instanceWork->run($data);

                            //habilita debug.
                            // if($this->config['debug']){
                            //     echo $outcome;
                            // }
    
                            // Verifica se executou com sucesso.
                            if ($outcome) {
                                echo "done \n";
                                $this->queue->lRem($workerID, 1, $messageRaw);
                            } else {
                                echo "Falha na execução do Work \n";
                            }

                        }catch(\Exception $ex ){
                            $this->logger->error($ex->getMessage());

                            // Caso ocorra erro na execução do work, registrar como falha e passa o erre na mensagem
                            $newMessage = array_merge($received,[
                                'error'=> $ex->getMessage()
                            ]);

                            $this->queue->rPush($this->config['name']. ':failed', json_encode($newMessage));
                        }
                    } else {
                        // Class o Work não foi encontrado.
                        echo "Work não foi encontrado. \n";
                        $this->queue->lRem($workerID, 1, $messageRaw);
                    }
                } catch (\Exception $ex) {
                    //fail:
                    $this->logger->error($ex->getMessage());

                    echo $workerID, ':', time(), ' ERROR: ', $ex->getMessage(), "\n";
                    //iff this error is just something with this particular worker, run it again:
                    //$redis->rPush($taskQ, $message);
                    //or
                    //$redis->rPush($taskQ . ':failed', $message);
                    //and then later clean out the failed queue with something else.
                } finally {

                    //always:
                    $this->queue->lRem($workerID, 1, $messageRaw);
                }

            } else {
                sleep(5);
            }
        }
        
        //Remove da lista de work em processamento
        $this->queue->lRem($this->config['name'] . ':workers', 0, $workerID);
    }

    protected function newLogger()
    {
        $settings = $this->config['logger'];

        $monolog = new LoggerFactory($settings);
        $monolog->addFileHandler($settings['filename']);
        $monolog->addConsoleHandler($settings['level']);

        return $monolog->createInstance($settings['name']);
    }
}