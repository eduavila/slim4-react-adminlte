<?php
namespace App\Commands;

use App\Lib\NQueue\NQueue;
use Psr\Container\ContainerInterface;

class RunQueue
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function run($args)
    {
        $queue = $this->container->get(NQueue::class);

        $queue->watch();
    }
}