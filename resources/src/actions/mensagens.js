import mensagensService from '../services/mensagens';

import { msgError } from '../helpers/errors';
import { addError, addSuccess } from './toasts';

// CONST
export const MENSAGENS_REQUEST = 'MENSAGENS_REQUEST';
export const MENSAGENS_SUCCESS = 'MENSAGENS_SUCCESS';
export const MENSAGENS_ERROR = 'MENSAGENS_ERROR';

export const SET_LIDA_MENSAGENS_REQUEST = 'SET_LIDA_MENSAGENS_REQUEST';
export const SET_LIDA_MENSAGENS_SUCCESS = 'SET_LIDA_MENSAGENS_SUCCESS';
export const SET_LIDA_MENSAGENS_ERROR = 'SET_LIDA_MENSAGENS_ERROR';

export function loadMensagens(limit){
    return (dispatch,getState) =>{

        const { usuario } = getState().auth;

        if(!usuario){
            return;
        }

        dispatch({
            type: MENSAGENS_REQUEST
        })

        return mensagensService
            .getAll(limit)
            .then((data)=>{
                const loadAll = limit === 0 ? true : false

                dispatch({
                    type: MENSAGENS_SUCCESS,
                    mensagens: data,
                    loadAll
                });
            })
            .catch((err) => {
                const msg = msgError(err);
                //Msg de erro.
                dispatch({
                    type: MENSAGENS_ERROR,
                    errors: err.message
                });
                
                dispatch(addError('Erro ao carregar mensagens do usuário!',msg));
            })
    }
}


export function setLidaMensagens(id){
    return (dispatch,getState) =>{
        dispatch({
            type: SET_LIDA_MENSAGENS_REQUEST
        })

        return mensagensService
            .setLida(id)
            .then(()=>{
                dispatch({
                    type: SET_LIDA_MENSAGENS_SUCCESS,
                    mensagemId: id 
                });
            })
            .catch((err) => {
                const msg = msgError(err);
                //Msg de erro.
                dispatch({
                    type: SET_LIDA_MENSAGENS_ERROR,
                    errors: err.message
                });
                
                dispatch(addError('Erro ao carregar marca como lida mensagem!',msg));
            })
    }
}