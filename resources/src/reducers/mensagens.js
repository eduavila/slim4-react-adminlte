import {
    MENSAGENS_REQUEST,
    MENSAGENS_SUCCESS,
    MENSAGENS_ERROR,
    SET_LIDA_MENSAGENS_SUCCESS
} from '../actions/mensagens';
import { actions } from 'react-redux-toastr';

const initialState = {
    listMensagens: [],
    loading: false,
    loadAll: false
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case MENSAGENS_REQUEST:
            return {
                ...state,
                loading: true,
                listMensagens: [],
                loadAll: false
            }
        case MENSAGENS_SUCCESS:
            return {
                ...state,
                listMensagens: action.mensagens,
                loading: false,
                loadAll: action.loadAll
            }
        case MENSAGENS_ERROR:
            return {
                ...state,
                loading: false,
                loadAll: false
            }

        case SET_LIDA_MENSAGENS_SUCCESS:
            //Seta mensagem como lida.
            const listMensagens = state.listMensagens.map((mensagem)=>{
                if(mensagem.id == action.mensagemId){
                    mensagem.lida = 1
                }

                return mensagem;
            })

            return {
                ...state,
                listMensagens: listMensagens,
            }
        default:
            return state;
    }
}
