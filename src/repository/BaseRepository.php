<?php declare(strict_types=1);

namespace App\Repository;

abstract class BaseRepository implements RepositoryInterface
{
    protected $model;

    public function getall()
    {
        $this->model::all();
    }

    public function find($id)
    {   
        return $this->model::find($id);
    }

    public function create($data)
    {

    }
    public function update($id, $data)
    {

    }

    public function delete($id)
    {

    }
}
