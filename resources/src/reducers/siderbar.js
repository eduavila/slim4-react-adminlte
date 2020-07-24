import { SIDEBAR_OPEN_CLOSED } from '../actions/sidebar';

const initialState = {
    siderBarOpen: false
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SIDEBAR_OPEN_CLOSED:
            return {
                ...state,
                siderBarOpen: !state.siderBarOpen
            };
            
        default:
            return state;
    }
}
