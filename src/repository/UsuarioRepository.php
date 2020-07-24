<?php
namespace App\Repository;

use App\Models\System\Usuario;
use App\Repository\BaseRepository;
use Illuminate\Database\Capsule\Manager as DB;

class UsuarioRepository extends BaseRepository{

    public function __construct(Usuario $usuario){
        $this->model = $usuario;
    }

    public function getLogin($id){
        $usuario = $this->model::find($id);
        if($usuario){
            return $usuario->login;    
        }else{
            return null;
        }
    }
    public function getListLogin(array $ids){
        return $this->model::whereIn('id',$ids)->get()->pluck('login')->all();
    }

    /**
     * Busca resumo de ações e tarefas agrupada por responsavel.
     *
     * @param int $secretariaId
     * @param string $usuarioStatus
     * @return array
     */
    public function buscaResumoEquipe($secretariaId, $usuarioStatus = 'A') 
    {
        $sql = "SELECT u.id, u.nome as usuario, u.status,
                    CAST(COALESCE(totAcao.atrasadas,0) AS SIGNED) AS acao_atrasadas,
                    CAST(COALESCE(totAcao.concluidas,0) AS SIGNED) AS acao_concluidas,
                    CAST(COALESCE(totAcao.abertas,0) AS SIGNED) AS acao_abertas,
                    COALESCE(totAcao.total,0) AS acao_total,
                    CAST(COALESCE(totTarefa.atrasadas,0) AS SIGNED) AS tarefa_atrasadas,
                    CAST(COALESCE(totTarefa.concluidas,0) AS SIGNED) AS tarefa_concluidas,
                    CAST(COALESCE(totTarefa.abertas,0) AS SIGNED) AS tarefa_abertas,
                    COALESCE(totTarefa.total,0) AS tarefa_total
                FROM sys_usuario u 
                    LEFT JOIN (
                        SELECT 
                            ge_acao.responsavel_id,
                            sum(case when ge_acao.data_final < date(NOW()) and ge_acao.situacao_id <> 4 then 1 else 0 end ) as atrasadas,
                            sum(case when ge_acao.situacao_id = 4 then 1 else 0 end ) as concluidas,
                            sum(case when ge_acao.situacao_id not in (3,4) AND ge_acao.data_final >= date(NOW()) then 1 else 0 end ) as abertas,
                            count(*) as total
                        FROM ge_acao WHERE ge_acao.deleted_at IS NULL AND ge_acao.secretaria_id = :secretariaTarefaId GROUP BY ge_acao.responsavel_id
                    ) AS totAcao ON totAcao.responsavel_id = u.id

                    LEFT JOIN (
                        SELECT 
                            ge_tarefa.responsavel_id,
                            sum(case when ge_tarefa.data_final < date(NOW()) and ge_tarefa.situacao_id <> 4 then 1 else 0 end ) as atrasadas,
                            sum(case when ge_tarefa.situacao_id = 4 then 1 else 0 end ) as concluidas,
                            sum(case when ge_tarefa.situacao_id not in (3,4) AND ge_tarefa.data_final >= date(NOW()) then 1 else 0 end ) as abertas,
                            count(*) as total
                        FROM ge_tarefa WHERE ge_tarefa.deleted_at IS NULL AND ge_tarefa.secretaria_id = :secretariaId GROUP BY ge_tarefa.responsavel_id

                    ) AS totTarefa ON totTarefa.responsavel_id = u.id
                    HAVING ( u.`status` = 'A' 
                        OR ( 
                                tarefa_abertas > 0
                                OR tarefa_atrasadas > 0 
                                OR acao_atrasadas > 0
                                OR acao_abertas > 0
                            )
                        ) ORDER BY nome";

        return DB::select( $sql ,  [ 'secretariaTarefaId' => $secretariaId, 'secretariaId' => $secretariaId ]);
    }
}