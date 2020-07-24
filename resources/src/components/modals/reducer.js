import { OPEN_MODAL,CLOSE_MODAL,CLOSE_ALL_MODAL } from './actions';

/* --- REDUCERS --- */
const initialState = {
	modals: [],
}

export default (state = initialState, action) => {
	switch (action.type) {
		case OPEN_MODAL:
			return {
				...state,
				modals: state.modals.concat(action.obj)
			};
		case CLOSE_MODAL:
			return {
				...state,
				modals: state.modals.filter(item => item.modalId !== action.obj.modalId),
			};
		case CLOSE_ALL_MODAL:
			return {
				...state,
				modals: []
			}
		default:
			return state;
	}
};
