import { 
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
 } from '../../src/actions/auth';
import reducer from '../../src/reducers/auth';

const initialState = {
    usuario: null,
    token: null,
    tokenRefresh: null,
    loggingIn: false,
    loggingOut: false,
    loginError: null,
};

describe('auth reducer', () => {
    test('Returns the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    test('Login request', () => {
        expect(reducer(initialState, { type: LOGIN_REQUEST })).toEqual({
            ...initialState,
            loggingIn: true,
            loginError: null
        });
    });

    test('Login success', () => {
        expect(reducer(initialState, { type: LOGIN_SUCCESS, usuario:{id:1}, token:'2k2kj',tokenRefresh: '212s1' })).toEqual({
            ...initialState,
            loggingIn: false,
            loginError: null,
            usuario: { id: 1 },
            token: '2k2kj',
            tokenRefresh: '212s1' 
        });
    });
    
    test('Login error', () => {
        expect(reducer(initialState, { type: LOGIN_FAILURE, error: 'erro no login' })).toEqual({
            ...initialState,
            loggingIn: false,
            usuario: null,
            token: null,
            tokenRefresh: null,
            loginError: 'erro no login'
        });
    });

    test('Logout Request', () => {
        expect(reducer(initialState, { type: LOGOUT_REQUEST })).toEqual({
            ...initialState,
            loggingOut: true
        });
    });

    test('Logout Success', () => {
        expect(reducer(initialState, { type: LOGOUT_SUCCESS })).toEqual({
            ...initialState,
            loggingOut: false,
            user: null,
            userRole: null,
            token: null,
            tokenRefresh: null,
            usuario: null,
            loginError: null
        });
    });

    test('Logout Success', () => {
        expect(reducer(initialState, { type: LOGOUT_FAILURE, error: 'Erro ao realizar logout' })).toEqual({
            ...initialState,
            loggingOut: false,
            logoutError: 'Erro ao realizar logout'
        });
    });
});