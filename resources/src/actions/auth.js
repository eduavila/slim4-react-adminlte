import authService from '../services/auth';
import history from '../history';
import { setTokensUser, unsetTokens } from '../helpers/auth';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function loginSuccess(data) {

    //Grava token no armazenamento do browser
    setTokensUser(data);

    //Atualiza dados store
    return {
        type: LOGIN_SUCCESS,
        usuario: data.usuario,
        token: data.token_access,
        tokenRefresh: data.token_refresh
    };
}

export function loginFailure(error) {
    return {
        type: LOGIN_FAILURE,
        usuario: null,
        error: error
    };
}

/**
 *  
 * Login 
 * 
 */
export function login(login, senha) {
    return async dispatch => {
        dispatch( {
            type: LOGIN_REQUEST,
            usuario: null
        });

        try {
            const data = await authService.login({ login, senha });

            dispatch(loginSuccess(data));
            history.push("/");
        }catch (error) {
            const response = error.response;
            if (response === undefined) {
                dispatch(loginFailure({
                    msg: error
                }));
            }
            else {
                dispatch(loginFailure(response.data));
            }
        }
    };
}

function logoutRequest() {
    return {
        type: LOGOUT_REQUEST
    };
}

export function logoutSuccess() {
    // Limpa token do navegador
    unsetTokens();
    
    return {
        type: LOGOUT_SUCCESS,
        usuario: null,
        token: null,
        tokenRefresh: null
    };
}

export function logoutFailure(error) {
    return {
        type: LOGOUT_FAILURE,
        error
    };
}

//
//Faz chamada para revoga token no servidor
//
export function logout() {
    return async ( dispatch, getState) => {
        try {
            dispatch(logoutRequest());

            // Busca token do state.
            const { tokenRefresh }  = getState().auth;
            const deviceId = localStorage.getItem('DEVICE_ID') || null;
        
            await authService.logout({ token: tokenRefresh, device_id: deviceId });

            history.push("/login");
            dispatch(logoutSuccess());
        } catch (error) {
            const response = error.response;
            if (response === undefined) {
                dispatch(logoutFailure({
                    msg: error
                }));
            }
            else if (error.response.status === 401) {
                history.push("/login");
                dispatch(logoutSuccess());
            }
            else {
                dispatch(logoutFailure(response.data));
            }
        }
    };
}
