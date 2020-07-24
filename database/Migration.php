<?php
namespace Database;

use Illuminate\Database\Capsule\Manager as Capsule;
use Phinx\Migration\AbstractMigration;

class Migration extends AbstractMigration
{
    /** @var \Illuminate\Database\Capsule\Manager $capsule */
    public $capsule;
    /** @var \Illuminate\Database\Schema\Builder $capsule */
    public $schema;

    public function init()
    {
        $config = (require __DIR__."/../src/app/settings.php")["settings"];

        $this->capsule = new Capsule;
        $this->capsule->addConnection([
            'driver'    => $config["db"]["driver"],
            'host'      => $config["db"]["host"],
            'database'  => $config["db"]["database"],
            'username'  => $config["db"]["username"],
            'password'  => $config["db"]["password"],
            'port'      => $config["db"]["port"],
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
        ]);

        $this->capsule->bootEloquent();
        $this->capsule->setAsGlobal();
        $this->schema = $this->capsule->schema();
    }
}