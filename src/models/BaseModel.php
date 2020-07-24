<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model{

    //Define nome coluna de atualizacao.
    const UPDATED_AT = 'refresh_at';

    // Define chave primaria da tabela;
    protected $primaryKey='id';

    // Define se vai controlar timestamp.
    public $timestamps = true;

    public function scopeDiff($query,$data)
    {
        return diffClass($this->getAttributes(),$data);
    }
}
