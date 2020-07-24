<?php
namespace App\Lib\NQueue;

abstract class NWork
{
    protected $container;
    protected $config;

    public function __construct($container, $config)
    {
        $this->container = $container;
        $this->config    = $config;
    }

    abstract public function run($data);
}
