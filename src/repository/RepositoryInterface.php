<?php declare(strict_types=1);
namespace App\Repository;

interface RepositoryInterface{    
    public function getall();
    public function create($data);
    public function update($id, $data);
    public function delete($id);
}