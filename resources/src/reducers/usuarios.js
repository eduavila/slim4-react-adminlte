import {
    LIST_USUARIO_REQUEST,
    LIST_USUARIO_SUCCESS,
    LIST_USUARIO_FAILURE,
    ALTERAR_SENHA_REQUEST,
    ALTERAR_SENHA_FAILURE
} from '../actions/usuarios';

const initialState = {
    listUsuarios: {
        usuarios: [],
        errors: null,
        requesting: false
    },
    alterarSenha: {
        errors: null
    }
};

export default function usuarios(state = initialState, action = {}) {
    switch (action.type) {
        case LIST_USUARIO_REQUEST:
            return {
                ...state,
                requesting: true,
                errors: null
            }
        case LIST_USUARIO_SUCCESS:
            return {
                ...state,
                listUsuarios: {
                    usuarios: action.usuarios,
                    errors: null,
                    requesting: false
                }
            };
        case LIST_USUARIO_FAILURE:
            return {
                ...state,
                loginError: action.error
            };
        case ALTERAR_SENHA_REQUEST:
            return {
                ...state,
                alterarSenha: {
                    errors: null,
                }
            }
        case ALTERAR_SENHA_FAILURE:
            return {
                ...state,
                alterarSenha: {
                    errors: action.errors
                }
            }

        default:
            return state;
    }
}