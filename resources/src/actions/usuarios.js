import usuarioService from '../services/usuarios';
import { addSuccess, addError } from './toasts';
import { msgError } from '../helpers/errors';

export const LIST_USUARIO_REQUEST = 'LIST_USUARIO_REQUEST';
export const LIST_USUARIO_SUCCESS = 'LIST_USUARIO_SUCCESS';
export const LIST_USUARIO_FAILURE = 'LIST_USUARIO_FAILURE';

export const ALTERAR_SENHA_REQUEST = 'ALTERAR_SENHA_REQUEST';
export const ALTERAR_SENHA_FAILURE = 'ALTERAR_SENHA_FAILURE';

export function usuarioRequest(onlyAtivos) {
    return dispatch => {
        dispatch({ type: LIST_USUARIO_REQUEST });

        return usuarioService.getAll(onlyAtivos)
            .then((data) => {
                dispatch({
                    type: LIST_USUARIO_SUCCESS,
                    usuarios: data
                })
            })
            .catch((error) => {
                const response = error.response;
                const msg = response ? response.data : err.message;
                dispatch(addError('Erro ao carregar usuário!', msg));
            });
    };
}

//
// Alterar senha
//
export function alterarSenhaRequest(senha, confirmar_senha) {
    return dispatch => {
        dispatch({ type: ALTERAR_SENHA_REQUEST });

        return usuarioService
            .alterarSenha({
                senha,
                confirmar_senha
            })
            .then((data) => {
                dispatch(addSuccess("Alteração senha.", "Alterada senha com sucesso!"));
            })
            .catch((err) => {
                const response = err.response;
                dispatch({ type: ALTERAR_SENHA_FAILURE, errors: response ? response.data : err.message });

                return Promise.reject();
            });
    }
}

export function getUsuario(usuarioId) {
    return (dispatch, getState) => {
        return usuarioService
            .get(usuarioId)
            .then((data) => {
                return data;
            })
            .catch((err) => {
                const msg = msgError(err);
                //Msg de erro.
                dispatch(addError('Erro ao carregar usuario!', msg));

                throw err;
            })
    }
}


export function createUsuario(usuarioId) {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            const usuario = {
                id: null,
                perfil_id: null,
                secretaaria_id: null,
                nome: null,
                matricula: null,
                email: null,
                login: null,
                senha: null,
                status: null,
                criado_por: null,
                token_id: null
            };

            resolve(usuario);
        });
    }
}


export function saveUsuario(values) {
    return (dispatch, getState) => {
        // Cria nova tarefa
        return usuarioService
            .createOrUpdate(values)
            .then((data) => {
                dispatch(addSuccess('Sucesso!', 'Registrado com sucesso.'));

                return data;
            })
            .catch((err) => {
                const msg = msgError(err);
                //Msg de erro.
                dispatch(addError('Erro ao carregar!', msg));

                throw err;
            });
    }
}

export function saveSenha(values) {
    return (dispatch, getState) => {
        // Cria nova tarefa
        return usuarioService
            .alterarSenha(values)
            .then((data) => {
                dispatch(addSuccess('Sucesso!', 'Registrado com sucesso.'));

                return data;
            })
            .catch((err) => {
                const msg = msgError(err);
                //Msg de erro.
                dispatch(addError('Erro ao carregar!', msg));

                throw err;
            });
    }
}