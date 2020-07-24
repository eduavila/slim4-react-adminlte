import tarefaService from '../services/tarefas';
import { addError,addSuccess } from './toasts';
import { msgError } from '../helpers/errors';
import { atividadesRequest } from './tarefaAtividades';
import { closeAllModal } from '../components/modals/actions';


// CONST

export const MODAL_EDIT_SHOW = 'MODAL_EDIT_SHOW';
export const MODAL_EDIT_CLOSED = 'MODAL_EDIT_CLOSED';

export const SHOW_DETAIL = 'SHOW_DETAIL';
export const CLOSED_DETAIL = 'CLOSED_DETAIL';

export const TAREFA_REQUEST= 'TAREFA_REQUEST';
export const TAREFA_REQUEST_SUCCESS  = 'TAREFA_REQUEST_SUCCESS';

export const UPDATE_PERC_CONCLUIDA = 'UPDATE_PERC_CONCLUIDA';
export const UPDATE_SITUACAO = 'UPDATE_SITUACAO';
export const UPDATE_PRIORIDADE = 'UPDATE_PRIORIDADE';

// abre tela de edicao tarefa
export function editModalShow(tarefa,acaoId){
    let tarefaEdit = null;

    if(tarefa){
        tarefaEdit = {...tarefa,participantes: tarefa.participantes.map((value)=>value.id)};
    }else{
        tarefaEdit = {
            id: null,
            titulo: "",
            descricao:  "",
            responsavel_id: "",
            participantes: [],
            data_inicio: null,
            data_final: null,
            prioridade_id: null,
            situacao_id: null,
            acao_id:acaoId
        }
    }

    return { 
        type: MODAL_EDIT_SHOW,
        tarefaEdit,
        acaoId
    };
}

export function editModalClosed(){
    return { type: MODAL_EDIT_CLOSED };
}


export function saveTarefa(values){
    return (dispatch,getState) =>{
        const { secretariaSelected } = getState().secretarias;

        if(values.situacao_id != 4){ // 4-Concluido
            values.data_concluido = null
        }

        if(!values.id){
            // Cria nova tarefa
            return tarefaService
                .create(secretariaSelected.id,values)
                .then((data)=>{
                    dispatch(addSuccess('Sucesso!', 'Registrado com sucesso.'));
                    
                    return data;
                })
                .catch((err)=>{
                    const msg = msgError(err);
                    //Msg de erro.
                    dispatch(addError('Erro ao carregar!',msg));

                    throw err;
                });

        }else{
            // atualiza tarefa
            delete values.info;
            delete values.acao;

            return tarefaService.update(secretariaSelected.id,values)
                .then((data)=>{
                    dispatch(addSuccess('Sucesso!', 'Atualizado com sucesso.'));

                    return data;
                })
                .catch((err)=>{
                    const msg = msgError(err);
                    dispatch(addError('Erro ao carregar!',msg));

                    throw err;
                });
        }
    }
}

// Abre tela de detalhe de tarefa
export function showDetail(tarefaId){
    return ( dispatch, getState) => {
        //Busca secretaria selecionada
        const { secretariaSelected }  = getState().secretarias;

        dispatch({ type: SHOW_DETAIL  });

        return tarefaService
            .get(secretariaSelected.id,tarefaId)
            .then((data)=>{
                
                dispatch({ type: TAREFA_REQUEST_SUCCESS, tarefa: data });

                //Carrega atividades relacionada
                dispatch(atividadesRequest(data.id));
            })
            .catch((err)=>{   
                const msg = msgError(err);
                //Msg de erro.
                dispatch(addError('Erro ao carregar!',msg));
                //fecha modal
                dispatch(closedDetail());
                return Promise.reject(msg);
            });
    }
}

// Atualiza modal detalhes caso ja esteja aberto.

export function updateDetail(){
    return ( dispatch, getState) => {
        //Busca secretaria selecionada
        const { secretariaSelected }  = getState().secretarias;
        const { tarefaSelected }  = getState().tarefas;

        if(tarefaSelected){
            return tarefaService
                .get(secretariaSelected.id,tarefaSelected.id)
                .then((data)=>{
                    dispatch({
                        type: TAREFA_REQUEST_SUCCESS,
                        tarefa: data
                    });
                })
                .catch((err)=>{
                    const msg = msgError(err);
                    //Msg de erro.
                    dispatch(addError('Erro ao carregar!',msg));
                });
        }
    }
}


//Abre tela de talhes
export function closedDetail(){
    return  {
        type: CLOSED_DETAIL
    }
}

export function updateConcluida(tarefaId, data){
    return ( dispatch, getState) => {
        
        const { secretariaSelected }  = getState().secretarias;
        console.log(data);
        // atualiza tarefa
        return tarefaService.update(secretariaSelected.id,{
            id: tarefaId,
            ...data
        })
        .then((data)=>{
            dispatch(addSuccess('Sucesso!', 'Atualizado % Concluído com sucesso.'));

            return data;
        })
        .catch((err)=>{
            const msg = msgError(err);
            dispatch(addError('Erro ao atualizar % Concluído!',msg));

            throw err;
        });
    }
}

export function updateSituacao(tarefaId,data){
    return ( dispatch, getState) => {
        
        const { secretariaSelected }  = getState().secretarias;

        // atualiza tarefa
        return tarefaService.update(secretariaSelected.id,{
            id: tarefaId,
            ...data
        })
        .then((data)=>{
            dispatch(addSuccess('Sucesso!', 'Atualizado Situação com sucesso.'));

            return data;
        })
        .catch((err)=>{
            const msg = msgError(err);
            dispatch(addError('Erro ao atualizar Situação!',msg));

            throw err;
        });
    }
}

export function updatePrioridade(tarefaId,prioridadeId){
    return ( dispatch, getState) => {
        
        const { secretariaSelected } = getState().secretarias;

        // atualiza tarefa
        return tarefaService.update(secretariaSelected.id,{
            id: tarefaId,
            prioridade_id: prioridadeId
        })
        .then((data)=>{
            dispatch(addSuccess('Sucesso!', 'Atualizado Prioridade com sucesso.'));

            return data;
        })
        .catch((err)=>{
            const msg = msgError(err);
            dispatch(addError('Erro ao atualizar Prioridade!',msg));

            throw err;
        });
    }
}

export function updateDataInicio(tarefaId,dataInicio){
    return ( dispatch, getState) => {
        
        const { secretariaSelected } = getState().secretarias;
        
        // atualiza tarefa
        return tarefaService.update(secretariaSelected.id,{
            id: tarefaId,
            data_inicio: dataInicio
        })
        .then((data)=>{
            dispatch(addSuccess('Sucesso!', 'Atualizado data inicio com sucesso.'));

            return data;
        })
        .catch((err)=>{
            const msg = msgError(err);
            dispatch(addError('Erro ao atualizar data inicio!',msg));

            throw err;
        });
    }
}


export function updateDataFim(tarefaId,dataFinal){
    return ( dispatch, getState) => {
        
        const { secretariaSelected } = getState().secretarias;

        // atualiza tarefa
        return tarefaService.update(secretariaSelected.id,{
            id: tarefaId,
            data_final: dataFinal
        })
        .then((data)=>{
            dispatch(addSuccess('Sucesso!', 'Atualizado Data com sucesso.'));

            return data;
        })
        .catch((err)=>{
            const msg = msgError(err);
            dispatch(addError('Erro ao atualizar Data!',msg));

            throw err;
        });
    }
}

export function loadTarefa(tarefaId){
    return (dispatch,getState) =>{
        //Busca secretaria selecionada
        const { secretariaSelected }  = getState().secretarias;

        return tarefaService
            .get(secretariaSelected.id,tarefaId)
            .then((data)=>{

                return data;
            })
            .catch((err) => {
                const msg = msgError(err);

                //Msg de erro.
                dispatch(addError('Erro ao carregar tarefa!',msg));

                throw err;
            })
    }
}

export function loadTarefas(acaoId){
    return (dispatch,getState) =>{
        //Busca secretaria selecionada
        const { secretariaSelected }  = getState().secretarias;

        return tarefaService
            .getAll(secretariaSelected.id,acaoId)
            .catch((err) => {
                const msg = msgError(err);
                //Msg de erro.
                dispatch(addError('Erro ao carregar tarefas!',msg));

                throw err;
            })
    }
}

export function loadAtividades(tarefaId){
    return ( dispatch, getState) => {

        //Busca secretaria selecionada
        const { secretariaSelected }  = getState().secretarias;

        return tarefaService
            .getAtividades(secretariaSelected.id,tarefaId)
            .catch((err)=>{
                const msg = msgError(err);
                dispatch(addError('Erro ao carregar atividades!',msg));

                throw err;
            });
    };
}

export function createTarefa(acaoId){
    return ( dispatch, getState) => {
        return new Promise((resolve)=>{
            const tarefa = {
                id: null,
                titulo: "",
                descricao:  "",
                responsavel_id: "",
                participantes: [],
                data_inicio: null,
                data_final: null,
                prioridade_id: null,
                situacao_id: 1,
                acao_id: acaoId,
                data_concluido: null
            };

            resolve(tarefa);
        });
    }
}

export function copiarTarefa(values){
    return ( dispatch, getState) => {
        const  { secretariaSelected } = getState().secretarias;

        delete values.id;

        // Cria nova tarefa
        return tarefaService
            .create(secretariaSelected.id,values)
            .then((data)=>{
                dispatch(addSuccess('Sucesso!', 'Registrado com sucesso.'));
                
                return data;
            })
            .catch((err)=>{
                const msg = msgError(err);
                //Msg de erro.
                dispatch(addError('Erro ao carregar!',msg));

                throw err;
            });
    }
}

export function deleteTarefa(tarefaId){
    return ( dispatch, getState) => {
        const  { secretariaSelected } = getState().secretarias;

        //Excluir tarefa
        return tarefaService
            .delete(secretariaSelected.id,tarefaId)
            .then((data)=>{
                dispatch(addSuccess('Sucesso!', 'Excluído com sucesso.'));
                dispatch(closeAllModal());
                return data;
            })
            .catch((err)=>{
                const msg = msgError(err);
                //Msg de erro.
                dispatch(addError('Erro ao excluir!',msg));

                throw err;
            });
    }
}