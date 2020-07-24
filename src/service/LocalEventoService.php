<?php declare(strict_types=1);

namespace App\Service;

use App\Exception\ValidationException;
use App\Models\Agenda\LocalEvento;
use Illuminate\Database\Capsule\Manager as DB;
use Psr\Log\LoggerInterface;

class LocalEventoService
{
    public function __construct(LoggerInterface $logger,AuthService $authService){
        $this->logger = $logger;
        $this->authService = $authService;
    }

    /**
     * Retorna lista de locais por secretaria.
     *
     * @param int $secretariaId
     * @param null|string $status  / A-Ativo , I-Inativo
     * @return Collection
     */
    public function getAll($secretariaId, $status)
    {
        $locais = LocalEvento::where('secretaria_id',$secretariaId);
                            
        if($status){
            $locais->where('status',$status);
        }
        return $locais->get();
    }

    /**
     * Retorna local selecionado.
     *
     * @param int $secretariaId
     * @param int $id   
     * @return Collection
     */
    public function get($secretariaId,$id)
    {
        $local = LocalEvento::where('id',$id)
                    ->where('secretaria_id',$secretariaId);

        return $local->first();
    }

    /**
     *  Cria novo Local 
     *
     * @param array $data
     * @return App\Models\LocalEvento
     */
    public function create($data)
    {
        try{
            $local = new LocalEvento();
            $local->fill($data);
            $local->status = $local->status ?: 'A';
            $local->criado_por = $data['criado_por'];
            $local->token_id   = $data['token_id'];
            $local->save();

            return $local;
        }catch(\Exception $ex){

            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }

    /**
     * Atualiza Local do evento
     *
     * @param array $data
     * @return App\Models\LocalEvento
     */
    public function update($data)
    {
        try{
            $local = LocalEvento::where('id',$data['id'])
                        ->where('secretaria_id',$data['secretaria_id'])
                        ->first();

            if(!$local)
            {
                throw new ValidationException('Local não encontrado!',400);
            }

            $local->fill($data);
            $local->save();

            return $local;
        }catch(\Exception $ex){
            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }
}
