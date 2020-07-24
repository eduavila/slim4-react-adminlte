import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
} from '../actions/auth';
import { getTokenAccess , getTokenReflesh, getUser} from '../helpers/auth';

const initialState = {
    usuario: getUser(),
    token: getTokenAccess(),
    tokenRefresh: getTokenReflesh(),
    loggingIn: false,
    loggingOut: false,
    loginError: null,
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, { loggingIn: true,loginError: null });
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggingIn:false,
                loginError: null,
                usuario: action.usuario,
                token: action.token,
                tokenRefresh: action.tokenRefresh
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loggingIn: false,
                usuario: null,
                token: null,
                tokenRefresh: null,
                loginError: action.error
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                loggingOut: true
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loggingOut: false,
                user: null,
                userRole: null,
                token:null,
                tokenRefresh:null,
                usuario:null,
                loginError: null
            };  
        case LOGOUT_FAILURE:
            return {
                ...state,
                loggingOut: false,
                logoutError: action.error
            };
        default:
            return state;
    }
}
