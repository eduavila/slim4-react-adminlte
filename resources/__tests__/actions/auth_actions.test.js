import history from './../../src/history';

// Actions to be tested
import  { login } from '../../src/actions/auth';

import * as actions from '../../src/actions/auth';
import { mockAxios, mockStore } from '../setup/setupTest';

jest.mock('./../../src/history');

const storeMock = {
    auth: {
        usuario: null,
        token: null,
        tokenRefresh: null,
        loggingIn: false,
        loggingOut: false,
        loginError: null,
    }
}

const store = mockStore(storeMock);

describe('auth_actions', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
    });

    test('Login com sucesso', async () => {
            const mockData = {
                    token_refresh: "asdsadsad45s5a64d6sa4d6sa",
                    token_access: "asds5a45as4d5sa45da",
                    usuario: {
                        id:1,
                        nome: 'teste.jpg'
                    }
                };

            // Mock
            mockAxios
                .onPost('/auth/login')
                .reply(200,mockData);

            history.push = jest.fn();

            await store.dispatch(login('teste','teste'));
            
            const expectedActions = [
                { type: actions.LOGIN_REQUEST, usuario: null },
                { 
                    type: actions.LOGIN_SUCCESS,
                    usuario: mockData.usuario,
                    token: mockData.token_access,
                    tokenRefresh: mockData.token_refresh
                }
            ]

            // Expects
            expect(store.getActions()).toMatchObject( expectedActions );
            
            // Verifica retornar para pagina principal.
            expect(history.push.mock.calls[0]).toEqual(["/"]);
    });

    test('Login com erro', async () => {
        const data = [
            {
                token_refresh: "asdsadsad45s5a64d6sa4d6sa",
                token_access: "asds5a45as4d5sa45da",
                usuario: {
                    id:1,
                    nome: 'teste.jpg'
                }
            }
        ];

        // Mock para chamada no servidor.
        mockAxios
            .onPost('/auth/login')
            .reply(400,{"msg":"Usuário ou senha incorreta!","erroCode":400});

        history.push = jest.fn();

        await store.dispatch(login('teste','teste'));
        
        const expectedActions = [
            { type: actions.LOGIN_REQUEST, usuario: null },
            { type: actions.LOGIN_FAILURE, usuario: null }
        ];

        // Expects
        expect(store.getActions()).toMatchObject( expectedActions ); 
    });

    test('Logout com sucesso', async () => {
        const mockData = {msg:"Revogado token com sucesso."};

        // Mock
        mockAxios
            .onPost('/auth/logout')
            .reply(200,mockData);

        history.push = jest.fn();

        const storeMockLogout = mockStore({
            auth: {
                usuario: null,
                token: null,
                tokenRefresh: "asdsadasdsadsadsa",
                loggingIn: false,
                loggingOut: false,
                loginError: null,
            }
        })

        await storeMockLogout.dispatch(actions.logout({ token: "asdsadasdsadsadsa", device_id:"" }));
        
        const expectedActions = [
            { type: actions.LOGOUT_REQUEST },
            { 
                type: actions.LOGOUT_SUCCESS,
                usuario: null,
                token: null,
                tokenRefresh: null
            }
        ];

        // Expects
        expect(storeMockLogout.getActions()).toMatchObject( expectedActions );
        
        // Verifica retornar para pagina principal.
        expect(history.push.mock.calls[0]).toEqual(["/login"]);
});

});

