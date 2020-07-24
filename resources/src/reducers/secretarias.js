import { SECRETARIA_SUCCESS,SECRETARIA_SELECTED } from '../actions/secretaria';

const initialState = {
    listSecretarias:[],
    secretariaSelected: null
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
        case SECRETARIA_SUCCESS:
            return {
                ...state,
                listSecretarias: action.secretarias
            };
        case SECRETARIA_SELECTED:
            return {
                ...state,
                secretariaSelected: action.secretaria
            }
        default:
            return state;
    }
}
