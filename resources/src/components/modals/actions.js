
export const OPEN_MODAL = '@modal/OPEN_MODAL';
export const CLOSE_MODAL = '@modal/CLOSE_MODAL';
export const CLOSE_ALL_MODAL = '@modal/CLOSE_ALL_MODAL';

export function openModal(obj){
	if(!obj.modalId){
		const id = new Date().getTime();
		obj.modalId = `modal_${id}`;
	}
	return { type: OPEN_MODAL, obj }
}

export function closeModal(obj){
	return { type: CLOSE_MODAL, obj }
}

export function closeAllModal(){
	return (dispatch, getState) => {

		//Força evento close de todos modal diponivel.
		const { modals } = getState().modals;
		modals.reverse().forEach((modal)=>{
			modal.onClose(null);
		});

		dispatch({ type: CLOSE_ALL_MODAL });
	}
}
