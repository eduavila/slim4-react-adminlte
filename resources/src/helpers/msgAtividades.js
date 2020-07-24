const msg = {
    'EXCLUIDO_TAREFA_ARQUIVO':' excluiu arquivo.',
    'NOVO_TAREFA_ARQUIVO':' adicionou um novo arquivo.',
    'NOVO_TAREFA': ' criou nova tarefa.',
    'EDIT_TAREFA':  ' editou tarefa.',
    'CANC_TAREFA':  ' cancelou a tarefa.',
    'CONC_TAREFA':  ' concluiu a tarefa.', 
    'COMENTARIO_TAREFA': ' registrou novo comentário.',
    'EDIT_ACAO': ' editou ação.',
    'NOVO_ACAO': ' criou a ação.',
    'CANCELOU_ACAO': ' cancelou a ação.',
};

export function msgType(type){
    return msg[type];
}