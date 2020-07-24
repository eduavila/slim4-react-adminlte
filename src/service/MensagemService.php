<?php declare (strict_types = 1);

namespace App\Service;

use App\Exception\ValidationException;
use App\Lib\NQueue\NQueue;
use App\Models\System\MensagemUsuario;
use App\Models\System\UsuarioTokenDevice;
use Illuminate\Database\Capsule\Manager as DB;
use Psr\Log\LoggerInterface;
use Selective\Config\Configuration;

class MensagemService
{
    public function __construct(NQueue $queue, LoggerInterface $logger, AuthService $authService, Configuration $config)
    {
        $this->logger      = $logger;
        $this->authService = $authService;
        $this->queue = $queue;

        $this->config = $config;

        $this->appUrl = $this->config->getString('settings.app_url');
        $this->nameApp = $this->config->getString('settings.name_app');
    }

    public function getAll($usuarioId, $limit)
    {
        $mensagem = MensagemUsuario::from('sys_mensagem_usuario as m')
            ->leftJoin('sys_usuario as userPara', 'm.usuario_para', '=', 'userPara.id')
            ->leftJoin('sys_usuario as userDe', 'm.criado_por', '=', 'userDe.id')
            ->select([
                'm.*',
                'userPara.nome as usuario_para_descri',
                'userDe.nome as usuario_de_descri',
            ])
            ->where('m.usuario_para', $usuarioId)
            ->orderBy('id', 'desc');

        if ($limit) {
            $mensagem->limit($limit);
        }

        return $mensagem->get();
    }

    public function setLida($usuarioId, $mensagemId)
    {
        DB::beginTransaction();
        try {
            $mensagem = MensagemUsuario::where('usuario_para', $usuarioId)
                ->where('id', $mensagemId)
                ->first();

            if (!$mensagem) {
                throw new ValidationException('Mensagens não encontrada!', 400);
            }

            $mensagem->lida = true;
            $mensagem->save();

            DB::commit();
            return;
        } catch (\Exception $ex) {
            DB::rollBack();
            $this->logger->error($ex->getMessage());
        }
    }

    /**
     * Criar novas mensagens.
     * Tags existente:
     *      {usuario} = Nome do usuario logado
     *      {usuarioId} = Id do usuario logado
     * @param [string] $type - Tipo da mensagem  
     * @param [array] $params - Lista paramentro para ser substituido na mensagem
     * @param [array] $usuariosPara - Lista Id usuarios a ser enviada msg
     * @return void
     */
    public function create(string $type, array $params,array $usuariosPara)
    {
        $mensagemsType = [
            'ADD_COMENTARIO'   => [
                'titulo'   => 'Adicionada novo comentário!',
                'mensagem' => '{usuario} adicionou novo comentário na <b>tarefa <a href="javascript:window.openTarefa({tarefaId});"> #{tarefaId}</a></b>.',
            ],
            'ADD_ARQUIVO'   =>[
                'titulo'   => 'Adicionado novo arquivo!',
                'mensagem' => '{usuario} adicionou novo arquivo na <b>tarefa <a href="javascript:window.openTarefa({tarefaId});"> #{tarefaId}</a></b>.'
            ],
            'EDIT_TAREFA'      => [
                'titulo'   => 'Tarefa foi editada!',
                'mensagem' => '{usuario} editou a <b>tarefa <a href="javascript:window.openTarefa({tarefaId});"> #{tarefaId}</a></b>',
            ],
            'EDIT_ARQUIVADA'   => [
                'titulo'   => 'Tarefa foi arquivada!',
                'mensagem' => '{usuario} editou a <b>tarefa <a href="javascript:window.openTarefa({tarefaId});"> #{tarefaId}</a></b>',
            ],
            'ADD_PARTICIPANTE' => [
                'titulo'   => 'Adicionou como participante!',
                'mensagem' => '{usuario} adicionou você como participante na <b>Tarefa: <a href="javascript:window.openTarefa({tarefaId});"> #{tarefaId}</a></b>',
            ],
            'ADD_RESPONSAVEL'  => [
                'titulo'   => 'Adicionou como responsável!',
                'mensagem' => '{usuario} adicionou você como responsável da <b>Tarefa: <a href="javascript:window.openTarefa({tarefaId});"> #{tarefaId}</a></b>',
            ],
            'ADD_PARTICIPANTE_ACAO' => [
                'titulo'   => 'Adicionou como participante de uma nova ação!',
                'mensagem' => '{usuario} adicionou você como participante na <p class="max-text"><b>Ação <a href="javascript:window.openAcao({acaoId});"> {descricao}</a></b></p>',
            ],
            'ADD_RESPONSAVEL_ACAO'  => [
                'titulo'   => 'Adicionou como responsável de uma nova ação!',
                'mensagem' => '{usuario} adicionou você como responsável da <p class="max-text"><b>Ação: <a href="javascript:window.openAcao({acaoId});">{descricao}</a></b></p>',
            ],
            'EDIT_ACAO'      => [
                'titulo'   => 'Ação foi editada!',
                'mensagem' => '{usuario} editou a <p class="max-text"><b>Ação: <a href="javascript:window.openAcao({acaoId});">{descricao}</a></b></p>',
            ],
            'ADD_EVENTO' => [
                'titulo'   => 'Adicionou como participante de um novo evento!',
                'mensagem' => '{usuario} adicionou você como participante no <p class="max-text"><b>Evento: <a href="javascript:window.openEvento({eventoId});"> {titulo}</a></b></p>',
            ],
            'EDIT_EVENTO' => [
                'titulo'   => 'Evento foi editado!',
                'mensagem' => '{usuario} alterou a data e hora do <p class="max-text"><b>Evento: <a href="javascript:window.openEvento({eventoId});"> {titulo}</a></b></p>',
            ],
        ];

        try {
            $usuarioLogado = $this->authService->getUsuarioInfo();
            $tokenId       = $this->authService->getTokenId();
           
            // Grava mensagem do usuário.
            foreach (array_unique($usuariosPara) as $usuario) {
                $titulo = $mensagemsType[$type]['titulo'];
                $mensagem = replaceTags($mensagemsType[$type]['mensagem'], 
                                        array_merge($params, [
                                            'usuario'   => $usuarioLogado->nome, 
                                            'usuarioId' => $usuarioLogado->id
                                        ]));
                    

                $msg               = new MensagemUsuario();
                $msg->titulo       = $titulo;
                $msg->mensagem     = $mensagem;
                $msg->lida         = 0;
                $msg->tipo         = $type;
                $msg->usuario_para = $usuario;
                $msg->token_id     = $tokenId;
                $msg->criado_por   = $usuarioLogado->id;
                $msg->dados        = json_encode($params);
                $msg->save();

                // Envia push
                $this->enviarPush($usuario,$titulo,$mensagem);
            }

        } catch (\Exception $ex) {

            $this->logger->error($ex->getMessage());
            throw $ex;
        }
    }

    /**
     * Envia notificação push para lista de devices do usuário.
     *
     * @param int $usuarioId
     * @param string $titulo
     * @param string $mensagem
     * @return void
     */
    public function enviarPush($usuarioId, $titulo, $mensagem){
        try {
            // Busca lista de todos devices registrado para enviar notificação
            $listaDevices = UsuarioTokenDevice::where('usuario_id',$usuarioId)->get();

            foreach($listaDevices as $device){
                
                //Envia para fila se processado no work implementando.
                $this->queue->sendQueue(\App\Works\PushWork::class, [
                    'token_device'=> $device->token,
                    'title'=> $this->nameApp.' - '.$titulo,
                    'body'         => strip_tags($mensagem),
                    "click_action" => $this->appUrl,
                    "icon"         => sprintf("%s/images/icon.png",$this->appUrl),
                ]);
            }

        }catch(\Exception $ex){
            $this->logger->error($ex->getMessage());
        }
    }
}
