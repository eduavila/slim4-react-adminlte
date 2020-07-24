<?php declare (strict_types = 1);

namespace App\Service;

use App\Models\GE\Atividade;
use App\Repository\AtividadeRepository;
use App\Repository\PrioridadeRepository;
use App\Repository\SituacaoRepository;
use App\Repository\UsuarioRepository;
use Carbon\Carbon;
use Psr\Log\LoggerInterface;

class AtividadeService
{
    public function __construct(LoggerInterface $logger, AuthService $authService, UsuarioRepository $usuarioRepo, SituacaoRepository $situacaoRepo, PrioridadeRepository $prioridadeRepo, AtividadeRepository $atividadeRepo)
    {
        $this->logger         = $logger;
        $this->authService    = $authService;
        $this->usuarioRepo    = $usuarioRepo;
        $this->situacaoRepo   = $situacaoRepo;
        $this->prioridadeRepo = $prioridadeRepo;
        $this->atividadeRepo  = $atividadeRepo;
    }

    /**
     *  Nova atividade
     *
     * @param [type] $tipo
     * @param [type] $tabela
     * @param [type] $recursoId
     * @param [type] $conteudo
     * @param [type] $descricao
     * @return void
     */
    public function create($data)
    {
        try {
            $usuario = $this->authService->getUsuario();

            $atividade             = new Atividade();
            $atividade->token_id   = $usuario->usuarioTokenId;
            $atividade->criado_por = $usuario->id;
            $atividade->fill($data);

            $atividade->save();
        } catch (\Exception $ex) {
            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }

    /**
     * Busca lista atividades referente a tarefa.
     *
     * @param int $tarefaId
     * @param int $page
     * @return Collection
     */
    public function getAllPorTarefa($tarefaId, $page)
    {
        $atividades = $this->atividadeRepo->getListPaginate($tarefaId, 'ge_tarefa', $page);

        $atividades = $atividades->transform(function ($atividade) {
            if (!isset($atividade->alteracoes)) {
                $atividade['alteracoes_descri'] = [];
                return $atividade;
            }

            $alteracoes = json_decode($atividade->alteracoes);

            $alteracoesDescritiva = [];
            foreach ($alteracoes as $alteracao) {
                switch ($alteracao->attr) {
                    case 'data_inicio':
                        $dataDe   = Carbon::parse($alteracao->de);
                        $dataPara = Carbon::parse($alteracao->para);
                        array_push($alteracoesDescritiva, sprintf('Data Início alterada de <b> %s </b> para <b> %s </b>.', $dataDe->format('d/m/Y'), $dataPara->format('d/m/Y')));

                        break;
                    case 'data_final':
                        $dataDe   = Carbon::parse($alteracao->de);
                        $dataPara = Carbon::parse($alteracao->para);
                        array_push($alteracoesDescritiva, sprintf('Data Prazo alterada de <b> %s </b> para <b> %s </b>.', $dataDe->format('d/m/Y'), $dataPara->format('d/m/Y')));
                        break;
                    case 'concluida':
                        array_push($alteracoesDescritiva, sprintf('%% Concluída alterada de <b>%s %%</b> para <b>%s %%</b>.', $alteracao->de, $alteracao->para));
                        break;
                    case 'situacao_id':
                        $situacaoDe   = $this->situacaoRepo->find($alteracao->de);
                        $situacaoPara = $this->situacaoRepo->find($alteracao->para);

                        array_push($alteracoesDescritiva, sprintf('Situação alterada de <b>%s</b> para <b>%s</b>.', $situacaoDe->descricao, $situacaoPara->descricao));
                        break;

                    case 'prioridade_id':
                        $prioridadeDe   = $this->prioridadeRepo->find($alteracao->de);
                        $prioridadePara = $this->prioridadeRepo->find($alteracao->para);

                        array_push($alteracoesDescritiva, sprintf('Situação alterada de <b>%s</b> para <b>%s</b>.', $prioridadeDe->descricao, $prioridadePara->descricao));
                        break;
                    case 'data_concluido':
                        $dataDe   = Carbon::parse($alteracao->de);
                        $dataPara = Carbon::parse($alteracao->para);
                        
                        if ($alteracao->de) {
                            array_push($alteracoesDescritiva, sprintf('Data Conclusão alterada de <b>%s</b> para <b>%s</b>.', $dataDe->format('d/m/Y'), $dataPara->format('d/m/Y')));
                        } else {
                            array_push($alteracoesDescritiva, sprintf('Data Conclusão alterada para <b>%s</b>.', $dataPara->format('d/m/Y')));
                        }

                        break;
                    case 'responsavel_id':
                        $usuarioDe   = $this->usuarioRepo->getLogin($alteracao->de);
                        $usuarioPara = $this->usuarioRepo->getLogin($alteracao->para);

                        array_push($alteracoesDescritiva, sprintf('Alterado responsável de <b>%s</b> para <b>%s</b>.', $usuarioDe, $usuarioPara));
                        break;
                    case 'participantes':
                        $usuarios = $this->usuarioRepo->getListLogin((array) $alteracao->para);

                        array_push($alteracoesDescritiva, sprintf('Adicionado partipante(s): <b> %s </b>.', implode(', ', $usuarios)));
                        break;
                    case 'descricao':
                        array_push($alteracoesDescritiva, sprintf('Descrição foi alterada.'));
                        break;
                    case 'titulo':
                        array_push($alteracoesDescritiva,'Título foi alterada.');
                        break;
                }
            }

            $atividade['alteracoes_descri'] = $alteracoesDescritiva;

            return $atividade;
        });

        return $atividades;
    }


    public function getAllPorAcao($acoaId,$page)
    {
        $atividades = $this->atividadeRepo->getListPaginate($acoaId, 'ge_acao', $page);

        $atividades = $atividades->transform(function ($atividade) {
            if (!isset($atividade->alteracoes)) {
                $atividade['alteracoes_descri'] = [];
                return $atividade;
            }

            $alteracoes = json_decode($atividade->alteracoes);

            $alteracoesDescritiva = [];
            foreach ($alteracoes as $alteracao) {
                switch ($alteracao->attr) {
                    case 'data_inicio':
                        $dataDe   = Carbon::parse($alteracao->de);
                        $dataPara = Carbon::parse($alteracao->para);
                        array_push($alteracoesDescritiva, sprintf('Data Início alterada de <b> %s </b> para <b> %s </b>.', $dataDe->format('d/m/Y'), $dataPara->format('d/m/Y')));

                        break;
                    case 'data_final':
                        $dataDe   = Carbon::parse($alteracao->de);
                        $dataPara = Carbon::parse($alteracao->para);
                        array_push($alteracoesDescritiva, sprintf('Data Prazo alterada de <b> %s </b> para <b> %s </b>.', $dataDe->format('d/m/Y'), $dataPara->format('d/m/Y')));
                        break;
                    case 'responsavel_id':
                        $usuarioDe   = $this->usuarioRepo->getLogin($alteracao->de);
                        $usuarioPara = $this->usuarioRepo->getLogin($alteracao->para);

                        array_push($alteracoesDescritiva, sprintf('Alterado responsável de <b>%s</b> para <b>%s</b>.', $usuarioDe, $usuarioPara));
                        break;
                    case 'participantes':
                        $usuarios = $this->usuarioRepo->getListLogin((array) $alteracao->para);

                        array_push($alteracoesDescritiva, sprintf('Adicionado partipante(s): <b> %s </b>.', implode(', ', $usuarios)));
                        break;
                    case 'descricao':
                        array_push($alteracoesDescritiva,'Descrição foi alterada.');
                        break;
                    case 'titulo':
                            array_push($alteracoesDescritiva,'Título foi alterada.');
                            break;
                }
            }

            $atividade['alteracoes_descri'] = $alteracoesDescritiva;

            return $atividade;
        });

        return $atividades;
    }
}
