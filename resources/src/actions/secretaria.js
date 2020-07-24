import secretariaService from "../services/secretarias";
import { addError } from '../actions/toasts';
import { logout, logoutFailure } from "./auth";
import history from '../history';

export const SECRETARIA_REQUEST = 'SECRETARIA_REQUEST';
export const SECRETARIA_SUCCESS = 'SECRETARIA_SUCCESS';
export const SECRETARIA_SELECTED = 'SECRETARIA_SELECTED';

export function requestSecretariaAcesso(){
    return ( dispatch, getState ) => {
        dispatch({
            type: SECRETARIA_REQUEST
        });

        return secretariaService.getSecetariaAcesso()
            .then((data) => {
                dispatch({
                    type: SECRETARIA_SUCCESS,
                    secretarias: data
                });

                const { usuario } = getState().auth;
                const secretariaSelected = data.find(secre => secre.id == usuario.secretaria_id);

                //Caso não encontra senhuma secretaria retonar para login;
                if(!secretariaSelected){

                    dispatch(logout());
                    dispatch(logoutFailure("Usuário não está vinculado a nenhuma secretaria. Entre contato com suporte!"));

                }else{
                    dispatch({
                        type: SECRETARIA_SELECTED,
                        secretaria: secretariaSelected
                    });
                }
            })
            .catch((error) => {
                dispatch(addError('Error','Erro ao carregar secretarias.'));
            });
    };
}


export function changeSecretaria(secretariaSelected){
    return ( dispatch, getState ) => {

        history.push('/');

        dispatch( {
            type: SECRETARIA_SELECTED,
            secretaria: secretariaSelected
        });
    };
}